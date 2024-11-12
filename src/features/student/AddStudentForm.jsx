import React from 'react'
import StudentForm from './StudentForm'
import apiServices from "../../common/ServiCeProvider/Services";

function AddStudentForm() {
    
  const handleAddStudent = async (formData) => {
    try {
      const res = await apiServices.addStudent(formData);
    } catch (err) {
      console.log("Error in adding performance",err)
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