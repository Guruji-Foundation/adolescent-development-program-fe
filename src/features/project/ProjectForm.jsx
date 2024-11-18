import react from "react";
import { useState, useEffect } from "react";

import "../../CSS/Main.css";
import "./ProjectForm.css";
import { FaEdit, FaTrashAlt } from "react-icons/fa";
import ErrorMessage from "../../common/FormInput/ErrorMessage";
import NumberInput from "../../common/FormInput/NumberInput";
import TextInput from "../../common/FormInput/TextInput";
import Button from "../../common/FormInput/Button";
import useError from "../../hooks/useError";
import SelectInput from "../../common/FormInput/SelectInput";
import SuccessModal from "../../common/FeedbackComponents/Sucess/SuccessModal";
import AgGridTable from "../../common/GloabalComponent/AgGridTable";
import apiServices from "../../common/ServiCeProvider/Services";
import DateInput from "../../common/FormInput/DateInput";
import AddTopicWithProject from "./AddTopicWithProject";
import ConfirmationModal from "../../common/FeedbackComponents/Confirmation/ConfirmationModal";

const ProjectForm = ({
  handleSubmit,
  message,
  heading,
  handleCloseModal,
  projectDataDefault=null,
}) => {

  const [projectData, setProjectData] = useState({
    name: projectDataDefault?.name,
    description: projectDataDefault?.description,
    status: projectDataDefault?.status,
    projectCoordinatorId: projectDataDefault?.projectCoordinatorIds?.[0]?.id,
  });

  console.log("88888",projectDataDefault)
  const [coordinatorList, setCoordinatorList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const { errors, setError, clearError } = useError();
  const [showAddTopicModal, setShowAddTopicModal] = useState(false);
  const [topicDataArray, setTopicDataArray] = useState([]);
  const [isShowDeleteModal, setIsShowDeleteModal] = useState(false)
  const [selectedTopicId, setSelectedTopicId] = useState(-1);
  const [editTopicData, setEditTopicData] = useState(null);

  useEffect(() => {
    apiServices
      .getProjectCoOrdinatorList()
      .then((res) => {
        res = res?.data?.data?.projectCoordinators;
        if (res && res.length > 0) {
          setCoordinatorList(res);
        } else {
          setCoordinatorList([]);
        }
        setLoading(false);
      })
      .catch((error) => {
        setError("Error fetching Coordiantor data.");
        console.error("Error fetching Coordiantor data:", error);
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    if(projectDataDefault){
      setProjectData({
        name: projectDataDefault?.name,
        description: projectDataDefault?.description,
        status: projectDataDefault?.status,
        projectCoordinatorId: projectDataDefault?.projectCoordinatorIds?.[0]?.id,
      });
      setTopicDataArray(projectDataDefault?.topics)
    }
  }, [projectDataDefault]);

  const handleSubmitButton = async (e) => {
    e.preventDefault();
    try {
      const postData = {
        name: projectData?.name,
        description: projectData?.description,
        status: projectData?.status,
        projectCoordinatorIds: [projectData?.projectCoordinatorId],
        createOrUpdateTopicRequests: topicDataArray
      }
      const res = await handleSubmit(postData);
      if (res?.data?.status) {
        setShowModal(true);
        clearError();
      } else if (res?.data?.messages) {
        setError(res?.data?.messages.map((msg) => msg.message));
      } else {
        setError("An unexpected error occurred.");
      }
    } catch (err) {
      setError(err.message || "Error submitting the form.");
    }
  };

  const handleClose = () => {
    setShowModal(false);
    handleCloseModal();
  };

  const handleInputChange = (e) => {
    setProjectData({
      ...projectData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSchoolChange = (e) => {
    setProjectData({
      ...projectData,
      projectCoordinatorId: Number(e.target.value),
    });
  };
  const handleDeleteTopic = () => {
    setTopicDataArray((prevArray) =>
      prevArray.filter((item) => item?.id !== selectedTopicId)
    );
    setSelectedTopicId(-1)
    setIsShowDeleteModal(false);
  }
  const columnDefs = [
    {
      headerName: "Topic Name",
      field: "name",
      filter: true,
      floatingFilter: true,
      flex: 1,
    },
    {
      headerName: "Description",
      field: "description",
      filter: true,
      floatingFilter: true,
      flex: 1,
    },
    {
      headerName: "Actions",
      cellRenderer: (params) => {
        return (
          <div>
            <button
              type="button"
              onClick={() => { setEditTopicData(params?.data); setShowAddTopicModal(true) }}
              className="action-button edit-button"
            >
              <FaEdit />
            </button>
            <button
              type="button"
              onClick={() => { setSelectedTopicId(params?.data?.id); setIsShowDeleteModal(true) }}
              className="action-button delete-button"
            >
              <FaTrashAlt />
            </button>
          </div >
        );
      },
    },
  ]


  return (
    <div className="form-container">
      <h2>{heading}</h2>

      <form onSubmit={handleSubmitButton}>
        <div className="form-layout">
          <TextInput
            label="Project Name"
            name="name"
            value={projectData.name}
            onChange={handleInputChange}
            required
          />

          <TextInput
            label="Description"
            name="description"
            value={projectData.description}
            onChange={handleInputChange}
            required
          />
          <TextInput
            label="Status"
            name="status"
            value={projectData.status}
            onChange={handleInputChange}
            required
          />
          <SelectInput
            label="Project Coordinator"
            value={projectData.projectCoordinatorId || ""}
            onChange={handleSchoolChange}
            options={coordinatorList}
            required
          />
        </div>
        <button
          type="button"
          onClick={() => { setShowAddTopicModal(true) }}
          style={{ border: "none", backgroundColor: "inherit", color: "dodgerblue", fontWeight: "600" }}
        >
          + Add Topic
        </button>
        {
          topicDataArray?.length > 0 && <div className="ag-theme-quartz">
            <AgGridTable
              rowData={topicDataArray}
              columnDefs={columnDefs}
              domLayout={"autoHeight"}
            />
          </div>
        }
        <Button
          type="submit"
          label="Submit"
          className="g-button submit-button"
        />
      </form>
      {errors?.length > 0 && <ErrorMessage errors={errors} />}
      {showModal && <SuccessModal data={message} onClose={handleClose} />}
      {
        showAddTopicModal && <AddTopicWithProject onClose={() => { setEditTopicData(null); setShowAddTopicModal(false) }} topicDataArray={topicDataArray} setTopicDataArray={setTopicDataArray} editTopicData={editTopicData} />
      }
      {
        isShowDeleteModal && (
          <ConfirmationModal
            title="Confirm Deletion"
            message="Do you really want to delete this Topic? Corresponding Performance of Student will also be Deleted."
            onConfirm={handleDeleteTopic}
            onCancel={() => { setSelectedTopicId(-1); setIsShowDeleteModal(false) }}
          />
        )
      }
    </div>
  );
};

export default ProjectForm;
