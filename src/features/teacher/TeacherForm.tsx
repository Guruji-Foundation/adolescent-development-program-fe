import React, { useState, useEffect } from "react";
import SuccessModal from "../../common/FeedbackComponents/Sucess/SuccessModal"; // Import the modal component
import useError from "../../hooks/useError";
import useFetchSchools from "../../hooks/useFetchSchools";

import TextInput from "../../common/FormInput/TextInput"; // Import TextInput
import NumberInput from "../../common/FormInput/NumberInput"; // Import NumberInput
import SelectInput from "../../common/FormInput/SelectInput"; // Import SelectInput
import ErrorMessage from "../../common/FormInput/ErrorMessage"; // Import ErrorMessage
import Button from "../../common/FormInput/Button";

import "./TeacherForm.css";
import "../../CSS/Main.css";

interface TeacherFormProps {
  handleSubmit: (teacherData: any) => Promise<any>;
  message: { heading: string; description: string };
  heading: string;
  handleCloseModal: () => void;
  teacherDataDefault: any | null;
}

const TeacherForm: React.FC<TeacherFormProps> = ({
  handleSubmit,
  message,
  heading,
  handleCloseModal,
  teacherDataDefault,
}) => {
  const { schools } = useFetchSchools();
  //creating state and assigning teacherData from crate or edit component teacherData
  const [teacherData, setTeacherData] = useState({
    name: teacherDataDefault.name,
    experience: teacherDataDefault.experience,
    schoolId: teacherDataDefault.schoolId,
  });

  useEffect(() => {
    setTeacherData(teacherDataDefault);
  }, [teacherDataDefault]);

  const [showModal, setShowModal] = useState(false);

  const { errors, setError, clearError } = useError();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTeacherData({
      ...teacherData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSchoolChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setTeacherData({
      ...teacherData,
      schoolId: Number(e.target.value),
    });
  };

  const handleSubmitButton = async (e: React.FormEvent) => {
    e.preventDefault();
    if (teacherData.schoolId != null && teacherData.schoolId) {
      try {
        const response = await handleSubmit(teacherData);

        if (response.data?.status) {
          setShowModal(true);
          clearError();
        } else if (response.data?.messages) {
          setError(response.data.messages.map((msg: any) => msg.message));
        } else {
          setError("An unexpected error occurred.");
        }
      } catch (error: any) {
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
