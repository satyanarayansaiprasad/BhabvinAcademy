const express = require("express");
const {
  getStudentProgress,
  deleteStudentProgress,
} = require("../../controllers/instructor-controller/student-progress-controller");

const router = express.Router();

router.get("/get", getStudentProgress);
router.delete("/delete/:studentId", deleteStudentProgress);

module.exports = router;
