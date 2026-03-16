const express = require("express");
const { getAllStudentsProgress } = require("../../controllers/instructor-controller/student-progress-controller");
const router = express.Router();

router.get("/get", getAllStudentsProgress);

module.exports = router;
