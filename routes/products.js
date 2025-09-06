const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');
const { authenticate } = require('../middleware/auth');  // ← ADD THIS LINE!

router.get('/', productController.getAllProducts);
router.get('/:id', productController.getProductById);
router.post('/', productController.createProduct);

module.exports = router;  // ← MUST BE THIS LINE!
// Get all products
router.get('/', async (req, res, next) => {
  try {
    const products = await Product.findAll(req.query);
    res.json(products);
  } catch (error) {
    next(error);
  }
});

// Get single product
router.get('/:id', async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }
    res.json(product);
  } catch (error) {
    next(error);
  }
});

// Create product (authenticated sellers only)
router.post('/', authenticate, async (req, res, next) => {
  try {
    if (req.user.role !== 'seller') {
      return res.status(403).json({ error: 'Only sellers can create products' });
    }

    const productData = {
      ...req.body,
      seller_id: req.user.id
    };

    const product = await Product.create(productData);
    res.status(201).json(product);
  } catch (error) {
    next(error);
  }
});


// Simple routes for testing - remove auth temporarily
router.get('/', (req, res) => {
  res.json([
    { id: 1, title: 'iPhone 12', price: 3200000, category: 'Phones' },
    { id: 2, title: 'Samsung S21', price: 2800000, category: 'Phones' }
  ]);
});

router.get('/:id', (req, res) => {
  res.json({
    id: req.params.id,
    title: 'Sample Product',
    price: 100000,
    description: 'Product description here'
  });
});

router.post('/', (req, res) => {
  res.json({
    message: 'Product created successfully!',
    product: req.body
  });
});

module.exports = router;

module.exports = router;