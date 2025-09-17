// controllers/orderController.js
const db = require('../config/db');

// Create a new order
exports.createOrder = async (req, res) => {
  try {
    const { customer, payment, product, total } = req.body;
    
    console.log('📦 Creating order:', { customer, payment, product, total });
    
    // Validate required fields
    if (!customer || !payment || !total) {
      return res.status(400).json({ 
        error: 'Missing required fields: customer, payment, and total are required' 
      });
    }
    
    // Insert order into database
    const query = `
      INSERT INTO orders (customer_info, payment_info, product_info, total_amount, status)
      VALUES (?, ?, ?, ?, ?)
    `;
    
    const values = [
      JSON.stringify(customer),
      JSON.stringify(payment),
      JSON.stringify(product),
      total,
      'pending' // initial status
    ];
    
    db.run(query, values, function(err) {
      if (err) {
        console.error('❌ Database error:', err);
        return res.status(500).json({ error: 'Failed to create order in database' });
      }
      
      const orderId = this.lastID;
      console.log('✅ Order created with ID:', orderId);
      
      res.status(201).json({
        success: true,
        orderId: orderId,
        message: 'Order created successfully',
        order: {
          id: orderId,
          customer: customer,
          payment: payment,
          product: product,
          total: total,
          status: 'pending'
        }
      });
    });
    
  } catch (error) {
    console.error('❌ Error creating order:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Get orders for current user
exports.getUserOrders = async (req, res) => {
  try {
    // For now, return sample data - you'll need to implement user authentication
    const orders = [
      { id: 1, total: 100000, status: 'completed', date: '2023-10-01' },
      { id: 2, total: 200000, status: 'processing', date: '2023-10-02' }
    ];
    
    res.json(orders);
  } catch (error) {
    console.error('❌ Error fetching user orders:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Get specific order by ID
exports.getOrderById = async (req, res) => {
  try {
    const orderId = req.params.id;
    
    // Query database for the order
    db.get('SELECT * FROM orders WHERE id = ?', [orderId], (err, row) => {
      if (err) {
        console.error('❌ Database error:', err);
        return res.status(500).json({ error: 'Database error' });
      }
      
      if (!row) {
        return res.status(404).json({ error: 'Order not found' });
      }
      
      // Parse JSON fields
      const order = {
        id: row.id,
        customer: JSON.parse(row.customer_info),
        payment: JSON.parse(row.payment_info),
        product: JSON.parse(row.product_info),
        total: row.total_amount,
        status: row.status,
        createdAt: row.created_at
      };
      
      res.json(order);
    });
  } catch (error) {
    console.error('❌ Error fetching order:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};