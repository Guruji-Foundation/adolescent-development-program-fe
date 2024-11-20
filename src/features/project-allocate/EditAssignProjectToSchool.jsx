import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";

import apiServices from "../../common/ServiCeProvider/Services";
import useError from "../../hooks/useError";
import ErrorMessage from "../../common/FormInput/ErrorMessage";
import AssignProjectToSchoolForm from "./AssignProjectToSchoolForm";

const EditTopic = () => {
  const [assignProject, setAssignProject] = useState({});

  const navigate = useNavigate();
  const { errors, setError, clearError } = useError();
  const { schoolId, projectId } = useParams();
  const message = {
    heading: "Project Assign Edited Sccussfully!",
    description: "You have Edited Project Assing",
  };

  const heading = "Edit Assign Project";
  useEffect(() => {
    if (schoolId && projectId) {
      apiServices
        .fetchProjectByProjectIdAndSchoolId(schoolId, projectId)
        .then((res) => {
          setAssignProject(res?.data?.data);
        })
        .catch((error) => {
          setError(error.message);
        });
    }
  }, [schoolId, projectId]);

  const handleSubmit = async (projectId, assignProject) => {
    console.log("Hello form hadnl sub")
    try {
      const response = await apiServices.updateProjectByProjectIdAndSchoolId(
        assignProject?.schoolId,
        projectId,
        assignProject
      );
      return response;
    } catch (error) {
      setError(error.message);
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
        isEdit={true}
      />
      {errors.length > 0 && <ErrorMessage errors={errors} />}
    </div>
  );
};

export default EditTopic;
