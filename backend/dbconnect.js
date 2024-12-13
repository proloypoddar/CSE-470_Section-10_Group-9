const mongoose = require('mongoose');
require('dotenv').config(); // To load the MongoDB URI from the .env file

const connectAtlasDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('Connected to MongoDB Atlas');
  } catch (error) {
    console.error('Error connecting to MongoDB Atlas:', error);
    process.exit(1); // Exit the process if the connection fails
  }
};

module.exports = connectAtlasDB;
