const User = require('../models/User');
const Product = require('../models/Product');
const Order = require('../models/Order');

// Dashboard stats
const getDashboardStats = async (req, res, next) => {
  try {
    // Use the new countDocuments method we added
    const totalUsers = await User.countDocuments();
    const totalProducts = await Product.countDocuments();
    const totalOrders = await Order.countDocuments();
    const totalRevenue = await Order.getTotalRevenue();

    res.json({
      total_users: totalUsers,
      total_products: totalProducts,
      total_orders: totalOrders,
      total_revenue: totalRevenue
    });
  } catch (error) {
    next(error);
  }
};

// Get pending seller verifications
const getPendingVerifications = async (req, res, next) => {
  try {
    const users = await User.find({ status: 'pending_verification' });
    res.json(users);
  } catch (error) {
    next(error);
  }
};

// Approve seller
const approveSeller = async (req, res, next) => {
  try {
    const user = await User.findByIdAndUpdate(
      req.params.id,
      { isVerified: true, status: 'active' },
      { new: true }
    );
    
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json({ message: 'Seller approved successfully', user });
  } catch (error) {
    next(error);
  }
};

// Get recent orders - ADD THIS MISSING FUNCTION!
const getRecentOrders = async (req, res, next) => {
  try {
    const orders = await Order.find()
      .sort({ createdAt: -1 })
      .limit(10);
    res.json(orders);
  } catch (error) {
    next(error);
  }
};

// Make sure to export ALL functions
module.exports = {
  getDashboardStats,
  getPendingVerifications,
  approveSeller,
  getRecentOrders  // ← This was missing!
};