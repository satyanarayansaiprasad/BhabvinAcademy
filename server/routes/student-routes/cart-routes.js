const express = require("express");
const {
    addToCart,
    fetchCartItems,
    deleteCartItem,
} = require("../../controllers/student-controller/cart-controller");
const authenticate = require("../../middleware/auth-middleware");
const router = express.Router();

router.post("/add", authenticate, addToCart);
router.get("/get/:userId", authenticate, fetchCartItems);
router.delete("/delete/:userId/:courseId", authenticate, deleteCartItem);

module.exports = router;
