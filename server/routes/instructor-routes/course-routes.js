const express = require("express");
const {
  addNewCourse,
  getCourses,
  getCourseDetails,
  updateCourse,
  deleteCourse,
} = require("../../controllers/instructor-controller/course-controller");
const authenticate = require("../../middleware/auth-middleware");
const { requireRole } = require("../../middleware/auth-middleware");

const router = express.Router();

router.get("/get", authenticate, requireRole("admin", "instructor", "sub-admin"), getCourses);
router.get("/get/details/:id", authenticate, requireRole("admin", "instructor", "sub-admin"), getCourseDetails);
router.post("/add", authenticate, requireRole("admin", "instructor"), addNewCourse);
router.put("/update/:id", authenticate, requireRole("admin", "instructor"), updateCourse);
router.delete("/delete/:id", authenticate, requireRole("admin", "instructor"), deleteCourse);

module.exports = router;
