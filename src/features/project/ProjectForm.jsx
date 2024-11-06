import react from "react";
import { useState, useEffect } from "react";

import "../../CSS/Main.css";
import "./ProjectForm.css";

import ErrorMessage from "../../common/FormInput/ErrorMessage";
import NumberInput from "../../common/FormInput/NumberInput";
import TextInput from "../../common/FormInput/TextInput";
import Button from "../../common/FormInput/Button";
import useError from "../../hooks/useError";
import SelectInput from "../../common/FormInput/SelectInput";
import SuccessModal from "../../common/FeedbackComponents/Sucess/SuccessModal";

import apiServices from "../../common/ServiCeProvider/Services";
import DateInput from "../../common/FormInput/DateInput";

const ProjectForm = ({
  handleSubmit,
  message,
  heading,
  handleCloseModal,
  projectDataDefault,
}) => {
  const [projectData, setProjectData] = useState({
    name: projectDataDefault?.name,
    description: projectDataDefault?.description,
    startDate: projectDataDefault?.startDate,
    endDate: projectDataDefault?.endDate,
    actualStartDate: projectDataDefault?.actualStartDate,
    actualEndDate: projectDataDefault?.actualEndDate,
    status: projectDataDefault?.status,
    schoolId: projectDataDefault?.schoolId,
  });

  const [schools, setSchools] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const { errors, setError, clearError } = useError();

  const status = [
    { id: 1, name: "Started" },
    { id: 2, name: "In-Progress" },
    { id: 3, name: "Completed" },
  ];
  useEffect(() => {
    apiServices
      .getAllSchoolList()
      .then((res) => {
        res = res?.data?.data?.schools;
        // console.log(res);
        if (res && res.length > 0) {
          setSchools(res);
        } else {
          setSchools([]);
        }
        setLoading(false);
      })
      .catch((error) => {
        setError("Error fetching school data.");
        console.error("Error fetching school data:", error);
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    setProjectData(projectDataDefault);
  }, [projectDataDefault]);

  const handleSubmitButton = async (e) => {
    e.preventDefault();
    if (projectData.schoolId != null && projectData.schoolId) {
      try {
        const res = await handleSubmit(projectData);
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
    }
  };
  const handleClose = () => {
    setShowModal(false);
    handleCloseModal();
  };

  const handleInputChange = (e) => {
    // console.log(e.target.name + " " + e.target.value);
    setProjectData({
      ...projectData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSchoolChange = (e) => {
    setProjectData({
      ...projectData,
      schoolId: Number(e.target.value),
    });
  };

  const getCurrentDate = () => {
    const today = new Date();
    return today.toISOString().split("T")[0];
  };

  // console.log(schools);

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
          <DateInput
            label="Start Date"
            name="startDate"
            value={projectData.startDate}
            onChange={handleInputChange}
            required
            min={getCurrentDate()}
            max={undefined}
          />

          <DateInput
            label="End Date"
            name="endDate"
            value={projectData.endDate}
            onChange={handleInputChange}
            required
            min={getCurrentDate()}
            max={undefined}
          />
          <DateInput
            label="Actual Start Date"
            name="actualStartDate"
            value={projectData.actualStartDate}
            onChange={handleInputChange}
            min={getCurrentDate()}
            max={undefined}
          />
          <DateInput
            label="Actual End Date"
            name="actualEndDate"
            value={projectData.actualEndDate}
            onChange={handleInputChange}
            min={getCurrentDate()}
            max={undefined}
          />
          {/* <SelectInput
            label="Status"
            value={projectData.status || ""}
            onChange={handleInputChange}
            options={status}
            required
          /> */}

          <TextInput
            label="Status"
            name="status"
            value={projectData.status}
            onChange={handleInputChange}
            required
          />
          <SelectInput
            label="School Details"
            value={projectData.schoolId || ""}
            onChange={handleSchoolChange}
            options={schools}
            required
          />
        </div>
        <Button
          type="submit"
          label="Submit"
          className="g-button submit-button"
        />
      </form>
      {errors.length > 0 && <ErrorMessage errors={errors} />}
      {showModal && <SuccessModal data={message} onClose={handleClose} />}
    </div>
  );
};

export default ProjectForm;
