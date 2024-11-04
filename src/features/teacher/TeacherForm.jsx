import React, { useState, useEffect } from "react";
import SuccessModal from "../../common/FeedbackComponents/Sucess/SuccessModal"; // Import the modal component
import useError from "../../hooks/useError";

import TextInput from "../../common/FormInput/TextInput"; // Import TextInput
import NumberInput from "../../common/FormInput/NumberInput"; // Import NumberInput
import SelectInput from "../../common/FormInput/SelectInput"; // Import SelectInput
import ErrorMessage from "../../common/FormInput/ErrorMessage"; // Import ErrorMessage
import Button from "../../common/FormInput/Button";

import "./TeacherForm.css";
import "../../CSS/Main.css";

import apiServices from "../../common/ServiCeProvider/Services";

const TeacherForm = ({
  handleSubmit,
  message,
  heading,
  handleCloseModal,
  teacherDataDefault,
}) => {
  const [schools, setSchools] = useState([]);
  const [loading, setLoading] = useState(false);
  const [teacherData, setTeacherData] = useState({
    name: teacherDataDefault?.name,
    experience: teacherDataDefault?.experience,
    schoolId: teacherDataDefault?.schoolId,
  });

  useEffect(() => {
    setTeacherData(teacherDataDefault);
  }, [teacherDataDefault]);

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

  const [showModal, setShowModal] = useState(false);

  const { errors, setError, clearError } = useError();

  const handleInputChange = (e) => {
    setTeacherData({
      ...teacherData,
      [e.target.name]: e.target.value,
    });
  };
  console.log(teacherData.schoolId);
  const handleSchoolChange = (e) => {
    setTeacherData({
      ...teacherData,
      schoolId: Number(e.target.value),
    });
  };

  const handleSubmitButton = async (e) => {
    e.preventDefault();
    if (teacherData.schoolId != null && teacherData.schoolId) {
      try {
        const response = await handleSubmit(teacherData);

        if (response?.data?.status) {
          setShowModal(true);
          clearError();
        } else if (response?.data?.messages) {
          setError(response?.data?.messages.map((msg) => msg.message));
        } else {
          setError("An unexpected error occurred.");
        }
      } catch (error) {
        setError(error.message || "Error submitting the form.");
      }
    }
  };

  const handleClose = () => {
    setShowModal(false);
    handleCloseModal();
  };

  return (
    <div className="form-container">
      <h2>{heading}</h2>
      <form onSubmit={handleSubmitButton}>
        <div className="form-layout">
          <TextInput
            label="Teacher Name"
            name="name"
            value={teacherData.name}
            onChange={handleInputChange}
            required
          />
          <NumberInput
            label="Experience"
            name="experience"
            value={teacherData.experience}
            onChange={handleInputChange}
            required
          />
          <SelectInput
            label="School Details"
            value={teacherData.schoolId || ""}
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

export default TeacherForm;
