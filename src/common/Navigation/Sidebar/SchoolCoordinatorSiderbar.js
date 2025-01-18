import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";

import "./Sidebar.css"; // Import custom styles
// import { FaSchool, FaChalkboardTeacher, FaUserGraduate } from "react-icons/fa"; // Import icons from react-icons
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
import Tooltip from "../../FeedbackComponents/Tooltip/ToolTip";

const SchoolCoordinatorSiderbar = () => {
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

  // Helper function to check if the route is active
  const isActive = (path) => location.pathname === path;

  const returnFun = () => {
    if (user?.email && user?.role === "school-coordinator") {
      return (
        <div className={isCollapsed ? "sidebar collapsed" : "sidebar"}>
          {/* User Info and Button Wrapper */}
          <div className="user-info-wrapper">
            {/* User Info Section */}
            <div className="user-info">
              <p>Welcome School coordinator</p>
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
            <Tooltip text="Teacher" hide={!isCollapsed}>
              <li>
                <Link
                  to="/teacher"
                  className={`menu-item ${
                    isActive("/teacher") ? "active" : ""
                  }`}
                >
                  <FaChalkboardTeacher className="icon" /> {/* Teacher icon */}
                  {!isCollapsed && <span>Teacher</span>}
                </Link>
              </li>
            </Tooltip>
            <Tooltip text="Teacher" hide={!isCollapsed}>
              <li>
                <Link
                  to="/student"
                  className={`menu-item ${
                    isActive("/student") ? "active" : ""
                  }`}
                >
                  <FaUserGraduate className="icon" /> {/* Student icon */}
                  {!isCollapsed && <span>Student</span>}
                </Link>
              </li>
            </Tooltip>
            <Tooltip text="Teacher" hide={!isCollapsed}>
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
            </Tooltip>
          </ul>
        </div>
      );
    } else {
      return <></>;
    }
  };
  return returnFun();
};

export default SchoolCoordinatorSiderbar;
