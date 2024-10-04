import React from "react";
import { FaExclamationTriangle } from "react-icons/fa"; // Warning icon

interface ErrorMessageProps {
  errors: string[];
}

const ErrorMessage: React.FC<ErrorMessageProps> = ({ errors }) => {
  return (
    <div className="error-message">
      <FaExclamationTriangle className="warning-icon" />
      {errors.map((err, index) => (
        <p key={index}>{err}</p>
      ))}
    </div>
  );
};

export default ErrorMessage;
