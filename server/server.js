require("dotenv").config();
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const authRoutes = require("./routes/auth-routes/index");
const mediaRoutes = require("./routes/instructor-routes/media-routes");
const instructorCourseRoutes = require("./routes/instructor-routes/course-routes");
const studentViewCourseRoutes = require("./routes/student-routes/course-routes");
const studentViewOrderRoutes = require("./routes/student-routes/order-routes");
const studentCoursesRoutes = require("./routes/student-routes/student-courses-routes");
const studentCourseProgressRoutes = require("./routes/student-routes/course-progress-routes");
const homeConfigRoutes = require("./routes/instructor-routes/home-config-routes");

const app = express();
const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI;

app.use(
    cors({
        origin: process.env.CLIENT_URL,
        methods: ["GET", "POST", "DELETE", "PUT"],
        allowedHeaders: ["Content-Type", "Authorization"],
    })
);

app.use(express.json());

//database connection
mongoose
    .connect(MONGO_URI)
    .then(() => console.log("mongodb is connected"))
    .catch((e) => console.log(e));

//routes configuration
app.get("/health", (req, res) => {
    res.status(200).json({
        success: true,
        message: "Server is healthy",
        env: {
            mongoUriSet: !!process.env.MONGO_URI,
            mongoUriLength: process.env.MONGO_URI?.length || 0,
            nodeEnv: process.env.NODE_ENV,
            clientUrl: process.env.CLIENT_URL
        },
        dbStatus: mongoose.connection.readyState === 1 ? "connected" : "disconnected",
        dbReadyState: mongoose.connection.readyState
    });
});

app.use("/auth", authRoutes);
app.use("/media", mediaRoutes);
app.use("/instructor/course", instructorCourseRoutes);
app.use("/student/course", studentViewCourseRoutes);
app.use("/student/order", studentViewOrderRoutes);
app.use("/student/courses-bought", studentCoursesRoutes);
app.use("/student/course-progress", studentCourseProgressRoutes);
app.use("/home-config", homeConfigRoutes);

app.use((err, req, res, next) => {
    console.log(err.stack);
    res.status(500).json({
        success: false,
        message: "Some error occured!",
        error: err.message,
        stack: err.stack
    });
});

if (require.main === module) {
    app.listen(PORT, () => {
        console.log(`Server is now running on port ${PORT}`);
    });
}

module.exports = app;
