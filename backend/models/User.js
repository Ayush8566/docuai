const mongoose = require("mongoose");

const activitySchema = new mongoose.Schema({
  type: {
    type: String,
    enum: ["UPLOAD", "GENERATE", "LOGIN"],
    required: true,
  },
  meta: Object,
  createdAt: { type: Date, default: Date.now },
});

const userSchema = new mongoose.Schema({
  name: { type: String, trim: true },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
  },

  passwordHash: { type: String }, // optional for OAuth users

  avatar: String,

  provider: {
    type: String,
    enum: ["local", "google", "github"],
    default: "local",
  },

  activities: [activitySchema],

  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("User", userSchema);
