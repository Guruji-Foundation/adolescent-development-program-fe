// Navbar.tsx

import React, { useState, useRef, useEffect } from "react";
import "./Navbar.css";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../../context/AuthContext";
import { BsPersonCircle, BsBell, BsChevronDown, BsBoxArrowRight, BsGear } from "react-icons/bs";
import Services from "../../../common/ServiCeProvider/Services";

const Navbar: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleLogout = () => {
    Services.logout(); // Clear all localStorage data
    logout(); // Call the auth context logout
    navigate("/login");
    setIsDropdownOpen(false);
  };

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  return (
    <header className="top-header">
      <nav className="top-navbar">
        <div className="navbar-left">
          <h1 className="navbar-title">ADP Platform</h1>
        </div>

        <div className="navbar-right">
          <div className="profile-menu" ref={dropdownRef}>
            {user?.email ? (
              <>
                <button 
                  className={`profile-trigger ${isDropdownOpen ? 'active' : ''}`} 
                  onClick={toggleDropdown}
                  aria-label="Profile menu"
                >
                  <div className="avatar">
                    {user.name?.charAt(0).toUpperCase() || 'U'}
                  </div>
                  <BsChevronDown className={`dropdown-icon ${isDropdownOpen ? 'rotated' : ''}`} />
                </button>
                {isDropdownOpen && (
                  <div className="dropdown-menu">
                    <div className="dropdown-header">
                      <div className="header-avatar">
                        {user.name?.charAt(0).toUpperCase() || 'U'}
                      </div>
                      <div className="header-info">
                        <span className="dropdown-user-name">{user.name}</span>
                        <span className="dropdown-user-email">{user.email}</span>
                      </div>
                    </div>
                    <div className="dropdown-content">
                      <Link to="/profile" className="dropdown-item">
                        <BsPersonCircle />
                        <span>My Profile</span>
                      </Link>
                      <Link to="/settings" className="dropdown-item">
                        <BsGear />
                        <span>Settings</span>
                      </Link>
                    </div>
                    <button onClick={handleLogout} className="dropdown-item logout">
                      <BsBoxArrowRight />
                      <span>Logout</span>
                    </button>
                  </div>
                )}
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
