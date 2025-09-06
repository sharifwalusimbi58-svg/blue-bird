const express = require('express');
const router = express.Router();
const orderController = require('../controllers/orderController');

router.post('/', orderController.createOrder);
router.get('/user', orderController.getUserOrders);
router.get('/:id', orderController.getOrderById);

router.post('/', (req, res) => {
  res.json({ message: 'Order created!', data: req.body });
});

router.get('/user', (req, res) => {
  res.json([{ id: 1, total: 100000 }, { id: 2, total: 200000 }]);
});

router.get('/:id', (req, res) => {
  res.json({ id: req.params.id, total: 100000, status: 'completed' });
});

module.exports = router;




module.exports = router;  // ← MUST BE THIS LINE!