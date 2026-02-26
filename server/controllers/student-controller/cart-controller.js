const Cart = require("../../models/Cart");
const Course = require("../../models/Course");

const addToCart = async (req, res) => {
    try {
        const { userId, courseId } = req.body;

        const course = await Course.findById(courseId);

        if (!course) {
            return res.status(404).json({
                success: false,
                message: "Course not found",
            });
        }

        let cart = await Cart.findOne({ userId });

        if (!cart) {
            cart = new Cart({
                userId,
                items: [],
            });
        }

        const isAlreadyInCart = cart.items.findIndex((item) => item.courseId === courseId) > -1;

        if (isAlreadyInCart) {
            return res.status(200).json({
                success: false,
                message: "Course already in cart",
            });
        }

        cart.items.push({
            courseId: course._id,
            title: course.title,
            instructorName: course.instructorName,
            image: course.image,
            pricing: course.pricing,
        });

        await cart.save();

        res.status(200).json({
            success: true,
            data: cart,
        });
    } catch (e) {
        console.log(e);
        res.status(500).json({
            success: false,
            message: "Some error occured!",
        });
    }
};

const fetchCartItems = async (req, res) => {
    try {
        const { userId } = req.params;

        const cart = await Cart.findOne({ userId });

        if (!cart) {
            return res.status(404).json({
                success: false,
                message: "Cart not found",
                data: [],
            });
        }

        res.status(200).json({
            success: true,
            data: cart.items,
        });
    } catch (e) {
        console.log(e);
        res.status(500).json({
            success: false,
            message: "Some error occured!",
        });
    }
};

const deleteCartItem = async (req, res) => {
    try {
        const { userId, courseId } = req.params;

        const cart = await Cart.findOne({ userId });

        if (!cart) {
            return res.status(404).json({
                success: false,
                message: "Cart not found",
            });
        }

        cart.items = cart.items.filter((item) => item.courseId !== courseId);

        await cart.save();

        res.status(200).json({
            success: true,
            data: cart.items,
        });
    } catch (e) {
        console.log(e);
        res.status(500).json({
            success: false,
            message: "Some error occured!",
        });
    }
};

module.exports = { addToCart, fetchCartItems, deleteCartItem };
