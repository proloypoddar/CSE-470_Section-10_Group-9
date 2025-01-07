const express = require('express');
const router = express.Router();

// Static About Data with the new email included
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
            "polok.poddar@g.bracu.ac.bd",
            "tahmid.islam@g.bracu.ac.bd" // Added the new emails here
        ],
        phones: [
            "+880 1711 111 111",
        ],
        address: "Gulshan, Dhaka, Bangladesh"
    }
};

// GET /about - Retrieve about data (no need to check or insert into database)
router.get('/', (req, res) => {
    res.json(aboutData); // Send the static aboutData directly as the response
});

module.exports = router;
