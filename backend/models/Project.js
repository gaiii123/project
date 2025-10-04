// models/Project.js
const { db } = require('../config/database');

class Project {
  // Create new project
  static create(projectData, callback) {
    const { name, description, target_amount } = projectData;
    const sql = `INSERT INTO projects (name, description, target_amount) 
                 VALUES (?, ?, ?)`;
    
    db.run(sql, [name, description, target_amount], function(err) {
      callback(err, { id: this.lastID, ...projectData });
    });
  }

  // Get all projects
  static findAll(callback) {
    const sql = 'SELECT * FROM projects ORDER BY created_at DESC';
    db.all(sql, [], callback);
  }

  // Get project by ID
  static findById(id, callback) {
    const sql = 'SELECT * FROM projects WHERE id = ?';
    db.get(sql, [id], callback);
  }

  // Update project collected amount
  static updateCollectedAmount(id, amount, callback) {
    const sql = 'UPDATE projects SET collected_amount = collected_amount + ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?';
    db.run(sql, [amount, id], callback);
  }

  // Update project status
  static updateStatus(id, status, callback) {
    const sql = 'UPDATE projects SET status = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?';
    db.run(sql, [status, id], callback);
  }

  // Get project progress
  static getProgress(callback) {
    const sql = `
      SELECT 
        id,
        name,
        target_amount,
        collected_amount,
        (collected_amount / target_amount) * 100 as progress_percentage
      FROM projects 
      WHERE status = 'active'
    `;
    db.all(sql, [], callback);
  }
}

module.exports = Project;