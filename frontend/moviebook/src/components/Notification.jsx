// src/components/Notification.js
import React from 'react';

const Notification = ({ message, type, onClose }) => {
  if (!message) return null;

  return (
    <div className={`notification ${type}`}>
      {message}
      <button onClick={onClose}>×</button>
    </div>
  );
};

export default Notification;