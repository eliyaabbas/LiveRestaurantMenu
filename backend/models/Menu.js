const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Schema for a single food/drink item
const MenuItemSchema = new Schema({
    name: { type: String, required: true, trim: true },
    description: { type: String, trim: true },
    price: { type: Number, required: true },
    // --- ADD THIS FIELD ---
    type: {
        type: String,
        enum: ['veg', 'non-veg', 'egg'], // Possible values
        default: 'veg', // Default to veg for new items
    },
});

// The rest of the file (CategorySchema, MenuSchema) remains exactly the same.
// Schema for a category (e.g., Appetizers, Desserts) which contains items
const CategorySchema = new Schema({
    name: { type: String, required: true, trim: true },
    items: [MenuItemSchema],
});

// The main Menu schema that belongs to a user
const MenuSchema = new Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user',
    required: true,
  },
  restaurantName: {
    type: String,
    required: true,
  },
  template: {
    type: String,
    default: 'default',
  },
  categories: [CategorySchema],
  isPublished: {
    type: Boolean,
    default: false,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
  viewCount: {
    type: Number,
    default: 0
  },
});

module.exports = mongoose.model('menu', MenuSchema);
