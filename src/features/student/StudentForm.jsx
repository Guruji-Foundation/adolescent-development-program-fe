import React, { useEffect, useState } from 'react'
import ErrorMessage from "../../common/FormInput/ErrorMessage";
import SuccessModal from "../../common/FeedbackComponents/Sucess/SuccessModal";
import { useNavigate } from "react-router-dom";
import useError from "../../hooks/useError";
import TextInput from "../../common/FormInput/TextInput";
import Button from "../../common/FormInput/Button";
import apiServices from "../../common/ServiCeProvider/Services";
import SelectInput from "../../common/FormInput/SelectInput";


function StudentForm({
    handleSubmit,
    heading,
    message,
    editInitialData = null
}) {

    const { errors, setError, clearError } = useError();
    const [schoolDropDownData, setSchoolDropDownData] = useState([])
    const [showModal, setShowModal] = useState(false);
    const navigate = useNavigate();

    const handleClose = () => {
        navigate("/performance")
    }

    const handleSubmitButton = async (e) => {
        e.preventDefault()
        try {
            const postData = {
                schoolId: formData?.schoolId,
                name: formData?.studentName,
                dob: formData?.dateOfBirth,
                parent: {
                    id: 0,
                    name: formData?.parentName,
                    occupation: formData?.parentOccupation,
                    phoneNumber: formData?.parentNumber
                },
                address: formData?.address,
                phoneNumber: formData?.studentNumber,
                alternativeNumber: formData?.alternateNumber,
                email: formData?.emailId,
            }
            const res = await handleSubmit(postData);
            if (res?.status) {
                setShowModal(true);
                clearError();
                navigate("/student")
            } else if (res?.messages) {
                setError(res?.messages.map((msg) => msg.message));
            } else {
                // setError("An unexpected error occurred.");
            }
        } catch (error) {
            setError(error.message || "Error submitting the form.");
        }
    }

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value,
        });
    };

    const [formData, setFormData] = useState({
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

    useEffect(() => {
        if (editInitialData) {
            setFormData(editInitialData)
        }
    }, [editInitialData]);

    const getSchoolData = async () => {
        try {
            const res = (await apiServices.getAllSchoolList())?.data?.data?.schools;
            if (res && res.length > 0) {
                setSchoolDropDownData(res)
            }
        } catch (err) {
            console.log("Error", err);
        }
    }

    useEffect(() => {
        getSchoolData()
    }, [])

    return (
        <div className="form-container">
            <form onSubmit={handleSubmitButton}>
                <div className="form-layout">
            <h2>{heading}</h2>

                    <div className='form-row'>
                        <TextInput
                            label="Name Of Student"
                            name="studentName"
                            value={formData.studentName}
                            onChange={handleInputChange}
                            required
                        />
                        <SelectInput
                            label="School Name"
                            value={formData.schoolId || ""}
                            onChange={(e) => {
                                setFormData({
                                    ...formData,
                                    schoolId: Number(e?.target?.value)
                                })
                            }}
                            options={schoolDropDownData}
                            required
                        />
                    </div>

                    <div className='form-row'>
                        <div>
                            <label htmlFor="dateOfBirth">Date of Birth<span className='required' style={{ color: "red" }}> *</span></label>
                            <input
                                type="date"
                                id="dateOfBirth"
                                name="dateOfBirth"
                                value={formData.dateOfBirth || ""}
                                onChange={(e) =>
                                    setFormData({
                                        ...formData,
                                        dateOfBirth: e.target.value,
                                    })
                                }
                                required
                            />
                        </div>
                        <TextInput
                            label="Parent Name"
                            name="parentName"
                            value={formData.parentName}
                            onChange={handleInputChange}
                            required
                        />
                    </div>

                    <div className='form-row'>
                        <TextInput
                            label="Parent's Occupation"
                            name="parentOccupation"
                            value={formData.parentOccupation}
                            onChange={handleInputChange}
                            required
                        />
                        <TextInput
                            label="Parent's Number"
                            name="parentNumber"
                            value={formData.parentNumber}
                            onChange={handleInputChange}
                            required
                        />
                    </div>

                    <div className='form-row'>
                        <TextInput
                            label="Address"
                            name="address"
                            value={formData.address}
                            onChange={handleInputChange}
                            required
                        />
                        <TextInput
                            label="Student's Number"
                            name="studentNumber"
                            value={formData.studentNumber}
                            onChange={handleInputChange}
                        // required
                        />
                    </div>

                    <div className='form-row'>
                        <TextInput
                            label="Alternate Number"
                            name="alternateNumber"
                            value={formData.alternateNumber}
                            onChange={handleInputChange}
                        // required
                        />
                        {/* <TextInput
                            label="Email Address"
                            name="emailId"
                            value={formData.emailId}
                            onChange={handleInputChange}
                        // required
                        /> */}
                        </div>

                </div>
                <Button
                    type="submit"
                    label="Submit"
                    className="g-button submit-button"
                />
            </form>
            {errors.length > 0 && <ErrorMessage errors={errors} />}
            {showModal && <SuccessModal data={message} onClose={handleClose} />}
        </div>
    )
}

export default StudentForm