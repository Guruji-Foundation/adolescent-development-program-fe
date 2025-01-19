import react from "react";
import { useState, useEffect, useCallback, useMemo } from "react";
import { FaEdit, FaTrashAlt } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

import apiServices from "../../common/ServiCeProvider/Services";
import useError from "../../hooks/useError";
import LoadingSpinner from "../../common/FeedbackComponents/Loading/LoadingSpinner";
import ErrorMessage from "../../common/FormInput/ErrorMessage";
import AgGridTable from "../../common/GloabalComponent/AgGridTable";
import ConfirmationModal from "../../common/FeedbackComponents/Confirmation/ConfirmationModal";

import "./ProjectPage.css";
import "../../CSS/Main.css";

const ProjectPage = () => {
  const [loading, setLoading] = useState(false);
  const { errors, setError, clearError } = useError();
  const [selectedProjectId, setSelectedProjectId] = useState(null); // State to store the selected school for deletion
  const [isModalVisible, setIsModalVisible] = useState(false); // State to control modal visibility

  const [projects, setProjects] = useState([]);

  const navigate = useNavigate();
  const getDataPath = useCallback((data) => data.name, []);
  const autoGroupColumnDef = useMemo(() => {
    return {
      headerName: "Project/Topic Name",
      cellRendererParams: {
        suppressCount: true,
      },
    };
  }, []);

  const handleEdit = (id) => {
    navigate(`/edit-project/${id}`);
  };
  const handleAssign = () => {
    navigate("/project/school/assign");
  };
  const handleDelete = (id) => {
    setSelectedProjectId(id);
    setIsModalVisible(true);
  };

  const confirmDelete = () => {
    if (selectedProjectId != null) {
      apiServices
        .deleteProject(selectedProjectId)
        .then(() => {
          const updatedProjects = projects.filter(
            (project) => project.id != selectedProjectId
          );
          setProjects(updatedProjects);
          setSelectedProjectId(null);
          setIsModalVisible(false);
        })
        .catch((error) => {
          setError(error.message);
        });
    }
  };

  const cancelDelete = () => {
    setSelectedProjectId();
    setIsModalVisible(false);
  };

  const handleCreateNew = () => {
    navigate("/create-project");
  };

  const getProjectList = async () => {
    try {
      setLoading(true);
      const res = (await apiServices.getAllProjectList(null))?.data?.data
        ?.projects;
      setProjects(res);
      setLoading(false);
    } catch (err) {
      setError(err.message);
    }
  };

  useEffect(() => {
    getProjectList();
  }, []);

  if (loading) {
    return <LoadingSpinner />;
  }

  if (errors.length > 0) {
    clearError();
    return <ErrorMessage errors={errors} />;
  }

  const columnDefs = [
    {
      headercheckboxSelection: true,
      checkboxSelection: false,
      width: 50,
    },
    {
      headerName: "Project Name",
      field: "name",
      filter: true,
      floatingFilter: true,
      cellStyle: { textAlign: 'left' }
    },
    {
      headerName: "Description",
      field: "description",
      filter: true,
      floatingFilter: true,
      flex: 1,
      cellStyle: { textAlign: 'left' }
    },
    {
      headerName: "Status",
      field: "status",
      filter: true,
      floatingFilter: true,
      cellStyle: { textAlign: 'left' }
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

  return (
    <div className="project-page">
      <div className="header">
        <div className="heading-container">
          <h2 className="project-heading">Projects</h2>
        </div>
        <button
          className="g-button create-new-button"
          onClick={handleCreateNew}
        >
          Create New
        </button>
      </div>
      <div className="ag-theme-quartz" style={{ height: "60vh" }}>
        <AgGridTable
          rowData={projects}
          columnDefs={columnDefs}
          treeData={true}
          groupDefaultExpanded={-1}
          getDataPath={getDataPath}
          autoGroupColumnDef={autoGroupColumnDef}
        />
      </div>

      {isModalVisible && (
        <ConfirmationModal
          title="Confirm Deletion"
          message="Do you really want to delete this Project? Corresponding School data will also be deleted" 
          onConfirm={confirmDelete}
          onCancel={cancelDelete}
        />
      )}
    </div>
  );
};

export default ProjectPage;
