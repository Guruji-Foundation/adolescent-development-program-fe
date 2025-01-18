import React, { useState, useEffect } from "react";
import "./StudentPage.css";
// import { fetchStudents } from '../../services/StudentService';
import { Student } from "../../types/Student";
import { FaEdit, FaTrashAlt } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import ConfirmationModal from "../../common/FeedbackComponents/Confirmation/ConfirmationModal";
import AgGridTable from "../../common/GloabalComponent/AgGridTable";
import apiServices from "../../common/ServiCeProvider/Services";
import SelectInput from "../../common/FormInput/SelectInput";
import { ImCross, ImDownload2, ImUpload2 } from "react-icons/im";
import { MdFileDownload, MdFileUpload } from "react-icons/md";
import axios from "axios";
import Toast from '../../common/FeedbackComponents/Toast/Toast';

const StudentPage = () => {
  const [isModalVisible, setIsModalVisible] = useState(false); // State to control modal visibility
  const [selectedStudentId, setSelectedStudentId] = useState(null);
  const [schoolList, setSchoolList] = useState([]);
  const [selectedSchool, setSelectedSchool] = useState(null);
  const [file, setFile] = useState(null);
  const [showUploadSuccessModal, setShowUploadSuccessModal] = useState(false);
  const [toast, setToast] = useState({ show: false, message: '', type: 'warning' });

  const navigate = useNavigate();

  const cancelDelete = () => {
    setSelectedStudentId(null);
    setIsModalVisible(false);
  };

  const handleDelete = (id) => {
    setSelectedStudentId(id);
    setIsModalVisible(true);
  };

  const handleEdit = (id) => {
    navigate(`/edit-student/${id}`);
  };

  const handelAddStudent = () => {
    navigate("/add-student");
  };

  const [rowData, setRowData] = useState([]);

  const getAllStudents = async () => {
    try {
      const data = (await apiServices.getStudentList(selectedSchool))?.data
        ?.data?.students;
      let rData = data?.map((data) => ({
        id: data?.id,
        name: data?.name,
        dob: data?.dob,
        address: data?.address,
        phoneNumber: data?.phoneNumber,
        email: data?.email,
        parentName: data?.parent?.name,
        parentOccupation: data?.parent?.occupation,
        parentPhoneNumber: data?.parent?.phoneNumber,
        schoolName: data?.schoolDetails?.name,
      }));
      setRowData(rData);
    } catch (err) {
      console.log("Error in get Student", err);
    }
  };

  const getAllSchool = async () => {
    try {
      const data = (await apiServices.getAllSchoolList())?.data?.data?.schools;
      setSchoolList(data);
    } catch (err) {
      throw err;
    }
  };

  useEffect(() => {
    getAllSchool();
  }, []);

  useEffect(() => {
    getAllStudents();
  }, [selectedSchool]);

  const confirmDelete = async () => {
    try {
      const res = await apiServices.deleteStudent(selectedStudentId);
      setIsModalVisible(false);
      getAllStudents();
    } catch (err) {
      console.log("Error in delete", err);
    }
  };

  const handleDownloadTemplateClick = async () => {
    try {
      const response = await axios.get(
        `https://adolescent-development-program-be-new-245843264012.us-central1.run.app/students/download-template`,
        {
          responseType: "blob",
          headers: {
            "Content-Type": "application/json",
            // Add any authentication headers if needed
            // 'Authorization': 'Bearer your-token'
          },
          // Removed withCredentials: true since it's causing CORS issues
        }
      );

      downloadCsvData(response.data, "student_template.xlsx");
    } catch (error) {
      console.error("Error downloading template:", error);
      // Add proper error handling here
    }
  };

  const uploadFile = async (file) => {
    if (!selectedSchool) {
      setToast({
        show: true,
        message: 'Please select a school before uploading',
        type: 'warning'
      });
      return;
    }
    const formData = new FormData();
    formData.append("file", file);
    try {
      const response = await axios.post(
        `https://adolescent-development-program-be-new-245843264012.us-central1.run.app/students/upload?schoolId=${selectedSchool}`,
        formData,
        {
          headers: {
            "sec-ch-ua-platform": '"Windows"',
            Referer:
              "https://adolescent-development-program-be-new-245843264012.us-central1.run.app/swagger-ui/index.html",
            "User-Agent":
              "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/132.0.0.0 Safari/537.36",
            accept: "application/json",
            "sec-ch-ua":
              '"Not A(Brand";v="8", "Chromium";v="132", "Google Chrome";v="132"',
            "sec-ch-ua-mobile": "?0",
            "Content-Type": "multipart/form-data",
          },
        }
      );
      if (response?.status === 200) {
        setFile(null);
        setShowUploadSuccessModal(true);
        await getAllStudents();
      }
    } catch (error) {
      console.error("Error uploading file:", error.response || error);
      alert("Failed to upload file. Please try again.");
    }
  };

  const handleFileChange = (event) => {
    const selectedFile = event.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
    }
    // Reset input value to allow selecting the same file again
    event.target.value = "";
  };

  const handleUpload = () => {
    if (file) {
      uploadFile(file);
    } else {
      alert("Please select a file to upload.");
    }
  };

  const columnDefs = [
    {
      headerName: "Name",
      field: "name",
      minWidth: 180,
      flex: 1.2,
      cellRenderer: params => (
        <div className="name-cell">
          <span>{params.value}</span>
        </div>
      ),
    },
    {
      headerName: "School Name",
      field: "schoolName",
      minWidth: 180,
      flex: 1.2,
      cellRenderer: params => (
        <div className="school-cell">
          <span className="school-badge">{params.value}</span>
        </div>
      ),
    },
    {
      headerName: "Date of Birth",
      field: "dob",
      minWidth: 130,
      flex: 1,
      cellRenderer: params => {
        const date = new Date(params.value);
        return date.toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'short',
          day: 'numeric'
        });
      },
    },
    {
      headerName: "Email",
      field: "email",
      minWidth: 200,
      flex: 1.5,
      cellRenderer: params => (
        <div className="email-cell">
          <span>{params.value}</span>
        </div>
      ),
    },
    {
      headerName: "Phone",
      field: "phoneNumber",
      minWidth: 150,
      flex: 1,
      cellRenderer: params => (
        <div className="phone-cell">
          <span>{params.value}</span>
        </div>
      ),
    },
    {
      headerName: "Address",
      field: "address",
      minWidth: 200,
      flex: 1.5,
      cellRenderer: params => (
        <div className="address-cell" title={params.value}>
          {params.value}
        </div>
      ),
    },
    {
      headerName: "Parent Name",
      field: "parentName",
      minWidth: 180,
      flex: 1.2,
    },
    {
      headerName: "Parent Occupation",
      field: "parentOccupation",
      minWidth: 180,
      flex: 1.2,
    },
    {
      headerName: "Parent Phone",
      field: "parentPhoneNumber",
      minWidth: 150,
      flex: 1,
    },
    {
      headerName: "Actions",
      field: "actions",
      cellRenderer: params => (
        <div className="action-buttons">
          <button
            onClick={() => handleEdit(params.data.id)}
            className="action-button edit-button"
            title="Edit Student"
          >
            <FaEdit />
          </button>
          <button
            onClick={() => handleDelete(params.data.id)}
            className="action-button delete-button"
            title="Delete Student"
          >
            <FaTrashAlt />
          </button>
        </div>
      ),
      filter: false,
      sortable: false,
      width: 120,
      minWidth: 120,
      maxWidth: 120,
      pinned: 'right',
      cellStyle: { padding: '0 8px' }
    }
  ];

  const defaultColDef = {
    sortable: true,
    filter: true,
    floatingFilter: true,
    resizable: true,
    suppressSizeToFit: true,
    flex: 1,
    cellStyle: { display: 'flex', alignItems: 'center' }
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

  const extractFilenameFromHeaderString = (rawString) => {
    if (!rawString) return "download.xlsx"; // Default filename if header is missing

    const filenameMatch = rawString.match(/filename="([^"]+)"/);
    return filenameMatch ? filenameMatch[1] : "download.xlsx";
  };

  const downloadStudentList = async () => {
    try {
      // Make an API call to fetch CSV data
      let url = `https://adolescent-development-program-be-new-245843264012.us-central1.run.app/students/download?schoolId=${selectedSchool}`;
      const response = await axios.get(
        url,
        {
          responseType: "blob", // Ensure the response is treated as a binary blob
        }
      );

      // Extract filename from headers
      const contentDisposition = response.headers["content-disposition"] || "";
      const filename = extractFilenameFromHeaderString(contentDisposition);

      // Trigger download
      downloadCsvData(response.data, filename);
    } catch (err) {
      console.error("Error downloading student list:", err.message || err);
      throw err; // Optionally re-throw the error for higher-level handling
    }
  };

  const renderFileUploadSection = () => (
    <div className="file-upload-container">
      <div className="school-selector-group">
        <div className="select-wrapper">
          <SelectInput
            label="Select School"
            value={selectedSchool || ""}
            options={schoolList}
            onChange={(e) => setSelectedSchool(e.target.value)}
            placeholder="Choose a school..."
          />
        </div>
        {selectedSchool && (
          <button 
            className="clear-school-button" 
            onClick={() => setSelectedSchool(null)}
            title="Clear selection"
          >
            <ImCross className="clear-icon" />
          </button>
        )}
      </div>

      <div className="action-buttons-row">
        <button className="action-button" onClick={handleDownloadTemplateClick}>
          <MdFileDownload className="button-icon" />
          Download Template
        </button>
        
        <label htmlFor="fileInput" className="action-button">
          <MdFileUpload className="button-icon" />
          Upload Student
        </label>
        <input
          id="fileInput"
          type="file"
          accept=".xlsx,.xls,.csv"
          onChange={(e) => {
            const selectedFile = e.target.files[0];
            if (selectedFile) {
              uploadFile(selectedFile);
            }
            e.target.value = "";
          }}
          style={{ display: "none" }}
        />
        
        <button className="action-button" onClick={downloadStudentList}>
          <MdFileDownload className="button-icon" />
          Download Data
        </button>
      </div>
    </div>
  );

  return (
    <div className="project-page">
      <div className="header">
        <div className="heading-container">
          <h2 className="project-heading">Student Management</h2>
        </div>
        <button
          className="create-new-button"
          onClick={handelAddStudent}
          title="Add New Student"
        >
          Create New
        </button>
      </div>

      {renderFileUploadSection()}

      <div className="ag-theme-quartz" style={{ height: "500px", width: "100%" }}>
        <AgGridTable 
          rowData={rowData} 
          columnDefs={columnDefs}
          defaultColDef={defaultColDef}
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

      {showUploadSuccessModal && (
        <ConfirmationModal
          title="Upload Successful"
          message="Student data has been successfully uploaded!"
          onConfirm={() => setShowUploadSuccessModal(false)}
          onCancel={() => setShowUploadSuccessModal(false)}
          confirmText="Confirm"
          cancelText="Cancel"
          showCancelButton={true}
        />
      )}

      {isModalVisible && (
        <ConfirmationModal
          title="Confirm Deletion"
          message="Do you really want to delete this Student?"
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
};

export default StudentPage;
