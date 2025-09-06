const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');

router.get('/stats', adminController.getDashboardStats);
router.get('/pending-verifications', adminController.getPendingVerifications);
router.put('/approve-seller/:id', adminController.approveSeller);
router.get('/recent-orders', adminController.getRecentOrders);

module.exports = router;