// database/seedApplications.js
// Script to seed test applications into the database

const { db } = require('../config/database');

async function seedApplications() {
  // First, check if projects and users exist
  const checkProjects = () => {
    return new Promise((resolve, reject) => {
      db.get('SELECT COUNT(*) as count FROM projects', (err, row) => {
        if (err) reject(err);
        resolve(row.count);
      });
    });
  };

  const checkUsers = () => {
    return new Promise((resolve, reject) => {
      db.get('SELECT COUNT(*) as count FROM users WHERE role = "beneficiary"', (err, row) => {
        if (err) reject(err);
        resolve(row.count);
      });
    });
  };

  try {
    const projectCount = await checkProjects();
    const userCount = await checkUsers();

    if (projectCount === 0) {
      console.log('⚠️  No projects found! Please create projects first.');
      console.log('   Run: node database/seedData.js');
      return;
    }

    if (userCount === 0) {
      console.log('⚠️  No beneficiary users found! Please create users first.');
      console.log('   Run: node database/seedData.js');
      return;
    }

    console.log(`✅ Found ${projectCount} projects and ${userCount} beneficiary users`);

    // Clear existing applications (optional)
    const clearApplications = () => {
      return new Promise((resolve, reject) => {
        db.run('DELETE FROM aid_applications', (err) => {
          if (err) reject(err);
          resolve();
        });
      });
    };

    await clearApplications();
    console.log('🗑️  Cleared existing applications');

    // Insert sample applications
    const insertApplication = (app) => {
      return new Promise((resolve, reject) => {
        const query = `
          INSERT INTO aid_applications (
            project_id, beneficiary_id, application_type, description,
            amount_requested, items_requested, reason, status
          ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)
        `;

        db.run(
          query,
          [
            app.project_id,
            app.beneficiary_id,
            app.application_type,
            app.description,
            app.amount_requested,
            app.items_requested,
            app.reason,
            app.status
          ],
          function(err) {
            if (err) {
              console.error(`❌ Error inserting application: ${err.message}`);
              reject(err);
            } else {
              console.log(`✅ Created application #${this.lastID}: ${app.application_type}`);
              resolve(this.lastID);
            }
          }
        );
      });
    };

    for (const app of sampleApplications) {
      try {
        await insertApplication(app);
      } catch (err) {
        console.error(`Failed to insert application: ${err.message}`);
      }
    }

    // Display summary
    const getSummary = () => {
      return new Promise((resolve, reject) => {
        db.all(`
          SELECT 
            status,
            COUNT(*) as count
          FROM aid_applications
          GROUP BY status
        `, (err, rows) => {
          if (err) reject(err);
          resolve(rows);
        });
      });
    };

    const summary = await getSummary();
    console.log('\n📊 Application Summary:');
    summary.forEach(row => {
      console.log(`   ${row.status}: ${row.count}`);
    });

    console.log('\n✅ Seeding completed successfully!');
    console.log('\n🚀 You can now:');
    console.log('   1. Restart your backend server');
    console.log('   2. Open the Applications tab in your app');
    console.log('   3. View and manage the test applications');

  } catch (error) {
    console.error('❌ Error seeding applications:', error);
  } finally {
    db.close();
  }
}

// Run the seeding
seedApplications();
