import React, { useState, useEffect } from "react";
import { FaEdit, FaTrashAlt } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

import apiServices from "../../common/ServiCeProvider/Services";
import useError from "../../hooks/useError";
import LoadingSpinner from "../../common/FeedbackComponents/Loading/LoadingSpinner";
import ErrorMessage from "../../common/FormInput/ErrorMessage";
import ConfirmationModal from "../../common/FeedbackComponents/Confirmation/ConfirmationModal";
import CustomTable from "../../common/GloabalComponent/CustomTable";

import "./ProjectPage.css";
import "../../CSS/Main.css";

const ProjectPage = () => {
  const [loading, setLoading] = useState(true);
  const { errors, setError, clearError } = useError();
  const [selectedProjectId, setSelectedProjectId] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [projects, setProjects] = useState([]);

  const navigate = useNavigate();

  const handleEdit = (id) => {
    navigate(`/edit-project/${id}`);
  };

  const handleDelete = (id) => {
    setSelectedProjectId(id);
    setIsModalVisible(true);
  };

  const confirmDelete = () => {
    if (selectedProjectId != null) {
      apiServices
        .deleteProject(selectedProjectId)
        .then(() => {
          const updatedProjects = projects.filter(
            (project) => project.id !== selectedProjectId
          );
          setProjects(updatedProjects);
          setSelectedProjectId(null);
          setIsModalVisible(false);
        })
        .catch((error) => {
          setError(error.message);
        });
    }
  };

  const cancelDelete = () => {
    setSelectedProjectId(null);
    setIsModalVisible(false);
  };

  const handleCreateNew = () => {
    navigate("/create-project");
  };

  const getProjectList = async () => {
    setLoading(true);
    try {
      const res = (await apiServices.getAllProjectList(null))?.data?.data?.projects;
      setProjects(res);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getProjectList();
  }, []);

  if (errors.length > 0) {
    return <ErrorMessage errors={errors} />;
  }

  const columnDefs = [
    {
      headerName: "Project Name",
      field: "name",
      flex: 2,
      cellRenderer: params => (
        <div className="project-name-cell">
          <span>{params.value}</span>
        </div>
      )
    },
    {
      headerName: "Description",
      field: "description",
      flex: 3,
      cellRenderer: params => (
        <div className="description-cell">
          <span>{params.value}</span>
        </div>
      )
    },
    {
      headerName: "Status",
      field: "status",
      flex: 1,
      cellRenderer: params => (
        <div className="status-cell">
          <span className={`status-badge ${params.value.toLowerCase()}`}>
            {params.value}
          </span>
        </div>
      )
    },
    {
      headerName: "Actions",
      cellRenderer: params => (
        <div className="action-buttons">
          <button
            onClick={() => handleEdit(params.data.id)}
            className="action-button edit-button"
            title="Edit Project"
          >
            <FaEdit size={16} />
          </button>
          <button
            onClick={() => handleDelete(params.data.id)}
            className="action-button delete-button"
            title="Delete Project"
          >
            <FaTrashAlt size={16} />
          </button>
        </div>
      ),
      width: 120,
      suppressSizeToFit: true
    }
  ];

  return (
    <div className="project-page">
      <div className="header">
        <div className="heading-container">
          <h2 className="project-heading">Project Management</h2>
        </div>
        <button
          className="create-new-button"
          onClick={handleCreateNew}
          title="Create New Project"
        >
          Create New
        </button>
      </div>

      {loading ? (
        <LoadingSpinner />
      ) : (
        <CustomTable 
          rowData={projects} 
          columnDefs={columnDefs}
          paginationPageSize={20}
          rowHeight={48}
          className="project-table"
        />
      )}

      {isModalVisible && (
        <ConfirmationModal
          title="Delete Project"
          message="Do you really want to delete this Project? Corresponding School data will also be deleted"
          onConfirm={confirmDelete}
          onCancel={cancelDelete}
        />
      )}
    </div>
  );
};

export default ProjectPage;
