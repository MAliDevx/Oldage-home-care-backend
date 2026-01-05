const User = require("../models/user.model");
const bcrypt = require("bcryptjs");
const generateToken = require("../utils/generate-token");
const generateOTP = require("../utils/generate-otp");
const sendEmail = require("../utils/send-forgot-password");





exports.registerUser = async (req, res) => {
  const { name, email, password } = req.body;

  const userExists = await User.findOne({ email });
  if (userExists)
    return res.status(400).json({ message: "User already exists" });

  const hashedPassword = await bcrypt.hash(password, 10);

  const user = await User.create({
    name,
    email,
    password: hashedPassword,
  });

  res.status(201).json({
    message: "User registered successfully",
    user: { id: user._id, name: user.name, email: user.email },
    token: generateToken(user._id),
    success:true,
  });
};

exports.loginUser = async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });
  if (!user)
    return res.status(400).json({ message: "Invalid email or password" });

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch)
    return res.status(400).json({ message: "Invalid email or password" });

  res.json({
    message: "Login successful",
    user: { id: user._id, name: user.name, email: user.email },
    token: generateToken(user._id),
     success: true,
  });
};

exports.forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: "User not found" });

    const otp = generateOTP();
    const otpExpire = Date.now() + 10 * 60 * 1000; 
    user.otp = otp;
    user.otpExpire = otpExpire;
    await user.save(); 

    await sendEmail(user.email, "Your Password Reset OTP", `Your OTP is ${otp}`);

    res.json({ message: "OTP sent to your email", success: true, },);

  } catch (err) {
    console.error("Forgot Password Error:", err);
    res.status(500).json({ error: "Server Error" });
  }
};

exports.verifyOTP = async (req, res) => {
  try {
    const { email, otp } = req.body;

    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: "User not found" });

    if (!user.otp) {
      return res.status(400).json({ message: "No OTP found. Please request a new one." });
    }

    if (user.otp.toString() !== otp.toString()) {
      return res.status(400).json({ message: "Invalid OTP" });
    }

    if (user.otpExpire < Date.now()) {
      return res.status(400).json({ message: "OTP expired" });
    }

    user.otp = undefined;
    user.otpExpire = undefined;
    await user.save();

    res.json({ message: "OTP Verified", success: true, },);

  } catch (err) {
    console.error("Verify OTP Error:", err);
    res.status(500).json({ error: "Server Error" });
  }
};

exports.resetPassword = async (req, res) => {
  try {
    const { email, newPassword } = req.body;

    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: "User not found" });

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;

    user.otp = undefined;
    user.otpExpire = undefined;

    await user.save();

    res.json({ message: "Password Updated Successfully",success: true, }, );

  } catch (err) {
    res.status(500).json({ error: "Server Error" });
  }
};





