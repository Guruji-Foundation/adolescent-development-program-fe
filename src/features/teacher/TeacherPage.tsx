import React, { useState, useEffect } from "react";
import axios from "axios";
import { FaEdit, FaTrashAlt } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

import "./TeacherPage.css"; // Assuming your styles are in TeacherPage.css
import { Teacher } from "../../types/Teacher";
import { fetchTeachers, deleteTeacher } from "../../services/TeacherService";
import ConfirmationModal from "../../common/Confirmation/ConfirmationModal"; // Import the modal component
import ToolTip from "../../common/Tooltip/ToolTip";

import "../../CSS/Main.css";

const TeacherPage: React.FC = () => {
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedTeacherId, setSelectedTeacherId] = useState<number | null>(
    null
  ); // State to store the selected school for deletion
  const [isModalVisible, setIsModalVisible] = useState<boolean>(false); // State to control modal visibility

  const navigate = useNavigate();

  useEffect(() => {
    fetchTeachers()
      .then((teacherData) => {
        if (teacherData && teacherData.length) {
          setTeachers(teacherData); // Ensure data is properly set
        } else {
          setTeachers([]); // Set to an empty array if no data is found
        }
        setLoading(false);
      })
      .catch((error) => {
        setError("Error fetching teacher data");
        console.error("Error fetching teacher data:", error);
        setLoading(false);
      });
  }, []);

  const handleEdit = (id: number) => {
    console.log(id);
    navigate(`/edit-teacher/${id}`);
  };

  const handleDelete = (id: number) => {
    setSelectedTeacherId(id); // Store the school id for deletion
    setIsModalVisible(true); // Show the confirmation modal
  };

  // Confirm deletion and delete the school
  const confirmDelete = () => {
    if (selectedTeacherId !== null) {
      deleteTeacher(selectedTeacherId)
        .then(() => {
          const updatedTeachers = teachers.filter(
            (school) => school.id !== selectedTeacherId
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
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div className="teacher-page">
      {/* Header Section */}
      <div className="header">
        <div className="heading-container">
          <h2 className="teacher-heading">Teachers</h2>
          <p className="subheading">List of Teachers</p>
        </div>
        <button
          onClick={handleCreateNew}
          className="g-button create-new-button"
        >
          Create New
        </button>
      </div>

      {/* Teacher Table */}
      {teachers.length > 0 ? (
        <table className="teacher-table">
          <thead>
            <tr>
              <th>Teacher Name</th>
              <th>Experience (Years)</th>
              <th>School Name</th>
              <th>School Address</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {teachers.map((teacher) => (
              <tr key={teacher.id}>
                <td>{teacher.name}</td>
                <td>{teacher.experience}</td>
                <td>{teacher.schoolDetails.name}</td>
                <td>{teacher.schoolDetails.address}</td>
                <td>
                  <ToolTip text="Edit">
                    <button
                      onClick={() => handleEdit(teacher.id)}
                      className="action-button edit-button"
                    >
                      <FaEdit />
                    </button>
                  </ToolTip>
                  <ToolTip text="Delete">
                    <button
                      onClick={() => handleDelete(teacher.id)}
                      className="action-button delete-button"
                    >
                      <FaTrashAlt />
                    </button>
                  </ToolTip>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <div>No teachers available</div>
      )}
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
