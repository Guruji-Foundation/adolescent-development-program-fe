import React, { useState, useEffect } from "react";
import "./StudentPage.css";
// import { fetchStudents } from '../../services/StudentService';
import { Student } from "../../types/Student";
import { FaEdit, FaTrashAlt } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import ConfirmationModal from "../../common/FeedbackComponents/Confirmation/ConfirmationModal";
import AgGridTable from "../../common/GloabalComponent/AgGridTable";
import apiServices from "../../common/ServiCeProvider/Services";

const StudentPage = () => {
  const [isModalVisible, setIsModalVisible] = useState(false); // State to control modal visibility
  const [selectedStudentId, setSelectedStudentId] = useState(null);
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

  const [rowData, setRowData] = useState([])
  const getAllSchools = async () => {
    try {
      const data = ((await apiServices.getStudentList())?.data?.data?.students)
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
      }))
      setRowData(rData);
    } catch (err) {
      console.log("Error in get Student", err)
    }
  }

  useState(() => {
    getAllSchools()
  }, [])

  const confirmDelete = async () => {
    try {
      const res = await apiServices.deleteStudent(selectedStudentId)
      setIsModalVisible(false);
      getAllSchools()
    } catch (err) {
      console.log("Error in delete", err)
    }
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


  console.log("88888", rowData)
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
        onConfirm={confirmDelete}
        onCancel={cancelDelete}
      />
    )}
  </div>);
};

export default StudentPage;
