import React, { useState, useEffect } from "react";
import { FaEdit, FaTrashAlt } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

import "./ProjectAllocationPage.css"; // Assuming your styles are in TeacherPage.css
import "../../CSS/Main.css";

import ConfirmationModal from "../../common/FeedbackComponents/Confirmation/ConfirmationModal"; // Import the modal component
import LoadingSpinner from "../../common/FeedbackComponents/Loading/LoadingSpinner";
import useError from "../../hooks/useError";
import ErrorMessage from "../../common/FormInput/ErrorMessage";

import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-quartz.css";
import AgGridTable from "../../common/GloabalComponent/AgGridTable";

import apiServices from "../../common/ServiCeProvider/Services";
import SelectInput from "../../common/FormInput/SelectInput";
import Button from "../../common/FormInput/Button";

const ProjectAllocationPage = () => {
  const [loading, setLoading] = useState(true);
  const { errors, setError, clearError } = useError();

  const [schools, setSchools] = useState([]);
  const [selectedSchoolId, setSelectedSchoolId] = useState(null); // State to store the selected school for deletion

  const [projects, setProjects] = useState([]);
  const [selectedProjectId, setSelectedProjectId] = useState(null);

  const [students, setStudents] = useState([]);
  const [selectedStudentsId, setSelectedStudentsId] = useState(null);

  const [isModalVisible, setIsModalVisible] = useState(false); // State to control modal visibility

  const navigate = useNavigate();
  const getSchooList = async () => {
    try {
      // setLoading(true);
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
      setSchools(rowData);
      console.log("get list");
      console.log(rowData);
      // setLoading(false);
    } catch (err) {
      setError(err.message);
    }
  };

  useEffect(() => {
    getSchooList();
  }, []);

  const getProjectList = async () => {
    try {
      // setLoading(true);
      console.log("form get " + selectedSchoolId);
      const res = (await apiServices.getAllProjectList(selectedSchoolId))?.data
        ?.data?.projects;
      // console.log(res);
      setProjects(res);
      // setLoading(false);
    } catch (err) {
      setError(err.message);
    }
  };

  useEffect(() => {
    if (selectedSchoolId != null) getProjectList();
  }, [selectedSchoolId]);

  useEffect(() => {
    if (selectedProjectId && selectedSchoolId) {
      setLoading(true);
      apiServices
        .getAllUnAllocatedStudents(selectedSchoolId, selectedProjectId)
        .then((studentData) => {
          studentData = studentData?.data?.data?.students;
          setStudents(studentData);
        })
        .catch((error) => {
          setError("Error fetching Student data ");
          console.error("Error fetching student data:", error);
          setLoading(false);
        });
      setLoading(false);
    }
  }, [selectedSchoolId, selectedProjectId]);

  const handleSchoolChange = (e) => {
    console.log("from school handle ");
    setSelectedSchoolId(e.target.value);
    setSelectedProjectId(null);
    setStudents([]);
    console.log(e.target.value);
  };

  const handleProjectChange = (e) => {
    console.log("from project handle ");
    setSelectedProjectId(e.target.value);
    console.log(e.target.value);
  };

  const handleAssign = async (id) => {
    console.log("form handle assign");
    // console.log(selectedProjectId);
    try {
      const response = await apiServices.allocateProjectToStudent(
        id,
        selectedProjectId
      );
      const updateStudents = students.filter((student) => student.id != id);
      setStudents(updateStudents);
      console.log(response);
    } catch (error) {
      setError(error.message);
    }
  };
  // if (loading) {
  //   return <LoadingSpinner />;
  // }

  if (errors.length > 0) {
    return <div>{errors.length > 0 && <ErrorMessage errors={errors} />}</div>;
  }
  console.log(students);
  const columDefs = [
    {
      headerCheckboxSelection: true,
      checkboxSelection: false,
      width: 50,
    },
    {
      headerName: "Student Name",
      field: "name",
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
      headerName: "Address",
      field: "address",
      filter: true,
      floatingFilter: true,
    },

    {
      headerName: "Actions",
      field: "actions",
      filter: true,
      floatingFilter: true,
      cellRenderer: (params) => {
        return (
          <div>
            <button
              onClick={() => handleAssign(params?.data?.id)}
              className="action-button edit-button"
            >
              Assign
            </button>
          </div>
        );
      },
    },
  ];

  return (
    <div className="teacher-page">
      {/* Header Section */}
      <div className="header">
        <div className="heading-container">
          <h2 className="teacher-heading">Allocate Student to Project</h2>
        </div>
      </div>
      <div className="header">
        <SelectInput
          label="Select School"
          value={selectedSchoolId || ""}
          options={schools}
          onChange={handleSchoolChange}
          required
        />

        <SelectInput
          label="Select Project"
          value={selectedProjectId || ""}
          onChange={handleProjectChange}
          options={projects}
          required
        />
        {/* <Button
          label="Assign"
          type="button"
          className="g-button submit-button"
        /> */}
      </div>

      {/* AgGrid Tables */}
      <div className="ag-theme-quartz" style={{ height: "500px" }}>
        <AgGridTable rowData={students} columnDefs={columDefs} />
      </div>
      {/* Confirmation Modal */}
      {/* {isModalVisible && (
        <ConfirmationModal
          title="Confirm Deletion"
          message="Do you really want to delete this Teacher?"
          onConfirm={confirmDelete}
          onCancel={cancelDelete}
        />
      )} */}
    </div>
  );
};

export default ProjectAllocationPage;
