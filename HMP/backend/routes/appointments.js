
const express = require('express');
const router = express.Router();
const Appointment = require('../models/Appointment');
const Doctor = require('../models/Doctor');
const HealthCard = require('../models/HealthCard');

// Utility function to handle errors
const handleError = (res, error, message = 'Internal server error') => {
    console.error(error);
    res.status(500).json({ error: message });
};

// Get all distinct departments
router.get('/departments', async (req, res) => {
    try {
        const departments = await Doctor.distinct('department');
        res.json(departments);
    } catch (err) {
        handleError(res, err);
    }
});

// Get doctors by department
router.get('/doctors/:department', async (req, res) => {
    try {
        const doctors = await Doctor.find({ department: req.params.department });
        res.json(doctors);
    } catch (err) {
        handleError(res, err);
    }
});

// Get doctor by ID (to fetch email and name)
router.get('/doctor/:id', async (req, res) => {
    try {
        const doctor = await Doctor.findById(req.params.id);
        if (!doctor) {
            return res.status(404).json({ error: 'Doctor not found' });
        }
        res.json(doctor);
    } catch (err) {
        handleError(res, err);
    }
});

// Create an appointment
router.post('/', async (req, res) => {
    const { department, doctor, date, timeSlot, patientName, patientEmail, patientPhone } = req.body;

    try {
        const doctorDetails = await Doctor.findById(doctor);
        if (!doctorDetails) {
            return res.status(404).json({ error: 'Doctor not found' });
        }

        const existingDoctorAppointment = await Appointment.findOne({ doctor, date, timeSlot });
        if (existingDoctorAppointment) {
            return res.status(400).json({ error: 'This time slot is already booked with this doctor.' });
        }

        const existingPatientAppointment = await Appointment.findOne({ patientEmail, date, timeSlot });
        if (existingPatientAppointment) {
            return res.status(400).json({ error: 'You already have an appointment at this time and date.' });
        }

        const newAppointment = new Appointment({
            department,
            doctor,
            doctorName: `${doctorDetails.firstName} ${doctorDetails.lastName}`,
            doctorEmail: doctorDetails.email,
            date,
            timeSlot,
            patientName,
            patientEmail,
            patientPhone,
        });

        await newAppointment.save();
        res.status(201).json(newAppointment);
    } catch (err) {
        handleError(res, err);
    }
});

// Get appointments by doctor email
router.get('/doctor/email/:email', async (req, res) => {
    try {
        const appointments = await Appointment.find({ doctorEmail: req.params.email });
        res.json(appointments);
    } catch (err) {
        handleError(res, err);
    }
});

// Get appointments by patient email
router.get('/patient/email/:email', async (req, res) => {
    try {
        const appointments = await Appointment.find({ patientEmail: req.params.email });
        res.json(appointments);
    } catch (err) {
        handleError(res, err);
    }
});

// Get the total number of appointments for a specific doctor
router.get('/count/:doctorEmail', async (req, res) => {
    try {
        const count = await Appointment.countDocuments({ doctorEmail: req.params.doctorEmail });
        res.json({ count });
    } catch (err) {
        handleError(res, err);
    }
});

// Get today's appointments for a specific doctor
router.get('/today-appointments', async (req, res) => {
    try {
        const { doctorEmail } = req.query;
        const today = new Date();
        const startOfDay = new Date(today.setHours(0, 0, 0, 0));
        const endOfDay = new Date(today.setHours(23, 59, 59, 999));

        const appointments = await Appointment.find({
            doctorEmail,
            date: { $gte: startOfDay, $lte: endOfDay },
        }).sort({ time: 1 });

        res.json(appointments);
    } catch (err) {
        handleError(res, err);
    }
});

// Request payment
router.put('/request-payment/:id', async (req, res) => {
    try {
        const appointment = await Appointment.findById(req.params.id);

        if (!appointment) {
            return res.status(404).json({ error: 'Appointment not found' });
        }

        if (appointment.paymentRequest === 'requested') {
            return res.status(400).json({ error: 'Payment already requested' });
        }

        appointment.paymentRequest = 'requested';
        await appointment.save();

        res.json({ message: 'Payment request has been sent' });
    } catch (err) {
        handleError(res, err);
    }
});

// Pay with health card
router.put('/pay/:id', async (req, res) => {
    const { email } = req.body;

    try {
        const appointment = await Appointment.findById(req.params.id);
        const healthCard = await HealthCard.findOne({ email });

        if (!appointment || !healthCard) {
            return res.status(404).json({ error: 'Appointment or Health Card not found' });
        }

        if (appointment.paidStatus === 'paid') {
            return res.status(400).json({ error: 'Appointment already paid' });
        }

        if (healthCard.topUpAmount < 1000) {
            return res.status(400).json({ error: 'Insufficient points in health card' });
        }

        healthCard.topUpAmount -= 1000;
        appointment.paidStatus = 'paid';
        appointment.status = 'completed';
        appointment.paymentRequest = 'requested';

        await healthCard.save();
        await appointment.save();

        res.json({ message: 'Payment successful', appointment });
    } catch (err) {
        handleError(res, err);
    }
});

module.exports = router;
