import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

import "./AssignProjectToStudent.css";
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

const AssignProjectToSchoolPage = () => {
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
  const getAllAssignProject = async () => {
    try {
      const res = await apiServices.getProjectBySchool(selectedSchoolId);
      console.log(res?.data?.data?.schoolProjects);
      setProjects(res?.data?.data?.schoolProjects);
    } catch (error) {
      setError(error.message);
    }
  };

  useEffect(() => {
    getSchooList();
  }, []);

  useEffect(() => {
    if (selectedSchoolId) {
      console.log("hello form seleceted school");
      getAllAssignProject();
    }
  }, [selectedSchoolId]);

  const handleSchoolChange = (e) => {
    setSelectedSchoolId(e.target.value);
  };

  const handleProjectChange = (e) => {
    setSelectedProjectId(e.target.value);
  };

  const handleClose = () => {
    setIsModalVisible(false);
  };

  const handleCreateNew = () => {
    navigate("/project/school/assign");
  };
  if (errors.length > 0) return <ErrorMessage errors={errors} />;

  const columDefs = [
    { headerCheckboxSelection: true, checkboxSelection: false, width: 50 },
    {
      headerName: "Project Name",
      field: "project.name",
      filter: true,
      floatingFilter: true,
    },

    {
      headerName: "Teacher Name",
      field: "teacher.name",
      filter: true,
      floatingFilter: true,
    },
    {
      headerName: "School Name",
      field: "school.name",
      filter: true,
      floatingFilter: true,
    },
    {
      headerName: "Start Date",
      field: "startDate",
      filter: true,
      floatingFilter: true,
    },
    {
      headerName: "End Date",
      field: "endDate",
      filter: true,
      floatingFilter: true,
    },
    {
      headerName: "Actual Start Date",
      field: "actualStartDate",
      filter: true,
      floatingFilter: true,
    },
    {
      headerName: "Actual End Date",
      field: "actualEndDate",
      filter: true,
      floatingFilter: true,
    },
    // {
    //   headerName: "Actions",
    //   field: "actions",
    //   cellRenderer: (params) => (
    //     <button
    //       onClick={() => handleAssign(params?.data?.id)}
    //       className="action-button edit-button"
    //     >
    //       Assign
    //     </button>
    //   ),
    // },
  ];

  return (
    <div className="teacher-page">
      <div className="header">
        <div className="heading-container">
          <h2 className="teacher-heading">Assign Project To School</h2>
        </div>
        <button
          className="g-button create-new-button"
          onClick={handleCreateNew}
        >
          Assign
        </button>
      </div>

      <div className="header">
        <SelectInput
          label="Select School"
          value={selectedSchoolId || ""}
          options={schools}
          onChange={handleSchoolChange}
          selectsomthingtext={"Select School"}
          required
        />
      </div>

      <div className="ag-theme-quartz" style={{ height: "500px" }}>
        <AgGridTable rowData={projects} columnDefs={columDefs} />
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

export default AssignProjectToSchoolPage;
