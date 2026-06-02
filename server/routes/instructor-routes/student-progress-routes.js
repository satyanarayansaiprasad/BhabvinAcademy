const express = require("express");
const {
  getStudentsProgress,
  deleteStudent,
} = require("../../controllers/instructor-controller/student-progress-controller");
const authenticateMiddleware = require("../../middleware/auth-middleware");

const router = express.Router();

router.get("/get", authenticateMiddleware, getStudentsProgress);
router.delete("/delete/:studentId", authenticateMiddleware, deleteStudent);

module.exports = router;
