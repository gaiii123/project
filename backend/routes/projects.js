// routes/projects.js
const express = require('express');
const router = express.Router();

const {
  getAllProjects,
  getProjectById,
  createProject,
  updateProjectProgress,
  getProjectProgress
} = require('../controllers/projectController');

// GET /api/projects - Get all projects
router.get('/', getAllProjects);

// GET /api/projects/progress - Get project progress
router.get('/progress', getProjectProgress);

// GET /api/projects/:id - Get project by ID
router.get('/:id', getProjectById);

// POST /api/projects - Create new project
router.post('/', createProject);

// PUT /api/projects/:id/progress - Update project progress
router.put('/:id/progress', updateProjectProgress);

module.exports = router;