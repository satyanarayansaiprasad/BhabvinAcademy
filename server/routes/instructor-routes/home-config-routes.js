const express = require("express");
const { getHomeConfig, updateHomeConfig } = require("../../controllers/instructor-controller/home-config-controller");
const router = express.Router();

router.get("/get", getHomeConfig);
router.put("/update", updateHomeConfig);

module.exports = router;
