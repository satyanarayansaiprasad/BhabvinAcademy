const express = require("express");
const {
  getCategories,
  addCategory,
  updateCategory,
  deleteCategory,
} = require("../../controllers/instructor-controller/category-controller");
const authenticate = require("../../middleware/auth-middleware");
const { requireRole } = require("../../middleware/auth-middleware");

const router = express.Router();

router.get("/get", getCategories);
router.post("/add", authenticate, requireRole("admin", "instructor"), addCategory);
router.put("/update/:id", authenticate, requireRole("admin", "instructor"), updateCategory);
router.delete("/delete/:id", authenticate, requireRole("admin", "instructor"), deleteCategory);

module.exports = router;
