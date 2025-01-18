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
import { ImCross, ImDownload2 } from "react-icons/im"
import axios from "axios";

const StudentPage = () => {
  const [isModalVisible, setIsModalVisible] = useState(false); // State to control modal visibility
  const [selectedStudentId, setSelectedStudentId] = useState(null);
  const [schoolList, setSchoolList] = useState([]);
  const [selectedSchool, setSelectedSchool] = useState(null);

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
  const columnDefs = [
    {
      headerName: "Name",
      field: "name",
      filter: true,
      floatingFilter: true,
    },
    {
      headerName: "School Name",
      field: "schoolName",
      filter: true,
      floatingFilter: true,
    },
    {
      headerName: "Date of Birth",
      field: "dob",
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
      headerName: "Phone Number",
      field: "phoneNumber",
      filter: true,
      floatingFilter: true,
    },
    {
      headerName: "Email",
      field: "email",
      filter: true,
      floatingFilter: true,
    },
    {
      headerName: "Parent Name",
      field: "parentName",
      filter: true,
      floatingFilter: true,
    },
    {
      headerName: "Parent Occupation",
      field: "parentOccupation",
      filter: true,
      floatingFilter: true,
    },
    {
      headerName: "Parent Phone Number",
      field: "parentPhoneNumber",
      filter: true,
      floatingFilter: true,
    },
    {
      headerName: "Actions",
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


  const downloadCsvData = (data, filename) => {
    const fileBlob = new Blob([data], {
      type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    });
    const fileUrl = window.URL.createObjectURL(fileBlob);
    const link = document.createElement('a');
  
    link.href = fileUrl;
    link.setAttribute('download', filename);
    document.body.appendChild(link);
  
    link.click();
    document.body.removeChild(link);
  };
  
 
const extractFilenameFromHeaderString = (rawString) => {
  if (!rawString) return 'download.xlsx'; // Default filename if header is missing

  const filenameMatch = rawString.match(/filename="([^"]+)"/);
  return filenameMatch ? filenameMatch[1] : 'download.xlsx';
};
  
  const downloadStudentList = async () => {
    try {
      // Make an API call to fetch CSV data
      const response = await axios.get(
        `https://adolescent-development-program-be-new-245843264012.us-central1.run.app/students/download?schoolId=${selectedSchool}`, // Adjust the endpoint
        {
          responseType: 'blob', // Ensure the response is treated as a binary blob
        }
      );
  
      // Extract filename from headers
      const contentDisposition = response.headers['content-disposition'] || '';
      const filename = extractFilenameFromHeaderString(contentDisposition);
  
      // Trigger download
      downloadCsvData(response.data, filename);
    } catch (err) {
      console.error('Error downloading student list:', err.message || err);
      throw err; // Optionally re-throw the error for higher-level handling
    }
  };

  return (<div className="project-page">
    <div className="header">
      <div className="heading-container">
        <h2 className="project-heading">Student</h2>
        <p className="subheading">List of Students</p>
      </div>
      <button
        className="g-button create-new-button"
        onClick={handelAddStudent}
      >
        Create New
      </button>
    </div>
    <div className='header'>
      <SelectInput
        label="Select School"
        value={selectedSchool || ""}
        options={schoolList}
        onChange={(e) => { setSelectedSchool(e.target.value) }}
      />

      <ImCross className="action-button delete-button"
        onClick={() => {
          setSelectedSchool(null)
        }} />

      <div onClick={downloadStudentList}>
        <ImDownload2 size={20} />
        &nbsp;DownLoad Student List
      </div>
    </div>

      <div className="ag-theme-quartz" style={{ height: "500px" }}>
        <AgGridTable rowData={rowData} columnDefs={columnDefs} />
      </div>

      {isModalVisible && (
        <ConfirmationModal
          title="Confirm Deletion"
          message="Do you really want to delete this Student?"
          onConfirm={confirmDelete}
          onCancel={cancelDelete}
        />
      )}
    </div>
  );
};

export default StudentPage;
