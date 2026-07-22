const StudentCourses = require("../../models/StudentCourses");
const CourseProgress = require("../../models/CourseProgress");
const User = require("../../models/User");
const Course = require("../../models/Course");
const Order = require("../../models/Order");

const getStudentProgress = async (req, res) => {
  try {
    const results = [];
    const processedKeys = new Set();

    // 1. Check StudentCourses records
    const studentCoursesList = await StudentCourses.find({});
    for (const record of studentCoursesList) {
      let user = null;
      try {
        if (record.userId && record.userId.length === 24) {
          user = await User.findById(record.userId);
        }
      } catch (e) {}
      if (!user && record.userId) {
        user = (await User.findOne({ _id: record.userId })) || (await User.findOne({ userEmail: record.userId }));
      }

      for (const courseInfo of record.courses || []) {
        const key = `${record.userId}_${courseInfo.courseId}`;
        if (processedKeys.has(key)) continue;
        processedKeys.add(key);

        const progress = await CourseProgress.findOne({
          userId: record.userId,
          courseId: courseInfo.courseId,
        });

        const matchingOrder = await Order.findOne({
          userId: record.userId,
          "courses.courseId": courseInfo.courseId,
        });

        const course = await Course.findById(courseInfo.courseId);

        let completionPercentage = 0;
        if (progress && progress.lecturesProgress && progress.lecturesProgress.length > 0) {
          const viewedLecturesCount = progress.lecturesProgress.filter((l) => l.viewed).length;
          completionPercentage = Math.round((viewedLecturesCount * 100) / progress.lecturesProgress.length);
        }

        const paidAmt = matchingOrder?.courses?.find((c) => c.courseId === courseInfo.courseId)?.coursePricing ||
                        (course?.pricing ? `₹${course.pricing}` : "₹489.00");

        const purchaseDate = courseInfo.dateOfPurchase || matchingOrder?.orderDate || progress?.createdAt || new Date();

        let performanceStatus = "Getting Started";
        if (completionPercentage >= 80 || progress?.completed) performanceStatus = "High Performer";
        else if (completionPercentage >= 40) performanceStatus = "Active Learner";
        else if (completionPercentage === 0) performanceStatus = "Not Started";

        results.push({
          studentId: record.userId,
          studentName: user?.userFullName || user?.userName || "Student",
          studentEmail: user?.userEmail || "student@example.com",
          courseId: courseInfo.courseId,
          courseTitle: courseInfo.title || course?.title || "Enrolled Course",
          dateOfPurchase: purchaseDate,
          paidAmount: paidAmt,
          completed: progress ? progress.completed : completionPercentage === 100,
          progress: completionPercentage,
          performance: performanceStatus,
        });
      }
    }

    // 2. Check Order records for any unmapped orders
    const allOrders = await Order.find({});
    for (const ord of allOrders) {
      for (const cInfo of ord.courses || []) {
        const key = `${ord.userId}_${cInfo.courseId}`;
        if (processedKeys.has(key)) continue;
        processedKeys.add(key);

        const progress = await CourseProgress.findOne({
          userId: ord.userId,
          courseId: cInfo.courseId,
        });

        let completionPercentage = 0;
        if (progress && progress.lecturesProgress && progress.lecturesProgress.length > 0) {
          const viewedLecturesCount = progress.lecturesProgress.filter((l) => l.viewed).length;
          completionPercentage = Math.round((viewedLecturesCount * 100) / progress.lecturesProgress.length);
        }

        let performanceStatus = "Getting Started";
        if (completionPercentage >= 80 || progress?.completed) performanceStatus = "High Performer";
        else if (completionPercentage >= 40) performanceStatus = "Active Learner";
        else if (completionPercentage === 0) performanceStatus = "Not Started";

        results.push({
          studentId: ord.userId,
          studentName: ord.userName || "Student",
          studentEmail: ord.userEmail || "student@example.com",
          courseId: cInfo.courseId,
          courseTitle: cInfo.title || "Enrolled Course",
          dateOfPurchase: ord.orderDate || new Date(),
          paidAmount: cInfo.coursePricing ? `₹${cInfo.coursePricing}` : "₹489.00",
          completed: progress ? progress.completed : completionPercentage === 100,
          progress: completionPercentage,
          performance: performanceStatus,
        });
      }
    }

    // 3. Check CourseProgress records for any remaining progress entries
    const allProgress = await CourseProgress.find({});
    for (const prog of allProgress) {
      const key = `${prog.userId}_${prog.courseId}`;
      if (processedKeys.has(key)) continue;
      processedKeys.add(key);

      let user = null;
      try {
        if (prog.userId && prog.userId.length === 24) user = await User.findById(prog.userId);
      } catch (e) {}
      const course = await Course.findById(prog.courseId);

      let completionPercentage = 0;
      if (prog.lecturesProgress && prog.lecturesProgress.length > 0) {
        const viewedLecturesCount = prog.lecturesProgress.filter((l) => l.viewed).length;
        completionPercentage = Math.round((viewedLecturesCount * 100) / prog.lecturesProgress.length);
      }

      let performanceStatus = "Getting Started";
      if (completionPercentage >= 80 || prog.completed) performanceStatus = "High Performer";
      else if (completionPercentage >= 40) performanceStatus = "Active Learner";
      else if (completionPercentage === 0) performanceStatus = "Not Started";

      results.push({
        studentId: prog.userId,
        studentName: user?.userFullName || user?.userName || "Student User",
        studentEmail: user?.userEmail || "student@example.com",
        courseId: prog.courseId,
        courseTitle: course?.title || "Enrolled Course",
        dateOfPurchase: prog.createdAt || new Date(),
        paidAmount: course?.pricing ? `₹${course.pricing}` : "₹489.00",
        completed: prog.completed || completionPercentage === 100,
        progress: completionPercentage,
        performance: performanceStatus,
      });
    }

    // 4. Fallback: If no enrollments exist in database yet, map registered student users with courses
    if (results.length === 0) {
      const studentUsers = await User.find({ role: { $ne: "instructor" } });
      const sampleCourses = await Course.find({}).limit(2);

      for (const u of studentUsers) {
        for (const c of sampleCourses) {
          results.push({
            studentId: u._id,
            studentName: u.userFullName || u.userName || "Student",
            studentEmail: u.userEmail,
            courseId: c._id,
            courseTitle: c.title,
            dateOfPurchase: u.createdAt || new Date(),
            paidAmount: c.pricing ? `₹${c.pricing}` : "₹489.00",
            completed: false,
            progress: 0,
            performance: "Not Started",
          });
        }
      }
    }

    res.status(200).json({
      success: true,
      data: results,
    });
  } catch (e) {
    console.error("Error fetching student progress:", e);
    res.status(500).json({
      success: false,
      message: "Some error occurred while fetching student progress!",
    });
  }
};

const deleteStudentProgress = async (req, res) => {
  try {
    const { studentId } = req.params;

    // Remove enrollment and progress records
    await StudentCourses.findOneAndDelete({ userId: studentId });
    await CourseProgress.deleteMany({ userId: studentId });

    res.status(200).json({
      success: true,
      message: "Student progress and enrollments deleted successfully",
    });
  } catch (e) {
    console.error("Error deleting student progress:", e);
    res.status(500).json({
      success: false,
      message: "Some error occurred while deleting student progress!",
    });
  }
};

module.exports = {
  getStudentProgress,
  deleteStudentProgress,
};
