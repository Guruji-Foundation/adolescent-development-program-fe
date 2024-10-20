import React from "react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

import SuccessModal from "../../common/FeedbackComponents/Sucess/SuccessModal";
import { createSchool } from "../../services/SchoolService";
import SchoolForm from "./SchoolForm";

const CreateSchool: React.FC = () => {
  const message = {
    heading: "School Created Successfully!",
    description: "Your school has been Created.",
  };
  const heading = "Create School";

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

  const navigate = useNavigate();

  const handleSubmit = async (schoolData: any) => {
    try {
      const response = await createSchool(schoolData);
      return response;
    } catch (error) {
      return error; // Return the error object to handle it in the form
    }
  };

  const handleCloseModal = () => {
    navigate("/school"); // Redirect to the school list page after closing the modal
  };

  return (
    <div>
      <SchoolForm
        handleSubmit={handleSubmit}
        message={message}
        heading={heading}
        handleCloseModal={handleCloseModal}
        schoolDataDefault={schoolData}
      />
    </div>
  );
};

export default CreateSchool;
