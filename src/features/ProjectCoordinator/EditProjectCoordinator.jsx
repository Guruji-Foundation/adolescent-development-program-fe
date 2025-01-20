import React, { useEffect, useState } from 'react'
import useError from "../../hooks/useError";
import ErrorMessage from "../../common/FormInput/ErrorMessage";
import apiServices from "../../common/ServiCeProvider/Services";
import { useNavigate, useParams } from "react-router-dom";
import ProjectCoordinatorForm from './ProjectCoordinatorForm';

function EditProjectCoordinator() {
  const { errors, setError, clearError } = useError();
  const { id } = useParams();
  const [coordinatorData, setCoordinatorData] = useState({
    name: "",
    areaOfExpertise: "",
    availability: "",
    mobileNumber: "",
    address: ""
  })
  const getCordinatorDetailsById = async () => {
    try {
      const apiResponseData = (await apiServices.getCoordinatorDetailsById(Number(id)))?.data?.data;
      setCoordinatorData({
        name: apiResponseData?.name,
        areaOfExpertise: apiResponseData?.areaOfExpertise,
        availability: apiResponseData?.availability,
        mobileNumber: apiResponseData?.mobileNumber,
        address: apiResponseData?.address,
      })
    } catch (Err) {

    }
  }

  useEffect(() => {
    getCordinatorDetailsById()
  }, [id])

  const handleSubmit = async (data) => {
    try {
      const res = await apiServices.editCoordinatorDetails(id, data);
      return res;
    } catch (err) {
      setError(err.message);
      throw err;
    }
  }


  return (
    <div>
      <ProjectCoordinatorForm
        heading={"Edit Project Coordinators Details"}
        message={{
          heading: "Coordinator Details Edited Successfully",
          description: "You have edited Coordinator",
        }}
        editInitialData={coordinatorData}
        handleSubmit={handleSubmit}
      />
    </div>
  )
}

export default EditProjectCoordinator