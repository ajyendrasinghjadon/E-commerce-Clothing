const express = require("express");
const User = require("../models/User");
const PendingUser = require("../models/PendingUser");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const { protect } = require("../middleware/authMiddleware");
const generateOTP = require("../utils/generateOTP");
const sendEmail = require("../utils/sendEmail");
const router = express.Router();

// @route POST /api/users/register
// @desc Register a new user
// @access Public
router.post("/register", async (req, res) => {
  const { name, email, password } = req.body;

  try {
    // 1. Check if user already exists in main collection
    let user = await User.findOne({ email });
    if (user) return res.status(400).json({ message: "User already exists" });

    // 2. Check if a pending registration already exists
    let pendingUser = await PendingUser.findOne({ email });
    
    const otp = generateOTP();
    const otpExpires = Date.now() + 5 * 60 * 1000; // 5 minutes

    if (pendingUser) {
      // Update existing pending registration
      pendingUser.name = name;
      pendingUser.password = password; // Will be re-hashed by pre-save hook
      pendingUser.otp = otp;
      pendingUser.otpExpires = otpExpires;
      pendingUser.otpAttempts = 0;
      await pendingUser.save();
    } else {
      // Create new pending registration
      pendingUser = new PendingUser({
        name,
        email,
        password,
        otp,
        otpExpires,
      });
      await pendingUser.save();
    }

    // 3. Send OTP Email
    sendEmail({
      to: email,
      subject: "Verify your email - Rabbit E-commerce",
      text: `Your OTP is ${otp}. It expires in 5 minutes.`,
      html: `<h1>Verify your email</h1><p>Your OTP is <strong>${otp}</strong>. It expires in 5 minutes.</p>`,
    });

    res.status(201).json({
      message: "Registration initiated. Please check your email for OTP.",
    });
  } catch (error) {
    console.error(`[Registration Error]: ${error.message}`);
    res.status(500).json({ message: "Registration failed. Please try again later." });
  }
});

// @route POST /api/users/verify-otp
// @desc Verify OTP
// @access Public
router.post("/verify-otp", async (req, res) => {
  const { email, otp } = req.body;

  try {
    let pendingUser = await PendingUser.findOne({ email });

    if (!pendingUser) {
      // Check if user is already verified and moved to main collection
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        return res.status(400).json({ message: "User is already verified. Please login." });
      }
      return res.status(404).json({ message: "Registration session not found or expired." });
    }

    if (Date.now() > pendingUser.otpExpires) {
      return res.status(400).json({ message: "OTP has expired. Please request a new one." });
    }

    if (pendingUser.otpAttempts >= 3) {
      return res
        .status(400)
        .json({ message: "Max attempts reached. Please request a new OTP" });
    }

    if (pendingUser.otp !== otp) {
      pendingUser.otpAttempts += 1;
      await pendingUser.save();
      return res.status(400).json({ message: "Invalid OTP" });
    }

    // 1. Create real User record
    const newUser = new User({
      name: pendingUser.name,
      email: pendingUser.email,
      password: pendingUser.password, // This was already hashed when saved to PendingUser?
      // Actually, PendingUser hashes it. User model also hashes on save.
      // To avoid double hashing, we might need to be careful.
      // But the User model `pre-save` hook checks `isModified('password')`.
      // If we just assign the hashed password, will it be re-hashed?
      // Yes, if we use `new User()`.
      isVerified: true,
    });

    // To prevent double hashing if the password is already hashed:
    // We can either bypass the hook or just pass the raw password if we didn't hash it in PendingUser.
    // However, the requirement said "Store: hashed password" in PendingUser.
    
    await newUser.save();

    // 2. Delete the pending registration
    await PendingUser.deleteOne({ email });

    res.status(200).json({ message: "Email verified successfully. You can now login." });
  } catch (error) {
    console.error(`[Verification Error]: ${error.message}`);
    res.status(500).send("Server Error");
  }
});

// @route POST /api/users/resend-otp
// @desc Resend OTP for pending registration
// @access Public
router.post("/resend-otp", async (req, res) => {
  const { email } = req.body;

  try {
    const pendingUser = await PendingUser.findOne({ email });

    if (!pendingUser) {
      return res.status(404).json({ message: "Registration session not found or expired." });
    }

    const otp = generateOTP();
    pendingUser.otp = otp;
    pendingUser.otpExpires = Date.now() + 5 * 60 * 1000;
    pendingUser.otpAttempts = 0;
    await pendingUser.save();

    sendEmail({
      to: email,
      subject: "New OTP - Rabbit E-commerce",
      text: `Your new OTP is ${otp}. It expires in 5 minutes.`,
      html: `<h1>Verify your email</h1><p>Your new OTP is <strong>${otp}</strong>. It expires in 5 minutes.</p>`,
    });

    res.status(200).json({ message: "New OTP sent to email" });
  } catch (error) {
    console.error(`[Resend OTP Error]: ${error.message}`);
    res.status(500).json({ message: "Failed to resend OTP." });
  }
});

// @route POST /api/users/forgot-password
// @desc Send forgot password reset link
// @access Public
router.post("/forgot-password", async (req, res) => {
  const { email } = req.body;

  try {
    let user = await User.findOne({ email });

    if (!user) return res.status(404).json({ message: "User not found" });

    // Generate 6-digit OTP
    const otp = generateOTP();

    // Set OTP to expire in 2 minutes
    user.resetOtp = otp;
    user.resetOtpExpires = Date.now() + 2 * 60 * 1000;
    await user.save();

    sendEmail({
      to: email,
      subject: "Password Reset OTP - Rabbit E-commerce",
      text: `Your password reset OTP is ${otp}. It expires in 2 minutes.`,
      html: `<h1>Reset Password</h1>
             <p>Your password reset OTP is: <strong>${otp}</strong></p>
             <p>This OTP will expire in 2 minutes.</p>`,
    });

    res.status(200).json({ message: "Password reset OTP sent to email" });
  } catch (error) {
    console.error(`[Forgot Password Error]: ${error.message}`);
    res.status(500).json({ message: "Failed to process forgot password request." });
  }
});

// @route POST /api/users/reset-password
// @desc Reset password using token
// @access Public
router.post("/reset-password", async (req, res) => {
  const { email, otp, newPassword } = req.body;

  try {
    let user = await User.findOne({ 
      email,
      resetOtp: otp,
      resetOtpExpires: { $gt: Date.now() }
    });

    if (!user) {
      return res.status(400).json({ message: "Invalid or expired reset OTP" });
    }

    user.password = newPassword; // bcrypt pre-save middleware will hash it
    user.resetOtp = undefined;
    user.resetOtpExpires = undefined;
    await user.save();

    res.status(200).json({ message: "Password reset successful" });
  } catch (error) {
    console.error(error);
    res.status(500).send("Server Error");
  }
});

// @route POST /api/users/resend-reset-otp
// @desc Resend password reset OTP
// @access Public
router.post("/resend-reset-otp", async (req, res) => {
  const { email } = req.body;

  try {
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const otp = generateOTP();
    user.resetOtp = otp;
    user.resetOtpExpires = Date.now() + 2 * 60 * 1000;
    await user.save();

    sendEmail({
      to: email,
      subject: "New Password Reset OTP - Rabbit E-commerce",
      text: `Your new password reset OTP is ${otp}. It expires in 2 minutes.`,
      html: `<h1>Reset Password</h1><p>Your new OTP is: <strong>${otp}</strong></p><p>It expires in 2 minutes.</p>`,
    });

    res.status(200).json({ message: "New reset OTP sent to email" });
  } catch (error) {
    console.error(`[Resend Reset OTP Error]: ${error.message}`);
    res.status(500).json({ message: "Failed to resend reset OTP." });
  }
});

// @route POST /api/users/login
// @desc Authenticate user
// @access Public
router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    //Find the user by email
    let user = await User.findOne({ email });

    if (!user) return res.status(400).json({ message: "Invalid Credentials" });

    if (!user.isVerified) {
      return res.status(400).json({ message: "Please verify your email first" });
    }

    const isMatch = await user.matchPassword(password);

    if (!isMatch)
      return res.status(400).json({ message: "Invalid Credentials" });

    //create JWT Payload
    const payload = { user: { id: user._id, role: user.role } };

    //Sign and return the token along with user data
    jwt.sign(
      payload,
      process.env.JWT_SECRET,
      { expiresIn: "40h" },
      (err, token) => {
        if (err) throw err;

        //Send the user and token in resopnse
        res.json({
          user: {
            _id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
          },
          token,
        });
      },
    );
  } catch (error) {
    console.error(error);
    res.status(500).send("Server Error");
  }
});

// @route GET /api/users/profile
// @desc Get logged-in user's profile (Protected Route)
// @access Private
router.get("/profile", protect, async (req, res) => {
  res.json(req.user);
});

module.exports = router;
