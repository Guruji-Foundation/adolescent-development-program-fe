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
  const [loading, setLoading] = useState(false);
  const { errors, setError, clearError } = useError();
  const gridRef = useRef();
  const gridRef2 = useRef();
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
  const [selectedAssignLength, setSelectedAssignLength] = useState(0);
  const [selectedUnAssignLength, setSelectedUnAssignLength] = useState(0);

  // Fetch list of schools on initial render
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
      setSchools(rowData);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Fetch project list based on selected school
  const getProjectList = async () => {
    if (selectedSchoolId) {
      try {
        setLoading(true);
        const res = (await apiServices.getAllProjectList(selectedSchoolId))
          ?.data?.data?.projects;
        setProjects(res);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
  };

  // Fetch allocated and unallocated students
  const fetchStudents = async () => {
    if (selectedProjectId && selectedSchoolId) {
      try {
        setLoading(true);
        const [unallocatedRes, allocatedRes] = await Promise.all([
          apiServices.getAllUnAllocatedStudents(selectedSchoolId, selectedProjectId),
          apiServices.getAllAllocatedStudents(selectedSchoolId, selectedProjectId)
        ]);

        setStudents(unallocatedRes?.data?.data?.students || []);
        setUnAssignStudents(allocatedRes?.data?.data?.students || []);
      } catch (error) {
        setError("Error fetching students");
      } finally {
        setLoading(false);
      }
    }
  };

  useEffect(() => {
    getSchooList();
  }, []);

  useEffect(() => {
    if (selectedSchoolId) {
      getProjectList();
      // Reset project selection and students when school changes
      setSelectedProjectId(null);
      setStudents([]);
      setUnAssignStudents([]);
    }
  }, [selectedSchoolId]);

  useEffect(() => {
    if (selectedSchoolId && selectedProjectId) {
      fetchStudents();
    }
  }, [selectedSchoolId, selectedProjectId]);

  const handleSchoolChange = (e) => {
    setSelectedSchoolId(e.target.value);
  };

  const handleProjectChange = (e) => {
    setSelectedProjectId(e.target.value);
  };

  // Assign student to project
  const handleAssign = async (id) => {
    try {
      setLoading(true);
      await apiServices.allocateProjectToStudent(
        selectedSchoolId,
        selectedProjectId,
        id
      );
      setAssignFlag(true);
      setIsModalVisible(true);
      await fetchStudents(); // Refresh both tables
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  // Unassign student from project
  const handleUnAssign = async (id) => {
    try {
      setLoading(true);
      await apiServices.deAllocateProjectToStudent(
        selectedSchoolId,
        selectedProjectId,
        id
      );
      setAssignFlag(false);
      setIsModalVisible(true);
      await fetchStudents(); // Refresh both tables
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setIsModalVisible(false);
  };

  const unassignedColumnDefs = [
    {
      headerCheckboxSelection: true,
      checkboxSelection: true,
      width: 50,
    },
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
            onClick={() => handleAssign([params?.data?.id])}
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
      headerCheckboxSelection: true,
      checkboxSelection: true,
      width: 50,
    },
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
            onClick={() => handleUnAssign([Number(params?.data?.id)])}
            className="action-button unassign-button"
            title="Unassign Student"
          >
            <FaUserMinus size={16} />
          </button>
        </div>
      ),
    },
  ];

  const handleGridReady = (params) => {
    gridRef.current = params;
  };

  const handleAssignSelectionChanged = () => {
    if (gridRef.current && gridRef.current.api) {
      const selectedRows = gridRef.current.api.getSelectedRows();
      setSelectedAssignLength(selectedRows.length); // Show button only if rows are selected
    }
  };

  const handleAssignMultiple = () => {
    if (gridRef.current && gridRef.current.api) {
      const selectedRows = gridRef.current.api.getSelectedRows();
      const selectedIds = selectedRows.map((row) => row.id);
      handleAssign(selectedIds)
      setSelectedAssignLength(0);
      console.log("Selected IDs:", selectedIds);
    } else {
      console.error("Grid API is not available.");
    }
  }

  const handleUnAssignMultiple = () => {
    if (gridRef2.current && gridRef2.current.api) {
      const selectedRows = gridRef2.current.api.getSelectedRows();
      const selectedIds = selectedRows.map((row) => row.id);
      handleUnAssign(selectedIds)
      setSelectedUnAssignLength(0);
      console.log("Selected IDs:", selectedIds);
    } else {
      console.error("Grid API is not available.");
    }
  }

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
          {selectedAssignLength > 0 && <div className="select-wrapper multiassign-button-container">

            <button className="create-new-button" onClick={handleAssignMultiple} >
              Assign {selectedAssignLength} Students
            </button>
          </div>}


        </div>
      </div>

      <div className="section-container">
        <div className="section-header">
          <h3 className="section-title">Unassigned Students</h3>
        </div>
        <CustomTable
          ref={gridRef}
          rowData={students}
          columnDefs={unassignedColumnDefs}
          paginationPageSize={10}
          onGridReady={handleGridReady}
          rowHeight={48}
          className="student-table"
          onSelectionChanged={handleAssignSelectionChanged}
          rowSelection="multiple"
        />
      </div>

      <div className="section-container">
        <div className="section-header" style={{ display: "flex" ,justifyContent:"space-between"}}>
          <h3 className="section-title">Assigned Students</h3>
          {selectedUnAssignLength > 0 && <div className="select-wrapper">

            <button className="create-new-button" onClick={handleUnAssignMultiple} >
              Unassign {selectedUnAssignLength} Students
            </button>
          </div>}
        </div>
        <CustomTable
          ref={gridRef2}
          rowData={unAssignStudents}
          columnDefs={assignedColumnDefs}
          paginationPageSize={10}
          onGridReady={(params) => { gridRef2.current = params; }}
          onSelectionChanged={() => {
            if (gridRef2.current && gridRef2.current.api) {
              const selectedRows = gridRef2.current.api.getSelectedRows();
              setSelectedUnAssignLength(selectedRows.length); // Show button only if rows are selected
            }
          }}
          rowHeight={48}
          className="student-table"
          rowSelection="multiple"
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
