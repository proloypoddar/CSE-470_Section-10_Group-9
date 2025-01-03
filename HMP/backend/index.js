require('dotenv').config(); // Add this line at the top
const express = require('express');
const connectAtlasDB = require('./dbconnect');
const cors = require('cors');
const path = require('path');
const bodyParser = require('body-parser');

const app = express();
const port = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Connect to MongoDB Atlas
connectAtlasDB();

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
app.use('/api/testAndServicesBill',require('./routes/testAndServicesBill'));
app.use('/api/admin',require('./routes/admin'));
app.use('/api/medicines',require('./routes/medicines'));
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



app.listen(port, () => {
  console.log(`Server is running on port: ${port}`);
});

