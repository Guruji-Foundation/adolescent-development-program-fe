import react from "react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

import ProjectForm from "./ProjectForm";
import apiServices from "../../common/ServiCeProvider/Services";

const CreateProject = () => {
  const message = {
    heading: "Project Create Successfully",
    description: "You have created Project",
  };
  const heading = "Create Project";
  const [projectData, setProjectData] = useState({
    name: "",
    description: "",
    startDate: "",
    endDate: "",
    actualStartDate: "",
    actualEndDate: "",
    status: "",
    schoolId: NaN,
  });

  const navigate = useNavigate();

  const handleCloseModal = () => {
    navigate("/projects");
  };
  const handleSubmit = async (projectData) => {
    try {
      const res = await apiServices.createProject(projectData);
      return res;
    } catch (err) {
      return err;
    }
  };

  return (
    <div>
      <ProjectForm
        message={message}
        heading={heading}
        handleCloseModal={handleCloseModal}
        // projectDataDefault={projectData}
        handleSubmit={handleSubmit}
      />
    </div>
  );
};

export default CreateProject;
