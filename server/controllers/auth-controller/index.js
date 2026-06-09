const User = require("../../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { OAuth2Client } = require("google-auth-library");
const googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

const registerUser = async (req, res) => {
  const { userName, userFullName, userEmail, password, role } = req.body;

  const existingUser = await User.findOne({
    $or: [{ userEmail }, { userName }],
  });

  if (existingUser) {
    return res.status(400).json({
      success: false,
      message: "User name or user email already exists",
    });
  }

  const hashPassword = await bcrypt.hash(password, 10);
  const newUser = new User({
    userName,
    userFullName,
    userEmail,
    role,
    password: hashPassword,
  });

  await newUser.save();

  return res.status(201).json({
    success: true,
    message: "User registered successfully!",
  });
};

const registerSubAdmin = async (req, res) => {
  const { userName, password } = req.body;

  const existingUser = await User.findOne({ userName });

  if (existingUser) {
    return res.status(400).json({
      success: false,
      message: "User name already exists",
    });
  }

  const hashPassword = await bcrypt.hash(password, 10);
  const newUser = new User({
    userName,
    userFullName: userName,
    userEmail: `${userName}@subadmin.bhavin.academy`,
    role: "sub-admin",
    password: hashPassword,
  });

  await newUser.save();

  return res.status(201).json({
    success: true,
    message: "Sub-Admin created successfully!",
  });
};

const loginUser = async (req, res) => {
  const { userEmail, password } = req.body;

  const checkUser = await User.findOne({
    $or: [{ userEmail: userEmail }, { userName: userEmail }],
  });

  if (!checkUser || !(await bcrypt.compare(password, checkUser.password))) {
    return res.status(401).json({
      success: false,
      message: "Invalid credentials",
    });
  }

  if (checkUser.status === "blocked") {
    return res.status(403).json({
      success: false,
      message: "Your account has been blocked. Please contact the administrator.",
    });
  }

  const accessToken = jwt.sign(
    {
      _id: checkUser._id,
      userName: checkUser.userName,
      userFullName: checkUser.userFullName,
      userEmail: checkUser.userEmail,
      role: checkUser.role,
      profileImage: checkUser.profileImage,
      userHeadline: checkUser.userHeadline,
      userBio: checkUser.userBio,
    },
    process.env.JWT_SECRET || "JWT_SECRET",
    { expiresIn: process.env.JWT_EXPIRES_IN || "120m" }
  );

  res.status(200).json({
    success: true,
    message: "Logged in successfully",
    data: {
      accessToken,
      user: {
        _id: checkUser._id,
        userName: checkUser.userName,
        userFullName: checkUser.userFullName,
        userEmail: checkUser.userEmail,
        role: checkUser.role,
        profileImage: checkUser.profileImage,
        userHeadline: checkUser.userHeadline,
        userBio: checkUser.userBio,
      },
    },
  });
};

const forgotPassword = async (req, res) => {
  const { userEmail } = req.body;
  const user = await User.findOne({ userEmail });

  if (!user) {
    return res.status(404).json({
      success: false,
      message: "User not found!",
    });
  }

  // In a real app, send reset link with token to email
  return res.status(200).json({
    success: true,
    message: "User verified. You can now reset your password.",
  });
};

const resetPassword = async (req, res) => {
  const { userEmail, newPassword } = req.body;
  const user = await User.findOne({ userEmail });

  if (!user) {
    return res.status(404).json({
      success: false,
      message: "User not found!",
    });
  }

  const hashPassword = await bcrypt.hash(newPassword, 10);
  user.password = hashPassword;
  await user.save();

  return res.status(200).json({
    success: true,
    message: "Password reset successfully!",
  });
};

const updateUserProfile = async (req, res) => {
  try {
    const { userId, userFullName, profileImage, userHeadline, userBio } = req.body;

    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found!",
      });
    }

    if (userFullName !== undefined) user.userFullName = userFullName;
    if (profileImage !== undefined) user.profileImage = profileImage;
    if (userHeadline !== undefined) user.userHeadline = userHeadline;
    if (userBio !== undefined) user.userBio = userBio;

    await user.save();

    res.status(200).json({
      success: true,
      message: "Profile updated successfully!",
      data: {
        _id: user._id,
        userName: user.userName,
        userFullName: user.userFullName,
        userEmail: user.userEmail,
        role: user.role,
        profileImage: user.profileImage,
        userHeadline: user.userHeadline,
        userBio: user.userBio,
      },
    });
  } catch (e) {
    console.log(e);
    res.status(500).json({
      success: false,
      message: "Some error occured!",
    });
  }
};

const getAllSubAdmins = async (req, res) => {
  try {
    const { currentUserId } = req.query;
    // Fetch all users who are not students and not the current logged in admin
    const subAdmins = await User.find({
      _id: { $ne: currentUserId },
      role: { $ne: "student" },
    }).select("-password");

    res.status(200).json({
      success: true,
      data: subAdmins,
    });
  } catch (e) {
    console.log(e);
    res.status(500).json({
      success: false,
      message: "Some error occured!",
    });
  }
};

const updateSubAdmin = async (req, res) => {
  try {
    const { id } = req.params;
    const { userName, password, status } = req.body;

    const user = await User.findById(id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found!",
      });
    }

    if (userName) user.userName = userName;
    if (status) user.status = status;
    if (password) {
      const hashPassword = await bcrypt.hash(password, 10);
      user.password = hashPassword;
    }

    await user.save();

    res.status(200).json({
      success: true,
      message: "Sub-Admin updated successfully!",
    });
  } catch (e) {
    console.log(e);
    res.status(500).json({
      success: false,
      message: "Some error occured!",
    });
  }
};

const deleteSubAdmin = async (req, res) => {
  try {
    const { id } = req.params;

    const user = await User.findByIdAndDelete(id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found!",
      });
    }

    res.status(200).json({
      success: true,
      message: "Sub-Admin deleted successfully!",
    });
  } catch (e) {
    console.log(e);
    res.status(500).json({
      success: false,
      message: "Some error occured!",
    });
  }
};

const googleLogin = async (req, res) => {
  try {
    const { credential, role = "student" } = req.body;
    let email, name, picture, googleId;

    if (!credential.includes(".") || credential.startsWith("ya29.")) {
      // It's an Access Token
      const googleResponse = await fetch(`https://www.googleapis.com/oauth2/v3/userinfo?access_token=${credential}`);
      if (!googleResponse.ok) {
        throw new Error("Failed to fetch user info from Google using access token");
      }
      const payload = await googleResponse.json();
      googleId = payload.sub;
      email = payload.email;
      name = payload.name;
      picture = payload.picture;
    } else {
      // It's an ID Token
      const ticket = await googleClient.verifyIdToken({
        idToken: credential,
        audience: process.env.GOOGLE_CLIENT_ID,
      });
      const payload = ticket.getPayload();
      googleId = payload.sub;
      email = payload.email;
      name = payload.name;
      picture = payload.picture;
    }

    let user = await User.findOne({
      $or: [{ googleId }, { userEmail: email }]
    });

    if (!user) {
      // Create new user if not exists
      user = new User({
        userName: email.split("@")[0] + "_" + Math.random().toString(36).slice(-4),
        userFullName: name,
        userEmail: email,
        role: role,
        googleId: googleId,
        profileImage: picture,
        password: await bcrypt.hash(Math.random().toString(36), 10), // Random password for OAuth users
      });
      await user.save();
    } else if (!user.googleId) {
      // Link googleId to existing email account
      user.googleId = googleId;
      if (!user.profileImage) user.profileImage = picture;
      await user.save();
    }

    if (user.status === "blocked") {
      return res.status(403).json({
        success: false,
        message: "Your account has been blocked.",
      });
    }

    const accessToken = jwt.sign(
      {
        _id: user._id,
        userName: user.userName,
        userFullName: user.userFullName,
        userEmail: user.userEmail,
        role: user.role,
        profileImage: user.profileImage,
      },
      process.env.JWT_SECRET || "JWT_SECRET",
      { expiresIn: process.env.JWT_EXPIRES_IN || "120m" }
    );

    res.status(200).json({
      success: true,
      message: "Logged in with Google successfully",
      data: {
        accessToken,
        user: {
          _id: user._id,
          userName: user.userName,
          userFullName: user.userFullName,
          userEmail: user.userEmail,
          role: user.role,
          profileImage: user.profileImage,
        },
      },
    });
  } catch (error) {
    console.error("Google Login Error:", error);
    res.status(500).json({ success: false, message: "Google authentication failed" });
  }
};

const microsoftLogin = async (req, res) => {
  try {
    const { microsoftId, email, name, role = "student" } = req.body;

    if (!microsoftId || !email) {
      return res.status(400).json({ success: false, message: "Invalid Microsoft login data" });
    }

    let user = await User.findOne({
      $or: [{ microsoftId }, { userEmail: email }]
    });

    if (!user) {
      user = new User({
        userName: email.split("@")[0] + "_" + Math.random().toString(36).slice(-4),
        userFullName: name,
        userEmail: email,
        role: role,
        microsoftId: microsoftId,
        password: await bcrypt.hash(Math.random().toString(36), 10),
      });
      await user.save();
    } else if (!user.microsoftId) {
      user.microsoftId = microsoftId;
      await user.save();
    }

    if (user.status === "blocked") {
      return res.status(403).json({ success: false, message: "Your account has been blocked." });
    }

    const accessToken = jwt.sign(
      {
        _id: user._id,
        userName: user.userName,
        userFullName: user.userFullName,
        userEmail: user.userEmail,
        role: user.role,
        profileImage: user.profileImage,
      },
      process.env.JWT_SECRET || "JWT_SECRET",
      { expiresIn: process.env.JWT_EXPIRES_IN || "120m" }
    );

    res.status(200).json({
      success: true,
      message: "Logged in with Microsoft successfully",
      data: {
        accessToken,
        user: {
          _id: user._id,
          userName: user.userName,
          userFullName: user.userFullName,
          userEmail: user.userEmail,
          role: user.role,
          profileImage: user.profileImage,
        },
      },
    });
  } catch (error) {
    console.error("Microsoft Login Error:", error);
    res.status(500).json({ success: false, message: "Microsoft authentication failed" });
  }
};

module.exports = {
  registerUser,
  registerSubAdmin,
  loginUser,
  forgotPassword,
  resetPassword,
  updateUserProfile,
  getAllSubAdmins,
  updateSubAdmin,
  deleteSubAdmin,
  googleLogin,
  microsoftLogin,
};
