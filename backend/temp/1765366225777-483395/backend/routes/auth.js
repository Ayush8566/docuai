const express = require('express');
const router = express.Router();
const User = require('../models/User');
const jwtUtil = require('../utils/jwt');

router.post('/register', async (req, res) => {
  const { name, email } = req.body;
  let user = await User.findOne({ email });
  if (user) return res.status(400).json({ message: 'Already exists' });
  user = new User({ name, email });
  await user.save();
  const token = jwtUtil.sign({ id: user._id, email });
  res.json({ user: { id: user._id, name, email }, token });
});

router.post('/login', async (req, res) => {
  const { email } = req.body;
  const user = await User.findOne({ email });
  if (!user) return res.status(404).json({ message: 'Not found' });
  const token = jwtUtil.sign({ id: user._id, email });
  res.json({ user: { id: user._id, name: user.name, email }, token });
});

module.exports = router;
