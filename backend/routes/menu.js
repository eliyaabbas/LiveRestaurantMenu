const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Menu = require('../models/Menu');
const User = require('../models/User');

// @route   GET api/menu
// @desc    Get ALL menus for the current user
// @access  Private
router.get('/', auth, async (req, res) => {
  try {
    const menus = await Menu.find({ user: req.user.id }).sort({ updatedAt: -1 });
    res.json(menus);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   POST api/menu
// @desc    Create a NEW menu card
// @access  Private
router.post('/', auth, async (req, res) => {
    const { restaurantName, template } = req.body;
    try {
        const user = await User.findById(req.user.id);
        const newMenu = new Menu({
            user: req.user.id,
            restaurantName: restaurantName || user.name,
            template: template || 'classic',
            categories: [{ name: 'Starters', items: [] }] // Start with a default category
        });
        const menu = await newMenu.save();
        res.json(menu);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   GET api/menu/:id
// @desc    Get a specific menu by its ID
// @access  Private
router.get('/:id', auth, async (req, res) => {
    try {
        const menu = await Menu.findById(req.params.id);
        if (!menu) {
            return res.status(404).json({ msg: 'Menu not found' });
        }
        // Make sure user owns this menu
        if (menu.user.toString() !== req.user.id) {
            return res.status(401).json({ msg: 'Not authorized' });
        }
        res.json(menu);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   PUT api/menu/:id
// @desc    Update a specific menu
// @access  Private
router.put('/:id', auth, async (req, res) => {
    const { restaurantName, categories, template, isPublished } = req.body;
    try {
        let menu = await Menu.findById(req.params.id);
        if (!menu) return res.status(404).json({ msg: 'Menu not found' });
        if (menu.user.toString() !== req.user.id) return res.status(401).json({ msg: 'Not authorized' });

        const updatedFields = {
            restaurantName,
            categories,
            template,
            isPublished,
            updatedAt: Date.now()
        };

        menu = await Menu.findByIdAndUpdate(req.params.id, { $set: updatedFields }, { new: true });
        res.json(menu);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   DELETE api/menu/:id
// @desc    Delete a specific menu
// @access  Private
router.delete('/:id', auth, async (req, res) => {
    try {
        let menu = await Menu.findById(req.params.id);
        if (!menu) return res.status(404).json({ msg: 'Menu not found' });
        if (menu.user.toString() !== req.user.id) return res.status(401).json({ msg: 'Not authorized' });

        await Menu.findByIdAndDelete(req.params.id);
        res.json({ msg: 'Menu removed' });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});


// @route   GET api/menu/public/:menuId
// @desc    Get a public menu by its ID, now including settings
// @access  Public
router.get('/public/:menuId', async (req, res) => {
  try {
    // .populate() is a powerful Mongoose feature that fetches related data.
    // Here, it gets the menu AND the 'settings' field from the user who owns the menu.
    const menu = await Menu.findById(req.params.menuId).populate('user', 'settings');

    if (!menu || !menu.isPublished) {
      return res.status(404).json({ msg: 'Menu not found or not published.' });
    }
    
    // We create a clean object to send to the frontend
    const publicMenuData = {
        _id: menu._id,
        restaurantName: menu.restaurantName,
        template: menu.template,
        categories: menu.categories,
        settings: menu.user.settings // Attach the settings directly to the response
    };

    res.json(publicMenuData);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error: Invalid Menu ID');
  }
});

router.post('/public/:menuId/view', async (req, res) => {
  try {
    // Find the menu and increment the viewCount field by 1
    await Menu.findByIdAndUpdate(req.params.menuId, { $inc: { viewCount: 1 } });
    res.status(200).send('View count updated.');
  } catch (err) {
    // Fail silently so it doesn't break the customer's menu view
    console.error('Failed to update view count:', err.message);
    res.status(500).send('Server Error');
  }
});


module.exports = router;
