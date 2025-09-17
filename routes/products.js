const express = require("express");
const router = express.Router();
const productController = require("../controllers/productController");
const { authenticate } = require("../middleware/auth");
const { uploadProductImages } = require("../middleware/upload"); // import multer config

// ======================
// REAL ROUTES
// ======================

// Get all products
router.get("/", productController.getAllProducts);

// Get product by ID
router.get("/:id", productController.getProductById);

// Create product (authenticated sellers only, with image upload)
router.post("/", authenticate, uploadProductImages, productController.createProduct);

// ======================
// TEMPORARY TEST ROUTES
// Uncomment if DB is not ready
/*
router.get("/", (req, res) => {
  res.json([
    { id: 1, title: "iPhone 12", price: 3200000, category: "Phones" },
    { id: 2, title: "Samsung S21", price: 2800000, category: "Phones" }
  ]);
});

router.get("/:id", (req, res) => {
  res.json({
    id: req.params.id,
    title: "Sample Product",
    price: 100000,
    description: "Product description here"
  });
});

router.post("/", (req, res) => {
  res.json({
    message: "Product created successfully!",
    product: req.body
  });
});
*/

module.exports = router;
