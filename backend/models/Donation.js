// models/Donation.js
const { db } = require('../config/database');

class Donation {
  // Create new donation
  static create(donationData, callback) {
    const { donor_name, donor_email, amount, currency, purpose } = donationData;
    const sql = `INSERT INTO donations (donor_name, donor_email, amount, currency, purpose) 
                 VALUES (?, ?, ?, ?, ?)`;
    
    db.run(sql, [donor_name, donor_email, amount, currency, purpose], function(err) {
      callback(err, { id: this.lastID, ...donationData });
    });
  }

  // Get all donations
  static findAll(callback) {
    const sql = 'SELECT * FROM donations ORDER BY created_at DESC';
    db.all(sql, [], callback);
  }

  // Get donation by ID
  static findById(id, callback) {
    const sql = 'SELECT * FROM donations WHERE id = ?';
    db.get(sql, [id], callback);
  }

  // Update donation status
  static updateStatus(id, status, callback) {
    const sql = 'UPDATE donations SET status = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?';
    db.run(sql, [status, id], callback);
  }

  // Get total donations amount
  static getTotalAmount(callback) {
    const sql = 'SELECT SUM(amount) as total FROM donations WHERE status = "completed"';
    db.get(sql, [], callback);
  }

  // Get donations by status
  static findByStatus(status, callback) {
    const sql = 'SELECT * FROM donations WHERE status = ? ORDER BY created_at DESC';
    db.all(sql, [status], callback);
  }
}

module.exports = Donation;