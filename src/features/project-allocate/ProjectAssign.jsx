import React, { useState } from "react";
import AssignProjectToSchoolPage from "./AssignProjectToSchoolPage";
import AssignProjectToStudentPage from "./AssignProjectToStudentPage";
import TabSwitch from "../../common/components/TabSwitch/TabSwitch";
import { FaSchool, FaUserGraduate } from "react-icons/fa";
import styles from "./ProjectAssign.module.css";

const ProjectAssign = () => {
  const [activeTab, setActiveTab] = useState("school");

  const tabs = [
    {
      id: "school",
      label: "Assign Project To School",
      icon: <FaSchool />,
    },
    {
      id: "student",
      label: "Assign Project To Student",
      icon: <FaUserGraduate />,
    },
  ];

  const components = {
    school: <AssignProjectToSchoolPage />,
    student: <AssignProjectToStudentPage />,
  };

  return (
    <div className={styles.mainContainer}>
      <div className={styles.content}>
        <TabSwitch
          tabs={tabs}
          activeTab={activeTab}
          onTabChange={setActiveTab}
        />
        <div className={styles.componentContainer}>{components[activeTab]}</div>
      </div>
    </div>
  );
};

export default ProjectAssign;
