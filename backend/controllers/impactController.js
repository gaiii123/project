// controllers/impactController.js
const Impact = require('../models/impact');

// Get all impact records
const getAllImpactRecords = (req, res) => {
  Impact.findAll((err, impactRecords) => {
    if (err) {
      return res.status(500).json({
        success: false,
        message: 'Error fetching impact records',
        error: err.message
      });
    }
    res.json({
      success: true,
      data: impactRecords || [],
      count: impactRecords?.length || 0
    });
  });
};

// Get impact record by ID
const getImpactRecordById = (req, res) => {
  const { id } = req.params;

  Impact.findById(id, (err, impactRecord) => {
    if (err) {
      return res.status(500).json({
        success: false,
        message: 'Error fetching impact record',
        error: err.message
      });
    }

    if (!impactRecord) {
      return res.status(404).json({
        success: false,
        message: 'Impact record not found'
      });
    }

    res.json({
      success: true,
      data: impactRecord
    });
  });
};

// Create new impact record
const createImpactRecord = (req, res) => {
  const { project_id, beneficiary_id, donation_id, impact_description, amount_used, status_update } = req.body;

  if (!impact_description || !status_update) {
    return res.status(400).json({
      success: false,
      message: 'Impact description and status update are required'
    });
  }

  const impactData = {
    project_id: project_id || null,
    beneficiary_id: beneficiary_id || null,
    donation_id: donation_id || null,
    impact_description,
    amount_used: amount_used ? parseFloat(amount_used) : null,
    status_update
  };

  Impact.create(impactData, (err, result) => {
    if (err) {
      return res.status(500).json({
        success: false,
        message: 'Error creating impact record',
        error: err.message
      });
    }

    res.status(201).json({
      success: true,
      message: 'Impact record created successfully',
      data: result
    });
  });
};

// Get impact summary
const getImpactSummary = (req, res) => {
  Impact.getSummary((err, summary) => {
    if (err) {
      return res.status(500).json({
        success: false,
        message: 'Error fetching impact summary',
        error: err.message
      });
    }

    res.json({
      success: true,
      data: summary || {
        beneficiaries_helped: 0,
        active_projects: 0,
        total_funds_utilized: 0,
        total_impact_records: 0
      }
    });
  });
};

module.exports = {
  getAllImpactRecords,
  getImpactRecordById,
  createImpactRecord,
  getImpactSummary
};