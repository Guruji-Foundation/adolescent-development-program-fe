import React, { useEffect } from 'react';
import { IoCheckmarkCircle } from "react-icons/io5";
import './SuccessModal.css';

const SuccessModal = ({ data, onClose }) => {
    useEffect(() => {
        // Set timeout to close the modal
        const timer = setTimeout(() => {
            onClose();
        }, 2500);

        // Cleanup function to clear timeout if component unmounts
        return () => {
            clearTimeout(timer);
        };
    }, []); // Empty dependency array means this effect runs once when modal mounts

    return (
        <div className="success-modal-overlay">
            <div className="success-modal-content">
                <IoCheckmarkCircle className="success-icon" />
                <p className="success-message">{data.description}</p>
            </div>
        </div>
    );
};

export default SuccessModal; 