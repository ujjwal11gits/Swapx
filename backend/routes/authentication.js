const express = require('express');
const jwt = require('jsonwebtoken'); 
const router = express.Router();
const bcrypt = require('bcrypt');
const User = require('../models/User');
const otpGenerator = require('otp-generator');
const Otp = require('../models/Otp');
const sendEmail = require('../utils/sendEmail');
const authMiddleware = require('../middleware/auth');




router.post('/signup', async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: 'All fields required' });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({ message: 'Email already registered' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = new User({ name, email, password: hashedPassword, role,coins:0 });
    await user.save();

    // Generate OTP
    const otp = otpGenerator.generate(6, { upperCase: false, specialChars: false });

    await Otp.create({ email, otp });

    // Send Email
    await sendEmail(
      email,
      'Verify your Email - OTP',
      `<p>Your OTP is: <b>${otp}</b></p>`
    );

    res.status(201).json({
      message: 'Signup successful. Verify your email via OTP sent to your inbox.'
    });

  } catch (err) {
    console.error('Signup Error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});


router.post('/verify-otp', async (req, res) => {
  const { email, otp } = req.body;

  if (!email || !otp) {
    return res.status(400).json({ message: 'Email and OTP are required' });
  }

  const otpRecord = await Otp.findOne({ email, otp });

  if (!otpRecord) {
    return res.status(400).json({ message: 'Invalid or expired OTP' });
  }

  // Mark user as verified
  await User.updateOne({ email }, { isVerified: true });

  // Remove used OTP
  await Otp.deleteMany({ email });

  res.status(200).json({ message: 'Email verified successfully' });
});



router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Basic input validation
    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required.' });
    }

    // Find user by email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials.' });
    }

    // Check if the user has verified their email
    if (!user.isVerified) {
      return res.status(403).json({ message: 'Please verify your email before logging in.' });
    }

    // Compare hashed password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials.' });
    }

    // Generate JWT token
    const token = jwt.sign(
      { userId: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
    );

    // Respond with token and user data 
    res.status(200).json({
      message: 'Login successful',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });

  } catch (err) {
    console.error('Login Error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});


router.get('/me', authMiddleware, async (req, res) => {
  try {
    // req.user is attached by authMiddleware
    res.status(200).json({
      message: 'Profile fetched successfully',
      user: req.user
    });
  } catch (err) {
    console.error('Fetch Profile Error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});


module.exports = router;
