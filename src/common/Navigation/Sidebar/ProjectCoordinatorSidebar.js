import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";

import Tooltip from "../../FeedbackComponents/Tooltip/ToolTip";

import "./Sidebar.css";
import { MdCastForEducation, MdAssignment, MdTopic } from "react-icons/md";
import { AiOutlineUserAdd } from "react-icons/ai";
import { BiChevronDown } from "react-icons/bi";
import { HiOutlineUserGroup } from "react-icons/hi";
import {
  FaSchool,
  FaChalkboardTeacher,
  FaUserGraduate,
  FaChartBar,
  FaCentercode,
} from "react-icons/fa"; // Import icons from react-icons
import { useAuth } from "../../../context/AuthContext";

const ProjectCoordinatorSidebar = () => {
  const [isCollapsed, setIsCollapsed] = useState(true);
  const [isProjectsSubmenuOpen, setIsProjectsSubmenuOpen] = useState(false);
  const location = useLocation(); // Get current location
  const { user } = useAuth();

  const toggleProjectsSubmenu = () => {
    setIsProjectsSubmenuOpen(!isProjectsSubmenuOpen);
  };

  const toggleSidebar = () => {
    setIsCollapsed(!isCollapsed);
  };

  const isActive = (path) => location.pathname === path;

  const returnFun = () => {
    if (user?.email && user?.role === "project-coordinator") {
      return (
        <div className={isCollapsed ? "sidebar collapsed" : "sidebar"}>
          {/* User Info and Button Wrapper */}
          <div className="user-info-wrapper">
            {/* User Info Section */}
            <div className="user-info">
              <p>Welcome Project Coordinator</p>
              <h1>{user?.name}</h1>
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
                to="/school-coordinator"
                className={`menu-item ${
                  isActive("/school-coordinator") ? "active" : ""
                }`}
              >
                <FaCentercode className="icon" />
                {!isCollapsed && <span>School coordinator</span>}
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
                to="/topics"
                className={`menu-item ${isActive("/topics") ? "active" : ""}`}
              >
                <MdTopic className="icon" /> {/* Projects icon */}
                {!isCollapsed && <span>Topics</span>}
              </Link>
            </li>

            <li>
              <Link
                to="/project-assign"
                className={`menu-item ${
                  isActive("/projects-assign") ? "active" : ""
                }`}
              >
                <AiOutlineUserAdd className="icon" /> {/* Projects icon */}
                {!isCollapsed && <span>Assign Project</span>}
              </Link>
            </li>

            <li>
              <Link
                to="/performance"
                className={`menu-item ${
                  isActive("/performance") ? "active" : ""
                }`}
              >
                <FaChartBar className="icon" />
                {!isCollapsed && <span>Performance</span>}
              </Link>
            </li>
          </ul>
        </div>
      );
    } else {
      return <></>;
    }
  };
  return returnFun();
};

export default ProjectCoordinatorSidebar;
