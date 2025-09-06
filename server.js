require('dotenv').config();
const app = require('./app');
const PORT = process.env.PORT || 5999;

// Start server
app.listen(PORT, () => {
    console.log(`🚀 UGMarket server running on port ${PORT}`);
    console.log(`📊 Environment: ${process.env.NODE_ENV || 'development'}`);
    console.log(`🔗 Health check: http://localhost:${PORT}/api/health`);
});

// Graceful shutdown
process.on('SIGINT', () => {
    console.log('\n🛑 Shutting down server gracefully');
    process.exit(0);
});