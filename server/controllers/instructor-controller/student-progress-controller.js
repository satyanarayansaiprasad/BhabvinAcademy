const StudentCourses = require("../../models/StudentCourses");
const CourseProgress = require("../../models/CourseProgress");
const User = require("../../models/User");

const getStudentProgress = async (req, res) => {
  try {
    const studentCoursesList = await StudentCourses.find({});
    const results = [];

    for (const record of studentCoursesList) {
      const user = await User.findById(record.userId);
      if (!user) continue;

      for (const courseInfo of record.courses) {
        const progress = await CourseProgress.findOne({
          userId: record.userId,
          courseId: courseInfo.courseId,
        });

        let completionPercentage = 0;
        if (progress && progress.lecturesProgress && progress.lecturesProgress.length > 0) {
          const viewedLecturesCount = progress.lecturesProgress.filter(
            (lecture) => lecture.viewed
          ).length;
          completionPercentage = Math.round(
            (viewedLecturesCount * 100) / progress.lecturesProgress.length
          );
        }

        results.push({
          studentId: record.userId,
          studentName: user.userFullName || user.userName,
          studentEmail: user.userEmail,
          courseId: courseInfo.courseId,
          courseTitle: courseInfo.title,
          dateOfPurchase: courseInfo.dateOfPurchase,
          completed: progress ? progress.completed : false,
          progress: completionPercentage,
        });
      }
    }

    res.status(200).json({
      success: true,
      data: results,
    });
  } catch (e) {
    console.log(e);
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
    console.log(e);
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
