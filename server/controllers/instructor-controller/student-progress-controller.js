const User = require("../../models/User");
const StudentCourses = require("../../models/StudentCourses");
const Progress = require("../../models/CourseProgress");

const getAllStudentsProgress = async (req, res) => {
  try {
    // 1. Fetch all users who are students
    // Students can have role "student" (from form/OAuth signup). Exclude admins and sub-admins.
    const students = await User.find({ role: { $nin: ["admin", "sub-admin"] } }).select("userName userEmail _id role");

    if (!students || students.length === 0) {
      return res.status(200).json({
        success: true,
        data: [],
      });
    }

    const studentsProgressData = await Promise.all(
      students.map(async (student) => {
        // 2. Fetch courses purchased by each student
        const studentCourses = await StudentCourses.findOne({ userId: student._id });
        
        const coursesWithProgress = studentCourses ? await Promise.all(
          studentCourses.courses.map(async (course) => {
            // 3. Fetch progress for each course
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
              completionPercentage: Math.round(completionPercentage),
              isCompleted: progress ? progress.completed : false,
            };
          })
        ) : [];

        return {
          studentId: student._id,
          userName: student.userName,
          userEmail: student.userEmail,
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
