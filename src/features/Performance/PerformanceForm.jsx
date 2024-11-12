import "../../CSS/Main.css";
import { useState, useEffect } from "react";
import SelectInput from "../../common/FormInput/SelectInput";
import apiServices from "../../common/ServiCeProvider/Services";
import Button from "../../common/FormInput/Button";
import TextInput from "../../common/FormInput/TextInput";
import useError from "../../hooks/useError";
import { useNavigate } from "react-router-dom";
import ErrorMessage from "../../common/FormInput/ErrorMessage";
import SuccessModal from "../../common/FeedbackComponents/Sucess/SuccessModal";

function PerformanceForm({
    handleSubmit,
    heading,
    message,
    editInitialData=null
}) {
    const { errors, setError, clearError } = useError();
    const [projectDropDownList, setProjectDropDownList] = useState([]);
    const [studentDropDownList, setStudentDropDownList] = useState([])
    const [showModal, setShowModal] = useState(false);
    const navigate = useNavigate();

    const handleSubmitButton = async (e) => {
        e.preventDefault()
        try {
            const res = await handleSubmit(formData);
            if (res?.data?.status) {
                setShowModal(true);
                clearError();
            } else if (res?.data?.messages) {
                setError(res?.data?.messages.map((msg) => msg.message));
            } else {
                setError("An unexpected error occurred.");
            }
        } catch (error) {
            setError(error.message || "Error submitting the form.");
        }
    }

    const [formData, setFormData] = useState({
        studentId: '',
        projectId: '',
        attendanceGrade: ""
    })

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value,
        });
    };

    const getProjectDropDownData = async () => {
        try {
            const res = (await apiServices.getAllProjectList())?.data?.data?.projects;
            if (res && res.length > 0) {
                setProjectDropDownList(res)
            }
        } catch (err) {
            console.log("Error",err);
        }
    }

    const getStudentDropDownList = async () => {
        try {
            const res = (await apiServices.getStudentList())?.data?.data?.students;
            if (res && res.length > 0) {
                setStudentDropDownList(res)
            }
        } catch (err) {
            console.log("Error",err);
        }
    }

    useEffect(() => {
        getProjectDropDownData();
        getStudentDropDownList();
    }, [])

    useState(()=>{
        if(editInitialData!=null){
            setFormData(editInitialData)
        }
    },[editInitialData])

    const handleClose = () => {
        navigate("/performance")
    }
    
    return (
        <div className="form-container">
            <h2>{heading}</h2>
            <form onSubmit={handleSubmitButton}>
                <div className="form-layout">
                    <SelectInput
                        label="Student Name"
                        value={formData.studentId || ""}
                        onChange={(e) => {
                            setFormData({
                                ...formData,
                                studentId: Number(e?.target?.value)
                            })
                        }}
                        options={studentDropDownList}
                        required
                    />
                    <SelectInput
                        label="Project Name"
                        value={formData.projectId || ''}
                        onChange={(e) => {
                            setFormData({
                                ...formData,
                                projectId: Number(e?.target?.value)
                            })
                        }}
                        options={projectDropDownList}
                        required
                    />
                    <TextInput
                        label="Grade For Performance"
                        name="attendanceGrade"
                        value={formData.attendanceGrade}
                        onChange={handleInputChange}
                        required
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

export default PerformanceForm