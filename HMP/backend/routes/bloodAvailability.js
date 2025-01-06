const express = require('express');
const router = express.Router();
const BloodAvailability = require('../models/BloodAvailability');

// Route to get blood availability
router.get('/', async (req, res) => {
  try {
    const bloodAvailability = await BloodAvailability.find();
    
    if (!bloodAvailability || bloodAvailability.length === 0) {
      return res.status(404).json({ message: 'Blood not available at the moment' });
    }

    res.status(200).json({
      success: true,
      data: bloodAvailability
    });

  } catch (error) {
    console.error('Error fetching blood availability:', error);
    res.status(500).json({ 
      success: false,
      message: 'Server error, please try again.'
    });
  }
});

module.exports = router;
