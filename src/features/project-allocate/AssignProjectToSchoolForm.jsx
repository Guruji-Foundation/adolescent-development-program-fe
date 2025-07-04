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

const AssignProjectToSchoolForm = ({
  handleSubmit,
  message,
  heading,
  handleCloseModal,
  isEdit,
  projectAssignToSchoolDataDefault,
}) => {
  const [assignProject, setAssignProject] = useState({
    schoolId: null,
    teacherId: null,
    projectId: null,
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

    getAllProjectList();
  }, []);
  const getAllSchoolList = async (projectId) => {
    try {
      const res = await apiServices.getUnassignedSchoolByProjectId(projectId);
      setSchools(res?.data?.data?.schools);
    } catch (error) {
      setError(error.message);
    }
  };
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
    if (projectAssignToSchoolDataDefault != null) {
      setAssignProject({
        schoolId: projectAssignToSchoolDataDefault?.school?.id,
        teacherId: projectAssignToSchoolDataDefault?.teacher?.id,
        projectId: projectAssignToSchoolDataDefault?.project?.id,
        startDate: projectAssignToSchoolDataDefault?.startDate,
        endDate: projectAssignToSchoolDataDefault?.endDate,
        actualStartDate: projectAssignToSchoolDataDefault?.actualStartDate,
        actualEndDate: projectAssignToSchoolDataDefault?.actualEndDate,
      });
      if (projectAssignToSchoolDataDefault?.project)
        setProjects([projectAssignToSchoolDataDefault?.project]);
      if (projectAssignToSchoolDataDefault?.school)
        setSchools([projectAssignToSchoolDataDefault?.school]);
      getAllTeacherList(projectAssignToSchoolDataDefault?.school?.id);
    }

    // console.log("hello form useeffect");
  }, [projectAssignToSchoolDataDefault]);

  console.log(assignProject);
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
    if (e.target.name == "projectId") {
      getAllSchoolList(e.target.value);
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

  // console.log(teachers);
  //submit button
  const handleSubmitButton = async (e) => {
    e.preventDefault();
    console.log("hello from submit");
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
          <div className='form-row'>
            <SelectInput
              label="Projects"
              value={assignProject.projectId || ""}
              onChange={handleSelectChange}
              options={projects}
              selectsomthingtext={"Select Project"}
              name={"projectId"}
              required
              disabled={isEdit}
            />
            <SelectInput
              label="Schools"
              value={assignProject.schoolId || ""}
              onChange={handleSelectChange}
              options={schools}
              selectsomthingtext={"Select School"}
              name={"schoolId"}
              required
              disabled={isEdit}
            />
          </div>

          <div className='form-row'>

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
              // required
              min={undefined}
              max={undefined}
            />
          </div>

          <div className='form-row'>
            <DateInput
              label="End Date"
              name="endDate"
              value={assignProject.endDate}
              onChange={handleInputChange}
              // required
              min={undefined}
              max={undefined}
            />
            <DateInput
              label="Actual Start Date"
              name="actualStartDate"
              value={assignProject.actualStartDate}
              onChange={handleInputChange}
              min={undefined}
              max={undefined}
            />
          </div>


          <DateInput
            label="Actual End Date"
            name="actualEndDate"
            value={assignProject.actualEndDate}
            onChange={handleInputChange}
            min={undefined}
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

export default AssignProjectToSchoolForm;
