const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth'); // Suggestions are for logged-in users
const Dish = require('../models/Dish');

// @route   GET api/dishes/suggest
// @desc    Get dish suggestions based on a query
// @access  Private
router.get('/suggest', auth, async (req, res) => {
  try {
    const { q, type } = req.query; // q = search query, type = veg/non-veg/egg

    if (!q || q.length < 2) {
      return res.json([]);
    }

    // Build the query object
    const query = {
      // Use a regular expression for a flexible "contains" search
      name: { $regex: q, $options: 'i' },
    };
    if (type && ['veg', 'non-veg', 'egg'].includes(type)) {
      query.type = type;
    }

    const suggestions = await Dish.find(query).limit(10).select('name'); // Limit to 10 results
    res.json(suggestions);

  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

module.exports = router;
