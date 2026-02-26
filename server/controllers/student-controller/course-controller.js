const Course = require("../../models/Course");
const StudentCourses = require("../../models/StudentCourses");
const mongoose = require("mongoose");

const getAllStudentViewCourses = async (req, res) => {
  try {
    const {
      category = [],
      level = [],
      primaryLanguage = [],
      sortBy = "price-lowtohigh",
    } = req.query;

    console.log(req.query, "req.query");

    let filters = {};
    if (category && category.length) {
      const categoryArray = typeof category === "string" ? category.split(",").filter(c => c.trim() !== "") : category;
      if (categoryArray.length > 0) filters.category = { $in: categoryArray };
    }
    if (level && level.length) {
      const levelArray = typeof level === "string" ? level.split(",").filter(l => l.trim() !== "") : level;
      if (levelArray.length > 0) filters.level = { $in: levelArray };
    }
    if (primaryLanguage && primaryLanguage.length) {
      const langArray = typeof primaryLanguage === "string" ? primaryLanguage.split(",").filter(p => p.trim() !== "") : primaryLanguage;
      if (langArray.length > 0) filters.primaryLanguage = { $in: langArray };
    }

    // Only show published courses
    filters.isPublished = true;

    let sortParam = {};
    switch (sortBy) {
      case "price-lowtohigh":
        sortParam.pricing = 1;
        break;
      case "price-hightolow":
        sortParam.pricing = -1;
        break;
      case "title-atoz":
        sortParam.title = 1;
        break;
      case "title-ztoa":
        sortParam.title = -1;
        break;
      default:
        sortParam.pricing = 1;
        break;
    }

    const coursesList = await Course.find(filters).sort(sortParam);

    res.status(200).json({
      success: true,
      data: coursesList,
    });
  } catch (e) {
    console.log(e);
    res.status(500).json({
      success: false,
      message: "Some error occured!",
    });
  }
};

const getStudentViewCourseDetails = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid Course ID format",
      });
    }

    const courseDetails = await Course.findById(id);

    if (!courseDetails) {
      return res.status(404).json({
        success: false,
        message: "No course details found",
        data: null,
      });
    }

    res.status(200).json({
      success: true,
      data: courseDetails,
    });
  } catch (e) {
    console.log(e);
    res.status(500).json({
      success: false,
      message: "Some error occured!",
    });
  }
};

const checkCoursePurchaseInfo = async (req, res) => {
  try {
    const { id, studentId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid Course ID provided",
      });
    }

    const studentCourses = await StudentCourses.findOne({
      userId: studentId,
    });

    const ifStudentAlreadyBoughtCurrentCourse = studentCourses
      ? studentCourses.courses.findIndex((item) => item.courseId === id) > -1
      : false;

    res.status(200).json({
      success: true,
      data: ifStudentAlreadyBoughtCurrentCourse,
    });
  } catch (e) {
    console.log(e);
    res.status(500).json({
      success: false,
      message: "Some error occured!",
    });
  }
};

module.exports = {
  getAllStudentViewCourses,
  getStudentViewCourseDetails,
  checkCoursePurchaseInfo,
};
