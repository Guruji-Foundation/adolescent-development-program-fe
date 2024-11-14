import React from 'react'
import StudentForm from './StudentForm'
import apiServices from "../../common/ServiCeProvider/Services";
import { useNavigate } from 'react-router-dom';

function AddStudentForm() {

  const navigate = useNavigate();
  const handleAddStudent = async (formData) => {
    try {
      const res = await apiServices.addStudent(formData);
      if(res?.status){
        navigate("/student")
      }
      return res;
    } catch (err) {
      console.log("Error in adding performance", err)
      throw err;
    }
  }

  return (
    <div>
      <StudentForm
        heading={"Add Student"}
        handleSubmit={handleAddStudent}
        message={{
          heading: "Student added successfully.",
          description: "You have added new student.",
        }}
        editInitialData={null}
      />
    </div>
  )
};

export default AddStudentForm