import React from 'react'
import { useLocation } from 'react-router-dom'

const ErrorPageForUpload = () => {
  const location = useLocation();
  const result = location.state?.data;
  if (!result) return null;

  const { status, data, messages } = result;

  console.log(messages);

  return (
    <div style={{ padding: '20px', maxWidth: '800px', margin: '0 auto' }}>
      <div style={{ 
        backgroundColor: '#fff4f4', 
        padding: '20px',
        borderRadius: '8px',
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
      }}>
        <h2 style={{ color: '#d32f2f', marginBottom: '20px' }}>Upload Status</h2>
        
        <div style={{ marginBottom: '20px' }}>
          <p>Total Processed: {data.totalProcessed}</p>
          <p>Success Count: {data.successCount}</p>
          <p>Failure Count: {data.failureCount}</p>
        </div>

        {/* <div style={{ marginBottom: '20px' }}>
          <h3 style={{ color: '#666' }}>Failed Items:</h3>
          <ul style={{ 
            listStyle: 'none', 
            padding: '0',
            margin: '10px 0',
            borderTop: '1px solid #eee'
          }}>
            {data.failedItems.size()>0 && data.failedItems.map((item, index) => (
              <li key={index} style={{ 
                padding: '10px 0',
                borderBottom: '1px solid #eee'
              }}>
                {item}
              </li>
            ))}
          </ul>
        </div> */}

        <div>
          <h3 style={{ color: '#666' }}>Messages:</h3>
          <ul style={{ 
            listStyle: 'none', 
            padding: '0',
            margin: '10px 0',
            borderTop: '1px solid #eee'
          }}>
            {messages!=null && messages.map((msg, index) => (
              <li key={index} style={{ 
                padding: '10px 0',
                borderBottom: '1px solid #eee',
                color: '#d32f2f'
              }}>
                {msg.message}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default ErrorPageForUpload