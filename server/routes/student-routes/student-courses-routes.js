const express = require("express");
const {
  getCoursesByStudentId,
  deleteCourseByStudentId,
} = require("../../controllers/student-controller/student-courses-controller");

const router = express.Router();

router.get("/get/:studentId", getCoursesByStudentId);
router.delete("/delete/:studentId/:courseId", deleteCourseByStudentId);

module.exports = router;
