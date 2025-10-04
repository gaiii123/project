// controllers/projectController.js
const Project = require('../models/Project');

// Get all projects
const getAllProjects = (req, res) => {
  Project.findAll((err, projects) => {
    if (err) {
      return res.status(500).json({
        success: false,
        message: 'Error fetching projects',
        error: err.message
      });
    }
    res.json({
      success: true,
      data: projects,
      count: projects.length
    });
  });
};

// Get project by ID
const getProjectById = (req, res) => {
  const { id } = req.params;

  Project.findById(id, (err, project) => {
    if (err) {
      return res.status(500).json({
        success: false,
        message: 'Error fetching project',
        error: err.message
      });
    }

    if (!project) {
      return res.status(404).json({
        success: false,
        message: 'Project not found'
      });
    }

    res.json({
      success: true,
      data: project
    });
  });
};

// Create new project
const createProject = (req, res) => {
  const { name, description, target_amount } = req.body;

  if (!name || !description || !target_amount) {
    return res.status(400).json({
      success: false,
      message: 'Name, description, and target amount are required'
    });
  }

  if (target_amount <= 0) {
    return res.status(400).json({
      success: false,
      message: 'Target amount must be greater than 0'
    });
  }

  const projectData = {
    name,
    description,
    target_amount: parseFloat(target_amount)
  };

  Project.create(projectData, (err, result) => {
    if (err) {
      return res.status(500).json({
        success: false,
        message: 'Error creating project',
        error: err.message
      });
    }

    res.status(201).json({
      success: true,
      message: 'Project created successfully',
      data: result
    });
  });
};

// Update project progress
const updateProjectProgress = (req, res) => {
  const { id } = req.params;
  const { amount } = req.body;

  if (!amount || amount <= 0) {
    return res.status(400).json({
      success: false,
      message: 'Valid amount is required'
    });
  }

  Project.updateCollectedAmount(id, parseFloat(amount), (err) => {
    if (err) {
      return res.status(500).json({
        success: false,
        message: 'Error updating project progress',
        error: err.message
      });
    }

    res.json({
      success: true,
      message: 'Project progress updated successfully'
    });
  });
};

// Get project progress
const getProjectProgress = (req, res) => {
  Project.getProgress((err, projects) => {
    if (err) {
      return res.status(500).json({
        success: false,
        message: 'Error fetching project progress',
        error: err.message
      });
    }

    res.json({
      success: true,
      data: projects || []
    });
  });
};

module.exports = {
  getAllProjects,
  getProjectById,
  createProject,
  updateProjectProgress,
  getProjectProgress
};