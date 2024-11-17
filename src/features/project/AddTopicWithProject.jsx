import React, { useEffect, useState } from 'react'
import TextInput from "../../common/FormInput/TextInput";

function AddTopicWithProject({
    onClose,
    setTopicDataArray,
    editTopicData
}) {

    const [topicData, setTopicData] = useState({
        name: "",
        description: "",
    })

    const handleSubmitButton = async (e) => {
        e.preventDefault();
        if (editTopicData) {
            setTopicDataArray((prev) =>
                prev?.map((item) =>
                    item?.id == editTopicData?.id ? {
                        id: editTopicData?.id,
                        name: topicData?.name,
                        description: topicData?.description,
                    } : item
                )
            )
        } else {
            setTopicDataArray((prev) => [...prev, {
                id: prev?.length,
                ...topicData
            }]);
        }
        onClose()
    }

    const handleInputChange = (e) => {
        setTopicData({
            ...topicData,
            [e.target.name]: e.target.value,
        });
    };

    useEffect(() => {
        setTopicData({
            name: editTopicData?.name,
            description: editTopicData?.description,
        })
    }, [editTopicData])

    return (
        <div className="modal-overlay">
            <div className="modal-content">
                <h2>Add Tpoic</h2>
                <div>

                    <form onSubmit={handleSubmitButton}>
                        <div className="form-layout">
                            <TextInput
                                label="Topic Name"
                                name="name"
                                value={topicData.name}
                                onChange={handleInputChange}
                                required
                            />

                            <TextInput
                                label="Description"
                                name="description"
                                value={topicData.description}
                                onChange={handleInputChange}
                                required
                            />
                        </div>
                        <div className="modal-actions">
                            <button type="button" className="r-button confirm-button" onClick={onClose} >
                                Cancel
                            </button>
                            <button type="submit" className="g-button cancel-button" >
                                Add Topic
                            </button>

                        </div>
                    </form>

                </div>


            </div>
        </div>
    )
}

export default AddTopicWithProject