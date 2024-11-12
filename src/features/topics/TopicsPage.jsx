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
import AgGridTable from "../../common/GloabalComponent/AgGridTable";

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

  // Fetch project list based on selected school
  const getProjectList = async () => {
    try {
      const res = (await apiServices.getAllProjectList())?.data?.data?.projects;
      setProjects(res);
    } catch (err) {
      setError(err.message);
    }
  };

  const getAllTopicList = async () => {
    // console.log(selectedProjectId);
    try {
      const res = (await apiServices.getAllTopicList(selectedProjectId))?.data
        ?.data?.topics;
      console.log("form get all project list ");
      console.log(res);
      setTopics(res);
    } catch (err) {
      setError(err.message);
    }
  };
  useEffect(() => {
    getAllTopicList();
    console.log("hello form topic list");
  }, [selectedProjectId]);

  useEffect(() => {
    getProjectList();
  }, []);

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
    { headerCheckboxSelection: true, checkboxSelection: false, width: 50 },
    {
      headerName: "Topic Name",
      field: "name",
      filter: true,
      floatingFilter: true,
    },
    {
      headerName: "Description",
      field: "description",
      filter: true,
      floatingFilter: true,
    },
    {
      headerName: "Project Name",
      field: "projectName",
      filter: true,
      floatingFilter: true,
    },

    {
      headerName: "Actions",
      filter: true,
      floatingFilter: true,
      cellRenderer: (params) => {
        return (
          <div>
            <button
              onClick={() => handleEdit(params?.data?.id)}
              className="action-button edit-button"
            >
              <FaEdit />
            </button>
            <button
              onClick={() => handleDelete(params?.data?.id)}
              className="action-button delete-button"
            >
              <FaTrashAlt />
            </button>
          </div>
        );
      },
    },
  ];

  return (
    <div className="school-page">
      <div className="header">
        <div className="heading-container">
          <h2 className="school-heading">Topic</h2>
        </div>
        <button
          className="g-button create-new-button"
          onClick={handleCreateNew}
        >
          Create New
        </button>
      </div>
      <div className="header">
        <SelectInput
          label="Select Project"
          value={selectedProjectId || ""}
          onChange={handleProjectChange}
          options={projects}
        />
      </div>
      <div className="ag-theme-quartz" style={{ height: "500px" }}>
        <AgGridTable rowData={topics} columnDefs={columDefs} />
      </div>
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
