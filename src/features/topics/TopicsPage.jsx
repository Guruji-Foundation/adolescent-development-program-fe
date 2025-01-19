import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

import "./TopicsPage.css";
import "../../CSS/Main.css";
import { FaEdit, FaTrashAlt } from "react-icons/fa";

import ConfirmationModal from "../../common/FeedbackComponents/Confirmation/ConfirmationModal";
import LoadingSpinner from "../../common/FeedbackComponents/Loading/LoadingSpinner";
import useError from "../../hooks/useError";
import ErrorMessage from "../../common/FormInput/ErrorMessage";

import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-quartz.css";
import CustomTable from "../../common/GloabalComponent/CustomTable";

import apiServices from "../../common/ServiCeProvider/Services";
import SelectInput from "../../common/FormInput/SelectInput";

const TopicsPage = () => {
  const [loading, setLoading] = useState(true);
  const { errors, setError, clearError } = useError();

  const [topics, setTopics] = useState([]);
  const [selectedTopicId, setSelectedTopicId] = useState(null);
  const [projects, setProjects] = useState([]);
  const [selectedProjectId, setSelectedProjectId] = useState(null);

  const [isModalVisible, setIsModalVisible] = useState(false);

  const title = "Delete Topic!";
  const message = "Do you really want to delete this topic";

  const navigate = useNavigate();

  const getAllTopicList = async () => {
    setLoading(true);
    try {
      const res = (await apiServices.getAllTopicList(selectedProjectId))?.data
        ?.data?.topics;
      console.log("form get all project list ");
      console.log(res);
      setTopics(res);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const getProjectList = async () => {
    try {
      const res = (await apiServices.getAllProjectList())?.data?.data?.projects;
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

  useEffect(() => {
    if (selectedProjectId) {
      getAllTopicList();
    } else {
      setTopics([]);
      setLoading(false);
    }
  }, [selectedProjectId]);

  const handleDelete = (id) => {
    clearError();
    setSelectedTopicId(id);
    setIsModalVisible(true);
  };

  const confirmDelete = () => {
    if (selectedTopicId !== null) {
      apiServices
        .deleteTopic(selectedTopicId)
        .then(() => {
          const updatedTopics = topics.filter(
            (topic) => topic.id !== selectedTopicId
          );
          setTopics(updatedTopics);
          setSelectedTopicId(null);
          setIsModalVisible(false);
        })
        .catch((error) => {
          console.error("Error deleting Topic:", error);
          setError("Failed to delete Topic. Please try again later.");
        });
    }
  };

  const cancelDelete = () => {
    setSelectedTopicId(null);
    setIsModalVisible(false);
  };

  const handleCreateNew = () => {
    navigate("/create-topic");
  };

  const handleEdit = (id) => {
    navigate(`/edit-topic/${id}`);
  };

  const handleProjectChange = (e) => {
    console.log(e.target.value);
    setSelectedProjectId(e.target.value);
    // getAllTopicList();
  };

  const handleClose = () => {
    setIsModalVisible(false);
  };
  console.log(topics);

  if (errors.length > 0) return <ErrorMessage errors={errors} />;

  const columDefs = [
    {
      headerName: "Topic Name",
      field: "name",
      cellClass: 'name-cell',
      flex: 2,
      cellRenderer: params => (
        <div className="topic-name-cell">
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
      headerName: "Project Name",
      field: "projectName",
      flex: 2,
      cellRenderer: params => (
        <div className="project-cell">
          <span className="project-badge">{params.value}</span>
        </div>
      )
    },
    {
      headerName: "Actions",
      cellRenderer: params => (
        <div className="action-buttons">
          <button
            onClick={() => handleEdit(params?.data?.id)}
            className="action-button edit-button"
            title="Edit Topic"
          >
            <FaEdit size={16} />
          </button>
          <button
            onClick={() => handleDelete(params?.data?.id)}
            className="action-button delete-button"
            title="Delete Topic"
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
    <div className="topic-page">
      <div className="header">
        <div className="heading-container">
          <h2 className="topic-heading">Topic Management</h2>
        </div>
        <button
          className="create-new-button"
          onClick={handleCreateNew}
          title="Create New Topic"
        >
          Create New
        </button>
      </div>

      <div className="filter-container">
        <div className="select-wrapper">
          <SelectInput
            label="Filter by Project"
            value={selectedProjectId || ""}
            onChange={handleProjectChange}
            options={projects}
            placeholder="Select a project to filter topics..."
            className="project-select"
          />
        </div>
      </div>

      {loading ? (
        <LoadingSpinner />
      ) : (
        <CustomTable 
          rowData={topics} 
          columnDefs={columDefs}
          paginationPageSize={20}
          rowHeight={48}
          className="topic-table"
        />
      )}

      {isModalVisible && (
        <ConfirmationModal
          title={title}
          message={message}
          onConfirm={confirmDelete}
          onCancel={cancelDelete}
        />
      )}
    </div>
  );
};

export default TopicsPage;
