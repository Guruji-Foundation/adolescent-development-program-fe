import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";

import "./Sidebar.css"; // Import custom styles
// import { FaSchool, FaChalkboardTeacher, FaUserGraduate } from "react-icons/fa"; // Import icons from react-icons
import { MdCastForEducation, MdAssignment } from "react-icons/md";
import { AiOutlineUserAdd } from "react-icons/ai";
import {
  FaSchool,
  FaChalkboardTeacher,
  FaUserGraduate,
  FaChartBar,
  FaCentercode,
} from "react-icons/fa"; // Import icons from react-icons
import ToolTip from "../../FeedbackComponents/Tooltip/ToolTip";

const Sidebar: React.FC = () => {
  const [isCollapsed, setIsCollapsed] = useState(true);
  const location = useLocation(); // Get current location

  const toggleSidebar = () => {
    setIsCollapsed(!isCollapsed);
  };

  // Helper function to check if the route is active
  const isActive = (path: string) => location.pathname === path;

  return (
    <div className={isCollapsed ? "sidebar collapsed" : "sidebar"}>
      {/* User Info and Button Wrapper */}
      <div className="user-info-wrapper">
        {/* User Info Section */}
        <div className="user-info">
          <p>Welcome!</p>
          <h1>Rajesh Pokharkar</h1>
        </div>

        {/* Toggle Button */}
        <button className="toggle-button" onClick={toggleSidebar}>
          {isCollapsed ? "»" : "«"}
        </button>
      </div>

      {/* Divider Line */}
      <hr className="sidebar-divider" />

      {/* Sidebar Menu */}
      <ul className="sidebar-menu">
        <li>
          <Link
            to="/school"
            className={`menu-item ${isActive("/school") ? "active" : ""}`}
          >
            <FaSchool className="icon" /> {/* School icon */}
            {!isCollapsed && <span>School</span>}
          </Link>
        </li>
        <li>
          <Link
            to="/teacher"
            className={`menu-item ${isActive("/teacher") ? "active" : ""}`}
          >
            <FaChalkboardTeacher className="icon" /> {/* Teacher icon */}
            {!isCollapsed && <span>Teacher</span>}
          </Link>
        </li>
        <li>
          <Link
            to="/student"
            className={`menu-item ${isActive("/student") ? "active" : ""}`}
          >
            <FaUserGraduate className="icon" /> {/* Student icon */}
            {!isCollapsed && <span>Student</span>}
          </Link>
        </li>
        <li>
          <Link
            to="/projects"
            className={`menu-item ${isActive("/projects") ? "active" : ""}`}
          >
            <MdCastForEducation className="icon" /> {/* Projects icon */}
            {!isCollapsed && <span>Projects</span>}
          </Link>
        </li>

        <li>
          <Link
            to="/project-allocation"
            className={`menu-item ${
              isActive("/projects-allocation") ? "active" : ""
            }`}
          >
            <AiOutlineUserAdd className="icon" /> {/* Projects icon */}
            {!isCollapsed && <span>Project Allocation</span>}
          </Link>
        </li>
        <li>
          <Link
            to="/project-allocation-view"
            className={`menu-item ${
              isActive("/project-allocation-view") ? "active" : ""
            }`}
          >
            <MdAssignment className="icon" />
            {!isCollapsed && <span>Project Allocation View</span>}
          </Link>
        </li>
        <li>
          <Link
            to="/performance"
            className={`menu-item ${isActive("/performance") ? "active" : ""}`}
          >
            <FaChartBar className="icon" />
            {!isCollapsed && <span>Performance</span>}
          </Link>
        </li>
        <li>
          <Link
            to="/project-coordinator"
            className={`menu-item ${isActive("/project-coordinator") ? "active" : ""}`}
          >
            <FaCentercode className="icon" />
            {!isCollapsed && <span>Project coordinator</span>}
          </Link>
        </li>
      </ul>
    </div>
  );
};

export default Sidebar;
