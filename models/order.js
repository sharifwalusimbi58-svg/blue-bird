const db = require('../config/database');

class Order {
  static async create(orderData) {
    // Basic implementation - you'll need to expand this
    const query = 'INSERT INTO orders (buyer_id, total_amount) VALUES ($1, $2) RETURNING *';
    const values = [orderData.buyer_id, orderData.total_amount];
    const result = await db.query(query, values);
    return result.rows[0];
  }

  static async countDocuments() {
    const result = await db.query('SELECT COUNT(*) FROM orders');
    return parseInt(result.rows[0].count);
  }

  static async getTotalRevenue() {
  const result = await db.query(`SELECT COALESCE(SUM(total_amount), 0) as revenue FROM orders WHERE payment_status = 'completed'`);
  return parseFloat(result.rows[0].revenue);
}
}

module.exports = Order;