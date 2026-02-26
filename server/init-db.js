require("dotenv").config({ path: "./.env" });
const mongoose = require("mongoose");
const cloudinary = require("cloudinary").v2;

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

const run = async () => {
    try {
        console.log("Connecting to MongoDB...");
        await mongoose.connect(process.env.MONGO_URI, { serverSelectionTimeoutMS: 5000 });
        console.log("Connected successfully!");

        // Models
        const User = require("./models/User") || mongoose.model('User');
        const Course = require("./models/Course") || mongoose.model('Course');
        const Order = require("./models/Order") || mongoose.model('Order');
        const Progress = require("./models/CourseProgress") || mongoose.model('Progress');
        const StudentCourses = require("./models/StudentCourses") || mongoose.model('StudentCourses');

        console.log("Ensuring collections exist...");
        await User.createCollection();
        await Course.createCollection();
        await Order.createCollection();
        await Progress.createCollection();
        await StudentCourses.createCollection();
        console.log("✅ MongoDB collections initialized successfully.");
    } catch (error) {
        console.error("❌ MongoDB Connection Error:", error.message);
    } finally {
        try { await mongoose.disconnect(); } catch (e) { }
    }

    try {
        // Test Cloudinary
        console.log("\nTesting Cloudinary...");
        const result = await cloudinary.api.ping();
        if (result.status === "ok") {
            console.log("✅ Cloudinary is connected and working successfully!");
        } else {
            console.log("⚠️ Cloudinary ping returned:", result);
        }
    } catch (error) {
        console.error("❌ Cloudinary Connection Error:", error.message);
    } finally {
        process.exit(0);
    }
};

run();
