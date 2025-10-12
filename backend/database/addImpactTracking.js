// database/addImpactTracking.js
// Migration script to add impact_tracking table to existing database
// Run this with: node database/addImpactTracking.js

const { db, dbPath } = require('../config/database');

// Check if table already exists
db.get(
  "SELECT name FROM sqlite_master WHERE type='table' AND name='impact_tracking'",
  (err, row) => {
    if (err) {
      console.error('Error checking for table:', err);
      db.close();
      process.exit(1);
    }

    if (row) {
      console.log('impact_tracking table already exists. Nothing to do.');
      db.close();
      process.exit(0);
    }

    // Create impact_tracking table
    console.log('Creating impact_tracking table...');
    
    db.serialize(() => {
      db.run(`
        CREATE TABLE impact_tracking (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          project_id INTEGER,
          beneficiary_id INTEGER,
          donation_id INTEGER,
          impact_description TEXT NOT NULL,
          amount_used REAL,
          status_update TEXT NOT NULL,
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE SET NULL,
          FOREIGN KEY (beneficiary_id) REFERENCES users(id) ON DELETE SET NULL,
          FOREIGN KEY (donation_id) REFERENCES donations(id) ON DELETE SET NULL
        )
      `, (err) => {
        if (err) {
          console.error('Error creating table:', err);
          db.close();
          process.exit(1);
        }
        console.log('impact_tracking table created successfully!');
      });

      // Create indexes
      db.run('CREATE INDEX idx_impact_project ON impact_tracking(project_id)', (err) => {
        if (err) console.error('Warning: Error creating project index:', err);
      });
      
      db.run('CREATE INDEX idx_impact_beneficiary ON impact_tracking(beneficiary_id)', (err) => {
        if (err) console.error('Warning: Error creating beneficiary index:', err);
      });
      
      db.run('CREATE INDEX idx_impact_donation ON impact_tracking(donation_id)', (err) => {
        if (err) {
          console.error('Warning: Error creating donation index:', err);
        }
        
        // Close database after all operations
        console.log('Migration completed successfully!');
        console.log('\nYou can now restart your server.');
        
        db.close((err) => {
          if (err) {
            console.error('Error closing database:', err);
          }
        });
      });
    });
  }
);
