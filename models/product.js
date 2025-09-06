const db = require('../config/database');

class Product {
  static async create(productData) {
    const { seller_id, title, description, price, category_id, condition, weight_kg, sku, stock_quantity } = productData;
    const query = `
      INSERT INTO products (seller_id, title, description, price, category_id, condition, weight_kg, sku, stock_quantity)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
      RETURNING *
    `;
    const values = [seller_id, title, description, price, category_id, condition, weight_kg, sku, stock_quantity];
    const result = await db.query(query, values);
    return result.rows[0];
  }

  static async findAll(filters = {}) {
    let query = 'SELECT * FROM products WHERE is_active = true AND status = $1';
    let values = ['published'];
    let paramCount = 2;

    if (filters.category_id) {
      query += ` AND category_id = $${paramCount++}`;
      values.push(filters.category_id);
    }

    if (filters.seller_id) {
      query += ` AND seller_id = $${paramCount++}`;
      values.push(filters.seller_id);
    }

    query += ' ORDER BY created_at DESC';
    
    const result = await db.query(query, values);
    return result.rows;
  }

  static async findById(id) {
    const query = 'SELECT * FROM products WHERE id = $1';
    const result = await db.query(query, [id]);
    return result.rows[0];
  }

  static async updateStock(id, quantity) {
    const query = 'UPDATE products SET stock_quantity = stock_quantity - $1 WHERE id = $2 RETURNING *';
    const result = await db.query(query, [quantity, id]);
    return result.rows[0];
  }

  // Add this method for admin controller
  static async countDocuments() {
    const result = await db.query('SELECT COUNT(*) FROM products');
    return parseInt(result.rows[0].count);
  }
}

module.exports = Product;