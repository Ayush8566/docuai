const mongoose = require("mongoose");

const ActivitySchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    type: {
      type: String,
      enum: ["GENERATE", "UPLOAD", "SHARE", "DOWNLOAD"],
    },
    message: String,
  },
  { timestamps: true }
);

module.exports = mongoose.model("Activity", ActivitySchema);
