// Navbar.tsx

import React from "react";
import "./Navbar.css";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../../context/AuthContext";
import { BsPersonCircle, BsBell, BsChevronDown } from "react-icons/bs";

const Navbar: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <header className="top-header">
      <nav className="top-navbar">
        <div className="navbar-left">
          <h1 className="navbar-title">ADP Platform</h1>
        </div>

        <div className="navbar-right">
          <div className="navbar-actions">
            <button className="icon-button" title="Notifications">
              <BsBell />
              <span className="notification-badge">2</span>
            </button>
          </div>
          
          <div className="user-profile">
            {user?.email ? (
              <>
                <div className="user-info">
                  <span className="user-name">{user.name}</span>
                  <span className="user-role">Administrator</span>
                </div>
                <div className="profile-menu">
                  <button className="profile-trigger">
                    <div className="avatar">
                      {user.name?.charAt(0).toUpperCase() || 'U'}
                    </div>
                    <BsChevronDown className="dropdown-icon" />
                  </button>
                  <button onClick={handleLogout} className="logout-button">
                    Logout
                  </button>
                </div>
              </>
            ) : (
              <Link to="/login" className="login-button">
                <BsPersonCircle />
                <span>Login</span>
              </Link>
            )}
          </div>
        </div>
      </nav>
    </header>
  );
};

export default Navbar;
