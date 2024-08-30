const express = require('express');
const crypto = require('crypto');
const User = require('../models/User');
const sendOTP = require('../utils/email');
const router = express.Router();

router.post('/request-otp', async (req, res) => {
  const { email } = req.body;

  let user = await User.findOne({ email });
  if (!user) {
    user = new User({ email });
  }

  const otp = crypto.randomInt(100000, 999999).toString();
  const otpExpiry = Date.now() + 10  60  1000; 

  user.otp = otp;
  user.otpExpiry = otpExpiry;
  await user.save();

  try {
    await sendOTP(email, otp);
    res.status(200).json({ message: 'OTP sent successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to send OTP', error });
  }
});

router.post('/verify-otp', async (req, res) => {
  const { email, otp } = req.body;

  const user = await User.findOne({ email });
  if (!user) return res.status(400).json({ message: 'User not found' });

  if (user.otp !== otp || Date.now() > user.otpExpiry) {
    return res.status(400).json({ message: 'Invalid or expired OTP' });
  }

  user.otp = null;
  user.otpExpiry = null;
  await user.save();

  res.status(200).json({ message: 'OTP verified successfully' });
});

module.exports = router;
