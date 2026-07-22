const Category = require("../../models/Category");

const DEFAULT_CATEGORIES = [
  { name: "Microsoft", slug: "microsoft" },
  { name: "Linux", slug: "linux" },
  { name: "Networking", slug: "networking" },
  { name: "Cloud", slug: "cloud" },
  { name: "Security", slug: "security" },
];

const getCategories = async (req, res) => {
  try {
    let categories = await Category.find().sort({ createdAt: -1 });

    // Seed default categories if database collection is empty
    if (categories.length === 0) {
      await Category.insertMany(DEFAULT_CATEGORIES);
      categories = await Category.find().sort({ createdAt: -1 });
    }

    res.status(200).json({
      success: true,
      data: categories,
    });
  } catch (e) {
    console.error("Error fetching categories:", e);
    res.status(500).json({
      success: false,
      message: "Error fetching categories",
    });
  }
};

const addCategory = async (req, res) => {
  try {
    const { name } = req.body;

    if (!name || !name.trim()) {
      return res.status(400).json({
        success: false,
        message: "Category name is required",
      });
    }

    const trimmedName = name.trim();
    const slug = trimmedName.toLowerCase().replace(/[^a-z0-9]+/g, "-");

    // Case-insensitive duplicate check
    const existingCategory = await Category.findOne({
      name: { $regex: new RegExp(`^${trimmedName}$`, "i") },
    });

    if (existingCategory) {
      return res.status(400).json({
        success: false,
        message: "A category with this name already exists",
      });
    }

    const newCategory = new Category({
      name: trimmedName,
      slug,
      status: "active",
    });

    await newCategory.save();

    res.status(201).json({
      success: true,
      message: "Category created successfully",
      data: newCategory,
    });
  } catch (e) {
    console.error("Error adding category:", e);
    res.status(500).json({
      success: false,
      message: "Error creating category",
    });
  }
};

const updateCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, status } = req.body;

    const category = await Category.findById(id);
    if (!category) {
      return res.status(404).json({
        success: false,
        message: "Category not found",
      });
    }

    if (name && name.trim()) {
      const trimmedName = name.trim();
      // Check for duplicate if name is changing
      const existing = await Category.findOne({
        _id: { $ne: id },
        name: { $regex: new RegExp(`^${trimmedName}$`, "i") },
      });

      if (existing) {
        return res.status(400).json({
          success: false,
          message: "Another category with this name already exists",
        });
      }

      category.name = trimmedName;
      category.slug = trimmedName.toLowerCase().replace(/[^a-z0-9]+/g, "-");
    }

    if (status) {
      category.status = status;
    }

    await category.save();

    res.status(200).json({
      success: true,
      message: "Category updated successfully",
      data: category,
    });
  } catch (e) {
    console.error("Error updating category:", e);
    res.status(500).json({
      success: false,
      message: "Error updating category",
    });
  }
};

const deleteCategory = async (req, res) => {
  try {
    const { id } = req.params;

    const deleted = await Category.findByIdAndDelete(id);
    if (!deleted) {
      return res.status(404).json({
        success: false,
        message: "Category not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Category deleted successfully",
    });
  } catch (e) {
    console.error("Error deleting category:", e);
    res.status(500).json({
      success: false,
      message: "Error deleting category",
    });
  }
};

module.exports = {
  getCategories,
  addCategory,
  updateCategory,
  deleteCategory,
};
