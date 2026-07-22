const express = require("express");
const {
  getCategories,
  addCategory,
  updateCategory,
  deleteCategory,
} = require("../../controllers/instructor-controller/category-controller");

const router = express.Router();

router.get("/get", getCategories);
router.post("/add", addCategory);
router.put("/update/:id", updateCategory);
router.delete("/delete/:id", deleteCategory);

module.exports = router;
