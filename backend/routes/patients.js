const express = require('express');
const bcrypt = require('bcryptjs');
const Patient = require('../models/Patient');
const jwt = require('jsonwebtoken');
const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET; 

// Register a new patient
router.post('/pregister', async (req, res) => {
  const { firstName, lastName, email, sex, dateOfBirth, mobileNumber, password } = req.body;

  try {
    // Check if email or mobile number already exists
    const existingPatient = await Patient.findOne({ $or: [{ email }, { mobileNumber }] });
    if (existingPatient) {
      return res.status(400).json({ message: 'Email or mobile number already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newPatient = new Patient({
      firstName,
      lastName,
      email,
      sex,
      dateOfBirth,
      mobileNumber,
      password: hashedPassword
    });

    await newPatient.save();
    res.status(201).json({ message: 'Patient registered successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});
// Login a patient
router.post('/plogin', async (req, res) => {
  const { email, password } = req.body;

  try {
    const patient = await Patient.findOne({ email });
    if (!patient) {
      return res.status(400).json({ message: 'Invalid email or password' });
    }

    const isMatch = await bcrypt.compare(password, patient.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid email or password' });
    }

    const payload = {
      patient: {
        id: patient.id
      }
    };

    const token = jwt.sign(payload, JWT_SECRET, { expiresIn: '1h' });

    res.json({ token });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Route to fetch patient details by email
router.get('/pdetails/email/:email', async (req, res) => {
  try {
    const email = req.params.email;
    const patient = await Patient.findOne({ email });
    if (!patient) {
      return res.status(404).json({ message: 'Patient not found' });
    }
    res.json(patient);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update patient profile
router.put('/pupdate', async (req, res) => {
  const { email, firstName, lastName, bloodGroup, age, difficulty, beendignosed, condition } = req.body;

  try {
    const patient = await Patient.findOneAndUpdate(
      { email },
      { firstName, lastName, bloodGroup, age, difficulty, beendignosed, condition },
      { new: true }
    );

    if (!patient) {
      return res.status(404).json({ message: 'Patient not found' });
    }

    res.json({ message: 'Profile updated successfully', patient });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});


router.get('/pdetails/search', async (req, res) => {
  try {
    const { searchQuery } = req.query;
    const patients = await Patient.find({
      $or: [
        { firstName: { $regex: searchQuery, $options: 'i' } }, // Case-insensitive search
        { lastName: { $regex: searchQuery, $options: 'i' } },
        { mobileNumber: { $regex: searchQuery, $options: 'i' } },
      ]
    }).select('firstName lastName age sex mobileNumber bloodGroup difficulty beendignosed condition');

    if (patients.length === 0) {
      return res.status(404).json({ message: 'No patients found' });
    }

    res.json(patients);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
