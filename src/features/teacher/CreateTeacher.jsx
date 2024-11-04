import React from "react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

import SuccessModal from "../../common/FeedbackComponents/Sucess/SuccessModal";
import TeacherForm from "./TeacherForm";

import apiServices from "../../common/ServiCeProvider/Services";

const CreateSchool = () => {
  const message = {
    heading: "Teacher Created Successfully!",
    description: "You have successfully created Teacher!",
  };
  const heading = "Create Teacher";

  const [teacherData, setTeacherData] = useState({
    name: "",
    experience: 0,
    schoolId: NaN,
  });

  const navigate = useNavigate();

  const handleSubmit = async (teacherData) => {
    console.log("from ct");
    
    console.log(teacherData);
    try {
      const response = await apiServices.createTeacher(teacherData);
      return response;
    } catch (error) {
      return error; // Return the error object to handle it in the form
    }
  };

  //rediret to teachers list page
  const handleCloseModal = () => {
    navigate("/teacher"); // Redirect to the school list page after closing the modal
  };

  return (
    <div>
      <TeacherForm
        handleSubmit={handleSubmit}
        message={message}
        heading={heading}
        handleCloseModal={handleCloseModal}
        teacherDataDefault={teacherData}
      />
    </div>
  );
};

export default CreateSchool;
