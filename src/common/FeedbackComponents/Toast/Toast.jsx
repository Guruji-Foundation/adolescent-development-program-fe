import React from 'react';
import './Toast.css';
import { IoWarning, IoCheckmarkCircle, IoInformationCircle, IoClose } from 'react-icons/io5';

const Toast = ({ type = 'warning', message, onClose }) => {
  const icons = {
    warning: <IoWarning className="toast-icon" />,
    success: <IoCheckmarkCircle className="toast-icon" />,
    info: <IoInformationCircle className="toast-icon" />
  };

  return (
    <div className={`toast-container ${type}`}>
      <div className="toast-content">
        {icons[type]}
        <div className="toast-message">
          <p className="toast-title">{type === 'warning' ? 'Warning' : type === 'success' ? 'Success' : 'Information'}</p>
          <p className="toast-text">{message}</p>
        </div>
        <button className="toast-close" onClick={onClose}>
          <IoClose />
        </button>
      </div>
    </div>
  );
};

export default Toast; 