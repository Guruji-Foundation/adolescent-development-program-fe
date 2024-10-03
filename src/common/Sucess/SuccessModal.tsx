import React from "react";
import "./SuccessModal.css";

interface SuccessModalProps {
  onClose: () => void;
  data: { heading: string; description: string }; // Define data prop type
}

const SuccessModal: React.FC<SuccessModalProps> = ({ onClose, data }) => {
  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2>{data.heading}</h2>
        <p>{data.description}</p>
        <button onClick={onClose} className="close-button">
          OK
        </button>
      </div>
    </div>
  );
};

export default SuccessModal;
