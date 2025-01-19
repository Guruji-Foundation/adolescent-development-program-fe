import React, { useState, useEffect } from "react";
import { FaEdit, FaTrashAlt } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import "./SchoolCoordinator.css";
import "../../CSS/Main.css";

import CustomTable from "../../common/GloabalComponent/CustomTable";
import ConfirmationModal from "../../common/FeedbackComponents/Confirmation/ConfirmationModal";
import LoadingSpinner from "../../common/FeedbackComponents/Loading/LoadingSpinner";
import ErrorMessage from "../../common/FormInput/ErrorMessage";
import Toast from '../../common/FeedbackComponents/Toast/Toast';
import useError from "../../hooks/useError";
import apiServices from "../../common/ServiCeProvider/Services";

function SchoolCoordinator() {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedId, setSelectedId] = useState(0);
  const [rowData, setRowData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState({ show: false, message: '', type: 'warning' });
  const { errors, setError, clearError } = useError();
  const navigate = useNavigate();

  const columnDefs = [
    {
      headerName: "Name",
      field: "name",
      minWidth: 180,
      flex: 1.2
    },
    {
      headerName: "Area Of Expertise",
      field: "areaOfExpertise",
      flex: 1
    },
    {
      headerName: "Availability",
      field: "availability",
      flex: 1
    },
    {
      headerName: "Mobile Number",
      field: "mobileNumber",
      flex: 1
    },
    {
      headerName: "Address",
      field: "address",
      flex: 1.5
    },
    {
      headerName: "Actions",
      cellRenderer: params => (
        <div className="action-buttons">
          <button
            onClick={() => handleEdit(params?.data?.id)}
            className="action-button edit-button"
            title="Edit Coordinator"
          >
            <FaEdit size={16} />
          </button>
          <button
            onClick={() => handleDelete(params?.data?.id)}
            className="action-button delete-button"
            title="Delete Coordinator"
          >
            <FaTrashAlt size={16} />
          </button>
        </div>
      ),
      width: 120,
      suppressSizeToFit: true
    }
  ];

  const getSchoolCoOrdinatorList = async () => {
    setLoading(true);
    try {
      const data = (await apiServices.getSchoolCoOrdinatorList())?.data?.data
        ?.projectCoordinators;
      const rowData = data?.map((item) => ({
        id: item?.id,
        name: item?.name,
        areaOfExpertise: item?.areaOfExpertise,
        availability: item?.availability,
        mobileNumber: item?.mobileNumber,
        address: item?.address,
      }));
      setRowData(rowData);
    } catch (err) {
      setError(err.message);
      setToast({
        show: true,
        message: 'Failed to fetch coordinators',
        type: 'error'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (id) => {
    navigate(`/edit-school-coordinator/${id}`);
  };

  const handleDelete = (id) => {
    clearError();
    setSelectedId(id);
    setIsModalVisible(true);
  };

  const confirmDelete = async () => {
    try {
      if (selectedId !== 0) {
        const res = await apiServices.deleteSchoolCoOrdinator(selectedId);
        if (res?.data?.status) {
          await getSchoolCoOrdinatorList();
          setToast({
            show: true,
            message: 'Coordinator deleted successfully',
            type: 'success'
          });
        } else {
          setError(res?.data?.message);
          setToast({
            show: true,
            message: 'Failed to delete coordinator',
            type: 'error'
          });
        }
        setIsModalVisible(false);
      }
    } catch (err) {
      setIsModalVisible(false);
      setError("Failed to delete Coordinator. Please try again later.");
    }
  };

  const cancelDelete = () => {
    setSelectedId(0);
    setIsModalVisible(false);
  };

  useEffect(() => {
    getSchoolCoOrdinatorList();
  }, []);

  if (errors.length > 0) {
    return <ErrorMessage errors={errors} />;
  }

  return (
    <div className="school-coordinator-page">
      <div className="header">
        <div className="heading-container">
          <h2 className="page-heading">School Coordinator Management</h2>
        </div>
        <button
          className="create-new-button"
          onClick={() => navigate("/add-school-coordinator")}
          title="Create New Coordinator"
        >
          Create New
        </button>
      </div>

      {loading ? (
        <LoadingSpinner />
      ) : (
        <CustomTable 
          rowData={rowData} 
          columnDefs={columnDefs}
          paginationPageSize={20}
          rowHeight={48}
          className="data-table"
        />
      )}

      {isModalVisible && (
        <ConfirmationModal
          title="Delete Coordinator"
          message="Do you really want to delete this coordinator? This action cannot be undone."
          onConfirm={confirmDelete}
          onCancel={cancelDelete}
        />
      )}

      {toast.show && (
        <Toast
          type={toast.type}
          message={toast.message}
          onClose={() => setToast({ ...toast, show: false })}
        />
      )}
    </div>
  );
}

export default SchoolCoordinator; 