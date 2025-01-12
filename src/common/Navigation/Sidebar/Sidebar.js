import React from "react";
import AdminSidebar from "./AdminSidebar";
import SchoolCoordinatorSiderbar from "./SchoolCoordinatorSiderbar";
import ProjectCoordinatorSidebar from "./ProjectCoordinatorSidebar";
import { useAuth } from "../../../context/AuthContext";

const Sidebar = () => {
  const { user } = useAuth();

  const returnFun = () => {
    if (user?.role == "admin") {
      return <AdminSidebar />;
    } else if (user?.role == "school-coordinator") {
      return <SchoolCoordinatorSiderbar />;
    } else if (user?.role == "project-coordinator") {
      return <ProjectCoordinatorSidebar />;
    } else {
      return <></>;
    }
  };

  return returnFun();
};

export default Sidebar;
