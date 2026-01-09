import mongoose from "mongoose";

const profileSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true
    },

    about: {
      type: String,
      maxlength: 1000
    },

    skills: 
      {
        type: [String],  
        trim: true
      },
    

    profileImage: {
      type: String 
    },

    /* ================= TEACHER FIELDS ================= */
    isTeacher: {
      type: Boolean,
      default: false
    },

    totalCourses: {
      type: Number,
      default: 0
    },

    experienceYears: {
      type: Number,
      default: 0
    },

    /* ================= STUDENT FIELDS ================= */
    isStudent: {
      type: Boolean,
      default: true
    },

    enrolledCoursesCount: {
      type: Number,
      default: 0
    }
  },
  { timestamps: true }
);

const Profile = mongoose.model("Profile", profileSchema);
export default Profile;
