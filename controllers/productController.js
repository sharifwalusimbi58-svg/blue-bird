// Simple product controller for now
const getAllProducts = async (req, res) => {
  try {
    // For now, return mock data - we'll connect to database later
    const products = [
      {
        id: 1,
        title: 'iPhone 12 Pro Max',
        price: 3200000,
        description: 'Brand new iPhone',
        category: 'Phones',
        stock_quantity: 5
      },
      {
        id: 2,
        title: 'Samsung Galaxy S21',
        price: 2800000,
        description: 'Latest Samsung phone',
        category: 'Phones', 
        stock_quantity: 3
      }
    ];
    
    res.json(products);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getProductById = async (req, res) => {
  try {
    const product = {
      id: req.params.id,
      title: 'Sample Product',
      price: 100000,
      description: 'This is a sample product',
      category: 'Testing',
      stock_quantity: 10
    };
    
    res.json(product);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const createProduct = async (req, res) => {
  try {
    res.json({
      message: 'Product created successfully!',
      product: req.body
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Make sure to export ALL functions
module.exports = {
  getAllProducts,
  getProductById, 
  createProduct
};