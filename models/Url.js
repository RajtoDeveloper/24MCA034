const mongoose = require('mongoose');

const clickSchema = new mongoose.Schema({
  timestamp: Date,
  referrer: String,
  location: String,
});

const urlSchema = new mongoose.Schema({
  originalUrl: { type: String, required: true },
  shortcode: { type: String, unique: true },
  expiry: Date,
  createdAt: { type: Date, default: Date.now },
  clicks: [clickSchema],
});

module.exports = mongoose.model('Url', urlSchema);
