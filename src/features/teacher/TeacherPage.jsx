import React, { useState, useEffect } from "react";
import { FaEdit, FaTrashAlt } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

import "./TeacherPage.css"; // Assuming your styles are in TeacherPage.css
import "../../CSS/Main.css";

import ConfirmationModal from "../../common/FeedbackComponents/Confirmation/ConfirmationModal"; // Import the modal component
import LoadingSpinner from "../../common/FeedbackComponents/Loading/LoadingSpinner";
import useError from "../../hooks/useError";
import ErrorMessage from "../../common/FormInput/ErrorMessage";

import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-quartz.css";
import AgGridTable from "../../common/GloabalComponent/AgGridTable";

import apiServices from "../../common/ServiCeProvider/Services";

const TeacherPage = () => {
  const [teachers, setTeachers] = useState([]);
  const [selectedTeacherId, setSelectedTeacherId] = useState(null);
  const [loading, setLoading] = useState(true);
  const { errors, setError, clearError } = useError();

  const [isModalVisible, setIsModalVisible] = useState(false); // State to control modal visibility

  const navigate = useNavigate();

  useEffect(() => {
    apiServices
      .getAllTeacherList()
      .then((teacherData) => {
        console.log(teacherData?.data?.data?.teacherDetails);
        setTeachers(teacherData?.data?.data?.teacherDetails);
        setLoading(false);
      })
      .catch((error) => {
        setError("Error fetching teacher data ");
        console.error("Error fetching teacher data:", error);
        setLoading(false);
      });
  }, []);

  const handleEdit = (id) => {
    console.log(id);
    navigate(`/edit-teacher/${id}`);
  };

  const handleDelete = (id) => {
    setSelectedTeacherId(id); // Store the school id for deletion
    setIsModalVisible(true); // Show the confirmation modal
  };

  // Confirm deletion and delete the school
  const confirmDelete = () => {
    if (selectedTeacherId != null) {
      apiServices
        .deleteTeacher(selectedTeacherId)
        .then(() => {
          const updatedTeachers = teachers.filter(
            (school) => school.id != selectedTeacherId
          );
          setTeachers(updatedTeachers); // Update the schools state
          setSelectedTeacherId(null); // Reset the selected school id
          setIsModalVisible(false); // Close the modal
        })
        .catch((error) => {
          console.error("Error deleting school:", error);
        });
    }
  };

  // Cancel deletion and close the modal
  const cancelDelete = () => {
    setSelectedTeacherId(null); // Reset the selected school id
    setIsModalVisible(false); // Close the modal
  };

  const handleCreateNew = () => {
    navigate("/create-teacher");
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  if (errors.length > 0) {
    return <div>{errors.length > 0 && <ErrorMessage errors={errors} />}</div>;
  }

  const columDefs = [
    {
      headerCheckboxSelection: true,
      checkboxSelection: false,
      width: 50,
    },
    {
      headerName: "Teacher Name",
      field: "name",
      filter: true,
      floatingFilter: true,
    },
    {
      headerName: "Experience (Years)",
      field: "experience",
      filter: true,
      floatingFilter: true,
    },
    {
      headerName: "School Name",
      field: `schoolDetails.name`,
      filter: true,
      floatingFilter: true,
    },
    {
      headerName: "School Address",
      field: "schoolDetails.address",
      filter: true,
      floatingFilter: true,
    },

    {
      headerName: "Actions",
      field: "actions",
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
    <div className="teacher-page">
      {/* Header Section */}
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

      {/* AgGrid Tables */}
      <div className="ag-theme-quartz" style={{ height: "500px" }}>
        <AgGridTable rowData={teachers} columnDefs={columDefs} />
      </div>
      {/* Confirmation Modal */}
      {isModalVisible && (
        <ConfirmationModal
          title="Confirm Deletion"
          message="Do you really want to delete this Teacher?"
          onConfirm={confirmDelete}
          onCancel={cancelDelete}
        />
      )}
    </div>
  );
};

export default TeacherPage;
