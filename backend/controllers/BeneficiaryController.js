// controllers/beneficiaryController.js
const Beneficiary = require('../models/Beneficiary');

// Get all beneficiaries
const getAllBeneficiaries = (req, res) => {
  Beneficiary.findAll((err, beneficiaries) => {
    if (err) {
      return res.status(500).json({ 
        success: false, 
        message: 'Error fetching beneficiaries',
        error: err.message 
      });
    }
    res.json({
      success: true,
      data: beneficiaries,
      count: beneficiaries.length
    });
  });
};

// Get beneficiary by ID
const getBeneficiaryById = (req, res) => {
  const { id } = req.params;
  
  Beneficiary.findById(id, (err, beneficiary) => {
    if (err) {
      return res.status(500).json({
        success: false,
        message: 'Error fetching beneficiary',
        error: err.message
      });
    }
    
    if (!beneficiary) {
      return res.status(404).json({
        success: false,
        message: 'Beneficiary not found'
      });
    }
    
    res.json({
      success: true,
      data: beneficiary
    });
  });
};

// Create new beneficiary
const createBeneficiary = (req, res) => {
  const { name, email, phone, address, needs_description } = req.body;

  // Basic validation
  if (!name || !email || !needs_description) {
    return res.status(400).json({
      success: false,
      message: 'Name, email, and needs description are required'
    });
  }

  const beneficiaryData = {
    name,
    email,
    phone: phone || '',
    address: address || '',
    needs_description
  };

  Beneficiary.create(beneficiaryData, (err, result) => {
    if (err) {
      if (err.message.includes('UNIQUE constraint failed')) {
        return res.status(400).json({
          success: false,
          message: 'Email already exists'
        });
      }
      return res.status(500).json({
        success: false,
        message: 'Error creating beneficiary',
        error: err.message
      });
    }

    res.status(201).json({
      success: true,
      message: 'Beneficiary application submitted successfully',
      data: result
    });
  });
};

// Update beneficiary status
const updateBeneficiaryStatus = (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  if (!status) {
    return res.status(400).json({
      success: false,
      message: 'Status is required'
    });
  }

  Beneficiary.updateStatus(id, status, (err) => {
    if (err) {
      return res.status(500).json({
        success: false,
        message: 'Error updating beneficiary status',
        error: err.message
      });
    }

    res.json({
      success: true,
      message: 'Beneficiary status updated successfully'
    });
  });
};

// Delete beneficiary
const deleteBeneficiary = (req, res) => {
  const { id } = req.params;

  Beneficiary.delete(id, (err) => {
    if (err) {
      return res.status(500).json({
        success: false,
        message: 'Error deleting beneficiary',
        error: err.message
      });
    }

    res.json({
      success: true,
      message: 'Beneficiary deleted successfully'
    });
  });
};

// Get beneficiaries by email (for user-specific view)
const getBeneficiariesByEmail = (req, res) => {
  const { email } = req.params;
  
  if (!email) {
    return res.status(400).json({
      success: false,
      message: 'Email is required'
    });
  }

  Beneficiary.findByEmail(email, (err, beneficiaries) => {
    if (err) {
      return res.status(500).json({
        success: false,
        message: 'Error fetching beneficiaries',
        error: err.message
      });
    }
    
    res.json({
      success: true,
      data: beneficiaries,
      count: beneficiaries.length
    });
  });
};

// Get beneficiary dashboard data
const getBeneficiaryDashboard = (req, res) => {
  const { email } = req.params;
  
  if (!email) {
    return res.status(400).json({
      success: false,
      message: 'Email is required'
    });
  }

  Beneficiary.getDashboardData(email, (err, dashboardData) => {
    if (err) {
      return res.status(500).json({
        success: false,
        message: 'Error fetching dashboard data',
        error: err.message
      });
    }
    
    res.json({
      success: true,
      data: dashboardData
    });
  });
};

module.exports = {
  getAllBeneficiaries,
  getBeneficiaryById,
  createBeneficiary,
  updateBeneficiaryStatus,
  deleteBeneficiary,
  getBeneficiariesByEmail,
  getBeneficiaryDashboard
};