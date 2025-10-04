// config/database.js
const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const fs = require('fs');

// Ensure database directory exists
const dbDir = path.join(__dirname, '..', 'database');
if (!fs.existsSync(dbDir)) {
  fs.mkdirSync(dbDir, { recursive: true });
}

// Database file will be created automatically here
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

// Initialize database tables
const initDatabase = () => {
  const initSQL = `
    -- Beneficiaries table
    CREATE TABLE IF NOT EXISTS beneficiaries (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      email TEXT UNIQUE NOT NULL,
      phone TEXT,
      address TEXT,
      needs_description TEXT,
      status TEXT DEFAULT 'pending',
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    -- Donations table
    CREATE TABLE IF NOT EXISTS donations (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      donor_name TEXT NOT NULL,
      donor_email TEXT NOT NULL,
      amount REAL NOT NULL,
      currency TEXT DEFAULT 'USD',
      purpose TEXT,
      status TEXT DEFAULT 'pending',
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    -- Projects table
    CREATE TABLE IF NOT EXISTS projects (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      description TEXT,
      target_amount REAL NOT NULL,
      collected_amount REAL DEFAULT 0,
      status TEXT DEFAULT 'active',
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    -- Impact tracking table
    CREATE TABLE IF NOT EXISTS impact_tracking (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      project_id INTEGER,
      beneficiary_id INTEGER,
      donation_id INTEGER,
      impact_description TEXT,
      amount_used REAL,
      status_update TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (project_id) REFERENCES projects (id) ON DELETE SET NULL,
      FOREIGN KEY (beneficiary_id) REFERENCES beneficiaries (id) ON DELETE SET NULL,
      FOREIGN KEY (donation_id) REFERENCES donations (id) ON DELETE SET NULL
    );

    -- Insert sample data
    INSERT OR IGNORE INTO projects (name, description, target_amount) VALUES 
    ('Education for Children', 'Provide school supplies and tuition for underprivileged children', 50000.00),
    ('Healthcare Initiative', 'Medical camps and healthcare services for rural areas', 75000.00),
    ('Food Distribution', 'Weekly food distribution to families in need', 25000.00);

    INSERT OR IGNORE INTO beneficiaries (name, email, phone, address, needs_description) VALUES 
    ('John Smith', 'john@example.com', '+1234567890', '123 Main St, City', 'Need educational support for two children'),
    ('Maria Garcia', 'maria@example.com', '+0987654321', '456 Oak Ave, Town', 'Medical assistance for chronic condition');
  `;

  db.exec(initSQL, (err) => {
    if (err) {
      console.error('Error initializing database:', err.message);
    } else {
      console.log('Database tables initialized successfully.');
    }
  });
};

module.exports = {
  db,
  initDatabase
};