import React from 'react'
import PerformanceForm from './PerformanceForm'
import apiServices from "../../common/ServiCeProvider/Services";

function AddPerformance() {

  const handelAddPerformance = async (formData) => {
    try {
      const res = await apiServices.savePerformance(formData);
      return res;
    } catch (err) {
      console.log("Error in adding performance",err)
    }
  }
  return (
    <div>
      <PerformanceForm
        heading={"Add Performance"}
        handleSubmit={handelAddPerformance}
        message={{
          heading: "Performance Assigned Successfully.",
          description: "You have Assinged Performance.",
        }}
      />
    </div>
  )
}

export default AddPerformance