import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FaEdit, FaTrashAlt } from "react-icons/fa";
import Tooltip from "../../common/FeedbackComponents/Tooltip/ToolTip";

import "./AssignProjectToStudent.css";
import "../../CSS/Main.css";

import ConfirmationModal from "../../common/FeedbackComponents/Confirmation/ConfirmationModal";
import LoadingSpinner from "../../common/FeedbackComponents/Loading/LoadingSpinner";
import useError from "../../hooks/useError";
import ErrorMessage from "../../common/FormInput/ErrorMessage";
import SelectInput from "../../common/FormInput/SelectInput";
import CustomTable from "../../common/GloabalComponent/CustomTable";
import apiServices from "../../common/ServiCeProvider/Services";

const AssignProjectToSchoolPage = () => {
  const [loading, setLoading] = useState(true);
  const { errors, setError, clearError } = useError();
  const [schools, setSchools] = useState([]);
  const [selectedSchoolId, setSelectedSchoolId] = useState(null);
  const [projects, setProjects] = useState([]);
  const [selectedProjectToDelete, setSelectedProjectToDelete] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const navigate = useNavigate();

  // Fetch list of schools on initial render
  async function getSchoolList() {
    try {
      const data = (await apiServices.getAllSchoolList())?.data?.data?.schools;
      setSchools(data || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  async function getAllAssignProject() {
    try {
      setLoading(true);
      const res = await apiServices.getProjectBySchool(selectedSchoolId);
      setProjects(res?.data?.data?.schoolProjects || []);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    getSchoolList();
  }, []);

  useEffect(() => {
    if (selectedSchoolId) {
      getAllAssignProject();
    } else {
      setProjects([]);
      setLoading(false);
    }
  }, [selectedSchoolId]);

  const handleSchoolChange = (e) => {
    setSelectedSchoolId(e.target.value);
  };

  const handleCreateNew = () => {
    navigate("/project/school/assign");
  };

  const handleEdit = (params) => {
    navigate(`/project/${params.project.id}/school/${params.school.id}/assign`);
  };

  const handleDelete = (params) => {
    clearError();
    setSelectedProjectToDelete(params);
    setIsModalVisible(true);
  };

  const confirmDelete = async () => {
    if (selectedProjectToDelete) {
      try {
        await apiServices.unassignProjectByProjectIdAndSchoolId(
          selectedProjectToDelete.school.id,
          selectedProjectToDelete.project.id
        );
        const updatedAssignProject = projects.filter(
          (project) =>
            project?.project?.id !== selectedProjectToDelete?.project?.id ||
            project?.school?.id !== selectedProjectToDelete?.school?.id
        );
        setProjects(updatedAssignProject);
        setSelectedProjectToDelete(null);
        setIsModalVisible(false);
      } catch (error) {
        setError(error.message);
      }
    }
  };

  const handleModalClose = () => {
    setSelectedProjectToDelete(null);
    setIsModalVisible(false);
  };

  const columnDefs = [
    {
      headerName: "Project Name",
      field: "project.name",
      flex: 2,
      cellRenderer: params => (
        <div className="project-name-cell">
          <span className="project-badge">{params.value}</span>
        </div>
      )
    },
    {
      headerName: "Teacher Name",
      field: "teacher.name",
      flex: 2,
      cellRenderer: params => (
        <div className="teacher-name-cell">
          <span>{params.value}</span>
        </div>
      )
    },
    {
      headerName: "School Name",
      field: "school.name",
      flex: 2,
      cellRenderer: params => (
        <div className="school-cell">
          <span className="school-badge">{params.value}</span>
        </div>
      )
    },
    {
      headerName: "Start Date",
      field: "startDate",
      flex: 1,
      cellRenderer: params => (
        <div className="date-cell">
          <span>{params.value}</span>
        </div>
      )
    },
    {
      headerName: "End Date",
      field: "endDate",
      flex: 1,
      cellRenderer: params => (
        <div className="date-cell">
          <span>{params.value}</span>
        </div>
      )
    },
    {
      headerName: "Actions",
      width: 120,
      suppressSizeToFit: true,
      cellRenderer: (params) => (
        <div className="action-buttons">
          <button
            onClick={() => handleEdit(params?.data)}
            className="action-button edit-button"
            title="Edit"
          >
            <FaEdit size={16} />
          </button>
          <button
            onClick={() => handleDelete(params?.data)}
            className="action-button delete-button"
            title="Unassign"
          >
            <FaTrashAlt size={16} />
          </button>
        </div>
      ),
    },
  ];

  if (loading) return <LoadingSpinner />;
  if (errors.length > 0) return <ErrorMessage errors={errors} />;

  return (
    <div className="teacher-page">
      <div className="header">
        <div className="heading-container">
          <h2 className="teacher-heading">Assign Project To School</h2>
        </div>
        <button
          className="create-new-button"
          onClick={handleCreateNew}
        >
          Assign New Project
        </button>
      </div>

      <div className="filter-container">
        <div className="select-wrapper">
          <SelectInput
            label="Select School"
            value={selectedSchoolId || ""}
            options={schools}
            onChange={handleSchoolChange}
            selectsomthingtext={"All Schools"}
            isFilter={true}
            className="school-select"
          />
        </div>
      </div>

      <CustomTable 
        rowData={projects} 
        columnDefs={columnDefs}
        paginationPageSize={20}
        rowHeight={48}
        className="teacher-table"
      />

      {isModalVisible && (
        <ConfirmationModal
          title="Unassign Project"
          message="Are you sure you want to unassign this project from the school?"
          onConfirm={confirmDelete}
          onCancel={handleModalClose}
        />
      )}
    </div>
  );
};

export default AssignProjectToSchoolPage;
