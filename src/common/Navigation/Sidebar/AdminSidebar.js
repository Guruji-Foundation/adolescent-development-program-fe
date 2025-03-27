import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import "./Sidebar.css";
import {
  BsBuilding,
  BsPerson,
  BsPeople,
  BsPersonLinesFill,
  BsPersonWorkspace,
  BsKanban,
  BsBook,
  BsListCheck,
  BsGraphUp,
  BsChevronLeft,
} from "react-icons/bs";
import { useAuth } from "../../../context/AuthContext";

const AdminSidebar = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const location = useLocation();
  const { user } = useAuth();

  const navItems = [
    { path: "/school", name: "School", icon: <BsBuilding /> },
    { path: "/teacher", name: "Teacher", icon: <BsPerson /> },
    { path: "/student", name: "Student", icon: <BsPeople /> },
    {
      path: "/school-coordinator",
      name: "School coordinator",
      icon: <BsPersonLinesFill />,
    },
    {
      path: "/project-coordinator",
      name: "Project coordinator",
      icon: <BsPersonWorkspace />,
    },
    { path: "/projects", name: "Projects", icon: <BsKanban /> },
    { path: "/topics", name: "Topics", icon: <BsBook /> },
    { path: "/project-assign", name: "Assign Project", icon: <BsListCheck /> },
    { path: "/performance", name: "Performance", icon: <BsGraphUp /> },
  ];

  if (!user?.email) return null;

  return (
    <div className={`sidebar ${isCollapsed ? "collapsed" : ""}`}>
      <button
        className="collapse-btn"
        onClick={() => setIsCollapsed(!isCollapsed)}
        title={isCollapsed ? "Expand" : "Collapse"}
      >
        <BsChevronLeft />
      </button>

      <nav className="nav-menu">
        {navItems.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            className={`nav-item ${
              location.pathname === item.path ? "active" : ""
            }`}
            title={item.name}
          >
            <span className="nav-icon">{item.icon}</span>
            <span className="nav-label">{item.name}</span>
          </Link>
        ))}
      </nav>
    </div>
  );
};

export default AdminSidebar;
