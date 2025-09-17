const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'ugmarket',
  password: 'your_password',
  port: 5432,
});

async function testConnection() {
  try {
    const client = await pool.connect();
    console.log('✅ Connected to PostgreSQL database');
    
    const result = await client.query('SELECT COUNT(*) FROM users');
    console.log(`📊 Users table has ${result.rows[0].count} records`);
    
    client.release();
  } catch (error) {
    console.error('❌ Connection error:', error.message);
  }
}

testConnection();