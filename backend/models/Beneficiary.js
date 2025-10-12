// models/Beneficiary.js
const { db } = require('../config/database');

class Beneficiary {
  // Create new beneficiary (stores in users table with role='beneficiary')
  static create(beneficiaryData, callback) {
    const { name, email, phone, address, needs_description } = beneficiaryData;
    
    // Insert into users table as a beneficiary
    const sql = `INSERT INTO users (name, email, phone, role, location, password, created_at, updated_at) 
                 VALUES (?, ?, ?, 'beneficiary', ?, '', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)`;
    
    db.run(
      sql, 
      [name, email, phone, address], 
      function(err) {
        if (err) {
          return callback(err);
        }
        
        // If you need to store the needs_description separately, consider adding an aid_application
        // For now, we're storing it in the users table via location field or you could create a separate beneficiary_profiles table
        
        callback(null, { 
          id: this.lastID, 
          name, 
          email, 
          phone, 
          address,
          needs_description,
          role: 'beneficiary',
          status: 'pending'
        });
      }
    );
  }

  // Get all beneficiaries
  static findAll(callback) {
    const sql = 'SELECT * FROM users WHERE role = ? ORDER BY created_at DESC';
    db.all(sql, ['beneficiary'], callback);
  }

  // Get beneficiary by ID
  static findById(id, callback) {
    const sql = 'SELECT * FROM users WHERE id = ? AND role = ?';
    db.get(sql, [id, 'beneficiary'], callback);
  }

  // Update beneficiary status (if you add a status column to users table)
  // Or update via aid_applications status
  static updateStatus(id, status, callback) {
    // If you add a status column to users table:
    const sql = 'UPDATE users SET updated_at = CURRENT_TIMESTAMP WHERE id = ? AND role = ?';
    db.run(sql, [id, 'beneficiary'], callback);
  }

  // Delete beneficiary
  static delete(id, callback) {
    const sql = 'DELETE FROM users WHERE id = ? AND role = ?';
    db.run(sql, [id, 'beneficiary'], callback);
  }

  // Get beneficiaries by application status (from aid_applications table)
  static findByStatus(status, callback) {
    const sql = `
      SELECT DISTINCT u.* 
      FROM users u
      INNER JOIN aid_applications aa ON u.id = aa.beneficiary_id
      WHERE u.role = ? AND aa.status = ?
      ORDER BY u.created_at DESC
    `;
    db.all(sql, ['beneficiary', status], callback);
  }

  // Get beneficiary's applications
  static getApplications(beneficiaryId, callback) {
    const sql = `
      SELECT aa.*, p.title as project_title 
      FROM aid_applications aa
      LEFT JOIN projects p ON aa.project_id = p.id
      WHERE aa.beneficiary_id = ?
      ORDER BY aa.created_at DESC
    `;
    db.all(sql, [beneficiaryId], callback);
  }

  // Create an aid application (better approach for needs_description)
  static createApplication(applicationData, callback) {
    const { project_id, beneficiary_id, description, amount_requested } = applicationData;
    const sql = `
      INSERT INTO aid_applications 
      (project_id, beneficiary_id, application_type, description, amount_requested, status, created_at, updated_at)
      VALUES (?, ?, ?, ?, ?, 'pending', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
    `;
    
    db.run(
      sql,
      [project_id, beneficiary_id, 'general', description, amount_requested],
      function(err) {
        callback(err, { id: this.lastID, ...applicationData, status: 'pending' });
      }
    );
  }
}

module.exports = Beneficiary;