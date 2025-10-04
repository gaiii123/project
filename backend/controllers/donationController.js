// controllers/donationController.js
const Donation = require('../models/Donation');

// Get all donations
const getAllDonations = (req, res) => {
  Donation.findAll((err, donations) => {
    if (err) {
      return res.status(500).json({
        success: false,
        message: 'Error fetching donations',
        error: err.message
      });
    }
    res.json({
      success: true,
      data: donations,
      count: donations.length
    });
  });
};

// Get donation by ID
const getDonationById = (req, res) => {
  const { id } = req.params;

  Donation.findById(id, (err, donation) => {
    if (err) {
      return res.status(500).json({
        success: false,
        message: 'Error fetching donation',
        error: err.message
      });
    }

    if (!donation) {
      return res.status(404).json({
        success: false,
        message: 'Donation not found'
      });
    }

    res.json({
      success: true,
      data: donation
    });
  });
};

// Create new donation
const createDonation = (req, res) => {
  const { donor_name, donor_email, amount, currency, purpose } = req.body;

  if (!donor_name || !donor_email || !amount) {
    return res.status(400).json({
      success: false,
      message: 'Donor name, email, and amount are required'
    });
  }

  if (amount <= 0) {
    return res.status(400).json({
      success: false,
      message: 'Amount must be greater than 0'
    });
  }

  const donationData = {
    donor_name,
    donor_email,
    amount: parseFloat(amount),
    currency: currency || 'USD',
    purpose: purpose || ''
  };

  Donation.create(donationData, (err, result) => {
    if (err) {
      return res.status(500).json({
        success: false,
        message: 'Error creating donation',
        error: err.message
      });
    }

    res.status(201).json({
      success: true,
      message: 'Donation submitted successfully',
      data: result
    });
  });
};

// Update donation status
const updateDonationStatus = (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  if (!status) {
    return res.status(400).json({
      success: false,
      message: 'Status is required'
    });
  }

  Donation.updateStatus(id, status, (err) => {
    if (err) {
      return res.status(500).json({
        success: false,
        message: 'Error updating donation status',
        error: err.message
      });
    }

    res.json({
      success: true,
      message: 'Donation status updated successfully'
    });
  });
};

// Get donation statistics
const getDonationStats = (req, res) => {
  Donation.getTotalAmount((err, result) => {
    if (err) {
      return res.status(500).json({
        success: false,
        message: 'Error fetching donation statistics',
        error: err.message
      });
    }

    Donation.findByStatus('completed', (err, completedDonations) => {
      if (err) {
        return res.status(500).json({
          success: false,
          message: 'Error fetching donation statistics',
          error: err.message
        });
      }

      res.json({
        success: true,
        data: {
          totalAmount: result?.total || 0,
          totalDonations: completedDonations?.length || 0,
          averageDonation: completedDonations?.length > 0 ? (result?.total || 0) / completedDonations.length : 0
        }
      });
    });
  });
};

module.exports = {
  getAllDonations,
  getDonationById,
  createDonation,
  updateDonationStatus,
  getDonationStats
};