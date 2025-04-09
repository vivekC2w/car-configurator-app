import React from 'react';

const LoadingSpinner = ({ 
  size = '50px',
  color = '#3498db',
  thickness = '5px',
  fullHeight = false,
  className = '',
  message = ''
}) => {
  const containerStyle = {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: fullHeight ? '100vh' : 'auto',
    padding: fullHeight ? '0' : '2rem',
  };

  const contentStyle = {
    textAlign: 'center',
  };

  const spinnerStyle = {
    width: size,
    height: size,
    border: `${thickness} solid #f3f3f3`,
    borderTop: `${thickness} solid ${color}`,
    borderRadius: '50%',
    animation: 'spin 1s linear infinite',
    margin: '0 auto',
  };

  const messageStyle = {
    color: color,
    marginTop: '1rem',
    fontSize: `calc(${size} * 0.5)`,
  };

  // Add the animation to the document head
  if (!document.getElementById('spinner-animation')) {
    const style = document.createElement('style');
    style.id = 'spinner-animation';
    style.innerHTML = `
      @keyframes spin {
        0% { transform: rotate(0deg); }
        100% { transform: rotate(360deg); }
      }
    `;
    document.head.appendChild(style);
  }

  return (
    <div 
      className={`loading-spinner-container ${className}`}
      style={containerStyle}
      aria-live="polite"
      aria-busy="true"
    >
      <div style={contentStyle}>
        <div 
          className="loading-spinner" 
          style={spinnerStyle}
          role="status"
        />
        {message && (
          <p style={messageStyle}>
            {message}
          </p>
        )}
      </div>
    </div>
  );
};

export default LoadingSpinner;