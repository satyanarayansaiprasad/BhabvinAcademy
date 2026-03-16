const User = require("../../models/User");
const StudentCourses = require("../../models/StudentCourses");
const Progress = require("../../models/CourseProgress");

const deleteStudent = async (req, res) => {
  try {
    const { studentId } = req.params;
    const user = await User.findById(studentId);
    if (!user || user.role !== "student") {
      return res.status(404).json({ success: false, message: "Student not found" });
    }
    await User.findByIdAndDelete(studentId);
    await StudentCourses.deleteOne({ userId: studentId });
    await Progress.deleteMany({ userId: studentId });
    res.status(200).json({ success: true, message: "Student deleted successfully" });
  } catch (error) {
    console.error("Error deleting student:", error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

const getAllStudentsProgress = async (req, res) => {
  try {
    // Only fetch users with role "student" — excludes admins, sub-admins, instructors
    const students = await User.find({ role: "student" }).select(
      "userName userFullName userEmail profileImage userHeadline userBio status _id"
    );

    if (!students || students.length === 0) {
      return res.status(200).json({
        success: true,
        data: [],
      });
    }

    const studentsProgressData = await Promise.all(
      students.map(async (student) => {
        // Fetch courses purchased by each student
        const studentCourses = await StudentCourses.findOne({ userId: student._id });

        const coursesWithProgress = studentCourses ? await Promise.all(
          studentCourses.courses.map(async (course) => {
            // Fetch progress for each course
            const progress = await Progress.findOne({
              userId: student._id,
              courseId: course.courseId,
            });

            let completionPercentage = 0;
            if (progress && progress.lecturesProgress) {
              const totalLectures = progress.lecturesProgress.length;
              const viewedLectures = progress.lecturesProgress.filter(lp => lp.viewed).length;
              completionPercentage = totalLectures > 0 ? (viewedLectures / totalLectures) * 100 : 0;
            }

            return {
              courseId: course.courseId,
              title: course.title,
              dateOfPurchase: course.dateOfPurchase,
              completionPercentage: Math.round(completionPercentage),
              isCompleted: progress ? progress.completed : false,
            };
          })
        ) : [];

        return {
          studentId: student._id,
          userName: student.userName,
          userFullName: student.userFullName,
          userEmail: student.userEmail,
          profileImage: student.profileImage,
          userHeadline: student.userHeadline,
          userBio: student.userBio,
          status: student.status,
          courses: coursesWithProgress,
        };
      })
    );

    res.status(200).json({
      success: true,
      data: studentsProgressData,
    });
  } catch (error) {
    console.error("Error fetching students progress:", error);
    res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

module.exports = { getAllStudentsProgress };


