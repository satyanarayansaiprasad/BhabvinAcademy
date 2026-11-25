const express = require("express");
const {
  createOrder,
  capturePaymentAndFinalizeOrder,
  createFreeOrder,
} = require("../../controllers/student-controller/order-controller");
const authenticate = require("../../middleware/auth-middleware");

const router = express.Router();

router.post("/create", authenticate, createOrder);
router.post("/capture", authenticate, capturePaymentAndFinalizeOrder);
router.post("/create-free", authenticate, createFreeOrder);

module.exports = router;
