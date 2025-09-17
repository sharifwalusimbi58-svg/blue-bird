const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const path = require('path');

// Import routes
const authRoutes = require('./routes/auth');
const productRoutes = require('./routes/products');
const userRoutes = require('./routes/users');
const orderRoutes = require('./routes/orders');



// Import middleware
const errorHandler = require('./middleware/errorHandler');

const app = express();

// Serve static files from the 'public' directory
app.use(express.static(path.join(__dirname, 'public')));


// Middleware
app.use(helmet());
app.use(cors());
app.use(morgan('combined'));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Serve uploaded files
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/users', userRoutes);
app.use('/api/orders', orderRoutes);

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    message: 'UGMarket API is running',
    timestamp: new Date().toISOString()
  });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({ error: 'Endpoint not found' });
});

// Simple test route to check database
app.get('/api/test-db', async (req, res) => {
    try {
        const result = await db.query('SELECT 1 as test');
        res.json({ 
            success: true, 
            message: 'Database connection working!',
            data: result.rows 
        });
    } catch (error) {
        res.status(500).json({ 
            success: false, 
            message: 'Database error',
            error: error.message 
        });
    }
});


// Error handler
app.use(errorHandler);

module.exports = app;

// ... other imports and middleware ...

// Routes - COMMENT OUT ALL FIRST
// app.use('/api/auth', authRoutes);
// app.use('/api/products', productRoutes);
// app.use('/api/users', userRoutes);
// app.use('/api/orders', orderRoutes);

// Then test one route at a time:
app.use('/api/auth', authRoutes);  // ← Uncomment this first and test
// app.use('/api/products', productRoutes);
// app.use('/api/users', userRoutes);
// app.use('/api/orders', orderRoutes);

// ... rest of your code ...

