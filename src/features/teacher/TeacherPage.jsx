import React, { useState, useEffect } from "react";
import { FaEdit, FaTrashAlt } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import "./TeacherPage.css";
import "../../CSS/Main.css";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-quartz.css";

import ConfirmationModal from "../../common/FeedbackComponents/Confirmation/ConfirmationModal";
import LoadingSpinner from "../../common/FeedbackComponents/Loading/LoadingSpinner";
import ErrorMessage from "../../common/FormInput/ErrorMessage";
import SelectInput from "../../common/FormInput/SelectInput";
import AgGridTable from "../../common/GloabalComponent/AgGridTable";
import useError from "../../hooks/useError";
import apiServices from "../../common/ServiCeProvider/Services";

const TeacherPage = () => {
  const [teachers, setTeachers] = useState([]);
  const [selectedTeacherId, setSelectedTeacherId] = useState(null);
  const [selectedSchool, setSelectedSchool] = useState(null);
  const [loading, setLoading] = useState(true);
  const [schoolList, setSchoolList] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);

  const { errors, setError } = useError();
  const navigate = useNavigate();

  // Fetch schools data
  async function fetchSchools() {
    try {
      setLoading(true);
      const response = await apiServices.getAllSchoolList();
      setSchoolList(response?.data?.data?.schools || []);
    } catch (error) {
      setError("Error fetching school data");
      console.error(error);
    } finally {
      setLoading(false);
    }
  }

  // Fetch teachers data
  async function fetchTeachers() {
    try {
      setLoading(true);
      const endpoint = selectedSchool
        ? apiServices.getAllTeacherList(selectedSchool)
        : apiServices.getAllTeacherList();

      const response = await endpoint;
      setTeachers(response?.data?.data?.teacherDetails || []);
    } catch (error) {
      setError("Error fetching teacher data");
      console.error(error);
    } finally {
      setLoading(false);
    }
  }

  // Delete teacher
  async function handleDeleteConfirm() {
    try {
      await apiServices.deleteTeacher(selectedTeacherId);
      setTeachers((prev) =>
        prev.filter((teacher) => teacher.id !== selectedTeacherId)
      );
      setIsModalVisible(false);
      setSelectedTeacherId(null);
    } catch (error) {
      setError("Error deleting teacher");
      console.error(error);
    }
  }

  // Event Handlers
  const handleEdit = (id) => navigate(`/edit-teacher/${id}`);
  const handleDelete = (id) => {
    setSelectedTeacherId(id);
    setIsModalVisible(true);
  };
  const handleCreateNew = () => navigate("/create-teacher");
  const handleSchoolChange = (e) => setSelectedSchool(e.target.value);
  const handleModalClose = () => {
    setIsModalVisible(false);
    setSelectedTeacherId(null);
  };

  // Column definitions for AG Grid
  const columnDefs = [
    // {
    //   headerCheckboxSelection: true,
    //   checkboxSelection: true,
    //   width: 50,
    //   field: "checkbox",
    //   pinned: "left",
    // },
    {
      headerName: "Teacher Name",
      field: "name",
      filter: true,
      floatingFilter: true,
      width: 200,
      resizable: true,
    },
    {
      headerName: "Experience (Years)",
      field: "experience",
      filter: true,
      floatingFilter: true,
      width: 150,
      resizable: true,
    },
    {
      headerName: "School Name",
      field: "schoolDetails.name",
      filter: true,
      floatingFilter: true,
      width: 250,
      resizable: true,
    },
    {
      headerName: "School Address",
      field: "schoolDetails.address",
      filter: true,
      floatingFilter: true,
      width: 300,
      resizable: true,
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
      ),
    },
  ];

  // Effects
  useEffect(() => {
    fetchSchools();
  }, []);

  useEffect(() => {
    fetchTeachers();
  }, [selectedSchool]);

  if (loading) return <LoadingSpinner />;
  if (errors.length > 0) return <ErrorMessage errors={errors} />;

  return (
    <div className="teacher-page">
      <div className="header">
        <div className="heading-container">
          <h2 className="teacher-heading">Teachers</h2>
        </div>
        <button
          onClick={handleCreateNew}
          className="g-button create-new-button"
        >
          Create New
        </button>
      </div>

      <div className="select-container">
        <div className="select-group">
          <SelectInput
            label="Select School"
            value={selectedSchool || ""}
            options={schoolList || []}
            onChange={handleSchoolChange}
            placeholder="Choose a school"
            className="select-input"
            labelClassName="select-label"
          />
        </div>
      </div>

      <div className="table-container">
        <div className="ag-theme-quartz">
          <AgGridTable
            rowData={teachers}
            columnDefs={columnDefs}
            defaultColDef={{
              resizable: true,
              sortable: true,
              wrapText: true,
              autoHeight: true,
            }}
            domLayout="autoHeight"
          />
        </div>
      </div>

      {isModalVisible && (
        <ConfirmationModal
          title="Confirm Deletion"
          message="Do you really want to delete this Teacher?"
          onConfirm={handleDeleteConfirm}
          onCancel={handleModalClose}
        />
      )}
    </div>
  );
};

export default TeacherPage;
