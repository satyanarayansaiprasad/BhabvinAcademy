const express = require("express");
const { getHomeConfig, updateHomeConfig } = require("../../controllers/home-config-controller");
const authenticateMiddleware = require("../../middleware/auth-middleware");

const router = express.Router();

router.get("/get", getHomeConfig); // publicly available
router.put("/update", authenticateMiddleware, updateHomeConfig); // protected

module.exports = router;
