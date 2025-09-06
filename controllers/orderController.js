const Order = require('../models/Order');
const Product = require('../models/Product');

const createOrder = async (req, res, next) => {
  try {
    const { items, shipping_address, payment_method } = req.body;
    
    // Calculate totals
    let subtotal = 0;
    const orderItems = [];
    
    for (const item of items) {
      const product = await Product.findById(item.product_id);
      if (!product) {
        return res.status(404).json({ error: `Product ${item.product_id} not found` });
      }
      
      if (product.stock_quantity < item.quantity) {
        return res.status(400).json({ error: `Insufficient stock for ${product.title}` });
      }
      
      const itemTotal = product.price * item.quantity;
      subtotal += itemTotal;
      
      orderItems.push({
        product_id: product.id,
        product_name: product.title,
        quantity: item.quantity,
        unit_price: product.price,
        subtotal: itemTotal
      });
    }
    
    // Calculate commission (10%)
    const commission = subtotal * 0.1;
    const shipping_cost = 15000; // UGX 15,000 fixed shipping
    const total_amount = subtotal + shipping_cost;
    const seller_earnings = subtotal - commission;
    
    // Create order
    const order = await Order.create({
      buyer_id: req.user.id,
      items: orderItems,
      subtotal_amount: subtotal,
      shipping_amount: shipping_cost,
      commission: commission,
      seller_earnings: seller_earnings,
      total_amount: total_amount,
      shipping_address: shipping_address,
      payment_method: payment_method
    });
    
    // Update product stock
    for (const item of items) {
      await Product.updateStock(item.product_id, item.quantity);
    }
    
    res.status(201).json({
      message: 'Order created successfully',
      order: order
    });
    
  } catch (error) {
    next(error);
  }
};

const getUserOrders = async (req, res, next) => {
  try {
    const orders = await Order.findByUserId(req.user.id);
    res.json(orders);
  } catch (error) {
    next(error);
  }
};

const getOrderById = async (req, res, next) => {
  try {
    const order = await Order.findById(req.params.id);
    
    // Check if user owns this order or is admin
    if (order.buyer_id !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Access denied' });
    }
    
    res.json(order);
  } catch (error) {
    next(error);
  }
};


module.exports = {
  createOrder,
  getUserOrders,
  getOrderById
};

