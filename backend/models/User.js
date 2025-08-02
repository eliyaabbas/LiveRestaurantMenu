const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  // ... (existing fields like name, email, password, etc.)
  
  // --- New Fields for OTP Verification ---
  isVerified: {
    type: Boolean,
    default: false,
  },
  verificationOtp: {
    type: String,
  },
  verificationOtpExpires: {
    type: Date,
  },
  
  // ... (rest of the schema)
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
  settings: {
    theme: {
      type: String,
      default: 'light',
    },
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
