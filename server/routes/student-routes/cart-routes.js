const express = require("express");
const {
    addToCart,
    fetchCartItems,
    deleteCartItem,
} = require("../../controllers/student-controller/cart-controller");
const router = express.Router();

router.post("/add", addToCart);
router.get("/get/:userId", fetchCartItems);
router.delete("/delete/:userId/:courseId", deleteCartItem);

module.exports = router;
