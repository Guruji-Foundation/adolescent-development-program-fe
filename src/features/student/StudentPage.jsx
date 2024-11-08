import React, { useState, useEffect } from "react";
import "./StudentPage.css";
// import { fetchStudents } from '../../services/StudentService';
import { Student } from "../../types/Student";
import { FaEdit, FaTrashAlt } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import ConfirmationModal from "../../common/FeedbackComponents/Confirmation/ConfirmationModal";
import AgGridTable from "../../common/GloabalComponent/AgGridTable";

const StudentPage = () => {
  const [isModalVisible, setIsModalVisible] = useState(false); // State to control modal visibility
  const [selectedStudentId,setSelectedStudentId]=useState(null);
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
}

const columnDefs = [
  {
      headerName: "Name",
      field: "name",
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

const rowData = [
  {
      name: "Alice Johnson",
      dob: "2010-04-15",
      address: "123 Maple St, Springfield",
      phoneNumber: "123-456-7890",
      email: "alice.johnson@example.com",
      parentName: "Michael Johnson",
      parentOccupation: "Engineer",
      parentPhoneNumber: "987-654-3210",
  },
  {
      name: "Bob Smith",
      dob: "2011-09-21",
      address: "456 Oak Ave, Lincoln",
      phoneNumber: "321-654-0987",
      email: "bob.smith@example.com",
      parentName: "Sarah Smith",
      parentOccupation: "Teacher",
      parentPhoneNumber: "654-321-9870",
  },
  {
      name: "Catherine Lee",
      dob: "2012-12-30",
      address: "789 Pine Rd, Georgetown",
      phoneNumber: "213-456-7890",
      email: "catherine.lee@example.com",
      parentName: "John Lee",
      parentOccupation: "Doctor",
      parentPhoneNumber: "123-789-4560",
  },
  {
      name: "Daniel Green",
      dob: "2013-07-19",
      address: "101 Cedar St, Willowbrook",
      phoneNumber: "789-123-4567",
      email: "daniel.green@example.com",
      parentName: "Linda Green",
      parentOccupation: "Accountant",
      parentPhoneNumber: "456-789-1234",
  },
];



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

    <div className="ag-theme-quartz" style={{ height: "500px" }}>
      <AgGridTable rowData={rowData} columnDefs={columnDefs} />
    </div>

    {isModalVisible && (
      <ConfirmationModal
        title="Confirm Deletion"
        message="Do you really want to delete this Teacher?"
        onConfirm={cancelDelete}
        onCancel={cancelDelete}
      />
    )}
  </div>);
};

export default StudentPage;
