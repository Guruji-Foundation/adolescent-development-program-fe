import React, { useState, useEffect } from "react";
import AgGridTable from "../../common/GloabalComponent/AgGridTable";
import ConfirmationModal from "../../common/FeedbackComponents/Confirmation/ConfirmationModal";
import { FaEdit, FaTrashAlt } from "react-icons/fa";
import apiServices from "../../common/ServiCeProvider/Services";
import { useNavigate } from "react-router-dom";
import LoadingSpinner from "../../common/FeedbackComponents/Loading/LoadingSpinner"; // Import loading spinner
import ErrorMessage from "../../common/FormInput/ErrorMessage";
import useError from "../../hooks/useError";

function ProjectCordinator() {
  const [isModalVisible, setIsModalVisible] = useState(false); // State to control modal visibility
  const [selectedId, setSelectedId] = useState(0);
  const [rowData, setRowData] = useState([])
  const handleEdit = (id) => {
    navigate(`/edit-coordinator/${id}`);
  };
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const { errors, setError, clearError } = useError();

  const handleDelete = (id) => {
    // clearError();
    setSelectedId(id);
    setIsModalVisible(true);
  };

  const columnDefs = [
    {
      headerName: "Name",
      field: "name",
      filter: true,
      floatingFilter: true,
    },
    {
      headerName: "Area Of Expertise",
      field: "areaOfExpertise",
      filter: true,
      floatingFilter: true,
    },
    {
      headerName: "Availability",
      field: "availability",
      filter: true,
      floatingFilter: true,
    },
    {
      headerName: "Mobile Number",
      field: "mobileNumber",
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

  const getCoOrdinatorList = async () => {
    try {
      setLoading(true);
      const data = (await apiServices.getProjectCoOrdinatorList())?.data?.data?.projectCoordinators;
      const rowData = data?.map((item) => ({
        id: item?.id,
        name: item?.name,
        areaOfExpertise: item?.areaOfExpertise,
        availability: item?.availability,
        mobileNumber: item?.mobileNumber,
        address: item?.address,
      }));
      setRowData(rowData);
      setLoading(false);
    } catch (err) {
      setLoading(false);
      // setError(err.message);
    }
  };

  useEffect(() => {
    getCoOrdinatorList();
  }, []);

  if (loading) {
    return <LoadingSpinner />;
  }

  const confirmDelete = async () => {
    try {
      if (selectedId !== 0) {
        const res = await apiServices.deleteCoOrdinator(selectedId)
        if (res?.data?.status) {
          getCoOrdinatorList();
        }
        else {
          setError(res?.data?.message);

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

  if (errors.length > 0) {
    clearError();
    return <div>{errors.length > 0 && <ErrorMessage errors={errors} />}</div>;
  }

  const handleAddCoordinator = () => {
    navigate("/add-coordinator")
  }

  return (
    <div className="project-page">
      <div className="header">
        <div className="heading-container">
          <h2 className="project-heading">Project Coordinator</h2>
          <p className="subheading">List of Project Coordinators</p>
        </div>
        <button
          className="g-button create-new-button"
          onClick={handleAddCoordinator}
        >
          Create New
        </button>
      </div>

      <div className="ag-theme-quartz" style={{ height: "500px" }}>
        <AgGridTable
          rowData={rowData}
          columnDefs={columnDefs}
        />
      </div>

      {isModalVisible && (
        <ConfirmationModal
          title="Confirm Deletion"
          message="Do you really want to delete this coordiantor?"
          onConfirm={confirmDelete}
          onCancel={cancelDelete}
        />
      )}
    </div>
  )
}

export default ProjectCordinator