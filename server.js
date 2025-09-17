require('dotenv').config();
const express = require('express');
const cors = require('cors'); // Add this line
const app = require('./app');
const PORT = process.env.PORT || 5999;

// Add CORS middleware before your routes
app.use(cors({
  origin: ['http://localhost', 'http://127.0.0.1', 'http://localhost:3000', 'http://127.0.0.1:3000'],
  credentials: true
}));

// If you don't want to install the cors package, use this manual CORS setup:
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
  
  // Handle preflight requests
  if (req.method === 'OPTIONS') {
    return res.sendStatus(200);
  }
  
  next();
});

// Start server
app.listen(PORT, () => {
    console.log(`🚀 UGMarket server running on port ${PORT}`);
    console.log(`📊 Environment: ${process.env.NODE_ENV || 'development'}`);
    console.log(`🔗 Health check: http://localhost:${PORT}/api/health`);
    console.log('✅ CORS enabled for frontend connections');
});

// Graceful shutdown
process.on('SIGINT', () => {
    console.log('\n🛑 Shutting down server gracefully');
    process.exit(0);
});

// In your server.js or database setup file
db.run(`CREATE TABLE IF NOT EXISTS orders (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  customer_info TEXT NOT NULL,
  payment_info TEXT NOT NULL,
  product_info TEXT NOT NULL,
  total_amount REAL NOT NULL,
  status TEXT DEFAULT 'pending',
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
)`);