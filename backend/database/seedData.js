// database/seedData.js
// Run this to add sample data: node database/seedData.js

const { db, dbPath } = require('../config/database');
const bcrypt = require('bcrypt');

console.log('🌱 Starting database seeding...');
console.log('📍 Database location:', dbPath);

async function seedDatabase() {
  try {
    // Hash passwords
    const adminPassword = await bcrypt.hash('admin123', 10);
    const donorPassword = await bcrypt.hash('donor123', 10);
    const beneficiaryPassword = await bcrypt.hash('beneficiary123', 10);

    db.serialize(() => {
      // 1. Insert Users
      const insertUsers = db.prepare(`
        INSERT INTO users (name, email, phone, password, role, location) 
        VALUES (?, ?, ?, ?, ?, ?)
      `);

      insertUsers.run('Admin User', 'admin@impacttrace.com', '+1234567890', adminPassword, 'admin', 'New York, USA');
      insertUsers.run('John Donor', 'john.donor@email.com', '+1234567891', donorPassword, 'donor', 'California, USA');
      insertUsers.run('Jane Donor', 'jane.donor@email.com', '+1234567892', donorPassword, 'donor', 'Texas, USA');
      insertUsers.run('Mary Smith', 'mary.beneficiary@email.com', '+1234567893', beneficiaryPassword, 'beneficiary', 'Kenya');
      insertUsers.run('John Beneficiary', 'john.beneficiary@email.com', '+1234567894', beneficiaryPassword, 'beneficiary', 'Uganda');
      insertUsers.finalize();

      // 2. Insert Projects (Created by Admin)
      const insertProjects = db.prepare(`
        INSERT INTO projects (title, description, category, target_amount, current_amount, location, status, start_date, end_date, created_by) 
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `);

      insertProjects.run(
        'School Supplies for Rural Areas',
        'Providing essential school supplies to children in rural communities',
        'Education',
        50000,
        15000,
        'Kenya',
        'active',
        '2025-01-01',
        '2025-12-31',
        1
      );

      insertProjects.run(
        'Medical Aid Program',
        'Emergency medical assistance for families in need',
        'Healthcare',
        75000,
        25000,
        'Uganda',
        'active',
        '2025-02-01',
        '2025-11-30',
        1
      );

      insertProjects.run(
        'Clean Water Initiative',
        'Building wells and water filtration systems in remote villages',
        'Infrastructure',
        100000,
        10000,
        'Tanzania',
        'active',
        '2025-03-01',
        '2025-12-31',
        1
      );
      insertProjects.finalize();

      // 3. Insert Aid Applications (Beneficiaries apply)
      const insertApplications = db.prepare(`
        INSERT INTO aid_applications (project_id, beneficiary_id, application_type, description, amount_requested, items_requested, reason, status, reviewed_by, review_notes, reviewed_at) 
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `);

      // Approved application
      insertApplications.run(
        1,
        4,
        'School Supplies',
        'Need school supplies for 3 children',
        500,
        'Notebooks, Pens, Backpacks',
        'My children cannot attend school without proper supplies',
        'approved',
        1,
        'Application approved. Good cause.',
        '2025-10-05 10:30:00'
      );

      // Pending application
      insertApplications.run(
        2,
        5,
        'Medical Aid',
        'Need medical assistance for surgery',
        2000,
        'Medical supplies, Surgery costs',
        'Emergency surgery needed for my mother',
        'pending',
        null,
        null,
        null
      );

      // Approved application
      insertApplications.run(
        1,
        5,
        'Education Support',
        'Need educational materials for homeschooling',
        300,
        'Books, Study materials',
        'Cannot afford educational materials',
        'approved',
        1,
        'Approved for basic materials',
        '2025-10-08 14:20:00'
      );

      // Rejected application
      insertApplications.run(
        3,
        4,
        'Water Infrastructure',
        'Need personal water filter',
        100,
        'Water filter',
        'No clean water access',
        'rejected',
        1,
        'This project is for community wells, not personal filters.',
        '2025-10-09 09:15:00'
      );
      insertApplications.finalize();

      // 4. Insert Donations (Donors donate to APPROVED applications)
      const insertDonations = db.prepare(`
        INSERT INTO donations (application_id, project_id, donor_id, item_name, quantity, amount, donation_type, notes, donation_date, status) 
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `);

      insertDonations.run(
        1,
        1,
        2,
        'School Supply Package',
        3,
        450,
        'monetary',
        'For Mary\'s children school supplies',
        '2025-10-06',
        'completed'
      );

      insertDonations.run(
        3,
        1,
        3,
        'Educational Books',
        1,
        200,
        'in-kind',
        'Books for homeschooling',
        '2025-10-09',
        'completed'
      );

      insertDonations.run(
        1,
        1,
        3,
        'Additional Supplies',
        1,
        150,
        'monetary',
        'Extra donation for school supplies',
        '2025-10-10',
        'completed'
      );
      insertDonations.finalize();

      // 5. Insert Project Updates
      const insertUpdates = db.prepare(`
        INSERT INTO project_updates (project_id, title, description, created_by) 
        VALUES (?, ?, ?, ?)
      `);

      insertUpdates.run(
        1,
        'First Batch Delivered',
        '50 children received school supplies this week!',
        1
      );

      insertUpdates.run(
        2,
        'Medical Camp Success',
        'Successfully conducted medical camp with 100+ beneficiaries',
        1
      );
      insertUpdates.finalize();

      // 6. Insert Feedback
      const insertFeedback = db.prepare(`
        INSERT INTO feedback (beneficiary_id, application_id, project_id, rating, comment) 
        VALUES (?, ?, ?, ?, ?)
      `);

      insertFeedback.run(
        4,
        1,
        1,
        5,
        'Thank you so much! My children are so happy with their new school supplies.'
      );
      insertFeedback.finalize();

      console.log('✅ Seed data inserted successfully!');
      console.log('\n📊 Sample accounts:');
      console.log('  Admin: admin@impacttrace.com / admin123');
      console.log('  Donor: john.donor@email.com / donor123');
      console.log('  Beneficiary: mary.beneficiary@email.com / beneficiary123');
      console.log('\n💡 Database seeding complete!');
    });

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

  } catch (error) {
    console.error('❌ Error seeding database:', error);
    db.close();
    process.exit(1);
  }
}

seedDatabase();
