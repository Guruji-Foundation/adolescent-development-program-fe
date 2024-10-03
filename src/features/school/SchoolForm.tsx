import React, { useState, useEffect } from "react";
import axios from "axios";
import SuccessModal from "../../common/Sucess/SuccessModal"; // Import the modal component
import "./SchoolForm.css";

import { createSchool } from "../../services/SchoolService";

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
    console.log("form school form ");
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
          <div className="form-field">
            <label htmlFor="name" className="required">
              School Name
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={schoolData.name}
              onChange={handleInputChange}
              required
            />
          </div>

          <div className="form-field">
            <label htmlFor="address" className="required">
              Address
            </label>
            <input
              type="text"
              id="address"
              name="address"
              value={schoolData.address}
              onChange={handleInputChange}
              required
            />
          </div>

          <div className="form-field">
            <label htmlFor="phoneNumber" className="required">
              Phone Number
            </label>
            <input
              type="tel"
              id="phoneNumber"
              name="phoneNumber"
              value={schoolData.phoneNumber}
              onChange={handleInputChange}
              required
            />
          </div>

          <div className="form-field">
            <label htmlFor="principalName" className="required">
              Principal Name
            </label>
            <input
              type="text"
              id="principalName"
              name="principalName"
              value={schoolData.principalName}
              onChange={handleInputChange}
              required
            />
          </div>

          <div className="form-field">
            <label htmlFor="principalContactNo" className="required">
              Principal Contact No
            </label>
            <input
              type="tel"
              id="principalContactNo"
              name="principalContactNo"
              value={schoolData.principalContactNo}
              onChange={handleInputChange}
              required
            />
          </div>

          <div className="form-field">
            <label htmlFor="managingTrustee">Managing Trustee</label>
            <input
              type="text"
              id="managingTrustee"
              name="managingTrustee"
              value={schoolData.managingTrustee}
              onChange={handleInputChange}
            />
          </div>

          <div className="form-field">
            <label htmlFor="trusteeContactInfo">Trustee Contact Info</label>
            <input
              type="tel"
              id="trusteeContactInfo"
              name="trusteeContactInfo"
              value={schoolData.trusteeContactInfo}
              onChange={handleInputChange}
            />
          </div>

          <div className="form-field">
            <label htmlFor="website">Website</label>
            <input
              type="url"
              id="website"
              name="website"
              value={schoolData.website}
              onChange={handleInputChange}
            />
          </div>
        </div>

        <button type="submit" className="submit-button">
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
