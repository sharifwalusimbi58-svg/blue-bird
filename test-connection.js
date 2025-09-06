import React, { useState } from 'react';
import { testConnection } from '../services/api';

const TestConnection = () => {
  const [message, setMessage] = useState('Click the button to test!');
  const [loading, setLoading] = useState(false);

  const handleTest = async () => {
    setLoading(true);
    setMessage('Testing...');
    
    try {
      const result = await testConnection();
      setMessage(`✅ Success: ${result.message}`);
    } catch (error) {
      setMessage('❌ Failed to connect to backend');
    }
    
    setLoading(false);
  };

  return (
    <div style={{ 
      padding: '20px', 
      border: '2px solid #ccc', 
      borderRadius: '10px',
      margin: '20px',
      textAlign: 'center'
    }}>
      <h3>🔗 Backend Connection Test</h3>
      <p>{message}</p>
      <button 
        onClick={handleTest} 
        disabled={loading}
        style={{
          padding: '10px 20px',
          backgroundColor: '#007bff',
          color: 'white',
          border: 'none',
          borderRadius: '5px',
          cursor: 'pointer'
        }}
      >
        {loading ? 'Testing...' : 'Test Connection'}
      </button>
    </div>
  );
};

export default TestConnection;