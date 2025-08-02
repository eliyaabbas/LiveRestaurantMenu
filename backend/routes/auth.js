const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const passport = require('passport');
const User = require('../models/User');
const sendEmail = require('../utils/sendEmail');

// --- UPDATED: Register Route ---
// Now sends an OTP instead of logging in directly
router.post('/register', async (req, res) => {
  const { name, email, password, phone, dob, gender } = req.body;
  try {
    let user = await User.findOne({ email });
    if (user && user.isVerified) {
      return res.status(400).json({ msg: 'User already exists' });
    }
    // If user exists but is not verified, we'll overwrite their data with the new registration attempt
    if (user && !user.isVerified) {
        await User.deleteOne({ email });
    }

    user = new User({ name, email, password, phone, dob, gender });
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(password, salt);

    // Generate 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    user.verificationOtp = otp;
    user.verificationOtpExpires = Date.now() + 3600000; // 1 hour
    
    await user.save();

    // Send OTP email
    const message = `<h1>Welcome to LiveRestaurantMenu!</h1><p>Your verification code is:</p><h2>${otp}</h2><p>This code will expire in one hour.</p>`;
    await sendEmail({ email: user.email, subject: 'Verify Your Email Address', html: message });

    res.status(200).json({ msg: 'Registration successful. Please check your email for a verification code.' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// --- NEW: Verify OTP Route ---
router.post('/verify-otp', async (req, res) => {
    const { email, otp } = req.body;
    try {
        const user = await User.findOne({ 
            email, 
            verificationOtp: otp, 
            verificationOtpExpires: { $gt: Date.now() } 
        });

        if (!user) {
            return res.status(400).json({ msg: 'Invalid OTP or OTP has expired.' });
        }

        user.isVerified = true;
        user.verificationOtp = undefined;
        user.verificationOtpExpires = undefined;
        await user.save();

        // Create and return JWT so the user is logged in
        const payload = { user: { id: user.id } };
        jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: 360000 }, (err, token) => {
            if (err) throw err;
            res.json({ token });
        });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// --- UPDATED: Login Route ---
// Now checks if the user is verified
router.post('/login', async (req, res) => {
    const { email, password } = req.body;
    try {
        let user = await User.findOne({ email });
        if (!user) return res.status(400).json({ msg: 'Invalid Credentials' });
        
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).json({ msg: 'Invalid Credentials' });

        // Check if user is verified
        if (!user.isVerified) {
            return res.status(401).json({ msg: 'Account not verified. Please check your email for the OTP.' });
        }

        const payload = { user: { id: user.id } };
        jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: 360000 }, (err, token) => {
            if (err) throw err;
            res.json({ token });
        });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// --- Forgot Password Route ---
router.post('/forgot-password', async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(200).json({ msg: 'If an account with that email exists, a password reset link has been sent.' });
    }
    const token = crypto.randomBytes(20).toString('hex');
    user.resetPasswordToken = token;
    user.resetPasswordExpires = Date.now() + 3600000; // 1 hour
    await user.save();
    const resetUrl = `${process.env.CLIENT_URL}/reset-password/${token}`;
    const message = `
      <h1>You have requested a password reset</h1>
      <p>Please go to this link to reset your password:</p>
      <a href="${resetUrl}" clicktracking="off">${resetUrl}</a>
      <p>This link will expire in one hour.</p>
    `;
    await sendEmail({
      email: user.email,
      subject: 'Password Reset Request for LiveRestaurantMenu',
      html: message,
    });
    res.status(200).json({ msg: 'A password reset link has been sent to your email.' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// --- Reset Password Route ---
router.post('/reset-password/:token', async (req, res) => {
  try {
    const { password } = req.body;
    const user = await User.findOne({
      resetPasswordToken: req.params.token,
      resetPasswordExpires: { $gt: Date.now() },
    });
    if (!user) {
      return res.status(400).json({ msg: 'Password reset token is invalid or has expired.' });
    }
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(password, salt);
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;
    await user.save();
    res.status(200).json({ msg: 'Your password has been updated successfully.' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// --- Google OAuth Routes ---
router.get('/google', passport.authenticate('google', {
  scope: ['profile', 'email']
}));

router.get('/google/callback', passport.authenticate('google', { failureRedirect: '/login', session: false }), (req, res) => {
  const payload = { user: { id: req.user.id } };
  jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: 360000 }, (err, token) => {
    if (err) throw err;
    res.redirect(`${process.env.CLIENT_URL}/auth/success?token=${token}`);
  });
});

module.exports = router;
