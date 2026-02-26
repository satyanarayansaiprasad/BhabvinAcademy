import mongoose from 'mongoose';

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

const HomeConfig = mongoose.model("HomeConfig", HomeConfigSchema);
export default HomeConfig;
