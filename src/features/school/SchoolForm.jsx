import React, { useState, useEffect } from "react";

import SuccessModal from "../../common/FeedbackComponents/Sucess/SuccessModal"; // Import the modal component
import "./SchoolForm.css";
import "../../CSS/Main.css";
import ErrorMessage from "../../common/FormInput/ErrorMessage";
import NumberInput from "../../common/FormInput/NumberInput";
import TextInput from "../../common/FormInput/TextInput";
import Button from "../../common/FormInput/Button";
import useError from "../../hooks/useError";

const SchoolForm = ({
  handleSubmit,
  message,
  heading,
  handleCloseModal,
  schoolDataDefault,
}) => {
  const [schoolData, setSchoolData] = useState({
    name: schoolDataDefault?.name,
    address: schoolDataDefault?.address,
    phoneNumber: schoolDataDefault?.phoneNumber,
    principalName: schoolDataDefault?.principalName,
    principalContactNo: schoolDataDefault?.principalContactNo,
    managingTrustee: schoolDataDefault?.managingTrustee,
    trusteeContactInfo: schoolDataDefault?.trusteeContactInfo,
    website: schoolDataDefault?.website,
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setSchoolData(schoolDataDefault);
  }, [schoolDataDefault]);

  const [showModal, setShowModal] = useState(false);
  const { errors, setError, clearError } = useError();

  const handleInputChange = (e) => {
    setSchoolData({
      ...schoolData,
      [e.target.name]: e.target.value,
    });
  };

  //submit button
  const handleSubmitButton = async (e) => {
    e.preventDefault();

    if (loading) return;
    setLoading(true);
    try {
      const response = await handleSubmit(schoolData); // Wait for the handleSubmit function

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
    } finally {
      setLoading(false); // Re-enable button
    }
  };

  const handleClose = () => {
    setShowModal(false);
    handleCloseModal();
  };

  return (
    <div className="form-container">
      <form onSubmit={handleSubmitButton}>
        <h2>{heading}</h2>
        <div className="form-layout">
          <div className="form-row">
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
          </div>

          <div className="form-row">
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
          </div>

          <div className="form-row">
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
          </div>

          <div className="form-row single-input">
            <TextInput
              label="Website"
              name="website"
              value={schoolData.website}
              onChange={handleInputChange}
            />
          </div>
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

export default SchoolForm;
