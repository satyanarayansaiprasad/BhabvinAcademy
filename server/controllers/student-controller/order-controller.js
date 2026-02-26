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
      orderStatus,
      paymentMethod,
      paymentStatus,
      orderDate,
      courses,
    } = req.body;

    const totalAmount = courses.reduce((acc, course) => acc + parseFloat(course.coursePricing), 0);

    const options = {
      amount: Math.round(totalAmount * 100), // amount in the smallest currency unit (paise for INR)
      currency: "INR",
      receipt: `receipt_${Date.now()}`,
    };

    const razorpayOrder = await razorpay.orders.create(options);

    if (!razorpayOrder) {
      return res.status(500).json({
        success: false,
        message: "Error while creating razorpay order!",
      });
    }

    const newlyCreatedCourseOrder = new Order({
      userId,
      userName,
      userEmail,
      orderStatus,
      paymentMethod,
      paymentStatus,
      orderDate,
      razorpayOrderId: razorpayOrder.id,
      courses,
    });

    await newlyCreatedCourseOrder.save();

    res.status(201).json({
      success: true,
      data: {
        razorpayOrderId: razorpayOrder.id,
        orderId: newlyCreatedCourseOrder._id,
        amount: razorpayOrder.amount,
        currency: razorpayOrder.currency,
      },
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
    const secret = process.env.RAZORPAY_KEY_SECRET || "razorpay_secret_placeholder";
    const hmac = crypto.createHmac("sha256", secret);
    hmac.update(razorpay_order_id + "|" + razorpay_payment_id);
    const generated_signature = hmac.digest("hex");

    if (generated_signature !== razorpay_signature) {
      return res.status(400).json({
        success: false,
        message: "Payment verification failed!",
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

module.exports = { createOrder, capturePaymentAndFinalizeOrder };
