import React, { useState, useEffect } from "react";
import axios from "axios";
import SuccessModal from "../../common/Sucess/SuccessModal"; // Import the modal component
import "./SchoolForm.css";
import "../../CSS/Main.css";

import { createSchool } from "../../services/SchoolService";
import ErrorMessage from "../../common/FormInput/ErrorMessage";
import NumberInput from "../../common/FormInput/NumberInput";
import TextInput from "../../common/FormInput/TextInput";

interface SchoolFormProps {
  handleSubmit: (schoolData: any) => Promise<any>;
  message: { heading: string; description: string };
  heading: string;
  handleCloseModal: () => void;
  schoolDataDefault: any | null;
}

const SchoolForm: React.FC<SchoolFormProps> = ({
  handleSubmit,
  message,
  heading,
  handleCloseModal,
  schoolDataDefault,
}) => {
  const [schoolData, setSchoolData] = useState({
    name: "",
    address: "",
    phoneNumber: "",
    principalName: "",
    principalContactNo: "",
    managingTrustee: "",
    trusteeContactInfo: "",
    website: "",
  });

  const [showModal, setShowModal] = useState(false);
  const [errorMessages, setErrorMessages] = useState<string[] | null>(null);

  useEffect(() => {
    if (schoolDataDefault != null) {
      console.log("if");
      console.log(schoolDataDefault);
      setSchoolData(schoolDataDefault);
    }
  }, [schoolDataDefault]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSchoolData({
      ...schoolData,
      [e.target.name]: e.target.value,
    });
  };

  //submit button
  const handleSubmitButton = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const response = await handleSubmit(schoolData); // Wait for the handleSubmit function

      if (response.data?.status) {
        setShowModal(true); // Show success modal
        setErrorMessages(null); // Clear errors
      } else if (response.data?.messages) {
        setErrorMessages(response.data.messages.map((msg: any) => msg.message));
      } else {
        setErrorMessages(["An unexpected error occurred."]);
      }
    } catch (error: any) {
      setErrorMessages([error.message || "Error submitting the form."]);
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
            label="School Name"
            name="name"
            value={schoolData.name}
            onChange={handleInputChange}
            required
          />

          <TextInput
            label="Address"
            name="address"
            value={schoolData.address}
            onChange={handleInputChange}
            required
          />
          <TextInput
            label=" Phone Number"
            name="phoneNumber"
            value={schoolData.phoneNumber}
            onChange={handleInputChange}
            required
          />

          <TextInput
            label="Principal Name"
            name="principalName"
            value={schoolData.principalName}
            onChange={handleInputChange}
            required
          />

          <TextInput
            label="Principal Contact No"
            name="principalContactNo"
            value={schoolData.principalContactNo}
            onChange={handleInputChange}
            required
          />

          <TextInput
            label="Managing Trustee"
            name="managingTrustee"
            value={schoolData.managingTrustee}
            onChange={handleInputChange}
          />

          <TextInput
            label="Trustee Contact Info"
            name="trusteeContactInfo"
            value={schoolData.trusteeContactInfo}
            onChange={handleInputChange}
          />

          <TextInput
            label="Website"
            name="website"
            value={schoolData.website}
            onChange={handleInputChange}
          />
        </div>

        <button type="submit" className="g-button submit-button">
          Submit
        </button>
      </form>

      {errorMessages && (
        <div className="error-messages">
          {errorMessages.map((msg, index) => (
            <p key={index}>{msg}</p>
          ))}
        </div>
      )}

      {showModal && <SuccessModal data={message} onClose={handleClose} />}
    </div>
  );
};

export default SchoolForm;
