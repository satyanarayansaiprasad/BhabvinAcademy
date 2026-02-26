const mongoose = require("mongoose");

const CartSchema = new mongoose.Schema({
    userId: {
        type: String,
        required: true,
    },
    items: [
        {
            courseId: {
                type: String,
                required: true,
            },
            title: String,
            instructorName: String,
            image: String,
            pricing: String,
        },
    ],
});

module.exports = mongoose.model("Cart", CartSchema);
