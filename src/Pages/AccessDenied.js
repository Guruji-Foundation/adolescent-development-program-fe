import React from "react";
import { Link } from "react-router-dom";
import "./AccessDenied.css";

const AccessDenied = () => {
  return (
    <div className="access-denied-container">
      <div className="access-denied-content">
        <h1 className="access-denied-title">Access Denied</h1>
        <p className="access-denied-message">
          You don’t have permission to view this page. Please log in to
          continue.
        </p>
        {/* <Link to="/login" className="access-denied-button">
          Go to Login
        </Link> */}
      </div>
    </div>
  );
};

export default AccessDenied;
