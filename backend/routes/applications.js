// routes/applications.js
const express = require('express');
const router = express.Router();
const applicationController = require('../controllers/applicationController');

// Get all applications
router.get('/', applicationController.getAllApplications);

// Get application statistics
router.get('/stats', applicationController.getApplicationStats);

// Get applications by status
router.get('/status/:status', applicationController.getApplicationsByStatus);

// Get application by ID
router.get('/:id', applicationController.getApplicationById);

// Get applications by beneficiary
router.get('/beneficiary/:beneficiaryId', applicationController.getApplicationsByBeneficiary);

// Create new application
router.post('/', applicationController.createApplication);

// Update application status
router.put('/:id/status', applicationController.updateApplicationStatus);

// Update application
router.put('/:id', applicationController.updateApplication);

// Delete application
router.delete('/:id', applicationController.deleteApplication);

module.exports = router;
