const User = require("../../models/User");
const StudentCourses = require("../../models/StudentCourses");
const CourseProgress = require("../../models/CourseProgress");
const Course = require("../../models/Course");

const getStudentsProgress = async (req, res) => {
  try {
    // Fetch all student records
    const studentCoursesList = await StudentCourses.find({});
    const result = [];

    for (const record of studentCoursesList) {
      const user = await User.findById(record.userId).select("-password");
      if (!user) continue;

      const coursesWithProgress = [];
      for (const c of record.courses) {
        const courseInfo = await Course.findById(c.courseId);
        if (!courseInfo) continue;

        const progressRecord = await CourseProgress.findOne({
          userId: record.userId,
          courseId: c.courseId,
        });

        const totalLectures = courseInfo.curriculum?.length || 0;
        const viewedLectures = progressRecord?.lecturesProgress?.filter(p => p.viewed).length || 0;
        const progressPercentage = totalLectures > 0 ? Math.round((viewedLectures / totalLectures) * 100) : 0;

        coursesWithProgress.push({
          courseId: c.courseId,
          title: c.title,
          instructorName: c.instructorName,
          dateOfPurchase: c.dateOfPurchase,
          courseImage: c.courseImage,
          progress: progressPercentage,
          completed: progressRecord?.completed || false,
        });
      }

      result.push({
        studentId: user._id,
        userName: user.userName,
        userFullName: user.userFullName || user.userName,
        userEmail: user.userEmail,
        profileImage: user.profileImage,
        status: user.status || "active",
        courses: coursesWithProgress,
      });
    }

    res.status(200).json({
      success: true,
      data: result,
    });
  } catch (error) {
    console.error("Error fetching students progress:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch student progress data.",
      error: error.message,
    });
  }
};

const deleteStudent = async (req, res) => {
  try {
    const { studentId } = req.params;

    // Delete User
    await User.findByIdAndDelete(studentId);
    // Delete StudentCourses
    await StudentCourses.findOneAndDelete({ userId: studentId });
    // Delete CourseProgress
    await CourseProgress.deleteMany({ userId: studentId });

    res.status(200).json({
      success: true,
      message: "Student deleted successfully!",
    });
  } catch (error) {
    console.error("Error deleting student:", error);
    res.status(500).json({
      success: false,
      message: "Failed to delete student.",
      error: error.message,
    });
  }
};

module.exports = {
  getStudentsProgress,
  deleteStudent,
};
