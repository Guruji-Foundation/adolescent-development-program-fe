import React from 'react'
import ProjectCoordinatorForm from './ProjectCoordinatorForm'
import { useNavigate } from 'react-router-dom';
import apiServices from "../../common/ServiCeProvider/Services";

function AddProjectCoordinator() {
    const navigate = useNavigate();
    const handleAddCoordinator = async (formData) => {
        try {
            const res = await apiServices.addProjectCoordinator(formData);
            if (res?.status) {
                navigate("/project-coordinator")
            }
            return res;
        } catch (err) {
            console.log("Error in adding Coordiantor", err)
            throw err;
        }
    }
    return (
        <div>
            <ProjectCoordinatorForm
                heading={"Add Coordinator"}
                handleSubmit={handleAddCoordinator}
                message={{
                    heading: "Coordinator added successfully.",
                    description: "You have added new Coordinator.",
                }}
                editInitialData={null}
            />
        </div>
    )
}

export default AddProjectCoordinator