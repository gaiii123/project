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

  // Get beneficiaries by email
  static findByEmail(email, callback) {
    const sql = 'SELECT * FROM beneficiaries WHERE email = ? ORDER BY created_at DESC';
    db.all(sql, [email], callback);
  }

  // Get dashboard data for a beneficiary
  static getDashboardData(email, callback) {
    // Get application statistics
    const statsQuery = `
      SELECT 
        COUNT(*) as total,
        SUM(CASE WHEN status = 'pending' THEN 1 ELSE 0 END) as pending,
        SUM(CASE WHEN status = 'approved' THEN 1 ELSE 0 END) as approved,
        SUM(CASE WHEN status = 'rejected' THEN 1 ELSE 0 END) as rejected,
        SUM(CASE WHEN status = 'completed' THEN 1 ELSE 0 END) as completed
      FROM beneficiaries 
      WHERE email = ?
    `;

    // Get recent applications
    const recentQuery = `
      SELECT id, name, email, status, needs_description, created_at, updated_at
      FROM beneficiaries 
      WHERE email = ?
      ORDER BY created_at DESC 
      LIMIT 10
    `;

    db.get(statsQuery, [email], (err, stats) => {
      if (err) {
        return callback(err);
      }

      db.all(recentQuery, [email], (err, applications) => {
        if (err) {
          return callback(err);
        }

        // Format recent activities
        const recentActivities = applications.map(app => ({
          id: app.id,
          type: app.status,
          title: `Application ${app.status}`,
          subtitle: app.needs_description.substring(0, 50) + '...',
          timestamp: app.updated_at || app.created_at
        }));

        // Create categories data
        const categories = [
          {
            name: 'Approved',
            count: stats.approved || 0,
            amount: stats.approved || 0,
            color: '#4caf50'
          },
          {
            name: 'Pending',
            count: stats.pending || 0,
            amount: stats.pending || 0,
            color: '#ff9800'
          },
          {
            name: 'Rejected',
            count: stats.rejected || 0,
            amount: stats.rejected || 0,
            color: '#f44336'
          },
          {
            name: 'Completed',
            count: stats.completed || 0,
            amount: stats.completed || 0,
            color: '#2196f3'
          }
        ];

        const dashboardData = {
          totalDonations: stats.total || 0,
          categories: categories,
          recentActivities: recentActivities,
          applicationStats: {
            pending: stats.pending || 0,
            approved: stats.approved || 0,
            rejected: stats.rejected || 0,
            completed: stats.completed || 0,
            total: stats.total || 0
          }
        };

        callback(null, dashboardData);
      });
    });
  }
}

module.exports = Beneficiary;