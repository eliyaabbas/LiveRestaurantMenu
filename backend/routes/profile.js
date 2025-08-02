const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const User = require('../models/User');

// @route   GET api/profile
// @desc    Get current user's profile
// @access  Private
router.get('/', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    if (!user) {
      return res.status(404).json({ msg: 'User not found' });
    }
    res.json(user);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   PUT api/profile
// @desc    Update user's profile with new fields
// @access  Private
router.put('/', auth, async (req, res) => {
  // Destructure all possible fields from the body
  const { name, phone, dob, gender } = req.body;

  // Build profile object dynamically
  const profileFields = {};
  if (name) profileFields.name = name;
  if (phone) profileFields.phone = phone;
  if (dob) profileFields.dob = dob;
  if (gender) profileFields.gender = gender;

  try {
    let user = await User.findByIdAndUpdate(
      req.user.id,
      { $set: profileFields },
      { new: true }
    ).select('-password');

    if (!user) {
      return res.status(404).json({ msg: 'User not found' });
    }
    res.json(user);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   DELETE api/profile
// @desc    Delete user account
// @access  Private
router.delete('/', auth, async (req, res) => {
    try {
        // Find user by ID from token and remove
        await User.findByIdAndDelete(req.user.id);
        res.json({ msg: 'User account deleted successfully.' });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

module.exports = router;
