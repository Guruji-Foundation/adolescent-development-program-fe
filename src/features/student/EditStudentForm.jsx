import React, { useEffect, useState } from 'react'
import useError from "../../hooks/useError";
import ErrorMessage from "../../common/FormInput/ErrorMessage";
import apiServices from "../../common/ServiCeProvider/Services";
import { useNavigate, useParams } from "react-router-dom";
import StudentForm from './StudentForm';

function EditStudentForm() {
    const { id } = useParams();
    const navigate = useNavigate()
    const { errors, setError, clearError } = useError();
    const [studentData, setStudentData] = useState({
        schoolId: "",
        studentName: "",
        dateOfBirth: "",
        parentName: "",
        parentOccupation: "",
        parentNumber: "",
        address: "",
        studentNumber: "",
        alternateNumber: "",
        emailId: "",
    })
    const getStudentData = async () => {
        try {
            const apiResponseData = (await apiServices.getStudentDetailsById(Number(id)))?.data?.data;
            setStudentData({
                schoolId: apiResponseData?.schoolDetails?.id || "",
                studentName: apiResponseData?.name || "",
                dateOfBirth: apiResponseData?.dob || "",
                parentName: apiResponseData?.parent?.name || "",
                parentOccupation: apiResponseData?.parent?.occupation || "",
                parentNumber: apiResponseData?.parent?.phoneNumber || "",
                address: apiResponseData?.address || "",
                studentNumber: apiResponseData?.phoneNumber || "",
                alternateNumber: apiResponseData?.alternativeNumber || "",
                emailId: apiResponseData?.email || ""
            })
        } catch (Err) {

        }
    }
    useEffect(() => {
        getStudentData()
    }, [id])

    const handleSubmit = async (data) => {
        try {
            const res = await apiServices.editStudent(id, data);
            return res;
        } catch (err) {
            setError(err.message);
            throw err;
        }
    }

    return (
        <div>
            <StudentForm
                heading={"Edit Student Details"}
                message={{
                    heading: "Student Details Edited Successfully",
                    description: "You have edited Student",
                }}
                editInitialData={studentData}
                handleSubmit={handleSubmit}
            />
        </div>
    )
}

export default EditStudentForm