import React from "react";
import ProjectCoordinatorForm from "./SchoolCoordinatorForm";
import { useNavigate } from "react-router-dom";
import apiServices from "../../common/ServiCeProvider/Services";

function AddSchoolCoordinator() {
  const navigate = useNavigate();
  const handleAddCoordinator = async (formData) => {
    try {
      const res = await apiServices.addProjectCoordinator(formData);
      if (res?.status) {
        navigate("/school-coordinator");
      }
      return res;
    } catch (err) {
      console.log("Error in adding School Coordiantor", err);
      throw err;
    }
  };
  return (
    <div>
      <ProjectCoordinatorForm
        heading={"Add Coordinator"}
        handleSubmit={handleAddCoordinator}
        message={{
          heading: "School Coordinator added successfully.",
          description: "You have added new School Coordinator.",
        }}
        editInitialData={null}
      />
    </div>
  );
}

export default AddSchoolCoordinator;
