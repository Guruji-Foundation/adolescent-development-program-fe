import React, { useState, useEffect } from "react";
import AgGridTable from "../../common/GloabalComponent/AgGridTable";
import ConfirmationModal from "../../common/FeedbackComponents/Confirmation/ConfirmationModal";

function ProjectCordinator() {
  const [isModalVisible, setIsModalVisible] = useState(false); // State to control modal visibility
  const [selectedId, setSelectedId] = useState(null);

  const columnDefs = [
    {
      headerName: "Name",
      field: "name",
      filter: true,
      floatingFilter: true,
    },
    {
      headerName: "Area Of Expertise",
      field: "areaOfExpertise",
      filter: true,
      floatingFilter: true,
    },
    {
      headerName: "Availability",
      field: "availability",
      filter: true,
      floatingFilter: true,
    },
    {
      headerName: "Mobile Number",
      field: "mobileNumber",
      filter: true,
      floatingFilter: true,
    },
    {
      headerName: "Address",
      field: "address",
      filter: true,
      floatingFilter: true,
    },];

  return (
    <div className="project-page">
      <div className="header">
        <div className="heading-container">
          <h2 className="project-heading">Student</h2>
          <p className="subheading">List of Students</p>
        </div>
        <button
          className="g-button create-new-button"
        // onClick={handelAddStudent}
        >
          Create New
        </button>
      </div>

      <div className="ag-theme-quartz" style={{ height: "500px" }}>
        <AgGridTable
          rowData={[]}
          columnDefs={columnDefs}
        />
      </div>

      {isModalVisible && (
        <ConfirmationModal
          title="Confirm Deletion"
          message="Do you really want to delete this Teacher?"
        // onConfirm={confirmDelete}
        // onCancel={cancelDelete}
        />
      )}
    </div>
  )
}

export default ProjectCordinator