import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import Tooltip from "../../FeedbackComponents/Tooltip/ToolTip";
import "./Sidebar.css";
import {
  MdCastForEducation,
  MdTopic,
} from "react-icons/md";
import { AiOutlineUserAdd } from "react-icons/ai";
import { FaSchool, FaChalkboardTeacher, FaUserGraduate, FaChartBar, FaCentercode } from "react-icons/fa";

const Sidebar: React.FC = () => {
  const [isCollapsed, setIsCollapsed] = useState(true);
  const location = useLocation(); // Get current location

  const toggleSidebar = () => {
    setIsCollapsed(!isCollapsed);
  };

  const isActive = (path: string) => location.pathname === path;

  const menuItems = [
    { path: "/school", icon: <FaSchool />, name: "School" },
    { path: "/teacher", icon: <FaChalkboardTeacher />, name: "Teacher" },
    { path: "/student", icon: <FaUserGraduate />, name: "Student" },
    { path: "/project-coordinator", icon: <FaCentercode />, name: "Project Coordinator" },
    { path: "/projects", icon: <MdCastForEducation />, name: "Projects" },
    { path: "/topics", icon: <MdTopic />, name: "Topics" },
    { path: "/project-assign", icon: <AiOutlineUserAdd />, name: "Assign Project" },
    { path: "/performance", icon: <FaChartBar />, name: "Performance" },
  ];

  return (
    <div className={isCollapsed ? "sidebar collapsed" : "sidebar"}>
      <div className="user-info-wrapper">
        <div className="user-info">
          <p>Welcome!</p>
          <h1>Rajesh Pokharkar</h1>
        </div>
        <button className="toggle-button" onClick={toggleSidebar}>
          {isCollapsed ? "»" : "«"}
        </button>
      </div>

      <hr className="sidebar-divider" />

      <ul className="sidebar-menu">
        {menuItems.map((item) => (
          <li key={item.path}>
            <Link
              to={item.path}
              className={`menu-item ${isActive(item.path) ? "active" : ""}`}
            >
              <Tooltip text={item.name}>
                <div className="icon-wrapper">{item.icon}</div>
              </Tooltip>
              {!isCollapsed && <span>{item.name}</span>}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Sidebar;
