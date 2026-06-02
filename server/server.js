require("dotenv").config();
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const authRoutes = require("./routes/auth-routes/index");
const studentViewCourseRoutes = require("./routes/student-routes/course-routes");
const studentViewOrderRoutes = require("./routes/student-routes/order-routes");
const studentCoursesRoutes = require("./routes/student-routes/student-courses-routes");
const studentCourseProgressRoutes = require("./routes/student-routes/course-progress-routes");
const studentCartRoutes = require("./routes/student-routes/cart-routes");
const contactRoutes = require("./routes/contact-routes");
const instructorCourseRoutes = require("./routes/instructor-routes/course-routes");
const instructorStudentProgressRoutes = require("./routes/instructor-routes/student-progress-routes");
const mediaRoutes = require("./routes/media-routes/index");
const homeConfigRoutes = require("./routes/home-config-routes/index");

const app = express();
const PORT = process.env.PORT || 5001;
const MONGO_URI = process.env.MONGO_URI;

const allowedOrigins = [
    process.env.CLIENT_URL,
    process.env.CLIENT_URL?.endsWith('/') ? process.env.CLIENT_URL.slice(0, -1) : `${process.env.CLIENT_URL}/`,
    "http://localhost:5173",
    "http://localhost:3000"
].filter(Boolean);

app.use(
    cors({
        origin: (origin, callback) => {
            if (!origin || allowedOrigins.indexOf(origin) !== -1) {
                callback(null, true);
            } else {
                callback(new Error("Not allowed by CORS"));
            }
        },
        methods: ["GET", "POST", "DELETE", "PUT"],
        allowedHeaders: ["Content-Type", "Authorization"],
        credentials: true
    })
);

app.use(express.json());

//database connection
let connectionError = null;
const connectDB = async () => {
    try {
        if (mongoose.connection.readyState >= 1) return;

        await mongoose.connect(MONGO_URI, {
            autoIndex: true,
        });
        console.log("mongodb is connected");
        connectionError = null;
    } catch (e) {
        console.log("MongoDB connection error:", e);
        connectionError = e.message;
    }
};

// Initial connection attempt
connectDB();

// Health check endpoint
app.get("/health", (req, res) => {
    res.status(200).json({
        success: true,
        message: "Server is healthy",
        mongodb: mongoose.connection.readyState === 1 ? "connected" : "disconnected",
        env: {
            RAZORPAY: !!(process.env.RAZORPAY_KEY_ID && process.env.RAZORPAY_KEY_SECRET),
        }
    });
});

//routes configuration
app.use("/auth", authRoutes);
app.use("/student/course", studentViewCourseRoutes);
app.use("/student/order", studentViewOrderRoutes);
app.use("/student/courses-bought", studentCoursesRoutes);
app.use("/student/course-progress", studentCourseProgressRoutes);
app.use("/student/cart", studentCartRoutes);
app.use("/contact", contactRoutes);
app.use("/instructor/course", instructorCourseRoutes);
app.use("/instructor/student-progress", instructorStudentProgressRoutes);
app.use("/media", mediaRoutes);
app.use("/home-config", homeConfigRoutes);

app.use((err, req, res, next) => {
    console.error(`ERROR at ${req.method} ${req.path}:`, err.stack);
    res.status(500).json({
        success: false,
        message: "Something went wrong",
        error: process.env.NODE_ENV === "development" ? err.message : undefined
    });
});

if (require.main === module) {
    app.listen(PORT, () => {
        console.log(`Server is now running on port ${PORT}`);
    });
}

module.exports = app;
