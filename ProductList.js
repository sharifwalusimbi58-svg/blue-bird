import React, { useState, useEffect } from 'react';
import { productsAPI } from '../services/api';

const ProductList = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({
    category: '',
    minPrice: '',
    maxPrice: '',
    condition: '',
    location: ''
  });

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async (searchQuery = '', filterParams = {}) => {
    try {
      setLoading(true);
      setError('');
      
      // Combine search and filter parameters
      const params = { ...filterParams };
      if (searchQuery) {
        params.q = searchQuery;
      }
      
      const response = await productsAPI.getAll(params);
      setProducts(response.data);
    } catch (err) {
      setError('Failed to fetch products');
      console.error('Error fetching products:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    fetchProducts(searchTerm, filters);
  };

  const handleFilterChange = (filterType, value) => {
    const newFilters = { ...filters, [filterType]: value };
    setFilters(newFilters);
    fetchProducts(searchTerm, newFilters);
  };

  const clearFilters = () => {
    setSearchTerm('');
    setFilters({
      category: '',
      minPrice: '',
      maxPrice: '',
      condition: '',
      location: ''
    });
    fetchProducts();
  };

  if (loading) return (
    <div className="loading-container">
      <div className="spinner"></div>
      <p>Loading products...</p>
    </div>
  );

  if (error) return <div className="error-message">{error}</div>;

  return (
    <div className="product-list">
      <div className="products-header">
        <h2>Featured Products</h2>
        
        {/* Search Bar */}
        <form onSubmit={handleSearch} className="search-form">
          <input
            type="text"
            placeholder="Search products..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
          <button type="submit" className="search-button">
            <i className="fas fa-search"></i>
          </button>
        </form>
      </div>

      {/* Filters */}
      <div className="filters-panel">
        <h3>Filters</h3>
        <div className="filter-group">
          <select 
            value={filters.category} 
            onChange={(e) => handleFilterChange('category', e.target.value)}
            className="filter-select"
          >
            <option value="">All Categories</option>
            <option value="electronics">Electronics</option>
            <option value="fashion">Fashion</option>
            <option value="home">Home & Garden</option>
            <option value="phones">Phones & Tablets</option>
          </select>
        </div>

        <div className="filter-group">
          <select 
            value={filters.condition} 
            onChange={(e) => handleFilterChange('condition', e.target.value)}
            className="filter-select"
          >
            <option value="">Any Condition</option>
            <option value="new">Brand New</option>
            <option value="used">Used</option>
            <option value="refurbished">Refurbished</option>
          </select>
        </div>

        <div className="filter-group">
          <select 
            value={filters.location} 
            onChange={(e) => handleFilterChange('location', e.target.value)}
            className="filter-select"
          >
            <option value="">All Locations</option>
            <option value="kampala">Kampala</option>
            <option value="entebbe">Entebbe</option>
            <option value="jinja">Jinja</option>
            <option value="mbarara">Mbarara</option>
          </select>
        </div>

        <div className="filter-group price-filter">
          <input
            type="number"
            placeholder="Min Price"
            value={filters.minPrice}
            onChange={(e) => handleFilterChange('minPrice', e.target.value)}
            className="price-input"
          />
          <span className="price-separator">-</span>
          <input
            type="number"
            placeholder="Max Price"
            value={filters.maxPrice}
            onChange={(e) => handleFilterChange('maxPrice', e.target.value)}
            className="price-input"
          />
        </div>

        <button onClick={clearFilters} className="clear-filters-btn">
          Clear Filters
        </button>
      </div>

      {/* Products Grid */}
      <div className="products-grid">
        {products.length > 0 ? (
          products.map(product => (
            <div key={product.id} className="product-card">
              <div className="product-image-container">
                <img 
                  src={product.image_url || '/placeholder-product.jpg'} 
                  alt={product.title}
                  className="product-image"
                />
                {product.condition === 'new' && (
                  <span className="product-badge new">New</span>
                )}
                {product.condition === 'refurbished' && (
                  <span className="product-badge refurbished">Refurbished</span>
                )}
              </div>
              
              <div className="product-info">
                <h3 className="product-title">{product.title}</h3>
                <p className="product-price">UGX {product.price?.toLocaleString() || '0'}</p>
                <p className="product-seller">
                  <i className="fas fa-store"></i> {product.seller_name}
                </p>
                <p className="product-location">
                  <i className="fas fa-map-marker-alt"></i> {product.location || 'Kampala'}
                </p>
                
                <div className="product-actions">
                  <button className="add-to-cart-btn">
                    <i className="fas fa-shopping-cart"></i> Add to Cart
                  </button>
                  <button className="view-details-btn">
                    Details
                  </button>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="no-products">
            <i className="fas fa-search"></i>
            <h3>No products found</h3>
            <p>Try adjusting your search or filters</p>
          </div>
        )}
      </div>

      {/* Add some CSS for the components */}
      <style jsx>{`
        .product-list {
          padding: 20px;
          max-width: 1200px;
          margin: 0 auto;
        }
        
        .products-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 20px;
          flex-wrap: wrap;
          gap: 15px;
        }
        
        .search-form {
          display: flex;
          max-width: 400px;
        }
        
        .search-input {
          flex: 1;
          padding: 10px 15px;
          border: 2px solid #ddd;
          border-radius: 4px 0 0 4px;
          font-size: 1rem;
        }
        
        .search-button {
          background: var(--primary, #FF6B01);
          color: white;
          border: none;
          padding: 0 20px;
          border-radius: 0 4px 4px 0;
          cursor: pointer;
        }
        
        .filters-panel {
          background: #f8f9fa;
          padding: 20px;
          border-radius: 8px;
          margin-bottom: 25px;
          display: flex;
          flex-wrap: wrap;
          gap: 15px;
          align-items: end;
        }
        
        .filter-group {
          display: flex;
          flex-direction: column;
        }
        
        .filter-select, .price-input {
          padding: 8px 12px;
          border: 1px solid #ddd;
          border-radius: 4px;
          min-width: 150px;
        }
        
        .price-filter {
          flex-direction: row;
          align-items: center;
        }
        
        .price-input {
          width: 100px;
        }
        
        .price-separator {
          margin: 0 10px;
        }
        
        .clear-filters-btn {
          background: none;
          border: 1px solid #ddd;
          padding: 8px 15px;
          border-radius: 4px;
          cursor: pointer;
        }
        
        .products-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
          gap: 20px;
        }
        
        .product-card {
          background: white;
          border-radius: 8px;
          overflow: hidden;
          box-shadow: 0 2px 10px rgba(0,0,0,0.1);
          transition: transform 0.2s;
        }
        
        .product-card:hover {
          transform: translateY(-5px);
        }
        
        .product-image-container {
          position: relative;
          height: 200px;
          overflow: hidden;
        }
        
        .product-image {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }
        
        .product-badge {
          position: absolute;
          top: 10px;
          left: 10px;
          padding: 5px 10px;
          border-radius: 4px;
          font-size: 0.8rem;
          font-weight: bold;
        }
        
        .product-badge.new {
          background: #28a745;
          color: white;
        }
        
        .product-badge.refurbished {
          background: #ffc107;
          color: #212529;
        }
        
        .product-info {
          padding: 15px;
        }
        
        .product-title {
          font-size: 1.1rem;
          margin: 0 0 10px 0;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
        
        .product-price {
          font-size: 1.2rem;
          font-weight: bold;
          color: var(--primary, #FF6B01);
          margin: 0 0 10px 0;
        }
        
        .product-seller, .product-location {
          font-size: 0.9rem;
          color: #6c757d;
          margin: 5px 0;
          display: flex;
          align-items: center;
          gap: 5px;
        }
        
        .product-actions {
          display: flex;
          gap: 10px;
          margin-top: 15px;
        }
        
        .add-to-cart-btn, .view-details-btn {
          flex: 1;
          padding: 10px;
          border: none;
          border-radius: 4px;
          cursor: pointer;
          font-weight: 500;
        }
        
        .add-to-cart-btn {
          background: var(--primary, #FF6B01);
          color: white;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 5px;
        }
        
        .view-details-btn {
          background: #f8f9fa;
          color: #212529;
          border: 1px solid #dee2e6;
        }
        
        .loading-container {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 40px;
        }
        
        .spinner {
          width: 40px;
          height: 40px;
          border: 4px solid #f3f3f3;
          border-top: 4px solid var(--primary, #FF6B01);
          border-radius: 50%;
          animation: spin 1s linear infinite;
          margin-bottom: 15px;
        }
        
        .error-message {
          background: #f8d7da;
          color: #721c24;
          padding: 15px;
          border-radius: 4px;
          margin: 20px;
          text-align: center;
        }
        
        .no-products {
          grid-column: 1 / -1;
          text-align: center;
          padding: 40px 20px;
          color: #6c757d;
        }
        
        .no-products i {
          font-size: 3rem;
          margin-bottom: 15px;
        }
        
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        
        @media (max-width: 768px) {
          .products-header {
            flex-direction: column;
            align-items: stretch;
          }
          
          .search-form {
            max-width: 100%;
          }
          
          .filters-panel {
            flex-direction: column;
            align-items: stretch;
          }
          
          .price-filter {
            flex-direction: column;
            align-items: stretch;
            gap: 10px;
          }
          
          .price-input {
            width: 100%;
          }
          
          .price-separator {
            display: none;
          }
        }
      `}</style>
    </div>
  );
};

export default ProductList;