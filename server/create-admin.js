require("dotenv").config({ path: "./.env" });
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const User = require("./models/User");

const run = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);

        const adminEmail = "admin@lms.com";
        const adminPassword = "AdminPassword123!";

        // Check if admin exists
        let adminUser = await User.findOne({ userEmail: adminEmail });

        if (adminUser) {
            console.log("Admin user exists. Resetting password to default...");
            const hashPassword = await bcrypt.hash(adminPassword, 10);
            adminUser.password = hashPassword;
            // Make sure the role is instructor/admin
            adminUser.role = "instructor"; // the frontend seems to expect "instructor" or "admin"
            await adminUser.save();
        } else {
            console.log("Creating new Admin user...");
            const hashPassword = await bcrypt.hash(adminPassword, 10);
            adminUser = new User({
                userName: "Admin",
                userEmail: adminEmail,
                password: hashPassword,
                role: "instructor" // typical for LMS admin dashboards
            });
            await adminUser.save();
        }

        console.log("-----------------------------------------");
        console.log("✅ Admin Login Credentials Configured:");
        console.log(`Email: ${adminEmail}`);
        console.log(`Password: ${adminPassword}`);
        console.log(`Role: ${adminUser.role}`);
        console.log("-----------------------------------------");

    } catch (error) {
        console.error("❌ Error:", error.message);
    } finally {
        await mongoose.disconnect();
        process.exit(0);
    }
};

run();
