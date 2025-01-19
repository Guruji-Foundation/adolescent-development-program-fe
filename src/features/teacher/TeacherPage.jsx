import React, { useState, useEffect } from "react";
import { FaEdit, FaTrashAlt } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import "./TeacherPage.css";
import "../../CSS/Main.css";

import ConfirmationModal from "../../common/FeedbackComponents/Confirmation/ConfirmationModal";
import LoadingSpinner from "../../common/FeedbackComponents/Loading/LoadingSpinner";
import ErrorMessage from "../../common/FormInput/ErrorMessage";
import SelectInput from "../../common/FormInput/SelectInput";
import CustomTable from "../../common/GloabalComponent/CustomTable";
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

  async function fetchSchools() {
    try {
      const response = await apiServices.getAllSchoolList();
      setSchoolList(response?.data?.data?.schools || []);
    } catch (error) {
      setError("Error fetching school data");
      console.error(error);
    }
  }

  async function fetchTeachers() {
    setLoading(true);
    try {
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

  const columnDefs = [
    {
      headerName: "Teacher Name",
      field: "name",
      flex: 2,
      cellRenderer: params => (
        <div className="teacher-name-cell">
          <span>{params.value}</span>
        </div>
      )
    },
    {
      headerName: "Experience (Years)",
      field: "experience",
      flex: 1,
      cellRenderer: params => (
        <div className="experience-cell">
          <span className="experience-badge">
            {params.value} years
          </span>
        </div>
      )
    },
    {
      headerName: "School Name",
      field: "schoolDetails.name",
      flex: 2,
      cellRenderer: params => (
        <div className="school-cell">
          <span className="school-badge">{params.value}</span>
        </div>
      )
    },
    {
      headerName: "School Address",
      field: "schoolDetails.address",
      flex: 3,
      cellRenderer: params => (
        <div className="address-cell">
          <span>{params.value}</span>
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
            title="Edit Teacher"
          >
            <FaEdit size={16} />
          </button>
          <button
            onClick={() => handleDelete(params?.data?.id)}
            className="action-button delete-button"
            title="Delete Teacher"
          >
            <FaTrashAlt size={16} />
          </button>
        </div>
      ),
      width: 120,
      suppressSizeToFit: true
    }
  ];

  useEffect(() => {
    fetchSchools();
  }, []);

  useEffect(() => {
    fetchTeachers();
  }, [selectedSchool]);

  if (errors.length > 0) return <ErrorMessage errors={errors} />;

  return (
    <div className="teacher-page">
      <div className="header">
        <div className="heading-container">
          <h2 className="teacher-heading">Teacher Management</h2>
        </div>
        <button
          onClick={handleCreateNew}
          className="create-new-button"
          title="Create New Teacher"
        >
          Create New
        </button>
      </div>

      <div className="filter-container">
        <div className="select-wrapper">
          <SelectInput
            label="Filter by School"
            value={selectedSchool || ""}
            options={schoolList}
            onChange={handleSchoolChange}
            placeholder="Select a school to filter teachers..."
            className="school-select"
          />
        </div>
      </div>

      {loading ? (
        <LoadingSpinner />
      ) : (
        <CustomTable 
          rowData={teachers} 
          columnDefs={columnDefs}
          paginationPageSize={20}
          rowHeight={48}
          className="teacher-table"
        />
      )}

      {isModalVisible && (
        <ConfirmationModal
          title="Delete Teacher"
          message="Do you really want to delete this teacher?"
          onConfirm={handleDeleteConfirm}
          onCancel={handleModalClose}
        />
      )}
    </div>
  );
};

export default TeacherPage;
