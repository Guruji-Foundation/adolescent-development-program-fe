import React, { useState } from 'react';
import './CreateSchoolForm1.css';

const CreateSchoolForm: React.FC = () => {
    const [schoolData, setSchoolData] = useState({
        name: '',
        address: '',
        phoneNumber: '',
        principalName: '',
        principalContactNo: '',
        managingTrustee: '',
        trusteeContactInfo: '',
        website: ''
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setSchoolData({ ...schoolData, [name]: value });
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        console.log('Form submitted:', schoolData);
    };

    return (
        <div className="create-school-page">
            <h2 className="school-heading">Create New School</h2>
            <form onSubmit={handleSubmit} className="create-school-form">
                <div className="form-group">
                    <label htmlFor="name">School Name</label>
                    <input 
                        type="text" 
                        id="name" 
                        name="name" 
                        value={schoolData.name} 
                        onChange={handleChange} 
                        placeholder="Enter school name"
                    />
                </div>

                <div className="form-group">
                    <label htmlFor="address">Address</label>
                    <input 
                        type="text" 
                        id="address" 
                        name="address" 
                        value={schoolData.address} 
                        onChange={handleChange} 
                        placeholder="Enter school address"
                    />
                </div>

                <div className="form-group">
                    <label htmlFor="phoneNumber">Phone Number</label>
                    <input 
                        type="text" 
                        id="phoneNumber" 
                        name="phoneNumber" 
                        value={schoolData.phoneNumber} 
                        onChange={handleChange} 
                        placeholder="Enter school phone number"
                    />
                </div>

                <div className="form-group">
                    <label htmlFor="principalName">Principal Name</label>
                    <input 
                        type="text" 
                        id="principalName" 
                        name="principalName" 
                        value={schoolData.principalName} 
                        onChange={handleChange} 
                        placeholder="Enter principal's name"
                    />
                </div>

                <div className="form-group">
                    <label htmlFor="principalContactNo">Principal Contact</label>
                    <input 
                        type="text" 
                        id="principalContactNo" 
                        name="principalContactNo" 
                        value={schoolData.principalContactNo} 
                        onChange={handleChange} 
                        placeholder="Enter principal's contact number"
                    />
                </div>

                <div className="form-group">
                    <label htmlFor="managingTrustee">Managing Trustee</label>
                    <input 
                        type="text" 
                        id="managingTrustee" 
                        name="managingTrustee" 
                        value={schoolData.managingTrustee} 
                        onChange={handleChange} 
                        placeholder="Enter managing trustee name"
                    />
                </div>

                <div className="form-group">
                    <label htmlFor="trusteeContactInfo">Trustee Contact</label>
                    <input 
                        type="text" 
                        id="trusteeContactInfo" 
                        name="trusteeContactInfo" 
                        value={schoolData.trusteeContactInfo} 
                        onChange={handleChange} 
                        placeholder="Enter trustee contact"
                    />
                </div>

                <div className="form-group full-width">
                    <label htmlFor="website">Website (optional)</label>
                    <input 
                        type="text" 
                        id="website" 
                        name="website" 
                        value={schoolData.website} 
                        onChange={handleChange} 
                        placeholder="Enter website (optional)"
                    />
                </div>

                <div className="form-group submit-button">
                    <button type="submit">Create School</button>
                </div>
            </form>
        </div>
    );
};

export default CreateSchoolForm;
