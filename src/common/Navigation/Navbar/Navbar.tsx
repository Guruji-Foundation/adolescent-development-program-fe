// Navbar.tsx

import React from "react";
import "./Navbar.css";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../../context/AuthContext";

const Navbar: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
    // console.log("logout form system");
  };
  return (
    <nav className="navbar">
      <div className="navbar-brand">
        {/* <img src="logo.png" alt="Logo" className="navbar-logo" /> */}
        <h1 className="navbar-title">ADP Platform</h1>
      </div>
      <ul className="navbar-links">
        <li>
          <Link to="/">Home</Link>
        </li>
        <li>
          <Link to="/about">About Us</Link>
        </li>
        <li>
          <Link to="/contact">Contact</Link>
        </li>
        {!user?.email ? (
          <>
            <li>
              <Link to="/login">Login</Link>
            </li>
            {/* <li>
              <Link to="/register">Register</Link>
            </li> */}
          </>
        ) : (
          <li>
            <Link to="" onClick={handleLogout}>
              logout
            </Link>
          </li>
        )}
      </ul>
    </nav>
  );
};

export default Navbar;
