import React, { useEffect, useState } from "react";
import { FaEdit, FaTrashAlt } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import "../../CSS/Main.css";
import "./SchoolPage.css";
import useError from "../../hooks/useError";
import ErrorMessage from "../../common/FormInput/ErrorMessage";
import LoadingSpinner from "../../common/FeedbackComponents/Loading/LoadingSpinner"; // Import loading spinner
import ConfirmationModal from "../../common/FeedbackComponents/Confirmation/ConfirmationModal";

import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-quartz.css";
import AgGridTable from "../../common/GloabalComponent/AgGridTable";

import apiServices from "../../common/ServiCeProvider/Services";

function SchoolPage() {
  const [selectedSchoolId, setSelectedSchoolId] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [schoolRowData, setSchoolRowData] = useState([]);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const { errors, setError, clearError } = useError();

  const title = "Delete School!";
  const message = "Do you really want to delete this school";

  const handleDelete = (id) => {
    clearError();
    setSelectedSchoolId(id);
    setIsModalVisible(true);
  };

  const confirmDelete = () => {
    if (selectedSchoolId !== null) {
      apiServices
        .deleteSchool(selectedSchoolId)
        .then(() => {
          const updatedSchools = schoolRowData.filter(
            (school) => school.id !== selectedSchoolId
          );
          setSchoolRowData(updatedSchools);
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

  const handleCreateNew = () => {
    navigate("/create-school");
  };

  const handleEdit = (id) => {
    navigate(`/edit-school/${id}`);
  };

  const getSchooList = async () => {
    try {
      setLoading(true);
      const data = (await apiServices.getAllSchoolList())?.data?.data?.students;
      const rowData = data?.map((item) => ({
        id: item?.id,
        name: item?.name,
        address: item?.address,
        principalName: item?.principalName,
        principalContactNo: item?.principalContactNo,
        managingTrustee: item?.managingTrustee,
        trusteeContactInfo: item?.trusteeContactInfo,
      }));
      setSchoolRowData(rowData);
      setLoading(false);
    } catch (err) {
      setError(err.message);
    }
  };

  useEffect(() => {
    getSchooList();
  }, []);

  if (loading) {
    return <LoadingSpinner />;
  }
  if (errors.length > 0) {
    clearError();
    return <div>{errors.length > 0 && <ErrorMessage errors={errors} />}</div>;
  }

  const columDefs = [
    {
      headerCheckboxSelection: true,
      checkboxSelection: false,
      width: 50,
    },
    {
      headerName: "School Name",
      field: "name",
      filter: true,
      floatingFilter: true,
    },
    {
      headerName: "Address",
      field: "address",
      filter: true,
      floatingFilter: true,
    },
    {
      headerName: "Principal Name",
      field: "principalName",
      filter: true,
      floatingFilter: true,
    },
    {
      headerName: "Managing Trustee",
      field: "principalContactNo",
      filter: true,
      floatingFilter: true,
    },
    {
      headerName: "Trustee Contact",
      field: "managingTrustee",
      filter: true,
      floatingFilter: true,
    },
    {
      headerName: "Trustee Contact Info",
      field: "trusteeContactInfo",
      filter: true,
      floatingFilter: true,
    },
    {
      headerName: "Actions",
      // field: "actions",
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
          <h2 className="school-heading">School</h2>
          <p className="subheading">List of Schools</p>
        </div>
        <button
          className="g-button create-new-button"
          onClick={handleCreateNew}
        >
          Create New
        </button>
      </div>
      <div className="ag-theme-quartz" style={{ height: "500px" }}>
        <AgGridTable rowData={schoolRowData} columnDefs={columDefs} />
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
}

export default SchoolPage;
