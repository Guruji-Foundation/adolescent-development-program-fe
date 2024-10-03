import React, { useState, useEffect } from "react";
import { FaEdit, FaTrashAlt } from "react-icons/fa";
import "./SchoolPage.css";
import { fetchSchools, deleteSchool } from "../../services/SchoolService";
import { School } from "../../types/School";
import { useNavigate } from "react-router-dom";
import ConfirmationModal from "../../common/Confirmation/ConfirmationModal"; // Import the modal component

const SchoolPage: React.FC = () => {
  const [schools, setSchools] = useState<School[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedSchoolId, setSelectedSchoolId] = useState<number | null>(null); // State to store the selected school for deletion
  const [isModalVisible, setIsModalVisible] = useState<boolean>(false); // State to control modal visibility
  const navigate = useNavigate();

  useEffect(() => {
    fetchSchools()
      .then((data) => {
        if (data && data.length > 0) {
          setSchools(data);
        } else {
          setSchools([]); // If no schools exist, set an empty array
        }
        setLoading(false);
      })
      .catch((error) => {
        setError("Error fetching school data.");
        console.error("Error fetching school data:", error);
        setLoading(false);
      });
  }, []);

  const handleEdit = (id: number) => {
    navigate(`/edit-school/${id}`);
  };

  // Handle showing the delete confirmation modal
  const handleDelete = (id: number) => {
    setSelectedSchoolId(id); // Store the school id for deletion
    setIsModalVisible(true); // Show the confirmation modal
  };

  // Confirm deletion and delete the school
  const confirmDelete = () => {
    if (selectedSchoolId !== null) {
      deleteSchool(selectedSchoolId)
        .then(() => {
          const updatedSchools = schools.filter(
            (school) => school.id !== selectedSchoolId
          );
          setSchools(updatedSchools); // Update the schools state
          setSelectedSchoolId(null); // Reset the selected school id
          setIsModalVisible(false); // Close the modal
        })
        .catch((error) => {
          console.error("Error deleting school:", error);
        });
    }
  };

  // Cancel deletion and close the modal
  const cancelDelete = () => {
    setSelectedSchoolId(null); // Reset the selected school id
    setIsModalVisible(false); // Close the modal
  };

  const handleCreateNew = () => {
    navigate("/create-school");
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div className="school-page">
      {/* Header Section */}
      <div className="header">
        <div className="heading-container">
          <h2 className="school-heading">School</h2>
          <p className="subheading">List of Schools</p>
        </div>
        <button className="create-new-button" onClick={handleCreateNew}>
          Create New
        </button>
      </div>

      {/* School Table */}
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
                <button
                  onClick={() => handleEdit(school.id)}
                  className="action-button edit-button"
                >
                  <FaEdit />
                </button>
                <button
                  onClick={() => handleDelete(school.id)}
                  className="action-button delete-button"
                >
                  <FaTrashAlt />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Confirmation Modal */}
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
