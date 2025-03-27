import React, { useEffect, useState } from "react";
import { FaEdit, FaTrashAlt } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import "./SchoolPage.css";
import "../../CSS/Main.css";

import useError from "../../hooks/useError";
import ErrorMessage from "../../common/FormInput/ErrorMessage";
import LoadingSpinner from "../../common/FeedbackComponents/Loading/LoadingSpinner";
import ConfirmationModal from "../../common/FeedbackComponents/Confirmation/ConfirmationModal";
import Toast from "../../common/FeedbackComponents/Toast/Toast";
import FileOperationsButtons from "../../common/GloabalComponent/FileOperationsButtons";
import CustomTable from "../../common/GloabalComponent/CustomTable";
import apiServices from "../../common/ServiCeProvider/Services";
import axios from "axios";
const apiUrl = process.env.REACT_APP_API_BASE_URL;
function SchoolPage() {
  const [selectedSchoolId, setSelectedSchoolId] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [schoolRowData, setSchoolRowData] = useState([]);
  const [loading, setLoading] = useState(false);
  const { errors, setError, clearError } = useError();
  const [toast, setToast] = useState({
    show: false,
    message: "",
    type: "warning",
  });
  const [showUploadSuccessModal, setShowUploadSuccessModal] = useState(false);

  const navigate = useNavigate();

  const handleDelete = (id) => {
    clearError();
    setSelectedSchoolId(id);
    setIsModalVisible(true);
  };

  const confirmDelete = async () => {
    if (selectedSchoolId) {
      try {
        await apiServices.deleteSchool(selectedSchoolId);
        setSchoolRowData((prev) =>
          prev.filter((school) => school.id !== selectedSchoolId)
        );
        setSelectedSchoolId(null);
        setIsModalVisible(false);
        setToast({
          show: true,
          message: "School deleted successfully",
          type: "success",
        });
      } catch (error) {
        setError("Failed to delete school. Please try again later.");
        setToast({
          show: true,
          message: "Failed to delete school",
          type: "error",
        });
      }
    }
  };

  const handleEdit = (id) => navigate(`/edit-school/${id}`);
  const handleCreateNew = () => navigate("/create-school");

  const getSchoolList = async () => {
    setLoading(true);
    try {
      const data = (await apiServices.getAllSchoolList())?.data?.data?.schools;
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
    } catch (err) {
      setError(err.message);
      setToast({
        show: true,
        message: "Failed to fetch schools",
        type: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  const downloadCsvData = (data, filename) => {
    const fileBlob = new Blob([data], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });
    const fileUrl = window.URL.createObjectURL(fileBlob);
    const link = document.createElement("a");
    link.href = fileUrl;
    link.setAttribute("download", filename);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleDownloadTemplateClick = async () => {
    try {
      const url = `${apiUrl}/schools/download-template`;
      const response = await axios.get(url, {
        responseType: "blob",
        headers: { "Content-Type": "application/json" },
      });
      downloadCsvData(response.data, "school_template.xlsx");
    } catch (error) {
      setToast({
        show: true,
        message: "Failed to download template",
        type: "error",
      });
    }
  };

  const downloadSchoolList = async () => {
    try {
      const url = `${apiUrl}/schools/download`;
      const response = await axios.get(url, { responseType: "blob" });
      const now = new Date();
      const date = now.toISOString().split("T")[0];
      const time = now.toTimeString().split(" ")[0].replace(/:/g, "-");
      downloadCsvData(response.data, `schools_${date}_${time}.xlsx`);
    } catch (err) {
      setToast({
        show: true,
        message: "Failed to download school list",
        type: "error",
      });
    }
  };

  const handleFileUpload = async (file) => {
    if (file) {
      const formData = new FormData();
      formData.append("file", file);

      try {
        const url = `${apiUrl}/schools/upload`;
        const response = await axios.post(url, formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });

        if (response?.status === 200) {
          setShowUploadSuccessModal(true);
          await getSchoolList();
        }
      } catch (error) {
        setToast({
          show: true,
          message: "Failed to upload file",
          type: "error",
        });
      }
    }
  };

  useEffect(() => {
    getSchoolList();
  }, []);

  const columnDefs = [
    {
      headerName: "School Name",
      field: "name",
      flex: 2,
      cellRenderer: (params) => (
        <div className="school-name-cell">
          <span className="school-name-badge">{params.value}</span>
        </div>
      ),
    },
    {
      headerName: "Address",
      field: "address",
      flex: 2,
      cellRenderer: (params) => (
        <div className="address-cell">
          <span>{params.value}</span>
        </div>
      ),
    },
    {
      headerName: "Principal",
      field: "principalName",
      flex: 1.5,
      cellRenderer: (params) => (
        <div className="principal-cell">
          <span>{params.value}</span>
        </div>
      ),
    },
    {
      headerName: "Contact",
      field: "principalContactNo",
      flex: 1,
      cellRenderer: (params) => (
        <div className="contact-cell">
          <span className="contact-badge">{params.value}</span>
        </div>
      ),
    },
    {
      headerName: "Managing Trustee",
      field: "managingTrustee",
      flex: 1.5,
    },
    {
      headerName: "Trustee Contact",
      field: "trusteeContactInfo",
      flex: 1.5,
    },
    {
      headerName: "Actions",
      cellRenderer: (params) => (
        <div className="action-buttons">
          <button
            onClick={() => handleEdit(params.data.id)}
            className="action-button edit-button"
            title="Edit School"
          >
            <FaEdit size={16} />
          </button>
          <button
            onClick={() => handleDelete(params.data.id)}
            className="action-button delete-button"
            title="Delete School"
          >
            <FaTrashAlt size={16} />
          </button>
        </div>
      ),
      width: 120,
      suppressSizeToFit: true,
    },
  ];

  return (
    <div className="school-page">
      <div className="header">
        <div className="heading-container">
          <h2 className="school-heading">School Management</h2>
        </div>
        <div className="header-right">
          <FileOperationsButtons
            onUpload={handleFileUpload}
            onDownloadTemplate={handleDownloadTemplateClick}
            onDownloadData={downloadSchoolList}
            uploadTitle="Upload School Data"
            downloadTitle="Download Options"
          />
          <button
            className="create-new-button"
            onClick={handleCreateNew}
            title="Create New School"
          >
            Create New
          </button>
        </div>
      </div>

      {loading ? (
        <LoadingSpinner />
      ) : (
        <CustomTable
          rowData={schoolRowData}
          columnDefs={columnDefs}
          paginationPageSize={20}
          rowHeight={48}
          className="school-table"
        />
      )}

      {isModalVisible && (
        <ConfirmationModal
          title="Delete School"
          message="Do you really want to delete this school? This action cannot be undone."
          onConfirm={confirmDelete}
          onCancel={() => setIsModalVisible(false)}
        />
      )}

      {showUploadSuccessModal && (
        <ConfirmationModal
          title="Upload Successful"
          message="School data has been successfully uploaded!"
          onConfirm={() => setShowUploadSuccessModal(false)}
          onCancel={() => setShowUploadSuccessModal(false)}
          confirmText="OK"
          showCancelButton={false}
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

export default SchoolPage;
