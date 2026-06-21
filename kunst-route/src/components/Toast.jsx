import React from 'react';

export default function Toast({ message, type = 'error', onClose }) {
  if (!message) return null;

  const isSuccess = type === 'success';

  return (
    <div
      className="toast-notification"
      style={isSuccess ? { borderLeftColor: 'var(--color-success)', background: '#f0fdf4' } : {}}
    >
      <div className="toast-icon" style={isSuccess ? { color: 'var(--color-success)' } : {}}>
        {isSuccess ? (
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
            <polyline points="22 4 12 14.01 9 11.01"></polyline>
          </svg>
        ) : (
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10"></circle>
            <line x1="12" y1="8" x2="12" y2="12"></line>
            <line x1="12" y1="16" x2="12.01" y2="16"></line>
          </svg>
        )}
      </div>
      <div className="toast-content" style={isSuccess ? { color: '#166534' } : {}}>
        <p>{message}</p>
      </div>
      {onClose && (
        <button type="button" onClick={onClose} className="toast-close">
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        </button>
      )}
    </div>
  );
}
