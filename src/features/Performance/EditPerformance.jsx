import React, { useEffect, useState } from 'react'
import PerformanceForm from './PerformanceForm'
import { useNavigate, useParams } from "react-router-dom";
import apiServices from "../../common/ServiCeProvider/Services";
import ErrorMessage from "../../common/FormInput/ErrorMessage";
import useError from "../../hooks/useError";

function EditPerformance() {
  const { id } = useParams();
  const { errors, setError, clearError } = useError();
  const [performanceData, setPerformanceData] = useState({
    studentId: '',
    projectId: '',
    attendanceGrade: ""
  })
  const getPerformanceData = async () => {
    try {
      const res = await apiServices.getPerformanceById(Number(id));
      if (res) {
        setPerformanceData({
          studentId: res?.data?.data?.studentId,
          projectId: res?.data?.data?.projectId,
          attendanceGrade: res?.data?.data?.attendanceGrade,
        })
      }

    } catch (err) {
     console.log("Error in GetPerformance",err)
    }
  }
  useEffect(() => {
    if (id > 0) {
      getPerformanceData()
    }
  }, [id])

  const handleSubmit = async (data) => {
    try {
      const res = await apiServices.editPerformance(id, data);
      return res;
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div>
      <PerformanceForm
        heading={"Edit Performance"}
        message={{
          heading: "Performance Edited Successfully",
          description: "You have edited Performance",
        }}
        editInitialData={performanceData}
        handleSubmit={handleSubmit}
      />
      {errors.length > 0 && <ErrorMessage errors={errors} />}

    </div>
  )
}

export default EditPerformance