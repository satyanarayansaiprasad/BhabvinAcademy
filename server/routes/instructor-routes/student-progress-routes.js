const express = require("express");
const { getAllStudentsProgress, deleteStudent } = require("../../controllers/instructor-controller/student-progress-controller");
const router = express.Router();

router.get("/get", getAllStudentsProgress);
router.delete("/delete/:studentId", deleteStudent);

module.exports = router;
