const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Menu = require('../models/Menu');

// @route   GET api/public/restaurant/:userId
// @desc    Get a user's public profile and all their published menus
// @access  Public
router.get('/restaurant/:userId', async (req, res) => {
    try {
        // Find the user to get their main restaurant name
        const user = await User.findById(req.params.userId).select('name');
        if (!user) {
            return res.status(404).json({ msg: 'Restaurant not found.' });
        }

        // Find all menus that belong to this user AND are published
        const publishedMenus = await Menu.find({
            user: req.params.userId,
            isPublished: true
        }).select('restaurantName _id'); // Select only the menu's title and ID

        res.json({
            restaurantName: user.name,
            publishedMenus: publishedMenus
        });

    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

module.exports = router;
