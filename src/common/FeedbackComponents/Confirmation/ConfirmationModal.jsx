import React from "react";
import "./ConfirmationModal.css"; // Optional: create CSS for modal
import "../../../CSS/Main.css";


const ConfirmationModal = ({ title, message, onConfirm, onCancel, confirmText }) => {
  return (
    <div className="modal-backdrop">
      <div className="modal-content">
        <h3>{title}</h3>
        <p>{message}</p>
        {confirmText ? <button className="g-button cancel-button" onClick={onConfirm}>
          {confirmText}
        </button> : <div className="modal-actions">
          <button className="r-button confirm-button" onClick={onConfirm}>
            Confirm
          </button>
          <button className="g-button cancel-button" onClick={onCancel}>
            Cancel
          </button>
        </div>}

      </div>
    </div>
  );
};

export default ConfirmationModal;
