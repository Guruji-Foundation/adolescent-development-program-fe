import React, { useState, useEffect, useRef } from "react";
import { FaUserPlus, FaUserMinus } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

import "./AssignProjectToStudent.css";
import "../../CSS/Main.css";

import SuccessModal from "../../common/FeedbackComponents/Sucess/SuccessModal";
import LoadingSpinner from "../../common/FeedbackComponents/Loading/LoadingSpinner";
import useError from "../../hooks/useError";
import ErrorMessage from "../../common/FormInput/ErrorMessage";
import CustomTable from "../../common/GloabalComponent/CustomTable";
import apiServices from "../../common/ServiCeProvider/Services";
import SelectInput from "../../common/FormInput/SelectInput";

const AssignProjectToStudentPage = () => {
  const [loading, setLoading] = useState(true);
  const { errors, setError, clearError } = useError();
  const gridRef = useRef();
  const [schools, setSchools] = useState([]);
  const [selectedSchoolId, setSelectedSchoolId] = useState(null);
  const [projects, setProjects] = useState([]);
  const [selectedProjectId, setSelectedProjectId] = useState(null);

  const [students, setStudents] = useState([]);
  const [unAssignStudents, setUnAssignStudents] = useState([]);

  const [isModalVisible, setIsModalVisible] = useState(false);
  const [assignFlag, setAssignFlag] = useState(true);
  const AssignModelData = {
    heading: "Success!",
    description: "You Have Successfully Assigned Project to Student",
  };
  const UnAssignModelData = {
    heading: "Success!",
    description: "You Have Successfully Unassigned Project from Student",
  };
  const navigate = useNavigate();

  // Fetch list of schools on initial render
  const getSchooList = async () => {
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
      setSchools(rowData);
    } catch (err) {
      setError(err.message);
    }
  };

  // Fetch project list based on selected school
  const getProjectList = async () => {
    if (selectedSchoolId) {
      try {
        const res = (await apiServices.getAllProjectList(selectedSchoolId))
          ?.data?.data?.projects;
        setProjects(res);
      } catch (err) {
        setError(err.message);
      }
    }
  };

  // Fetch allocated students
  const getAllUnAssignedStudents = async () => {
    if (selectedProjectId && selectedSchoolId) {
      try {
        setLoading(true);
        const studentData = (
          await apiServices.getAllUnAllocatedStudents(
            selectedSchoolId,
            selectedProjectId
          )
        )?.data?.data?.students;
        setStudents(studentData);
      } catch (error) {
        setError("Error fetching allocated students");
      } finally {
        setLoading(false);
      }
    }
  };

  // Fetch unallocated students

  const getAllAssginedStudents = async () => {
    if (selectedProjectId && selectedSchoolId) {
      try {
        const res = (
          await apiServices.getAllAllocatedStudents(
            selectedSchoolId,
            selectedProjectId
          )
        )?.data?.data?.students;
        setUnAssignStudents(res);
      } catch (err) {
        setError(err.message);
      }
    }
  };

  useEffect(() => {
    getSchooList();
  }, []);
  console.log(selectedSchoolId + " " + selectedProjectId);

  useEffect(() => {
    if (selectedSchoolId) {
      getProjectList();
    }
  }, [selectedSchoolId]);

  useEffect(() => {
    if (selectedSchoolId && selectedProjectId) {
      getAllUnAssignedStudents();
      getAllAssginedStudents();
    }
  }, [selectedSchoolId, selectedProjectId]);

  const handleSchoolChange = (e) => {
    setSelectedSchoolId(e.target.value);
    setSelectedProjectId(null);
    setStudents([]);
    setUnAssignStudents([]);
  };

  const handleProjectChange = (e) => {
    setSelectedProjectId(e.target.value);
  };

  // Assign student to project
  const handleAssign = async (id) => {
    try {
      await apiServices.allocateProjectToStudent(
        selectedSchoolId,
        selectedProjectId,
        id
      );
      setAssignFlag(true);
      setIsModalVisible(true);

      // Refresh unassigned and assigned students data
      await getAllAssginedStudents();
      await getAllUnAssignedStudents();
    } catch (error) {
      setError(error.message);
    }
  };

  // Unassign student from project
  const handleUnAssign = async (id) => {
    try {
      await apiServices.deAllocateProjectToStudent(
        selectedSchoolId,
        selectedProjectId,
        id
      );
      setAssignFlag(false);
      setIsModalVisible(true);

      // Refresh assigned and unassigned students data
      await getAllAssginedStudents();
      await getAllUnAssignedStudents();
    } catch (error) {
      setError(error.message);
    }
  };

  const handleClose = () => {
    setIsModalVisible(false);
  };

  const unassignedColumnDefs = [
    {
      headerName: "Student Name",
      field: "name",
      flex: 2,
      cellRenderer: params => (
        <div className="student-name-cell">
          <span>{params.value}</span>
        </div>
      )
    },
    {
      headerName: "Phone Number",
      field: "phoneNumber",
      flex: 1,
      cellRenderer: params => (
        <div className="phone-cell">
          <span>{params.value}</span>
        </div>
      )
    },
    {
      headerName: "Email",
      field: "email",
      flex: 2,
      cellRenderer: params => (
        <div className="email-cell">
          <span>{params.value}</span>
        </div>
      )
    },
    {
      headerName: "Actions",
      width: 120,
      suppressSizeToFit: true,
      cellRenderer: (params) => (
        <div className="action-buttons">
          <button
            onClick={() => handleAssign(params?.data?.id)}
            className="action-button assign-button"
            title="Assign Student"
          >
            <FaUserPlus size={16} />
          </button>
        </div>
      ),
    },
  ];

  const assignedColumnDefs = [
    {
      headerName: "Student Name",
      field: "name",
      flex: 2,
      cellRenderer: params => (
        <div className="student-name-cell">
          <span>{params.value}</span>
        </div>
      )
    },
    {
      headerName: "Phone Number",
      field: "phoneNumber",
      flex: 1,
      cellRenderer: params => (
        <div className="phone-cell">
          <span>{params.value}</span>
        </div>
      )
    },
    {
      headerName: "Email",
      field: "email",
      flex: 2,
      cellRenderer: params => (
        <div className="email-cell">
          <span>{params.value}</span>
        </div>
      )
    },
    {
      headerName: "Actions",
      width: 120,
      suppressSizeToFit: true,
      cellRenderer: (params) => (
        <div className="action-buttons">
          <button
            onClick={() => handleUnAssign(params?.data?.id)}
            className="action-button unassign-button"
            title="Unassign Student"
          >
            <FaUserMinus size={16} />
          </button>
        </div>
      ),
    },
  ];

  if (loading) return <LoadingSpinner />;
  if (errors.length > 0) return <ErrorMessage errors={errors} />;

  return (
    <div className="teacher-page">
      <div className="header">
        <div className="heading-container">
          <h2 className="teacher-heading">Assign Project To Student</h2>
        </div>
      </div>

      <div className="filter-container">
        <div className="filters-wrapper">
          <div className="select-wrapper">
            <SelectInput
              label="Select School"
              value={selectedSchoolId || ""}
              options={schools}
              onChange={handleSchoolChange}
              selectsomthingtext={"Select School"}
              className="school-select"
            />
          </div>
          <div className="select-wrapper">
            <SelectInput
              label="Select Project"
              value={selectedProjectId || ""}
              onChange={handleProjectChange}
              options={projects}
              selectsomthingtext={"Select Project"}
              className="project-select"
              disabled={!selectedSchoolId}
            />
          </div>
        </div>
      </div>

      <div className="section-container">
        <div className="section-header">
          <h3 className="section-title">Unassigned Students</h3>
        </div>
        <CustomTable 
          rowData={students}
          columnDefs={unassignedColumnDefs}
          paginationPageSize={10}
          rowHeight={48}
          className="student-table"
        />
      </div>

      <div className="section-container">
        <div className="section-header">
          <h3 className="section-title">Assigned Students</h3>
        </div>
        <CustomTable 
          rowData={unAssignStudents}
          columnDefs={assignedColumnDefs}
          paginationPageSize={10}
          rowHeight={48}
          className="student-table"
        />
      </div>

      {isModalVisible && (
        <SuccessModal
          data={assignFlag ? AssignModelData : UnAssignModelData}
          onClose={handleClose}
        />
      )}
    </div>
  );
};

export default AssignProjectToStudentPage;
