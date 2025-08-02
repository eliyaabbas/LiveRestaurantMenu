// Import mongoose for MongoDB interaction
const mongoose = require('mongoose');

// Function to connect to the database
const connectDB = async () => {
  try {
    // Attempt to connect to MongoDB using the URI from environment variables
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('MongoDB Connected...');
  } catch (err) {
    // If connection fails, log the error and exit the process
    console.error(err.message);
    process.exit(1);
  }
};

// Export the function to be used in other parts of the application
module.exports = connectDB;
