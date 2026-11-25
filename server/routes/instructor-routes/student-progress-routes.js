const express = require("express");
const {
  getStudentProgress,
  deleteStudentProgress,
} = require("../../controllers/instructor-controller/student-progress-controller");
const authenticate = require("../../middleware/auth-middleware");
const { requireRole } = require("../../middleware/auth-middleware");

const router = express.Router();

router.get("/get", authenticate, requireRole("admin", "instructor", "sub-admin"), getStudentProgress);
router.delete("/delete/:studentId", authenticate, requireRole("admin", "instructor"), deleteStudentProgress);

module.exports = router;
