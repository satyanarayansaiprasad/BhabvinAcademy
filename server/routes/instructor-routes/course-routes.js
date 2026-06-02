const express = require("express");
const {
  addNewCourse,
  fetchAllInstructorCourses,
  fetchInstructorCourseDetails,
  updateCourseById,
  deleteCourse,
} = require("../../controllers/instructor-controller/course-controller");
const authenticateMiddleware = require("../../middleware/auth-middleware");

const router = express.Router();

router.post("/add", authenticateMiddleware, addNewCourse);
router.get("/get", authenticateMiddleware, fetchAllInstructorCourses);
router.get("/get/details/:id", authenticateMiddleware, fetchInstructorCourseDetails);
router.put("/update/:id", authenticateMiddleware, updateCourseById);
router.delete("/delete/:id", authenticateMiddleware, deleteCourse);

module.exports = router;
