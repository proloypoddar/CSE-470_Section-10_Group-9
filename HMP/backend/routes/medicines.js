
const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const Medicine = require('../models/Medicine');

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/medicines/');
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

const upload = multer({ storage });
/**
 * Route to add a new medicine
 * @route POST /add
 * @access Public
 */

// Add new medicine
router.post('/add', upload.single('image'), async (req, res) => {
  try {
    const { name, genericName, dosageForm, strength, price, strip, manufacturer, description } = req.body;
    
    if (!name || !genericName || !dosageForm || !strength || !price) {
      return res.status(400).json({ message: 'Required fields are missing' });
    }

    const image = req.file ? `/uploads/medicines/${req.file.filename}` : '';

    const newMedicine = new Medicine({
      name: name.trim(),
      genericName: genericName.trim(),
      dosageForm: dosageForm.trim(),
      strength: strength.trim(),
      price: Number(price),
      strip: Number(strip) || 0,
      manufacturer: manufacturer?.trim(),
      description: description?.trim(),
      image,
    });

    await newMedicine.save();
    res.status(201).json({ message: 'Medicine added successfully', medicine: newMedicine });
  } catch (err) {
    res.status(500).json({ message: 'Failed to add medicine', error: err.message });
  }
});

// Fetch all medicines
router.get('/', async (req, res) => {
  try {
    const medicines = await Medicine.find();
    res.status(200).json(medicines);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch medicines.', error: err.message });
  }
});

// Update medicine stock (increase or decrease)
router.put('/:id', async (req, res) => {
  const { operation, strip } = req.body;
  
  try {
    // Validate input
    if (!operation || !strip || !['increase', 'decrease'].includes(operation)) {
      return res.status(400).json({ 
        message: 'Invalid input. Operation must be "increase" or "decrease" and strip must be provided' 
      });
    }

    const stripAmount = Number(strip);
    if (isNaN(stripAmount) || stripAmount <= 0) {
      return res.status(400).json({ message: 'Strip amount must be a positive number' });
    }

    const medicine = await Medicine.findById(req.params.id);
    if (!medicine) {
      return res.status(404).json({ message: 'Medicine not found' });
    }

    if (operation === 'increase') {
      medicine.strip += stripAmount;
    } else {
      if (medicine.strip < stripAmount) {
        return res.status(400).json({ 
          message: 'Insufficient stock',
          currentStock: medicine.strip 
        });
      }
      medicine.strip -= stripAmount;
    }

    await medicine.save();
    res.status(200).json({ 
      message: 'Medicine stock updated successfully', 
      currentStock: medicine.strip 
    });
  } catch (error) {
    res.status(500).json({ 
      message: 'Failed to update medicine stock', 
      error: error.message 
    });
  }
});

module.exports = router;
