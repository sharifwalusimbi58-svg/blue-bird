const express = require('express');
const router = express.Router();
const orderController = require('../controllers/orderController');

// POST /api/orders - Create a new order
router.post('/', orderController.createOrder);

// GET /api/orders/user - Get orders for current user
router.get('/user', orderController.getUserOrders);

// GET /api/orders/:id - Get specific order by ID
router.get('/:id', orderController.getOrderById);

module.exports = router;