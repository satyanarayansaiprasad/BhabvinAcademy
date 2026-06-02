const Course = require("../../models/Course");

// Add a new course
const addNewCourse = async (req, res) => {
  try {
    const courseData = req.body;
    const newCourse = new Course({
      ...courseData,
      date: new Date(),
    });

    await newCourse.save();

    res.status(201).json({
      success: true,
      message: "Course created successfully!",
      data: newCourse,
    });
  } catch (error) {
    console.error("Error creating course:", error);
    res.status(500).json({
      success: false,
      message: "Failed to create course.",
      error: error.message,
    });
  }
};

// Fetch all courses
const fetchAllInstructorCourses = async (req, res) => {
  try {
    const courses = await Course.find({});
    res.status(200).json({
      success: true,
      data: courses,
    });
  } catch (error) {
    console.error("Error fetching courses:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch courses.",
      error: error.message,
    });
  }
};

// Fetch course details by ID
const fetchInstructorCourseDetails = async (req, res) => {
  try {
    const { id } = req.params;
    const course = await Course.findById(id);

    if (!course) {
      return res.status(404).json({
        success: false,
        message: "Course not found",
      });
    }

    res.status(200).json({
      success: true,
      data: course,
    });
  } catch (error) {
    console.error("Error fetching course details:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch course details.",
      error: error.message,
    });
  }
};

// Update course by ID
const updateCourseById = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    const course = await Course.findByIdAndUpdate(id, updateData, { new: true });

    if (!course) {
      return res.status(404).json({
        success: false,
        message: "Course not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Course updated successfully!",
      data: course,
    });
  } catch (error) {
    console.error("Error updating course:", error);
    res.status(500).json({
      success: false,
      message: "Failed to update course.",
      error: error.message,
    });
  }
};

// Delete course by ID
const deleteCourse = async (req, res) => {
  try {
    const { id } = req.params;
    const course = await Course.findByIdAndDelete(id);

    if (!course) {
      return res.status(404).json({
        success: false,
        message: "Course not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Course deleted successfully!",
    });
  } catch (error) {
    console.error("Error deleting course:", error);
    res.status(500).json({
      success: false,
      message: "Failed to delete course.",
      error: error.message,
    });
  }
};

module.exports = {
  addNewCourse,
  fetchAllInstructorCourses,
  fetchInstructorCourseDetails,
  updateCourseById,
  deleteCourse,
};
