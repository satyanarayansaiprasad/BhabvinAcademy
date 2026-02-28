const Cart = require("../../models/Cart");
const razorpay = require("../../helpers/razorpay");
const crypto = require("crypto");
const Order = require("../../models/Order");
const Course = require("../../models/Course");
const StudentCourses = require("../../models/StudentCourses");

const createOrder = async (req, res) => {
  try {
    const {
      userId,
      userName,
      userEmail,
      courses,
    } = req.body;

    const totalAmount = courses.reduce((acc, item) => acc + parseFloat(item.coursePricing || 0), 0);

    if (isNaN(totalAmount) || totalAmount <= 0) {
      return res.status(400).json({
        success: false,
        message: "Invalid order amount. Total must be greater than 0.",
      });
    }

    // Check if Razorpay keys are configured
    if (!process.env.RAZORPAY_KEY_ID || !process.env.RAZORPAY_KEY_SECRET) {
      return res.status(500).json({
        success: false,
        message: "Razorpay is not correctly configured on the server. Please check environment variables.",
      });
    }

    // Create Razorpay order
    const options = {
      amount: Math.round(totalAmount * 100), // amount in paise
      currency: "INR",
      receipt: `receipt_order_${Date.now()}`,
    };

    let razorpayOrder;
    try {
      razorpayOrder = await razorpay.orders.create(options);
    } catch (razorError) {
      console.error("Razorpay Order Creation Error:", razorError);
      return res.status(500).json({
        success: false,
        message: "Failed to create Razorpay order",
        error: razorError.message
      });
    }

    const newlyCreatedCourseOrder = new Order({
      userId,
      userName,
      userEmail,
      orderStatus: "pending",
      paymentMethod: "razorpay",
      paymentStatus: "pending",
      orderDate: new Date(),
      courses,
      razorpayOrderId: razorpayOrder.id,
    });

    await newlyCreatedCourseOrder.save();

    res.status(201).json({
      success: true,
      data: {
        orderId: newlyCreatedCourseOrder._id,
        razorpayOrderId: razorpayOrder.id,
        amount: razorpayOrder.amount,
        currency: razorpayOrder.currency,
        razorpayKeyId: process.env.RAZORPAY_KEY_ID,
      },
      message: "Order created successfully",
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      success: false,
      message: "Some error occured!",
    });
  }
};

const capturePaymentAndFinalizeOrder = async (req, res) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature, orderId } = req.body;

    let order = await Order.findById(orderId);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order can not be found",
      });
    }

    // Verify signature
    const secret = process.env.RAZORPAY_KEY_SECRET;
    if (!secret) {
      return res.status(500).json({
        success: false,
        message: "Verification failed: Server secret is missing.",
      });
    }

    const hmac = crypto.createHmac("sha256", secret);
    hmac.update(razorpay_order_id + "|" + razorpay_payment_id);
    const generated_signature = hmac.digest("hex");

    if (generated_signature !== razorpay_signature) {
      return res.status(400).json({
        success: false,
        message: "Payment verification failed: Signature mismatch.",
      });
    }

    order.paymentStatus = "paid";
    order.orderStatus = "confirmed";
    order.razorpayPaymentId = razorpay_payment_id;
    order.razorpaySignature = razorpay_signature;

    await order.save();

    //update out student course model
    let studentCourses = await StudentCourses.findOne({
      userId: order.userId,
    });

    const coursesToAdd = order.courses.map(course => ({
      courseId: course.courseId,
      title: course.title,
      instructorId: course.instructorId,
      instructorName: course.instructorName,
      dateOfPurchase: order.orderDate,
      courseImage: course.courseImage,
    }));

    if (studentCourses) {
      for (const courseToAdd of coursesToAdd) {
        if (!studentCourses.courses.some(c => c.courseId === courseToAdd.courseId)) {
          studentCourses.courses.push(courseToAdd);
        }
      }
      await studentCourses.save();
    } else {
      studentCourses = new StudentCourses({
        userId: order.userId,
        courses: coursesToAdd,
      });
      await studentCourses.save();
    }

    //update the course schema students for each course
    for (const course of order.courses) {
      await Course.findByIdAndUpdate(course.courseId, {
        $addToSet: {
          students: {
            studentId: order.userId,
            studentName: order.userName,
            studentEmail: order.userEmail,
            paidAmount: course.coursePricing,
            purchasedDate: order.orderDate,
          },
        },
      });
    }

    // Clear the cart for this user after successful purchase
    await Cart.findOneAndDelete({ userId: order.userId });

    res.status(200).json({
      success: true,
      message: "Order confirmed",
      data: order,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      success: false,
      message: "Some error occured!",
    });
  }
};

const createFreeOrder = async (req, res) => {
  try {
    const {
      userId,
      userName,
      userEmail,
      courses,
    } = req.body;

    // Verify all courses are actually free
    for (const item of courses) {
      const course = await Course.findById(item.courseId);
      if (!course || course.pricing > 0) {
        return res.status(400).json({
          success: false,
          message: `Course "${item.title}" is not a free course and requires payment.`,
        });
      }
    }

    const newlyCreatedCourseOrder = new Order({
      userId,
      userName,
      userEmail,
      orderStatus: "confirmed",
      paymentMethod: "free_mock",
      paymentStatus: "paid",
      orderDate: new Date(),
      courses,
    });

    await newlyCreatedCourseOrder.save();

    //update out student course model
    let studentCourses = await StudentCourses.findOne({
      userId: userId,
    });

    const coursesToAdd = courses.map(course => ({
      courseId: course.courseId,
      title: course.title,
      instructorId: course.instructorId,
      instructorName: course.instructorName,
      dateOfPurchase: new Date(),
      courseImage: course.courseImage,
    }));

    if (studentCourses) {
      for (const courseToAdd of coursesToAdd) {
        if (!studentCourses.courses.some(c => c.courseId === courseToAdd.courseId)) {
          studentCourses.courses.push(courseToAdd);
        }
      }
      await studentCourses.save();
    } else {
      studentCourses = new StudentCourses({
        userId: userId,
        courses: coursesToAdd,
      });
      await studentCourses.save();
    }

    //update the course schema students for each course
    for (const course of courses) {
      await Course.findByIdAndUpdate(course.courseId, {
        $addToSet: {
          students: {
            studentId: userId,
            studentName: userName,
            studentEmail: userEmail,
            paidAmount: course.coursePricing,
            purchasedDate: new Date(),
          },
        },
      });
    }

    // Clear the cart for this user
    await Cart.findOneAndDelete({ userId: userId });

    res.status(201).json({
      success: true,
      message: "Order confirmed",
      data: newlyCreatedCourseOrder,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      success: false,
      message: "Some error occured!",
    });
  }
};

module.exports = { createOrder, capturePaymentAndFinalizeOrder, createFreeOrder };
