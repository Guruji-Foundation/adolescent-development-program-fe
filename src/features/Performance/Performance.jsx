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
import SuccessModal from "../../common/FeedbackComponents/Sucess/SuccessModal";

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
    const [editedData, setEditedData] = useState([]);
    const [showModal, setShowModal] = useState(false);

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

        getSchoolData();
    }, []);

    const getSchoolData = async () => {
        try {
            const res = (await apiServices.getAllSchoolList())?.data?.data?.schools;
            if (res && res.length > 0) {
                setSchoolList(res);
            }
        } catch (err) {
            console.log("Error", err);
        }
    }

    const getPerformanceDetailsBasedOnProjectAndSchool = async () => {
        try {
            const response = await apiServices.getPerformanceListBySchoolAndProject(selectedSchool, selectedProject);
            const rowData2 = response?.data?.data?.studentPerformances?.map((student) => {
                const row = {
                    studentName: student.studentName,
                    studentId: student.studentId,
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
                        editable: true,
                    },
                    {
                        headerName: "Post Marks",
                        field: `${item?.id}_afterInterventionMark`,
                        editable: true,
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

    const handleCellValueChange = (params) => {
        const updatedRow = params.data;
        setEditedData((prev) => {
            const existingIndex = prev.findIndex((row) => row.studentName === updatedRow.studentName);
            if (existingIndex > -1) {
                // Update existing student data
                const updated = [...prev];
                updated[existingIndex] = updatedRow;
                return updated;
            } else {
                // Add new student data
                return [...prev, updatedRow];
            }
        });
    };

    const prepareDataForPost = () => {
        if (editedData?.length == 0) return null;
        const studentPerformances = editedData.map((student) => {
            const topics = Object.entries(student)
                .filter(([key]) => key.includes("_beforeInterventionMark") || key.includes("_afterInterventionMark"))
                .reduce((acc, [key, value]) => {
                    const [topicId, field] = key.split("_");

                    let topic = acc.find((t) => t.topicId === Number(topicId));
                    if (!topic) {
                        topic = { topicId: Number(topicId), beforeInterventionMark: 0, afterInterventionMark: 0 };
                        acc.push(topic);
                    }

                    topic[field] = value;
                    return acc;
                }, []);

            return {
                studentId: student.studentId || 0,
                studentName: student.studentName,
                topics,
            };
        });
        return { studentPerformances };
    };


    const saveAllPerformances = async () => {
        try {
            const postData = prepareDataForPost();
            if (postData) {
                const res = await apiServices.saveAllPerformanceTable(selectedSchool, selectedProject, postData);
                if (res?.data?.status) {
                    setEditedData([]);
                    setShowModal(true)
                }
            }
            else {
                return;
            }

        } catch (err) {
            throw err;
        }
    }
    return (
        <div className="project-page">
            <div className="header">
                <div className="heading-container">
                    <h2 className="project-heading">Performance</h2>
                    <p className="subheading">Performance List of Students</p>
                </div>
                <button
                    className="g-button create-new-button"
                    onClick={() => { saveAllPerformances() }}
                >
                    Save
                </button>
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
                <div>
                    <div className="ag-theme-quartz" style={{ height: "500px" }}>
                        <AgGridTable
                            rowData={rowDataWithTpoic}
                            columnDefs={columDefsWithTopic}
                            onCellValueChanged={handleCellValueChange}
                        />
                    </div>
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
            {showModal && <SuccessModal data={{description:"Performance Updated Successfully!!"}} onClose={()=>{setShowModal(false)}} />}
        </div>
    )
}

export default Performance