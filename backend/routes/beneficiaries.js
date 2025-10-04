// routes/beneficiaries.js
const express = require('express');
const router = express.Router();

// Import controller functions directly
const {
  getAllBeneficiaries,
  getBeneficiaryById,
  createBeneficiary,
  updateBeneficiaryStatus,
  deleteBeneficiary
} = require('../controllers/BeneficiaryController');

// GET /api/beneficiaries - Get all beneficiaries
router.get('/', getAllBeneficiaries);

// GET /api/beneficiaries/:id - Get beneficiary by ID
router.get('/:id', getBeneficiaryById);

// POST /api/beneficiaries - Create new beneficiary
router.post('/', createBeneficiary);

// PUT /api/beneficiaries/:id/status - Update beneficiary status
router.put('/:id/status', updateBeneficiaryStatus);

// DELETE /api/beneficiaries/:id - Delete beneficiary
router.delete('/:id', deleteBeneficiary);

module.exports = router;