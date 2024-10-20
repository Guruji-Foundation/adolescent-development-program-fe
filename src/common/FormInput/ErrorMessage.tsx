import React from "react";
import { FaExclamationTriangle } from "react-icons/fa"; // Warning icon
import "./ErrorMessage.css"; // Assuming you're adding styles in an external CSS file

interface ErrorMessageProps {
  errors: string[];
}

const ErrorMessage: React.FC<ErrorMessageProps> = ({ errors }) => {
  return (
    <div className="error-message">
      <FaExclamationTriangle className="warning-icon" />
      <div className="error-text">
        {errors.map((err, index) => (
          <p key={index} className="error-item">
            {err}
          </p> // Ensuring each error is in its own block
        ))}
      </div>
    </div>
  );
};

export default ErrorMessage;
