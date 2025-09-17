const db = require('../config/database');// adjust if your DB connection is in another path

// ==============================
// GET all products
// ==============================
exports.getAllProducts = (req, res, next) => {
  try {
    const { category, condition, location, minPrice, maxPrice, q } = req.query;
    
    let query = "SELECT * FROM products WHERE 1=1";
    const params = [];
    
    // Add filters based on query parameters
    if (category) {
      query += " AND category = ?";
      params.push(category);
    }
    
    if (condition) {
      query += " AND condition = ?";
      params.push(condition);
    }
    
    if (location) {
      query += " AND location LIKE ?";
      params.push(`%${location}%`);
    }
    
    if (minPrice) {
      query += " AND price >= ?";
      params.push(minPrice);
    }
    
    if (maxPrice) {
      query += " AND price <= ?";
      params.push(maxPrice);
    }
    
    if (q) {
      query += " AND (title LIKE ? OR description LIKE ?)";
      params.push(`%${q}%`, `%${q}%`);
    }
    
    query += " ORDER BY created_at DESC";
    
    db.all(query, params, (err, rows) => {
      if (err) {
        console.error("❌ Error fetching products:", err.message);
        return next(err);
      }
      res.json(rows);
    });
  } catch (error) {
    console.error("❌ Error in getAllProducts:", error.message);
    next(error);
  }
};

// ==============================
// GET product by ID
// ==============================
exports.getProductById = (req, res, next) => {
  try {
    db.get("SELECT * FROM products WHERE id = ?", [req.params.id], (err, row) => {
      if (err) {
        console.error("❌ Error fetching product:", err.message);
        return next(err);
      }
      
      if (!row) {
        return res.status(404).json({ error: "Product not found" });
      }
      
      res.json(row);
    });
  } catch (error) {
    console.error("❌ Error in getProductById:", error.message);
    next(error);
  }
};

// ==============================
// CREATE product (sellers only)
// ==============================
exports.createProduct = (req, res, next) => {
  try {
    // For now, let's skip authentication check until you implement it
    // if (req.user.role !== "seller") {
    //   return res.status(403).json({ error: "Only sellers can create products" });
    // }

    const {
      title,
      category,
      condition,
      description,
      price,
      stock,
      sku,
      weight,
      shipping_method,
      shipping_location,
      seller_name,
      location
    } = req.body;

    if (!title || !price || !category) {
      return res.status(400).json({ error: "Title, price, and category are required" });
    }

    // For now, let's handle image URLs as strings until you implement file uploads
    const image_url = req.body.image_url || "https://via.placeholder.com/300x200?text=Product+Image";

    // Insert product into DB
    const query = `
      INSERT INTO products
      (title, category, condition, description, price, stock, sku, weight, shipping_method, shipping_location, image_url, seller_name, location)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    const values = [
      title,
      category,
      condition || "new",
      description || "",
      price,
      stock || 1,
      sku || "",
      weight || 0,
      shipping_method || "Standard",
      shipping_location || "Kampala",
      image_url,
      seller_name || "Unknown Seller",
      location || "Kampala"
    ];

    db.run(query, values, function(err) {
      if (err) {
        console.error("❌ Error creating product:", err.message);
        return next(err);
      }
      
      // Get the newly created product
      db.get("SELECT * FROM products WHERE id = ?", [this.lastID], (err, row) => {
        if (err) {
          console.error("❌ Error fetching created product:", err.message);
          return next(err);
        }
        
        res.status(201).json({
          message: "✅ Product created successfully",
          product: row
        });
      });
    });
  } catch (error) {
    console.error("❌ Error in createProduct:", error.message);
    next(error);
  }
};

// ==============================
// UPDATE product
// ==============================
exports.updateProduct = (req, res, next) => {
  try {
    const { id } = req.params;
    const {
      title,
      category,
      condition,
      description,
      price,
      stock,
      sku,
      weight,
      shipping_method,
      shipping_location,
      image_url
    } = req.body;

    const query = `
      UPDATE products 
      SET title = ?, category = ?, condition = ?, description = ?, price = ?, stock = ?, 
          sku = ?, weight = ?, shipping_method = ?, shipping_location = ?, image_url = ?
      WHERE id = ?
    `;

    const values = [
      title,
      category,
      condition,
      description,
      price,
      stock,
      sku,
      weight,
      shipping_method,
      shipping_location,
      image_url,
      id
    ];

    db.run(query, values, function(err) {
      if (err) {
        console.error("❌ Error updating product:", err.message);
        return next(err);
      }
      
      if (this.changes === 0) {
        return res.status(404).json({ error: "Product not found" });
      }
      
      res.json({
        message: "✅ Product updated successfully",
        changes: this.changes
      });
    });
  } catch (error) {
    console.error("❌ Error in updateProduct:", error.message);
    next(error);
  }
};

// ==============================
// DELETE product
// ==============================
exports.deleteProduct = (req, res, next) => {
  try {
    const { id } = req.params;

    db.run("DELETE FROM products WHERE id = ?", [id], function(err) {
      if (err) {
        console.error("❌ Error deleting product:", err.message);
        return next(err);
      }
      
      if (this.changes === 0) {
        return res.status(404).json({ error: "Product not found" });
      }
      
      res.json({
        message: "✅ Product deleted successfully",
        changes: this.changes
      });
    });
  } catch (error) {
    console.error("❌ Error in deleteProduct:", error.message);
    next(error);
  }
};

// ==============================
// SEARCH products
// ==============================
exports.searchProducts = (req, res, next) => {
  try {
    const { q } = req.query;
    
    if (!q) {
      return res.status(400).json({ error: "Search query is required" });
    }
    
    const query = `
      SELECT * FROM products 
      WHERE title LIKE ? OR description LIKE ? OR category LIKE ?
      ORDER BY created_at DESC
    `;
    
    const searchTerm = `%${q}%`;
    
    db.all(query, [searchTerm, searchTerm, searchTerm], (err, rows) => {
      if (err) {
        console.error("❌ Error searching products:", err.message);
        return next(err);
      }
      
      res.json(rows);
    });
  } catch (error) {
    console.error("❌ Error in searchProducts:", error.message);
    next(error);
  }
};