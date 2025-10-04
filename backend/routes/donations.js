// routes/donations.js
const express = require('express');
const router = express.Router();

const {
  getAllDonations,
  getDonationById,
  createDonation,
  updateDonationStatus,
  getDonationStats
} = require('../controllers/donationController');

// GET /api/donations - Get all donations
router.get('/', getAllDonations);

// GET /api/donations/stats - Get donation statistics
router.get('/stats', getDonationStats);

// GET /api/donations/:id - Get donation by ID
router.get('/:id', getDonationById);

// POST /api/donations - Create new donation
router.post('/', createDonation);

// PUT /api/donations/:id/status - Update donation status
router.put('/:id/status', updateDonationStatus);

module.exports = router;