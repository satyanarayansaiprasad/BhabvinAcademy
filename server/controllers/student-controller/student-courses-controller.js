const StudentCourses = require("../../models/StudentCourses");
const Course = require("../../models/Course");
const Progress = require("../../models/CourseProgress");

const getCoursesByStudentId = async (req, res) => {
  try {
    const { studentId } = req.params;
    const studentBoughtCourses = await StudentCourses.findOne({
      userId: studentId,
    });

    res.status(200).json({
      success: true,
      data: studentBoughtCourses?.courses || [],
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Some error occured!",
    });
  }
};

const deleteCourseByStudentId = async (req, res) => {
  try {
    const { studentId, courseId } = req.params;

    // 1. Remove from student's enrolled courses list
    const studentCourses = await StudentCourses.findOne({ userId: studentId });
    if (studentCourses) {
      studentCourses.courses = studentCourses.courses.filter(
        (course) => course.courseId.toString() !== courseId.toString()
      );
      await studentCourses.save();
    }

    // 2. Remove from the main Course document's students array
    await Course.findByIdAndUpdate(courseId, {
      $pull: { students: { studentId: studentId } },
    });

    // 3. Remove progress record for this student and course
    await Progress.findOneAndDelete({ userId: studentId, courseId: courseId });

    res.status(200).json({
      success: true,
      message: "Course removed successfully from your learning list",
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "An error occurred while deleting the course",
    });
  }
};

module.exports = { getCoursesByStudentId, deleteCourseByStudentId };
