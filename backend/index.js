require('dotenv').config(); // Load environment variables from .env file

const express = require('express');
const connectAtlasDB = require('./dbconnect'); // MongoDB connection module
const cors = require('cors');
const path = require('path');
const bodyParser = require('body-parser');

const app = express();
const port = process.env.PORT || 5000; // Default to port 5000 if not set in .env

// Middleware
app.use(cors()); // Enable Cross-Origin Resource Sharing (CORS)
app.use(express.json()); // Parse incoming JSON requests
app.use(bodyParser.urlencoded({ extended: true })); // Parse URL-encoded data

// Connect to MongoDB Atlas
connectAtlasDB();

// Simple welcome route
app.get('/', (req, res) => {
  res.send('Welcome to the Hospital Management System API');
});

// Routes
app.use('/api/doctors', require('./routes/doctors'));
app.use('/api/patients', require('./routes/patients'));
app.use('/api/prescriptions', require('./routes/prescriptions'));
app.use('/api/wardBooking', require('./routes/wardBooking'));
app.use('/api/cabinBooking', require('./routes/cabinBooking'));
app.use('/api/healthCards', require('./routes/healthcards'));
app.use('/api/items', require('./routes/testOrService'));
app.use('/api/testAndServicesBill', require('./routes/testAndServicesBill'));
app.use('/api/admin', require('./routes/admin'));
app.use('/api/medicines', require('./routes/medicines'));
app.use('/uploads/medicines', express.static(path.join(__dirname, 'uploads/medicines')));
app.use('/uploads/doctors', express.static(path.join(__dirname, 'uploads/doctors')));
app.use('/api/medicineBill', require('./routes/medicineBill'));
app.use('/api/chatbot', require('./routes/chatbot'));
app.use('/api/blooddonor', require('./routes/bloodDonor'));
app.use('/api/bloodavailability', require('./routes/bloodAvailability'));
app.use('/api/bloodrecipient', require('./routes/bloodRecipient'));
app.use('/api/appointments', require('./routes/appointments'));
app.use('/api/about', require('./routes/about'));
app.use('/api/support', require('./routes/support'));

// Start the server
app.listen(port, () => {
  console.log(`Server is running on port: ${port}`);
});
