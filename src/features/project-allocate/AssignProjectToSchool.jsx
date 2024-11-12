import React from "react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

import SuccessModal from "../../common/FeedbackComponents/Sucess/SuccessModal";
import apiServices from "../../common/ServiCeProvider/Services";
import AssignProjectToSchoolForm from "./AssignProjectToSchoolForm";

const CreateTopic = () => {
  const message = {
    heading: "Project Assign Successfully!",
    description: "You have Successfully assign Project to school",
  };
  const heading = "Assign Project";

  const [assignProject, setAssignProject] = useState({});

  const navigate = useNavigate();

  const handleSubmit = async (projectId, assignProjectData) => {
    try {
      const response = await apiServices.assignProjectToSchool(
        projectId,
        assignProjectData
      );
      return response;
    } catch (error) {
      return error; // Return the error object to handle it in the form
    }
  };

  const handleCloseModal = () => {
    navigate("/project-assign"); // Redirect to the school list page after closing the modal
  };

  return (
    <div>
      <AssignProjectToSchoolForm
        handleSubmit={handleSubmit}
        message={message}
        heading={heading}
        handleCloseModal={handleCloseModal}
        projectAssignToSchoolDataDefault={assignProject}
      />
    </div>
  );
};

export default CreateTopic;
