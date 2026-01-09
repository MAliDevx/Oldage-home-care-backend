import mongoose from "mongoose";

const junkSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true, // filename
  },
  type: {
    type: String,
    enum: ["image", "file"],
    required: true,
  },
  path: {
    type: String,
    required: true,
    unique: true,
  },
  inUse: {
    type: Boolean,
    default: false,
  },
  uploadedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Junk = mongoose.model("Junk", junkSchema);
export default Junk;
