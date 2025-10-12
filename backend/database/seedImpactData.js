// database/seedImpactData.js
// Run this to add sample impact tracking data: node database/seedImpactData.js

const { db, dbPath } = require('../config/database');

console.log('🌱 Starting impact tracking data seeding...');
console.log('📍 Database location:', dbPath);

function seedImpactData() {
  db.serialize(() => {
    // First, let's check what donations and beneficiaries exist
    db.all('SELECT id, donor_id, project_id, amount FROM donations', (err, donations) => {
      if (err) {
        console.error('Error fetching donations:', err);
        return;
      }

      console.log('Found donations:', donations);

      if (donations.length === 0) {
        console.log('⚠️ No donations found. Please run seedData.js first.');
        db.close();
        return;
      }

      // Insert Impact Tracking records
      const insertImpact = db.prepare(`
        INSERT INTO impact_tracking (project_id, beneficiary_id, donation_id, impact_description, amount_used, status_update) 
        VALUES (?, ?, ?, ?, ?, ?)
      `);

      // Impact from the first donation
      const firstDonation = donations[0];
      insertImpact.run(
        firstDonation.project_id,
        4, // First beneficiary
        firstDonation.id,
        '8 families received emergency food packages for a week',
        firstDonation.amount * 0.9, // 90% of donation used
        'Successfully distributed school supplies to 5 children. They are now attending school regularly with proper materials.'
      );

      if (donations.length > 1) {
        const secondDonation = donations[1];
        insertImpact.run(
          secondDonation.project_id,
          5, // Second beneficiary
          secondDonation.id,
          '5 children received school supplies including notebooks and textbooks',
          secondDonation.amount * 0.85,
          'Educational books distributed to rural school. Students showing improved academic performance.'
        );
      }

      // General project impacts (no specific donation)
      insertImpact.run(
        1,
        null,
        null,
        '120 children benefited from the school supplies program',
        null,
        'Project milestone reached: Over 100 students now have access to proper learning materials'
      );

      insertImpact.run(
        1,
        null,
        null,
        'Healthcare services provided to 200+ individuals',
        null,
        'Medical camp expanded to neighboring villages. Emergency healthcare now accessible to remote communities'
      );

      insertImpact.finalize();

      console.log('✅ Impact tracking data inserted successfully!');
      console.log('\n💡 Impact data seeding complete!');
      console.log('📊 Added impact records for existing donations and projects');

      // Close database after all operations
      setTimeout(() => {
        db.close((err) => {
          if (err) {
            console.error('Error closing database:', err);
          } else {
            console.log('✅ Database connection closed.');
          }
        });
      }, 1000);
    });
  });
}

// Check if impact_tracking table exists, if not create it
db.get("SELECT name FROM sqlite_master WHERE type='table' AND name='impact_tracking'", (err, row) => {
  if (err) {
    console.error('❌ Error checking for impact_tracking table:', err);
    db.close();
    process.exit(1);
  }

  if (!row) {
    console.log('⚠️ impact_tracking table does not exist. Creating it...');
    db.run(`
      CREATE TABLE IF NOT EXISTS impact_tracking (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        project_id INTEGER,
        beneficiary_id INTEGER,
        donation_id INTEGER,
        impact_description TEXT NOT NULL,
        amount_used DECIMAL(10,2),
        status_update TEXT NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE CASCADE,
        FOREIGN KEY (beneficiary_id) REFERENCES users(id) ON DELETE CASCADE,
        FOREIGN KEY (donation_id) REFERENCES donations(id) ON DELETE CASCADE
      )
    `, (err) => {
      if (err) {
        console.error('❌ Error creating impact_tracking table:', err);
        db.close();
        process.exit(1);
      }
      console.log('✅ impact_tracking table created successfully!');
      seedImpactData();
    });
  } else {
    seedImpactData();
  }
});
