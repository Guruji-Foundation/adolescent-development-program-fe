import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FaEdit } from "react-icons/fa";

import "./AssignProjectToStudent.css";
import "../../CSS/Main.css";

import ConfirmationModal from "../../common/FeedbackComponents/Confirmation/ConfirmationModal";
import LoadingSpinner from "../../common/FeedbackComponents/Loading/LoadingSpinner";
import useError from "../../hooks/useError";
import ErrorMessage from "../../common/FormInput/ErrorMessage";
import SelectInput from "../../common/FormInput/SelectInput";
import AgGridTable from "../../common/GloabalComponent/AgGridTable";
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
      headerCheckboxSelection: true,
      checkboxSelection: true,
      width: 50,
    },
    {
      headerName: "Project Name",
      field: "project.name",
      filter: true,
      floatingFilter: true,
    },
    {
      headerName: "Teacher Name",
      field: "teacher.name",
      filter: true,
      floatingFilter: true,
    },
    {
      headerName: "School Name",
      field: "school.name",
      filter: true,
      floatingFilter: true,
    },
    {
      headerName: "Start Date",
      field: "startDate",
      filter: true,
      floatingFilter: true,
    },
    {
      headerName: "End Date",
      field: "endDate",
      filter: true,
      floatingFilter: true,
    },
    {
      headerName: "Actions",
      field: "actions",
      filter: false,
      floatingFilter: false,
      width: 120,
      pinned: "right",
      cellRenderer: (params) => (
        <div className="action-buttons-container">
          <button
            onClick={() => handleEdit(params?.data)}
            className="action-button edit-button"
            title="Edit"
          >
            <FaEdit size={16} />
          </button>
          <button
            onClick={() => handleDelete(params?.data)}
            className="action-button"
            title="Unassign Project"
          >
            Unassign
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
          className="g-button create-new-button"
          onClick={handleCreateNew}
        >
          Assign
        </button>
      </div>

      <div className="select-container">
        <SelectInput
          label="Select School"
          value={selectedSchoolId || ""}
          options={schools}
          onChange={handleSchoolChange}
          selectsomthingtext={"All School"}
          isFilter={true}
        />
      </div>

      <div className="table-container">
        <div className="ag-theme-quartz">
          <AgGridTable
            rowData={projects}
            columnDefs={columnDefs}
            defaultColDef={{
              sortable: true,
            }}
          />
        </div>
      </div>

      {isModalVisible && (
        <ConfirmationModal
          title="Unassigned Project!"
          message="Do you really want to unassinged project from school."
          onConfirm={confirmDelete}
          onCancel={handleModalClose}
        />
      )}
    </div>
  );
};

export default AssignProjectToSchoolPage;
