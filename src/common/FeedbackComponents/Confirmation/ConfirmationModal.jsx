import React from "react";
import "./ConfirmationModal.css"; // Optional: create CSS for modal
import "../../../CSS/Main.css";
import { useNavigate } from "react-router-dom";


const ConfirmationModal = ({ title, message, onConfirm, onCancel, confirmText, seeMore = false,data=null}) => {
  const navigate = useNavigate();
  return (
    <div className="modal-backdrop">
      <div className="modal-content">
        <h3>{title}</h3>
        <p>{message}</p>
        
        {seeMore? <button onClick={() => navigate('/errorpageforupload', { state: { data: data } })} >See More</button>:''}
        {confirmText ? 
         <div className="modal-actions">
        <button className="g-button cancel-button" onClick={onConfirm}>
          {confirmText} </button> 
        </div> : 
        <div className="modal-actions">
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
