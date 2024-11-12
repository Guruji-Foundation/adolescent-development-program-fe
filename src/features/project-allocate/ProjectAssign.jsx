import react from "react";
import { useState } from "react";
import Slider from "react-slick";
import AssignProjectToSchoolPage from "./AssignProjectToSchoolPage";
import AssignProjectToStudentPage from "./AssignProjectToStudentPage";

import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

const ProjectAssign = () => {
  const [activeComponent, setActiveComponent] = useState("Component One");
  const components = {
    "Component One": <AssignProjectToSchoolPage />,
    "Component Two": <AssignProjectToStudentPage />,
  };

  const handleComponentChange = (componentName) => {
    setActiveComponent(componentName);
  };

  return (
    <div>
      {/* Slider on top */}
      <div style={styles.slider}>
        <button
          style={
            activeComponent === "Component One"
              ? styles.activeButton
              : styles.button
          }
          onClick={() => handleComponentChange("Component One")}
        >
          Assign Project To School
        </button>
        <button
          style={
            activeComponent === "Component Two"
              ? styles.activeButton
              : styles.button
          }
          onClick={() => handleComponentChange("Component Two")}
        >
          Assign Project To Student
        </button>
      </div>

      {/* Name of active component */}
      {/* <h1 style={styles.heading}>{activeComponent}</h1> */}

      {/* Display the selected component */}
      <div style={styles.componentContainer}>{components[activeComponent]}</div>
    </div>
  );
};

const styles = {
  slider: {
    display: "flex",
    justifyContent: "center",
    padding: "10px",
    backgroundColor: "#f4f4f4",
    borderBottom: "1px solid #ddd",
  },
  button: {
    padding: "10px 20px",
    margin: "0 5px",
    backgroundColor: "#fff",
    border: "1px solid #ccc",
    borderRadius: "5px",
    cursor: "pointer",
    fontSize: "16px",
  },
  activeButton: {
    padding: "10px 20px",
    margin: "0 5px",
    backgroundColor: "#2196f3",
    color: "#fff",
    border: "1px solid #2196f3",
    borderRadius: "5px",
    cursor: "pointer",
    fontSize: "16px",
  },
  heading: {
    textAlign: "center",
    margin: "20px 0",
  },
  componentContainer: {
    padding: "20px",
    textAlign: "center",
  },
};
export default ProjectAssign;
