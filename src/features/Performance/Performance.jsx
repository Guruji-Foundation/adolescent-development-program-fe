import React, { useState, useEffect } from 'react'
import LoadingSpinner from "../../common/FeedbackComponents/Loading/LoadingSpinner";
import apiServices from "../../common/ServiCeProvider/Services";
import { FaEdit, FaTrashAlt } from "react-icons/fa";
import { ImCross } from "react-icons/im"
import { useNavigate } from "react-router-dom";
import ConfirmationModal from "../../common/FeedbackComponents/Confirmation/ConfirmationModal";
import AgGridTable from "../../common/GloabalComponent/AgGridTable";
import useError from "../../hooks/useError";
import SelectInput from "../../common/FormInput/SelectInput";

function Performance() {
    const navigate = useNavigate();
    const handelAddPerformance = () => {
        navigate("/add-performance");
    }
    const [selectedPerformanceId, setSelectedPerformanceId] = useState(null);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [performanceData, setPerfomaceData] = useState([]);
    const { errors, setError, clearError } = useError();
    const [studentData, setStudentData] = useState([]);
    const [topicData, setTopicData] = useState([]);
    const [projectsList, setProjectsList] = useState([]);
    const [schoolList, setSchoolList] = useState([]);
    const [selectedSchool, setSelectedSchool] = useState(null);
    const [selectedProject, setSelectedProject] = useState(null);
    const [columDefsWithTopic, setColumDefsWithTopic] = useState([])
    const [rowDataWithTpoic, setRowDataWithTopic] = useState([])

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
                        {/* <button
                            onClick={() => handleDelete(params?.data?.id)}
                            className="action-button delete-button"
                        >
                            <FaTrashAlt />
                        </button> */}
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
                studentName: studentData?.find((data) => (item?.studentId == data?.id))?.name,
                topicName: topicData?.find((data) => (item?.topicId == data?.id))?.name,
            }))
            setPerfomaceData(rData);
        } catch (err) {
            setError(err.message);
            throw err;
        }
    }

    const getTopicData = async (selectedProjectId) => {
        try {
            const res = (await apiServices.getAllTopicList(selectedProjectId))?.data?.data?.topics;
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
        getTopicData(null);
        getStudentData();
    }, []);

    useEffect(() => {
        getPerformanceData();
    }, [studentData, topicData])

    useEffect(() => {
        apiServices
            .getAllProjectList()
            .then((res) => {
                res = res?.data?.data?.projects;
                // console.log(res);
                if (res && res.length > 0) {
                    setProjectsList(res);
                } else {
                    setProjectsList([]);
                }
            })
            .catch((error) => {
                setError("Error fetching school data.");
                console.error("Error fetching school data:", error);
            });

    }, []);

    const getSchoolData = async () => {
        try {
            const res = (await apiServices.getSchoolByProjectId(selectedProject))?.data?.data?.schools;
            if (res && res.length > 0) {
                setSchoolList(res);
            }
        } catch (err) {
            console.log("Error", err);
        }
    }

    useEffect(() => {
        if (selectedProject) {
            getSchoolData();
        }
    }, [selectedProject])

    const getPerformanceDetailsBasedOnProjectAndSchool = async () => {
        try {
            const response = await apiServices.getPerformanceListBySchoolAndProject(selectedSchool, selectedProject);
            const rowData2 = response?.data?.data?.studentPerformances?.map((student) => {
                const row = {
                    studentName: student.studentName
                };

                student.topics.forEach((topic) => {
                    row[`${topic.topicId}_beforeInterventionMark`] = topic.beforeInterventionMark;
                    row[`${topic.topicId}_afterInterventionMark`] = topic.afterInterventionMark;
                });

                return row;
            });
            setRowDataWithTopic(rowData2)
        } catch (err) {

        }
    }

    useEffect(() => {
        if (selectedProject && selectedSchool) {
            getTopicData(selectedProject);
            getPerformanceDetailsBasedOnProjectAndSchool();
        }
    }, [selectedProject, selectedSchool])

    useEffect(() => {
        if (selectedProject && selectedSchool) {
            const columnDefs2 = topicData?.map((item) => ({
                headerName: item?.name,
                children: [
                    {
                        headerName: "Pre Marks",
                        field: `${item?.id}_beforeInterventionMark`,
                    },
                    {
                        headerName: "Post Marks",
                        field: `${item?.id}_afterInterventionMark`
                    }
                ]
            }))
            setColumDefsWithTopic([{
                headerName: "Student Name",
                field: "studentName",
                flex: 1,
                minWidth: 300,
                pinned: "left"
            }, ...columnDefs2])
        }
    }, [topicData])

    return (
        <div className="project-page">
            <div className="header">
                <div className="heading-container">
                    <h2 className="project-heading">Performance</h2>
                    <p className="subheading">Performance List of Students</p>
                </div>
                {/* <button
                    className="g-button create-new-button"
                    onClick={handelAddPerformance}
                >
                    Create New
                </button> */}
            </div>

            <div className='header'>
                <SelectInput
                    label="Select Project"
                    value={selectedProject || ""}
                    options={projectsList}
                    onChange={(e) => { setSelectedProject(e.target.value) }}
                />
                <SelectInput
                    label="Select School"
                    value={selectedSchool || ""}
                    options={schoolList}
                    onChange={(e) => { setSelectedSchool(e.target.value) }}
                />
                <ImCross className="action-button delete-button" onClick={() => {
                    setSelectedProject(null);
                    setSelectedSchool(null);
                    getTopicData(null);
                }} />
            </div>

            {!(selectedSchool && selectedProject) ? (
                <div className="ag-theme-quartz" style={{ height: "500px" }}>
                    <AgGridTable rowData={performanceData} columnDefs={columnDefs} />
                </div>
            ) : (
                <div className="ag-theme-quartz" style={{ height: "500px" }}>
                    <AgGridTable rowData={rowDataWithTpoic} columnDefs={columDefsWithTopic} />
                </div>
            )}

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