import React, { useState, useEffect } from 'react';
import { authAPI, productsAPI } from '../services/api';

const ConnectionTest = () => {
  const [message, setMessage] = useState('Click to test connection');
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);

  const testConnection = async () => {
    setLoading(true);
    try {
      // Test backend connection
      const healthResponse = await fetch('http://localhost:5000/api/health');
      const healthData = await healthResponse.json();
      
      // Test products API
      const productsResponse = await productsAPI.getAll();
      
      setMessage(`✅ Backend: ${healthData.message}`);
      setProducts(productsResponse.data);
    } catch (error) {
      setMessage('❌ Connection failed: ' + error.message);
      console.error('Connection error:', error);
    }
    setLoading(false);
  };

  const testLogin = async () => {
    setLoading(true);
    try {
      // Test login with dummy credentials
      const response = await authAPI.login({
        email: 'test@example.com',
        password: 'test123'
      });
      
      // Save token
      localStorage.setItem('authToken', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.user));
      
      setMessage('✅ Login test successful! Token saved.');
    } catch (error) {
      setMessage('⚠️ Login test failed (expected for now): ' + error.response?.data?.error);
    }
    setLoading(false);
  };

  return (
    <div style={{ 
      padding: '20px', 
      border: '2px solid #4CAF50', 
      borderRadius: '10px', 
      margin: '20px',
      textAlign: 'center'
    }}>
      <h3>🔗 Backend Connection Tester</h3>
      
      <p>{message}</p>
      
      <div style={{ margin: '15px 0' }}>
        <button 
          onClick={testConnection} 
          disabled={loading}
          style={{
            padding: '10px 20px',
            backgroundColor: '#4CAF50',
            color: 'white',
            border: 'none',
            borderRadius: '5px',
            margin: '5px',
            cursor: 'pointer'
          }}
        >
          {loading ? 'Testing...' : 'Test Connection'}
        </button>
        
        <button 
          onClick={testLogin} 
          disabled={loading}
          style={{
            padding: '10px 20px',
            backgroundColor: '#2196F3',
            color: 'white',
            border: 'none',
            borderRadius: '5px',
            margin: '5px',
            cursor: 'pointer'
          }}
        >
          Test Login
        </button>
      </div>

      {products.length > 0 && (
        <div>
          <h4>📦 Products from Backend:</h4>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
            {products.map(product => (
              <div key={product.id} style={{
                border: '1px solid #ddd',
                padding: '10px',
                borderRadius: '5px',
                width: '200px'
              }}>
                <strong>{product.title}</strong>
                <p>UGX {product.price?.toLocaleString()}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ConnectionTest;