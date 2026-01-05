const mongoose = require("mongoose");

/* ================= USER ================= */
const userSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  email: { type: String, required: true, unique: true, lowercase: true },
  password: { type: String, required: true },

  role: {
    type: String,
    enum: ["student", "teacher", "admin"],
    default: "student"
  },

  otp: String,
  otpExpire: Date,
  isOtpUsed: { type: Boolean, default: false }
}, { timestamps: true });

/* ================= SUBJECT ================= */
const subjectSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: String,

  teacher: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  }
}, { timestamps: true });

/* ================= ENROLLMENT ================= */
const enrollmentSchema = new mongoose.Schema({
  student: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },

  subject: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Subject",
    required: true
  },

  teacher: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },

  enrolledAt: {
    type: Date,
    default: Date.now
  }
});

/* ================= MODELS ================= */
const User = mongoose.model("User", userSchema);
const Subject = mongoose.model("Subject", subjectSchema);
const Enrollment = mongoose.model("Enrollment", enrollmentSchema);

module.exports = {
  User,
  Subject,
  Enrollment
};
