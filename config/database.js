const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const fs = require('fs');

// Create database file path
const dbPath = path.join(__dirname, '../ugmarket.db');

// Create database directory if it doesn't exist
const dbDir = path.dirname(dbPath);
if (!fs.existsSync(dbDir)) {
    fs.mkdirSync(dbDir, { recursive: true });
}

// Create database connection
const db = new sqlite3.Database(dbPath, (err) => {
    if (err) {
        console.error('❌ Error connecting to SQLite database:', err.message);
    } else {
        console.log('✅ Connected to SQLite database');
    }
});

// Enable foreign keys
db.run('PRAGMA foreign_keys = ON');

// Create a promise-based query method
const query = (text, params = []) => {
    return new Promise((resolve, reject) => {
        if (text.trim().toLowerCase().startsWith('select')) {
            db.all(text, params, (err, rows) => {
                if (err) reject(err);
                else resolve({ rows });
            });
        } else {
            db.run(text, params, function(err) {
                if (err) reject(err);
                else resolve({ 
                    rows: [], 
                    rowCount: this.changes,
                    lastID: this.lastID 
                });
            });
        }
    });
};

// Test the connection
db.serialize(() => {
    console.log('📊 SQLite database ready');
});

module.exports = {
    query,
    db
};