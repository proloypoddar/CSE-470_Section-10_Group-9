const mongoose = require('mongoose');

const aboutSchema = new mongoose.Schema({
    title: { type: String, required: true },
    mission: { type: String, required: true },
    coreValues: { type: [String], required: true },
    services: { type: [String], required: true },
    contactInfo: {
        emails: { type: [String], required: true },
        phones: { type: [String], required: true },
        address: { type: String, required: true }
    }
});

const About = mongoose.model('About', aboutSchema);

module.exports = About;
