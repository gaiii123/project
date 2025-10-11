// database/setupDatabase.js
// Run this script manually to initialize the database: node database/setupDatabase.js

const { db, initDatabase, dbPath } = require('../config/database');

console.log('🔧 Starting database setup...');
console.log('📍 Database location:', dbPath);

initDatabase()
  .then(() => {
    console.log('✅ Database setup completed successfully!');
    console.log('\n📊 Database structure:');
    
    // Show all tables
    db.all(
      "SELECT name FROM sqlite_master WHERE type='table' ORDER BY name",
      (err, tables) => {
        if (err) {
          console.error('Error listing tables:', err);
        } else {
          console.log('\nTables created:');
          tables.forEach(table => {
            console.log(`  ✓ ${table.name}`);
          });
        }
        
        // Close database connection
        db.close((err) => {
          if (err) {
            console.error('Error closing database:', err);
          } else {
            console.log('\n✅ Database connection closed.');
            console.log('\n🚀 You can now start your server!');
          }
        });
      }
    );
  })
  .catch(err => {
    console.error('❌ Database setup failed:', err);
    db.close();
    process.exit(1);
  });
