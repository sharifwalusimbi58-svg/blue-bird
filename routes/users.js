const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');

router.put('/profile', userController.updateProfile);
router.put('/password', userController.changePassword);
router.get('/seller/:id', userController.getSellerProfile);


// Simple routes without controllers
router.put('/profile', (req, res) => {
  res.json({ message: 'Profile updated!', data: req.body });
});

router.put('/password', (req, res) => {
  res.json({ message: 'Password changed!' });
});

router.get('/seller/:id', (req, res) => {
  res.json({
    id: req.params.id,
    name: 'Test Seller',
    business_name: 'Test Business'
  });
});

module.exports = router;




module.exports = router;  // ← MUST BE THIS LINE!