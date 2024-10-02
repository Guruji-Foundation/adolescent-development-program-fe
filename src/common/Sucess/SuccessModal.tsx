import React from 'react';
import './SuccessModal.css';

interface SuccessModalProps {
  onClose: () => void;
}

const SuccessModal: React.FC<SuccessModalProps> = ({ onClose }) => {
  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2>School Created Successfully!</h2>
        <p>Your school has been created.</p>
        <button onClick={onClose} className="close-button">OK</button>
      </div>
    </div>
  );
};

export default SuccessModal;
