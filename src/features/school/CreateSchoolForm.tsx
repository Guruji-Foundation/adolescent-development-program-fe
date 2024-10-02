import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom'; // For navigation
import SuccessModal from '../../common/Sucess/SuccessModal'; // Import the modal component
import './CreateSchoolForm.css';

const CreateSchoolForm: React.FC = () => {
  const [schoolData, setSchoolData] = useState({
    name: '',
    address: '',
    phoneNumber: '',
    principalName: '',
    principalContactNo: '',
    managingTrustee: '',
    trusteeContactInfo: '',
    website: '',
  });

  const [showModal, setShowModal] = useState(false);
  const [errorMessages, setErrorMessages] = useState<string[] | null>(null);
  const navigate = useNavigate();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSchoolData({
      ...schoolData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    axios
      .post('http://localhost:8080/schools', schoolData)
      .then((response) => {
        if (response.data.status) {
          setShowModal(true); // Show the success modal
          setErrorMessages(null); // Clear any errors
        } else {
          setErrorMessages(response.data.messages.map((msg: any) => msg.message));
        }
      })
      .catch((error) => {
        setErrorMessages([error.message]);
      });
  };

  const handleCloseModal = () => {
    setShowModal(false);
    navigate('/schools'); // Redirect to the school list page after closing the modal
  };

  return (
    <div className="form-container">
      <h2>Create School</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-layout">
          <div className="form-field">
            <label htmlFor="name" className="required">School Name</label>
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
            <label htmlFor="address" className="required">Address</label>
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
            <label htmlFor="phoneNumber" className="required">Phone Number</label>
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
            <label htmlFor="principalName" className="required">Principal Name</label>
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
            <label htmlFor="principalContactNo" className="required">Principal Contact No</label>
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

        <button type="submit" className="submit-button">Submit</button>
      </form>

      {errorMessages && (
        <div className="error-messages">
          {errorMessages.map((msg, index) => (
            <p key={index}>{msg}</p>
          ))}
        </div>
      )}

      {showModal && <SuccessModal onClose={handleCloseModal} />}
    </div>
  );
};

export default CreateSchoolForm;
