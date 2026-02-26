const express = require("express");
const {
  createOrder,
  capturePaymentAndFinalizeOrder,
  createFreeOrder,
} = require("../../controllers/student-controller/order-controller");

const router = express.Router();

router.post("/create", createOrder);
router.post("/capture", capturePaymentAndFinalizeOrder);
router.post("/create-free", createFreeOrder);

module.exports = router;
