import React, { useEffect, useState } from "react";
import { FaEdit, FaTrashAlt } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import "../../CSS/Main.css";
import "./SchoolPage.css";
import useError from "../../hooks/useError";
import ErrorMessage from "../../common/FormInput/ErrorMessage";
import LoadingSpinner from "../../common/FeedbackComponents/Loading/LoadingSpinner"; // Import loading spinner
import ConfirmationModal from "../../common/FeedbackComponents/Confirmation/ConfirmationModal";
import { MdFileDownload, MdFileUpload } from "react-icons/md";
import { ImCross } from "react-icons/im";
import SelectInput from "../../common/FormInput/SelectInput";
import Toast from '../../common/FeedbackComponents/Toast/Toast';

import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-quartz.css";
import AgGridTable from "../../common/GloabalComponent/AgGridTable";

import apiServices from "../../common/ServiCeProvider/Services";
import axios from "axios";

function SchoolPage() {
  const [selectedSchoolId, setSelectedSchoolId] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [schoolRowData, setSchoolRowData] = useState([]);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const { errors, setError, clearError } = useError();
  const [toast, setToast] = useState({ show: false, message: '', type: 'warning' });
  const [showUploadSuccessModal, setShowUploadSuccessModal] = useState(false);

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
      setLoading(false);
    } catch (err) {
      setError(err.message);
    }
  };

  const handleDownloadTemplateClick = async () => {
    try {
      const response = await axios.get(
        `https://adolescent-development-program-be-new-245843264012.us-central1.run.app/schools/download-template`,
        {
          responseType: "blob",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      downloadCsvData(response.data, "school_template.xlsx");
    } catch (error) {
      console.error("Error downloading template:", error);
      setToast({
        show: true,
        message: 'Failed to download template',
        type: 'error'
      });
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

  const downloadSchoolList = async () => {
    try {
      let url = `https://adolescent-development-program-be-new-245843264012.us-central1.run.app/schools/download`;
      const response = await axios.get(url, {
        responseType: "blob",
      });

      // Generate filename with current date and time
      const now = new Date();
      const date = now.toISOString().split('T')[0];
      const time = now.toTimeString().split(' ')[0].replace(/:/g, '-');
      const filename = `schools_${date}_${time}.xlsx`;

      downloadCsvData(response.data, filename);
    } catch (err) {
      console.error("Error downloading school list:", err.message || err);
      setToast({
        show: true,
        message: 'Failed to download school list',
        type: 'error'
      });
    }
  };

  const handleFileUpload = async (event) => {
    const selectedFile = event.target.files[0];
    if (selectedFile) {
      const formData = new FormData();
      formData.append("file", selectedFile);
      
      try {
        const response = await axios.post(
          `https://adolescent-development-program-be-new-245843264012.us-central1.run.app/schools/upload`,
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
        );
        
        if (response?.status === 200) {
          setShowUploadSuccessModal(true);
          await getSchooList(); // Refresh the list
        }
      } catch (error) {
        console.error("Error uploading file:", error.response || error);
        setToast({
          show: true,
          message: 'Failed to upload file',
          type: 'error'
        });
      }
    }
    event.target.value = ""; // Reset input
  };

  const renderFileUploadSection = () => (
    <div className="file-upload-container">
      <div className="action-buttons-row">
        <button className="action-button" onClick={handleDownloadTemplateClick}>
          <MdFileDownload className="button-icon" />
          Download Template
        </button>
        
        <label htmlFor="fileInput" className="action-button">
          <MdFileUpload className="button-icon" />
          Upload School
        </label>
        <input
          id="fileInput"
          type="file"
          accept=".xlsx,.xls,.csv"
          onChange={handleFileUpload}
          style={{ display: "none" }}
        />
        
        <button className="action-button" onClick={downloadSchoolList}>
          <MdFileDownload className="button-icon" />
          Download Data
        </button>
      </div>
    </div>
  );

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
        </div>
        <button
          className="g-button create-new-button"
          onClick={handleCreateNew}
        >
          Create New
        </button>
      </div>

      {renderFileUploadSection()}

      <div className="ag-theme-quartz" style={{ height: "500px", width: "100%" }}>
        <AgGridTable 
          rowData={schoolRowData} 
          columnDefs={columDefs}
          pagination={true}
          paginationPageSize={10}
          rowHeight={48}
          headerHeight={48}
          animateRows={true}
          enableCellTextSelection={true}
          suppressMovableColumns={true}
          suppressDragLeaveHidesColumns={true}
          onGridSizeChanged={(params) => {
            params.api.sizeColumnsToFit();
          }}
          onFirstDataRendered={(params) => {
            params.api.sizeColumnsToFit();
          }}
          className="custom-ag-table"
        />
      </div>
      {isModalVisible && (
        <ConfirmationModal
          title={title}
          message={message}
          onConfirm={confirmDelete}
          onCancel={cancelDelete}
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
