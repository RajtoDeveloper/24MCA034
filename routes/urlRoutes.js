const express = require('express');
const router = express.Router();
const Url = require('../models/Url');
const geoip = require('geoip-lite');
const generateShortcode = require('../utils/generateShortcode');
const logAPI = require('../utils/logService');

const BASE_URL = "http://localhost:3000"; 


router.post('/shorturls', async (req, res) => {
  const { url, validity = 30, shortcode } = req.body;
  if (!url) {
    await logAPI("backend", "error", "handler", "URL not provided");
    return res.status(400).json({ error: "URL is required" });
  }

  const code = shortcode || generateShortcode();
  const expiryDate = new Date(Date.now() + validity * 60000);

  const existing = await Url.findOne({ shortcode: code });
  if (existing) {
    await logAPI("backend", "error", "handler", "Shortcode already exists");
    return res.status(400).json({ error: "Shortcode already in use" });
  }

  const newUrl = new Url({
    originalUrl: url,
    shortcode: code,
    expiry: expiryDate,
  });

  await newUrl.save();

  await logAPI("backend", "info", "handler", `Created shortcode ${code}`);

  res.status(201).json({
    shortLink: `${BASE_URL}/${code}`,
    expiry: expiryDate.toISOString(),
  });
});


router.get('/:shortcode', async (req, res) => {
  const { shortcode } = req.params;
  const record = await Url.findOne({ shortcode });

  if (!record) {
    await logAPI("backend", "error", "handler", "Shortcode not found");
    return res.status(404).json({ error: "Shortcode not found" });
  }

  if (new Date() > record.expiry) {
    await logAPI("backend", "warning", "handler", "Link expired");
    return res.status(410).json({ error: "Shortlink expired" });
  }

  const ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress;
  const geo = geoip.lookup(ip);

  record.clicks.push({
    timestamp: new Date(),
    referrer: req.get('Referrer') || 'unknown',
    location: geo?.country || 'unknown',
  });

  await record.save();
  await logAPI("backend", "info", "handler", `Redirected using ${shortcode}`);

  res.redirect(record.originalUrl);
});


router.get('/shorturls/:shortcode', async (req, res) => {
  const { shortcode } = req.params;
  const record = await Url.findOne({ shortcode });

  if (!record) {
    await logAPI("backend", "error", "handler", "Stats shortcode not found");
    return res.status(404).json({ error: "Shortcode not found" });
  }

  res.json({
    url: record.originalUrl,
    createdAt: record.createdAt,
    expiry: record.expiry,
    clickCount: record.clicks.length,
    clicks: record.clicks
  });
});

module.exports = router;
