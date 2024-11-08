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
    const [performanceData,setPerfomaceData]=useState([]);
    const { errors, setError, clearError } = useError();

    const handleDelete = (id) => {
        setSelectedPerformanceId(id);
        setIsModalVisible(true);
    };

    const cancelDelete = () => {
        setSelectedPerformanceId(null);
        setIsModalVisible(false);
      };

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
            headerName: "Project Name",
            field: "projectName",
            filter: true,
            flex: 1,
            floatingFilter: true,
        },
        {
            headerName: "Grade",
            field: "attendanceGrade",
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

    const getPerformanceData = async ()=>{
        try{
            const data = (await apiServices.getPerformanceList())?.data?.data?.performances
            setPerfomaceData(data);
        }catch(err){
            setError(err.message);
            throw err;
        }
    }

    useEffect(()=>{
        getPerformanceData();
    },[])
    
    const rowData = [
        {
            id: 1,
            studentName: "John Doe",
            projectName: "Science Project",
            attendanceGrade: "A",
        },
        {
            id: 2,
            studentName: "Jane Smith",
            projectName: "Math Research",
            attendanceGrade: "B",
        },
        {
            id: 3,
            studentName: "Mike Johnson",
            projectName: "History Analysis",
            attendanceGrade: "A-",
        },
        {
            id: 4,
            studentName: "Emily Davis",
            projectName: "Art Project",
            attendanceGrade: "B+",
        },
        {
            id: 5,
            studentName: "David Wilson",
            projectName: "Chemistry Experiment",
            attendanceGrade: "A",
        },
    ];

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
                <AgGridTable rowData={rowData} columnDefs={columnDefs} />
            </div>

            {isModalVisible && (
                <ConfirmationModal
                    title="Confirm Deletion"
                    message="Do you really want to delete this Teacher?"
                    onConfirm={cancelDelete}
                    onCancel={cancelDelete}
                />
            )}
        </div>
    )
}

export default Performance