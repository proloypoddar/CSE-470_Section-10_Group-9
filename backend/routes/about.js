const express = require('express');
const About = require('../models/About'); 
const router = express.Router();

// Static About Data
const aboutData = {
    title: "HealingWave Health Service",
    mission: "Delivering compassionate healthcare with state-of-the-art technology and skilled professionals.",
    coreValues: [
        "Compassionate Care",
        "Patient-Centered Approach",
        "Integrity & Transparency",
        "Innovation & Excellence",
        "Community Engagement"
    ],
    services: [
        "24/7 Emergency Care",
        "Advanced Surgical Units",
        "Rehabilitation & Diagnostics",
        "Doctor & Patient Portals",
        "Telemedicine Services"
    ],
    contactInfo: {
        emails: [
            "sakib.khan1@g.bracu.ac.bd",
            "md.raisul.islam1@g.bracu.ac.bd",
            "samir.yeasir.emon@g.bracu.ac.bd",
            "nowshin.sumaiya@g.bracu.ac.bd"
        ],
        phones: [
            "+880 1832 465 446",
            "+880 1615 600 788",
            "+880 1631 497 688",
            "+880 1955 884 993"
        ],
        address: "15 Rankin Street, Wari, Dhaka, 1203"
    }
};

// Middleware to check if the data exists in the database, and insert if it does not
const ensureAboutData = async (req, res, next) => {
    try {
        let about = await About.findOne();
        if (!about) {
            
            about = new About(aboutData);
            await about.save();
        }
        req.aboutData = about; 
        next();
    } catch (error) {
        res.status(500).json({ message: 'Server Error', error });
    }
};

// GET /about - Retrieve about data from the database
router.get('/', ensureAboutData, (req, res) => {
    res.json(req.aboutData);
});

module.exports = router;
