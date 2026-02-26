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
    featuredCourseSections: {
        trending: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Course' }],
        mostDemanded: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Course' }],
        recent: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Course' }],
    },
    categories: [
        {
            id: String,
            label: String,
        },
    ],
});

module.exports = mongoose.model("HomeConfig", HomeConfigSchema);
