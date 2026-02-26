const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  userName: String,
  userFullName: String,
  userEmail: String,
  password: String,
  role: String,
  profileImage: String,
});

module.exports = mongoose.model("User", UserSchema);
