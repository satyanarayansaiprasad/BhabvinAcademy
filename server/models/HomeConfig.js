const mongoose = require("mongoose");

const HomeConfigSchema = new mongoose.Schema({
    skillPillars: [
        {
            label: String,
        },
    ],
    studentReviews: [
        {
            studentName: String,
            reviewText: String,
            studentImage: String,
        },
    ],
});

module.exports = mongoose.model("HomeConfig", HomeConfigSchema);
