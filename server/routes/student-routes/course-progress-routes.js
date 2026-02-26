const express = require("express");
const {
  getCurrentCourseProgress,
  markCurrentLectureAsViewed,
  resetCurrentCourseProgress,
  getCompletedCourses,
} = require("../../controllers/student-controller/course-progress-controller");

const router = express.Router();

router.get("/get/:userId/:courseId", getCurrentCourseProgress);
router.post("/mark-lecture-viewed", markCurrentLectureAsViewed);
router.post("/reset-progress", resetCurrentCourseProgress);
router.get("/completed-courses/:userId", getCompletedCourses);

module.exports = router;
