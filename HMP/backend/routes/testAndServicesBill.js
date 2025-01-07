const express = require('express');
const router = express.Router();
const TestAndServicesBill = require('../models/TestAndServicesBill');
const HealthCard = require('../models/HealthCard');

// HTTP Status codes
const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  BAD_REQUEST: 400,
  NOT_FOUND: 404,
  SERVER_ERROR: 500
};

// Validate required fields
const validateFields = (fields) => {
  return Object.entries(fields).every(([key, value]) => value !== undefined && value !== '');
};

// Create a new bill
router.post('/add', async (req, res) => {
  try {
    const billData = {
      doctorName,
      doctorEmail,
      patientName,
      patientEmail,
      phoneNumber,
      selectedItems
    } = req.body;

    if (!validateFields(billData)) {
      return res.status(HTTP_STATUS.BAD_REQUEST).json({ 
        error: 'All fields are required' 
      });
    }

    const newBill = new TestAndServicesBill({
      ...billData,
      phone: phoneNumber,
      totalBill: selectedItems.reduce((total, item) => total + item.price, 0)
    });

    await newBill.save();
    res.status(HTTP_STATUS.CREATED).json({ 
      message: 'Bill sent to the patient successfully',
      billId: newBill._id 
    });
  } catch (err) {
    console.error('Error creating bill:', err);
    res.status(HTTP_STATUS.BAD_REQUEST).json({ 
      error: 'Failed to add bill',
      details: err.message 
    });
  }
});

// Fetch bills by patient email
router.get('/bills/:email', async (req, res) => {
  try {
    const bills = await TestAndServicesBill.find({ patientEmail: req.params.email });
    res.json(bills);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch bills' });
  }
});

// Pay for a bill and update health card
router.put('/pay/:id', async (req, res) => {
  try {
    const { email } = req.body;
    const [bill, healthCard] = await Promise.all([
      TestAndServicesBill.findById(req.params.id),
      HealthCard.findOne({ email })
    ]);

    if (!bill || !healthCard) {
      return res.status(HTTP_STATUS.NOT_FOUND).json({ 
        error: !bill ? 'Bill not found' : 'Health card not found' 
      });
    }

    if (bill.totalBill > healthCard.topUpAmount) {
      return res.status(HTTP_STATUS.BAD_REQUEST).json({ 
        error: 'Insufficient funds',
        required: bill.totalBill,
        available: healthCard.topUpAmount
      });
    }

    // Update both documents
    bill.paid = true;
    healthCard.topUpAmount -= bill.totalBill;

    await Promise.all([bill.save(), healthCard.save()]);

    res.status(HTTP_STATUS.OK).json({ 
      message: 'Payment successful',
      bill,
      remainingBalance: healthCard.topUpAmount
    });
  } catch (err) {
    console.error('Payment processing error:', err);
    res.status(HTTP_STATUS.SERVER_ERROR).json({ 
      error: 'Failed to process payment',
      details: err.message 
    });
  }
});

module.exports = router;
