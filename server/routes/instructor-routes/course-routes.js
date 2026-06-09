const express = require("express");
const {
  addNewCourse,
  getCourses,
  getCourseDetails,
  updateCourse,
  deleteCourse,
} = require("../../controllers/instructor-controller/course-controller");

const router = express.Router();

router.post("/add", addNewCourse);
router.get("/get", getCourses);
router.get("/get/details/:id", getCourseDetails);
router.put("/update/:id", updateCourse);
router.delete("/delete/:id", deleteCourse);

module.exports = router;
