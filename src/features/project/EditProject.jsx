import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";

import ProjectForm from "./ProjectForm";
import apiServices from "../../common/ServiCeProvider/Services";
import useError from "../../hooks/useError";
import ErrorMessage from "../../common/FormInput/ErrorMessage";

const EditProject = () => {
  const message = {
    heading: "Project Edited Successfully",
    description: "You have edited Project",
  };
  const heading = "Edit Project";
  const [projectData, setProjectData] = useState({
    name: "",
    description: "",
    status: "",
    projectCoordinatorIds: [],
  });
  const navigate = useNavigate();
  const { id } = useParams();
  const { errors, setError, clearError } = useError();

  useEffect(() => {
    if (id) {
      apiServices
        .fetchProject(Number(id))
        .then((res) => {
          if (res) {
            res = res?.data?.data;
            setProjectData({
              name: res?.name,
              description: res?.description,
              status: res?.status,
              projectCoordinatorIds: res?.projectCoordinators,
              topics: res?.topics,
            });
          }
        })
        .catch((error) => {
          setError(error.message);
        });
    }
  }, [id]);

  const handleCloseModal = () => {
    navigate("/projects");
  };
  const handleSubmit = async (projectData) => {
    try {
      const res = await apiServices.updateProject(id, projectData);
      return res;
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div>
      <ProjectForm
        message={message}
        heading={heading}
        handleCloseModal={handleCloseModal}
        projectDataDefault={projectData}
        handleSubmit={handleSubmit}
      />
      {errors.length > 0 && <ErrorMessage errors={errors} />}
    </div>
  );
};

export default EditProject;
