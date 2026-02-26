import express from 'express';
import { getHomeConfig, updateHomeConfig } from '../../controllers/instructor-controller/home-config-controller.js';

const router = express.Router();

router.get("/get", getHomeConfig);
router.put("/update", updateHomeConfig);

export default router;
