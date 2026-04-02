const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  userName: String,
  userFullName: String,
  userEmail: String,
  password: String,
  role: String,
  profileImage: String,
  userHeadline: String,
  userBio: String,
  status: { type: String, default: "active" },
  googleId: String,
  microsoftId: String,
}, { timestamps: true });

module.exports = mongoose.model("User", UserSchema);
