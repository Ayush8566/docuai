const express = require("express");
const router = express.Router();
const Activity = require("../models/Activity");
const { protect } = require("../middleware/auth");

router.get("/my", protect, async (req, res) => {
  const activities = await Activity.find({ user: req.user._id })
    .sort({ createdAt: -1 })
    .limit(20);

  res.json(activities);
});

module.exports = router;
