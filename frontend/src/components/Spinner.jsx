import React from 'react';

export default function Spinner({ size = 'medium' }) {
  const sizeMap = {
    small: 16,
    medium: 24,
    large: 40
  };

  const dimension = sizeMap[size] || sizeMap.medium;

  return (
    <div 
      className="spinner" 
      style={{ 
        width: dimension, 
        height: dimension,
        display: 'inline-block'
      }}
      role="status"
      aria-label="Loading"
    />
  );
}
