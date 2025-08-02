const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const connectDB = require('./config/db');
const passport = require('passport');
const session = require('express-session');

// --- FIX ---
// Load environment variables FIRST
dotenv.config();

// Now, require the passport config AFTER .env is loaded
require('./config/passport-setup');

// --- END FIX ---

const app = express();
connectDB();

app.use(cors());
app.use(express.json());

// Express Session Middleware
app.use(
  session({
    secret: 'a_secret_key_for_sessions', // In production, use a long random string from .env
    resave: false,
    saveUninitialized: true,
  })
);

// Passport Middleware
app.use(passport.initialize());
app.use(passport.session());


app.get('/', (req, res) => {
  res.send('LiveRestaurantMenu API is running...');
});

// API Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/menu', require('./routes/menu'));
app.use('/api/settings', require('./routes/settings'));
app.use('/api/profile', require('./routes/profile'));
// Add this line in server.js with your other app.use() routes
app.use('/api/public', require('./routes/public'));
// Add this line in server.js with your other app.use() routes
app.use('/api/dishes', require('./routes/dishes'));


const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
