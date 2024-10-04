import React, { useState } from "react";
import { FaEdit, FaTrashAlt, FaExclamationTriangle } from "react-icons/fa"; // Warning icon
import { useNavigate } from "react-router-dom";
import { deleteSchool } from "../../services/SchoolService";
import ConfirmationModal from "../../common/Confirmation/ConfirmationModal";
import Tooltip from "../../common/Tooltip/ToolTip";
import "../../CSS/Main.css";
import "./SchoolPage.css";

import useFetchSchools from "../../hooks/useFetchSchools";
import useError from "../../hooks/useError";


import ErrorMessage from "../../common/FormInput/ErrorMessage";

const SchoolPage: React.FC = () => {
  const [selectedSchoolId, setSelectedSchoolId] = useState<number | null>(null);
  const [isModalVisible, setIsModalVisible] = useState<boolean>(false);

  const navigate = useNavigate();
  const { schools, setSchools, loading } = useFetchSchools();
  const { errors, setError, clearError } = useError(); // Handle multiple errors


// delete school 
  const handleDelete = (id: number) => {
    clearError(); // Clear errors before attempting to delete
    setSelectedSchoolId(id);
    setIsModalVisible(true);
  };

  const confirmDelete = () => {
    if (selectedSchoolId !== null) {
      deleteSchool(selectedSchoolId)
        .then(() => {
          const updatedSchools = schools.filter(
            (school) => school.id !== selectedSchoolId
          );
          setSchools(updatedSchools);
          setSelectedSchoolId(null);
          setIsModalVisible(false);
        })
        .catch((error) => {
          console.error("Error deleting school:", error);
          setError("Failed to delete school. Please try again later.");
        });
    }
  };

  const cancelDelete = () => {
    setSelectedSchoolId(null);
    setIsModalVisible(false);
  };


  ///creation button 
  const handleCreateNew = () => {
    navigate("/create-school");
  };

  //edit button 
  const handleEdit = (id: number) => {
    navigate(`/edit-school/${id}`);
  };


  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="school-page">
      <div className="header">
        <div className="heading-container">
          <h2 className="school-heading">School</h2>
          <p className="subheading">List of Schools</p>
        </div>
        <button className="g-button create-new-button" onClick={handleCreateNew}>
          Create New
        </button>
      </div>

      {/* Global error handling for both fetch and delete */}
      {errors.length > 0 && <ErrorMessage errors={errors} />}

      <table className="school-table">
        <thead>
          <tr>
            <th>School Name</th>
            <th>Address</th>
            <th>Principal Name</th>
            <th>Principal Contact</th>
            <th>Managing Trustee</th>
            <th>Trustee Contact</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {schools.map((school) => (
            <tr key={school.id}>
              <td>{school.name}</td>
              <td>{school.address}</td>
              <td>{school.principalName}</td>
              <td>{school.principalContactNo}</td>
              <td>{school.managingTrustee}</td>
              <td>{school.trusteeContactInfo}</td>
              <td>
                <Tooltip text="Edit">
                  <button
                    onClick={() => handleEdit(school.id)}
                    className="action-button edit-button"
                  >
                    <FaEdit />
                  </button>
                </Tooltip>
                <Tooltip text="Delete">
                  <button
                    onClick={() => handleDelete(school.id)}
                    className="action-button delete-button"
                  >
                    <FaTrashAlt />
                  </button>
                </Tooltip>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {isModalVisible && (
        <ConfirmationModal
          title="Confirm Deletion"
          message="Do you really want to delete this school?"
          onConfirm={confirmDelete}
          onCancel={cancelDelete}
        />
      )}
    </div>
  );
};

export default SchoolPage;
