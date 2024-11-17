import React, { useState, useEffect } from "react";

import SuccessModal from "../../common/FeedbackComponents/Sucess/SuccessModal"; // Import the modal component
import "./AssignProjectToSchoolForm.css";
import "../../CSS/Main.css";
import ErrorMessage from "../../common/FormInput/ErrorMessage";
import NumberInput from "../../common/FormInput/NumberInput";
import TextInput from "../../common/FormInput/TextInput";
import Button from "../../common/FormInput/Button";
import useError from "../../hooks/useError";
import SelectInput from "../../common/FormInput/SelectInput";
import DateInput from "../../common/FormInput/DateInput";

import apiServices from "../../common/ServiCeProvider/Services";

const TopicsForm = ({
  handleSubmit,
  message,
  heading,
  handleCloseModal,
  projectAssignToSchoolDataDefault,
}) => {
  const [assignProject, setAssignProject] = useState({
    schoolId: NaN,
    teacherId: NaN,
    projectId: NaN,
    startDate: "",
    endDate: "",
    actualStartDate: "",
    actualEndDate: "",
  });
  const [projects, setProjects] = useState([]);
  const [selectedProjectId, setSelectedProjectId] = useState(null);
  const [schools, setSchools] = useState([]);
  const [selectedSchoolId, setSelectedSchoolId] = useState(null);
  const [teachers, setTeachers] = useState([]);
  const [selectedTeacherId, setSelectedTeacherId] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const getAllProjectList = async () => {
      try {
        const res = await apiServices.getAllProjectList();
        setProjects(res?.data?.data?.projects);
      } catch (error) {
        setError(error.message);
      }
    };
    const getAllSchoolList = async () => {
      try {
        const res = await apiServices.getAllSchoolList();
        setSchools(res?.data?.data?.schools);
      } catch (error) {
        setError(error.message);
      }
    };

    getAllProjectList();
    getAllSchoolList();
  }, []);

  const getAllTeacherList = async (schoolId) => {
    try {
      console.log("form get all teacher list = " + schoolId);
      const res = await apiServices.getAllTeacherList(schoolId);
      setTeachers(res?.data?.data?.teacherDetails);
    } catch (error) {
      setError(error.message);
    }
  };
  useEffect(() => {
    setAssignProject({
      schoolId: projectAssignToSchoolDataDefault?.schoolId,
      teacherId: projectAssignToSchoolDataDefault?.teacherId,
      projectId: projectAssignToSchoolDataDefault?.projectId,
      startDate: projectAssignToSchoolDataDefault?.startDate,
      endDate: projectAssignToSchoolDataDefault?.endDate,
      actualStartDate: projectAssignToSchoolDataDefault?.actualStartDate,
      actualEndDate: projectAssignToSchoolDataDefault?.actualEndDate,
    });
    // console.log("hello form useeffect");
  }, [projectAssignToSchoolDataDefault]);

  const [showModal, setShowModal] = useState(false);
  const { errors, setError, clearError } = useError();

  const handleSelectChange = (e) => {
    setAssignProject({
      ...assignProject,
      [e.target.name]: Number(e.target.value),
    });
    if (e.target.name == "schoolId") {
      getAllTeacherList(e.target.value);
    }
    // console.log(e.target.name);
  };
  const handleInputChange = (e) => {
    // console.log(e.target.name + " " + e.target.value);
    setAssignProject({
      ...assignProject,
      [e.target.name]: e.target.value,
    });
  };

  console.log(teachers);
  //submit button
  const handleSubmitButton = async (e) => {
    e.preventDefault();

    try {
      const reqData = {
        schoolId: assignProject?.schoolId,
        teacherId: assignProject?.teacherId,
        studentIds: [],
        startDate: assignProject?.startDate,
        endDate: assignProject?.endDate,
        actualStartDate: assignProject?.actualStartDate,
        actualEndDate: assignProject?.actualEndDate,
      };
      const response = await handleSubmit(assignProject?.projectId, reqData); // Wait for the handleSubmit function

      if (response.data?.status) {
        setShowModal(true); // Show success modal
        clearError(); // Clear errors
      } else if (response.data?.messages) {
        setError(response.data.messages.map((msg) => msg.message));
      } else {
        setError("An unexpected error occurred.");
      }
    } catch (error) {
      setError(error.message || "Error submitting the form.");
    }
  };

  const handleClose = () => {
    setShowModal(false);
    handleCloseModal();
  };

  const getCurrentDate = () => {
    const today = new Date();
    return today.toISOString().split("T")[0];
  };

  return (
    <div className="form-container">
      <h2>{heading}</h2>
      <form onSubmit={handleSubmitButton}>
        <div className="form-layout">
          <SelectInput
            label="Projects"
            value={assignProject.projectId || ""}
            onChange={handleSelectChange}
            options={projects}
            selectsomthingtext={"Select Project"}
            name={"projectId"}
            required
          />
          <SelectInput
            label="Schools"
            value={assignProject.schoolId || ""}
            onChange={handleSelectChange}
            options={schools}
            selectsomthingtext={"Select School"}
            name={"schoolId"}
            required
          />
          <SelectInput
            label="Teachers"
            value={assignProject.teacherId || ""}
            onChange={handleSelectChange}
            options={teachers}
            selectsomthingtext={"Select Teacher"}
            name={"teacherId"}
            required
          />
          <DateInput
            label="Start Date"
            name="startDate"
            value={assignProject.startDate}
            onChange={handleInputChange}
            required
            min={getCurrentDate()}
            max={undefined}
          />

          <DateInput
            label="End Date"
            name="endDate"
            value={assignProject.endDate}
            onChange={handleInputChange}
            required
            min={getCurrentDate()}
            max={undefined}
          />
          <DateInput
            label="Actual Start Date"
            name="actualStartDate"
            value={assignProject.actualStartDate}
            onChange={handleInputChange}
            min={getCurrentDate()}
            max={undefined}
          />
          <DateInput
            label="Actual End Date"
            name="actualEndDate"
            value={assignProject.actualEndDate}
            onChange={handleInputChange}
            min={getCurrentDate()}
            max={undefined}
          />
        </div>
        {/* Use Button component */}
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

export default TopicsForm;
