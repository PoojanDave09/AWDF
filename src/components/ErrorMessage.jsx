import React from 'react';

function ErrorMessage({ message, onRetry }) {
  return (
    <div style={{ color: 'red', textAlign: 'center', padding: '20px' }}>
      <p>Error: {message}</p>
      {onRetry && (
        <button onClick={onRetry} style={{ marginTop: '10px' }}>
          Retry
        </button>
      )}
    </div>
  );
}

export default ErrorMessage;
