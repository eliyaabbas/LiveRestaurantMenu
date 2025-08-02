const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  // ... other user fields like name, email, password, etc. ...

  // Expanded settings object
  settings: {
    theme: {
      type: String,
      default: 'light',
    },
    // --- New Settings Fields ---
    currency: {
        type: String,
        default: '$',
    },
    showPrices: {
        type: Boolean,
        default: true,
    },
    showVegNonVeg: {
        type: Boolean,
        default: true,
    }
  },
  
  // ... rest of the schema like date, resetPasswordToken, etc. ...
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: function() { return !this.googleId; }
  },
  googleId: {
    type: String,
  },
  phone: {
    type: String,
  },
  dob: {
    type: Date,
  },
  gender: {
    type: String,
    enum: ['Male', 'Female', 'Other', 'Prefer not to say'],
  },
  date: {
    type: Date,
    default: Date.now,
  },
  resetPasswordToken: {
    type: String,
  },
  resetPasswordExpires: {
    type: Date,
  },
});

module.exports = mongoose.model('user', UserSchema);
