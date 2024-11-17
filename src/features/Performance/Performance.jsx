import React, { useState, useEffect } from 'react'
import LoadingSpinner from "../../common/FeedbackComponents/Loading/LoadingSpinner";
import apiServices from "../../common/ServiCeProvider/Services";
import { FaEdit, FaTrashAlt } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import ConfirmationModal from "../../common/FeedbackComponents/Confirmation/ConfirmationModal";
import AgGridTable from "../../common/GloabalComponent/AgGridTable";
import useError from "../../hooks/useError";

function Performance() {
    const navigate = useNavigate();
    const handelAddPerformance = () => {
        navigate("/add-performance");
    }
    const [selectedPerformanceId, setSelectedPerformanceId] = useState(null); // State to store the selected school for deletion
    const [isModalVisible, setIsModalVisible] = useState(false); // State to control modal visibility
    const [performanceData, setPerfomaceData] = useState([]);
    const { errors, setError, clearError } = useError();
    const [studentData, setStudentData] = useState([]);
    const [topicData, setTopicData] = useState([]);

    const handleDelete = (id) => {
        setSelectedPerformanceId(id);
        setIsModalVisible(true);
    };

    const cancelDelete = () => {
        setSelectedPerformanceId(null);
        setIsModalVisible(false);
    };

    const deletePerformance = async () => {
        try {
            const res = await apiServices.deletePerformance(selectedPerformanceId);
            if (res?.data?.status) {
                setIsModalVisible(false);
                getPerformanceData()
            }
        } catch (err) {
            console.log("Error in Deleting", err)
        }
    }

    const handleEdit = (id) => {
        navigate(`/edit-performance/${id}`);
    };

    const columnDefs = [
        {
            headercheckboxSelection: true,
            checkboxSelection: false,
            width: 50,
        },
        {
            headerName: "Sr.No",
            field: "id",
            filter: true,
            floatingFilter: true,
        },
        {
            headerName: "Student",
            field: "studentName",
            filter: true,
            flex: 1,
            floatingFilter: true,
        },
        {
            headerName: "Topic Name",
            field: "topicName",
            filter: true,
            flex: 1,
            floatingFilter: true,
        },
        {
            headerName: "Marks before Intervention",
            field: "beforeInterventionMark",
            filter: true,
            floatingFilter: true,
        },
        {
            headerName: "Marks After Intervention",
            field: "afterInterventionMark",
            filter: true,
            floatingFilter: true,
        },
        {
            headerName: "Actions",
            cellRenderer: (params) => {
                return (
                    <div>
                        <button
                            onClick={() => handleEdit(params?.data?.id)}
                            className="action-button edit-button"
                        >
                            <FaEdit />
                        </button>
                        <button
                            onClick={() => handleDelete(params?.data?.id)}
                            className="action-button delete-button"
                        >
                            <FaTrashAlt />
                        </button>
                    </div>
                );
            },
        },
    ]

    const getPerformanceData = async () => {
        try {
            const data = (await apiServices.getPerformanceList())?.data?.data?.performances
            const rData = data?.map((item) => ({
                ...item,
                studentName:studentData?.find((data)=>(item?.studentId==data?.id))?.name,
                topicName:topicData?.find((data)=>(item?.topicId==data?.id))?.name,
            }))
            setPerfomaceData(rData);
        } catch (err) {
            setError(err.message);
            throw err;
        }
    }

    const getTopicData = async () => {
        try {
            const res = (await apiServices.getAllTopicList())?.data?.data?.topics;
            if (res && res.length > 0) {
                setTopicData(res)
            }
        } catch (err) {
            console.log("Error", err);
        }
    }

    const getStudentData = async () => {
        try {
            const res = (await apiServices.getStudentList())?.data?.data?.students;
            if (res && res.length > 0) {
                setStudentData(res)
            }
        } catch (err) {
            console.log("Error", err);
        }
    }

    useEffect(() => {
        getTopicData();
        getStudentData();
    }, []);

    useEffect(()=>{
        getPerformanceData();
    },[studentData,topicData])
    return (
        <div className="project-page">
            <div className="header">
                <div className="heading-container">
                    <h2 className="project-heading">Performance</h2>
                    <p className="subheading">Performance List of Students</p>
                </div>
                <button
                    className="g-button create-new-button"
                    onClick={handelAddPerformance}
                >
                    Create New
                </button>
            </div>

            <div className="ag-theme-quartz" style={{ height: "500px" }}>
                <AgGridTable rowData={performanceData} columnDefs={columnDefs} />
            </div>

            {isModalVisible && (
                <ConfirmationModal
                    title="Confirm Deletion"
                    message="Do you really want to delete this Teacher?"
                    onConfirm={deletePerformance}
                    onCancel={cancelDelete}
                />
            )}
        </div>
    )
}

export default Performance