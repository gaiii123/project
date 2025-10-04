// models/Beneficiary.js
const { db } = require('../config/database');

class Beneficiary {
  // Create new beneficiary
  static create(beneficiaryData, callback) {
    const { name, email, phone, address, needs_description } = beneficiaryData;
    const sql = `INSERT INTO beneficiaries (name, email, phone, address, needs_description) 
                 VALUES (?, ?, ?, ?, ?)`;
    
    db.run(sql, [name, email, phone, address, needs_description], function(err) {
      callback(err, { id: this.lastID, ...beneficiaryData });
    });
  }

  // Get all beneficiaries
  static findAll(callback) {
    const sql = 'SELECT * FROM beneficiaries ORDER BY created_at DESC';
    db.all(sql, [], callback);
  }

  // Get beneficiary by ID
  static findById(id, callback) {
    const sql = 'SELECT * FROM beneficiaries WHERE id = ?';
    db.get(sql, [id], callback);
  }

  // Update beneficiary status
  static updateStatus(id, status, callback) {
    const sql = 'UPDATE beneficiaries SET status = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?';
    db.run(sql, [status, id], callback);
  }

  // Delete beneficiary
  static delete(id, callback) {
    const sql = 'DELETE FROM beneficiaries WHERE id = ?';
    db.run(sql, [id], callback);
  }

  // Get beneficiaries by status
  static findByStatus(status, callback) {
    const sql = 'SELECT * FROM beneficiaries WHERE status = ? ORDER BY created_at DESC';
    db.all(sql, [status], callback);
  }
}

module.exports = Beneficiary;