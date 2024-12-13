const mongoose = require('mongoose');

const PatientSchema = new mongoose.Schema({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  sex: { type: String, required: true },
  dateOfBirth: { type: Date, required: true },
  mobileNumber: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },

  age: { type: Number },
  bloodGroup: { type: String },
  difficulty: { type: String },
  beendignosed: { type: String },
  condition: { type: String },
});

module.exports = mongoose.model('Patient', PatientSchema);
