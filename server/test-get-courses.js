require("dotenv").config({ path: "./.env" });
const mongoose = require("mongoose");
const Course = require("./models/Course");

const run = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI, { serverSelectionTimeoutMS: 5000 });
    const filters = {};
    const sortParam = { pricing: 1 };
    const coursesList = await Course.find(filters).sort(sortParam);
    console.log("Found", coursesList.length, "courses");
  } catch (e) {
    console.error("Error:", e);
  } finally {
    process.exit(0);
  }
};
run();
