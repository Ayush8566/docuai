const express = require("express");
const User = require("../models/User");
const router = express.Router();

// GET /api/profile/:id
router.get("/:id", async (req, res) => {
  const user = await User.findById(req.params.id).select(
    "name avatar provider activities createdAt"
  );
  if (!user) return res.status(404).json({ message: "User not found" });
  res.json(user);
});

module.exports = router;
