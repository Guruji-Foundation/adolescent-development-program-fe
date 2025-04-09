import React, { useEffect, useState } from 'react'
import ErrorMessage from "../../common/FormInput/ErrorMessage";
import SuccessModal from "../../common/FeedbackComponents/Sucess/SuccessModal";
import { useNavigate } from "react-router-dom";
import useError from "../../hooks/useError";
import TextInput from "../../common/FormInput/TextInput";
import Button from "../../common/FormInput/Button";
import apiServices from "../../common/ServiCeProvider/Services";

function AddProjectCoordinatorForm({
    handleSubmit,
    heading,
    message,
    editInitialData = null
}) {
    const { errors, setError, clearError } = useError();
    const [showModal, setShowModal] = useState(false);
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        password: "",
        userRole: "PROJECT_COORDINATOR",
        mobileNumber: "",
        address: ""
    })
    const [loading, setLoading] = useState(false);

    const handleClose = () => {
        navigate("/project-coordinator")
    }

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value,
        });
    };

    useEffect(() => {
        if (editInitialData) {
            setFormData(editInitialData)
        }
    }, [editInitialData]);

    const handleSubmitButton = async (e) => {
        e.preventDefault()
        if (loading) return;
        setLoading(true)
        try {
            const res = await handleSubmit(formData);
            if (res?.status) {
                setShowModal(true);
                clearError();
                navigate("/project-coordinator");
            } else if (res?.messages) {
                setError(res?.messages.map((msg) => msg.message));
            } else {
                setError("An unexpected error occurred.");
            }
        } catch (error) {
            setError(error.message || "Error submitting the form.");
        } finally {
            setLoading(false); // Re-enable button
        }
    }
    return (
        <div className="form-container">
            <form onSubmit={handleSubmitButton}>
                <div className="form-layout">
                    <h2>{heading}</h2>

                    <div className='form-row'>
                        <TextInput
                            label="Name Of Coordinator"
                            name="name"
                            value={formData.name}
                            onChange={handleInputChange}
                            required
                        />

                        <TextInput
                            label="Email"
                            name="email"
                            type="email"
                            value={formData.email}
                            onChange={handleInputChange}
                            required
                        />
                    </div>

                    <div className='form-row'>
                        <TextInput
                            label="Password"
                            name="password"
                            type="password"
                            value={formData.password}
                            onChange={handleInputChange}
                            required
                        />

                        <TextInput
                            label="Mobile Number"
                            name="mobileNumber"
                            value={formData.mobileNumber}
                            onChange={handleInputChange}
                            required
                        />
                    </div>

                    <TextInput
                        label="Address"
                        name="address"
                        value={formData.address}
                        onChange={handleInputChange}
                    />
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

export default AddProjectCoordinatorForm