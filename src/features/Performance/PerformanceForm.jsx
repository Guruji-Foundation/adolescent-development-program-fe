import "../../CSS/Main.css";
import { useState, useEffect } from "react";
import SelectInput from "../../common/FormInput/SelectInput";
import apiServices from "../../common/ServiCeProvider/Services";
import Button from "../../common/FormInput/Button";
import TextInput from "../../common/FormInput/TextInput";

function PerformanceForm({
    heading,

}) {

    const handleSubmitButton = async (e) => {
        
    }

    const [formData, setFormData] = useState({
        student:"",
        project:"",
        grade:""
    })
    return (
        <div className="form-container">
            <h2>{heading}</h2>
            <form onSubmit={handleSubmitButton}>
                <div className="form-layout">
                    <SelectInput
                        label="Student Name"
                        value={formData.student || ""}
                        // onChange={handleSchoolChange}
                        options={[]}
                        required
                    />
                    <SelectInput
                        label="Project Name"
                        value={formData.project || ""}
                        // onChange={handleSchoolChange}
                        options={[]}
                        required
                    />
                    <TextInput
                        label="Grade For Performance"
                        name="grade"
                        value={formData.grade}
                        // onChange={handleInputChange}
                        required
                    />

                </div>
                <Button
                    type="submit"
                    label="Submit"
                    className="g-button submit-button"
                />
            </form>
        </div>
    )
}

export default PerformanceForm