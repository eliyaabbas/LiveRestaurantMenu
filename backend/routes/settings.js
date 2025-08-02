const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth'); // Import our auth middleware
const User = require('../models/User');

// @route   GET api/settings
// @desc    Get user settings
// @access  Private
router.get('/', auth, async (req, res) => {
  try {
    // req.user.id is available because of our auth middleware
    const user = await User.findById(req.user.id).select('settings');
    if (!user) {
        return res.status(404).json({ msg: 'User not found' });
    }
    res.json(user.settings);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   PUT api/settings
// @desc    Update user settings
// @access  Private
router.put('/', auth, async (req, res) => {
  // Destructure all possible settings from the request body
  const { theme, currency, showPrices, showVegNonVeg } = req.body;

  try {
    let user = await User.findById(req.user.id);
    if (!user) {
        return res.status(404).json({ msg: 'User not found' });
    }

    // Update settings fields dynamically if they are provided in the request
    if (theme !== undefined) user.settings.theme = theme;
    if (currency !== undefined) user.settings.currency = currency;
    if (showPrices !== undefined) user.settings.showPrices = showPrices;
    if (showVegNonVeg !== undefined) user.settings.showVegNonVeg = showVegNonVeg;
    
    await user.save();

    res.json(user.settings);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

module.exports = router;
