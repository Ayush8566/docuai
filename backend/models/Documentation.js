const mongoose = require("mongoose");

const DocumentationSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    repoName: String,
    files: [String],

    documentation: {
      type: String,
      required: true,
    },

    snippet: String,

    isPublic: {
      type: Boolean,
      default: false,
    },

    publicId: {
      type: String,
      unique: true,
      sparse: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Documentation", DocumentationSchema);
