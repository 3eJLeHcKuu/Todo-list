import React from 'react';

export const Notification = ({ message, type, onClose }) => (
    <div className={`notification ${type}`}>
        {message}
        <button className="close-btn" onClick={onClose}>✕</button>
    </div>
);
