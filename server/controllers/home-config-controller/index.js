const HomeConfig = require("../../models/HomeConfig");

const getHomeConfig = async (req, res) => {
  try {
    let config = await HomeConfig.findOne({});
    if (!config) {
      config = new HomeConfig({
        skillPillars: [],
        studentReviews: [],
        featuredCourseSections: { trending: [], recent: [] },
        categories: [],
      });
      await config.save();
    }
    res.status(200).json({
      success: true,
      data: config,
    });
  } catch (error) {
    console.error("Error getting home config:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch home configuration.",
      error: error.message,
    });
  }
};

const updateHomeConfig = async (req, res) => {
  try {
    const updateData = req.body;
    let config = await HomeConfig.findOne({});
    if (!config) {
      config = new HomeConfig(updateData);
      await config.save();
    } else {
      config = await HomeConfig.findByIdAndUpdate(config._id, updateData, { new: true });
    }
    res.status(200).json({
      success: true,
      message: "Home configuration updated successfully!",
      data: config,
    });
  } catch (error) {
    console.error("Error updating home config:", error);
    res.status(500).json({
      success: false,
      message: "Failed to update home configuration.",
      error: error.message,
    });
  }
};

module.exports = {
  getHomeConfig,
  updateHomeConfig,
};
