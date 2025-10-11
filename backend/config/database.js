// config/database.js
const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const fs = require('fs');

// Ensure database directory exists
const dbDir = path.join(__dirname, '..', 'database');
if (!fs.existsSync(dbDir)) {
  fs.mkdirSync(dbDir, { recursive: true });
}

// Database file path
const dbPath = path.join(dbDir, 'impacttrace.db');

// Create database connection
const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error('Error opening database:', err.message);
  } else {
    console.log('Connected to SQLite database.');
    console.log('Database location:', dbPath);
  }
});

// Enable foreign keys
db.run('PRAGMA foreign_keys = ON');

// Check if database is already initialized
const isDatabaseInitialized = () => {
  return new Promise((resolve, reject) => {
    db.get(
      "SELECT name FROM sqlite_master WHERE type='table' AND name='users'",
      (err, row) => {
        if (err) reject(err);
        resolve(!!row);
      }
    );
  });
};

// Initialize database tables (runs only once)
const initDatabase = async () => {
  try {
    const isInitialized = await isDatabaseInitialized();
    
    if (isInitialized) {
      console.log('Database already initialized. Skipping table creation.');
      return;
    }

    console.log('Initializing database tables for the first time...');

    return new Promise((resolve, reject) => {
      db.serialize(() => {
        // Users table (All user types: admin, donor, beneficiary)
        db.run(`
          CREATE TABLE users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            email TEXT UNIQUE NOT NULL,
            phone TEXT,
            password TEXT NOT NULL,
            role TEXT NOT NULL CHECK(role IN ('admin', 'donor', 'beneficiary')),
            location TEXT,
            profile_image TEXT,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
          )
        `);

        // Projects table (Created by Admin)
        db.run(`
          CREATE TABLE projects (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            title TEXT NOT NULL,
            description TEXT NOT NULL,
            category TEXT NOT NULL,
            target_amount REAL NOT NULL,
            current_amount REAL DEFAULT 0,
            location TEXT,
            status TEXT DEFAULT 'active' CHECK(status IN ('active', 'completed', 'archived')),
            image_url TEXT,
            start_date DATE,
            end_date DATE,
            created_by INTEGER NOT NULL,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE CASCADE
          )
        `);

        // Aid Applications table (Beneficiaries apply for Projects)
        db.run(`
          CREATE TABLE aid_applications (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            project_id INTEGER NOT NULL,
            beneficiary_id INTEGER NOT NULL,
            application_type TEXT NOT NULL,
            description TEXT NOT NULL,
            amount_requested REAL,
            items_requested TEXT,
            reason TEXT,
            voice_recording_url TEXT,
            documents TEXT,
            status TEXT DEFAULT 'pending' CHECK(status IN ('pending', 'approved', 'rejected', 'under_review')),
            reviewed_by INTEGER,
            review_notes TEXT,
            reviewed_at DATETIME,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE CASCADE,
            FOREIGN KEY (beneficiary_id) REFERENCES users(id) ON DELETE CASCADE,
            FOREIGN KEY (reviewed_by) REFERENCES users(id) ON DELETE SET NULL
          )
        `);

        // Donations table (Donors donate to APPROVED Applications)
        db.run(`
          CREATE TABLE donations (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            application_id INTEGER NOT NULL,
            project_id INTEGER NOT NULL,
            donor_id INTEGER NOT NULL,
            item_name TEXT NOT NULL,
            quantity INTEGER DEFAULT 1,
            amount REAL NOT NULL,
            donation_type TEXT DEFAULT 'monetary' CHECK(donation_type IN ('monetary', 'in-kind')),
            photo_url TEXT,
            notes TEXT,
            donation_date DATE NOT NULL,
            status TEXT DEFAULT 'completed' CHECK(status IN ('completed', 'pending', 'cancelled')),
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (application_id) REFERENCES aid_applications(id) ON DELETE CASCADE,
            FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE CASCADE,
            FOREIGN KEY (donor_id) REFERENCES users(id) ON DELETE CASCADE
          )
        `);

        // Feedback table (Beneficiaries give feedback)
        db.run(`
          CREATE TABLE feedback (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            beneficiary_id INTEGER NOT NULL,
            application_id INTEGER,
            project_id INTEGER,
            rating INTEGER CHECK(rating >= 1 AND rating <= 5),
            comment TEXT,
            voice_feedback_url TEXT,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (beneficiary_id) REFERENCES users(id) ON DELETE CASCADE,
            FOREIGN KEY (application_id) REFERENCES aid_applications(id) ON DELETE SET NULL,
            FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE SET NULL
          )
        `);

        // Project Updates table (Admin posts updates)
        db.run(`
          CREATE TABLE project_updates (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            project_id INTEGER NOT NULL,
            title TEXT NOT NULL,
            description TEXT NOT NULL,
            image_url TEXT,
            created_by INTEGER NOT NULL,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE CASCADE,
            FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE CASCADE
          )
        `);

        // Reports table (Generated by Admin)
        db.run(`
          CREATE TABLE reports (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            report_type TEXT NOT NULL CHECK(report_type IN ('donation', 'project', 'beneficiary', 'impact', 'application')),
            title TEXT NOT NULL,
            filters TEXT,
            pdf_url TEXT,
            generated_by INTEGER NOT NULL,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (generated_by) REFERENCES users(id) ON DELETE CASCADE
          )
        `);

        // Create indexes for performance
        db.run('CREATE INDEX idx_donations_application ON donations(application_id)');
        db.run('CREATE INDEX idx_donations_donor ON donations(donor_id)');
        db.run('CREATE INDEX idx_donations_project ON donations(project_id)');
        db.run('CREATE INDEX idx_applications_beneficiary ON aid_applications(beneficiary_id)');
        db.run('CREATE INDEX idx_applications_project ON aid_applications(project_id)');
        db.run('CREATE INDEX idx_applications_status ON aid_applications(status)');
        db.run('CREATE INDEX idx_projects_status ON projects(status)');
        db.run('CREATE INDEX idx_users_role ON users(role)');

        console.log('✅ Database tables created successfully!');
        resolve();
      });
    });
  } catch (error) {
    console.error('Error initializing database:', error);
    throw error;
  }
};

module.exports = {
  db,
  initDatabase,
  dbPath
};