// models/Impact.js
const { db } = require('../config/database');

class Impact {
  // Create new impact record
  static create(impactData, callback) {
    const { project_id, beneficiary_id, donation_id, impact_description, amount_used, status_update } = impactData;
    const sql = `INSERT INTO impact_tracking (project_id, beneficiary_id, donation_id, impact_description, amount_used, status_update) 
                 VALUES (?, ?, ?, ?, ?, ?)`;
    
    db.run(sql, [project_id, beneficiary_id, donation_id, impact_description, amount_used, status_update], function(err) {
      callback(err, { id: this.lastID, ...impactData });
    });
  }

  // Get all impact records with joins
  static findAll(callback) {
    const sql = `
      SELECT 
        it.*,
        p.name as project_name,
        b.name as beneficiary_name,
        d.donor_name,
        d.amount as donation_amount
      FROM impact_tracking it
      LEFT JOIN projects p ON it.project_id = p.id
      LEFT JOIN beneficiaries b ON it.beneficiary_id = b.id
      LEFT JOIN donations d ON it.donation_id = d.id
      ORDER BY it.created_at DESC
    `;
    db.all(sql, [], callback);
  }

  // Get impact by ID
  static findById(id, callback) {
    const sql = `
      SELECT 
        it.*,
        p.name as project_name,
        b.name as beneficiary_name,
        d.donor_name
      FROM impact_tracking it
      LEFT JOIN projects p ON it.project_id = p.id
      LEFT JOIN beneficiaries b ON it.beneficiary_id = b.id
      LEFT JOIN donations d ON it.donation_id = d.id
      WHERE it.id = ?
    `;
    db.get(sql, [id], callback);
  }

  // Get impact summary
  static getSummary(callback) {
    const sql = `
      SELECT 
        COUNT(DISTINCT beneficiary_id) as beneficiaries_helped,
        COUNT(DISTINCT project_id) as active_projects,
        SUM(amount_used) as total_funds_utilized,
        COUNT(*) as total_impact_records
      FROM impact_tracking
    `;
    db.get(sql, [], callback);
  }
}

module.exports = Impact;