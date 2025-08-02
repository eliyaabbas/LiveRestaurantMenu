const mongoose = require('mongoose');

const DishSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  type: {
    type: String,
    required: true,
    enum: ['veg', 'non-veg', 'egg'],
  },
});

// Create a text index on the name field to allow for efficient text searching
DishSchema.index({ name: 'text' });

module.exports = mongoose.model('dish', DishSchema);
