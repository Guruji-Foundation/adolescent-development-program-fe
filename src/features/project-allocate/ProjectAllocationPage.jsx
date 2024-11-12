import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

import "./ProjectAllocationPage.css";
import "../../CSS/Main.css";

import SuccessModal from "../../common/FeedbackComponents/Sucess/SuccessModal";
import LoadingSpinner from "../../common/FeedbackComponents/Loading/LoadingSpinner";
import useError from "../../hooks/useError";
import ErrorMessage from "../../common/FormInput/ErrorMessage";

import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-quartz.css";
import AgGridTable from "../../common/GloabalComponent/AgGridTable";

import apiServices from "../../common/ServiCeProvider/Services";
import SelectInput from "../../common/FormInput/SelectInput";

const ProjectAllocationPage = () => {
  const [loading, setLoading] = useState(true);
  const { errors, setError, clearError } = useError();

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
  const getAllAllocatedStudents = async () => {
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

  const getAllUnAssginStudent = async () => {
    if (selectedProjectId && selectedSchoolId) {
      try {
        const res = (await apiServices.fetchProject(selectedProjectId))?.data
          ?.data?.students;
        setUnAssignStudents(res);
      } catch (err) {
        setError(err.message);
      }
    }
  };

  useEffect(() => {
    getSchooList();
  }, []);

  useEffect(() => {
    if (selectedSchoolId) {
      getProjectList();
    }
  }, [selectedSchoolId]);

  useEffect(() => {
    if (selectedSchoolId && selectedProjectId) {
      getAllAllocatedStudents();
      getAllUnAssginStudent();
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
      await apiServices.allocateProjectToStudent(id, selectedProjectId);
      setAssignFlag(true);
      setIsModalVisible(true);

      // Refresh unassigned and assigned students data
      await getAllAllocatedStudents();
      await getAllUnAssginStudent();
    } catch (error) {
      setError(error.message);
    }
  };

  // Unassign student from project
  const handleUnAssign = async (id) => {
    try {
      await apiServices.deAllocateProjectToStudent(id, selectedProjectId);
      setAssignFlag(false);
      setIsModalVisible(true);

      // Refresh assigned and unassigned students data
      await getAllUnAssginStudent();
      await getAllAllocatedStudents();
    } catch (error) {
      setError(error.message);
    }
  };

  const handleClose = () => {
    setIsModalVisible(false);
  };

  if (errors.length > 0) return <ErrorMessage errors={errors} />;

  const columDefs = [
    { headerCheckboxSelection: true, checkboxSelection: false, width: 50 },
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
    { headerName: "Email", field: "email", filter: true, floatingFilter: true },
    {
      headerName: "Actions",
      field: "actions",
      cellRenderer: (params) => (
        <button
          onClick={() => handleAssign(params?.data?.id)}
          className="action-button edit-button"
        >
          Assign
        </button>
      ),
    },
  ];

  const uncolumDefs = [
    { headerCheckboxSelection: true, checkboxSelection: false, width: 50 },
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
    { headerName: "Email", field: "email", filter: true, floatingFilter: true },
    {
      headerName: "Actions",
      field: "actions",
      cellRenderer: (params) => (
        <button
          onClick={() => handleUnAssign(params?.data?.id)}
          className="action-button edit-button"
        >
          Unassign
        </button>
      ),
    },
  ];

  return (
    <div className="teacher-page">
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
      </div>

      <div className="ag-theme-quartz" style={{ height: "500px" }}>
        <AgGridTable rowData={students} columnDefs={columDefs} />
      </div>

      <div className="header">
        <div className="heading-container">
          <h2 className="teacher-heading">Allocated Student to Project</h2>
        </div>
      </div>
      <div className="ag-theme-quartz" style={{ height: "500px" }}>
        <AgGridTable rowData={unAssignStudents} columnDefs={uncolumDefs} />
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

export default ProjectAllocationPage;
