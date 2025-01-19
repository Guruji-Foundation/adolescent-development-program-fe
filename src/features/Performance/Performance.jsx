import React, { useState, useEffect } from 'react'
import LoadingSpinner from "../../common/FeedbackComponents/Loading/LoadingSpinner";
import apiServices from "../../common/ServiCeProvider/Services";
import { FaEdit, FaTrashAlt } from "react-icons/fa";
import { ImCross, ImDownload2, ImUpload2 } from "react-icons/im"
import { useNavigate } from "react-router-dom";
import ConfirmationModal from "../../common/FeedbackComponents/Confirmation/ConfirmationModal";
import AgGridTable from "../../common/GloabalComponent/AgGridTable";
import useError from "../../hooks/useError";
import SelectInput from "../../common/FormInput/SelectInput";
import SuccessModal from "../../common/FeedbackComponents/Sucess/SuccessModal";
import axios from 'axios';
import "../../CSS/Main.css"
import { MdFileDownload, MdFileUpload } from "react-icons/md";
import './Performance.css';

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
    const [selectedTopics, setSelectedTopics] = useState(null);
    const [file, setFile] = useState(null);
    const [showUploadSuccessModal, setShowUploadSuccessModal] = useState(false);

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


    const downloadCsvData = (data, filename) => {
        const fileBlob = new Blob([data], {
            type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        });
        const fileUrl = window.URL.createObjectURL(fileBlob);
        const link = document.createElement('a');

        link.href = fileUrl;
        link.setAttribute('download', filename);
        document.body.appendChild(link);

        link.click();
        document.body.removeChild(link);
    };


    const extractFilenameFromHeaderString = (rawString) => {
        if (!rawString) return 'download.xlsx'; // Default filename if header is missing

        const filenameMatch = rawString.match(/filename="([^"]+)"/);
        return filenameMatch ? filenameMatch[1] : 'download.xlsx';
    };

    const handleDownloadTemplateClick = async () => {
        try {
            const requestBody = {
                schoolId: Number(selectedSchool),
                projectId: Number(selectedProject),
                topicIds: [
                    Number(selectedTopics)
                ]
            }
            // const response = await apiServices.downloadPerformanceTemplate(requestBody);
            const response = await axios.post(
                `https://adolescent-development-program-be-new-245843264012.us-central1.run.app/performances/download`, requestBody, // Adjust the endpoint
                {
                    responseType: 'blob', // Ensure the response is treated as a binary blob
                }
            );
            const contentDisposition = response.headers['content-disposition'] || '';
            // const filename = extractFilenameFromHeaderString(contentDisposition);
            console.log(typeof response.data);
            // Trigger download
            downloadCsvData(response.data, "Performace");
        } catch (error) {
            throw error;
        }
    }

    const uploadFile = async (file) => {
        // Form the data
        const formData = new FormData();
        formData.append('file', file);

        try {
            const response = await axios.post(
                'https://adolescent-development-program-be-new-245843264012.us-central1.run.app/performances/upload',
                formData,
                {
                    headers: {
                        'sec-ch-ua-platform': '"Windows"',
                        'Referer': 'https://adolescent-development-program-be-new-245843264012.us-central1.run.app/swagger-ui/index.html',
                        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/132.0.0.0 Safari/537.36',
                        'accept': 'application/json',
                        'sec-ch-ua': '"Not A(Brand";v="8", "Chromium";v="132", "Google Chrome";v="132"',
                        'sec-ch-ua-mobile': '?0',
                        'Content-Type': 'multipart/form-data',
                    },
                }
            );

            if (response?.status) {
                setFile(null);
                setShowUploadSuccessModal(true)
            }
            console.log('File uploaded successfully:', response.data);
        } catch (error) {
            console.error('Error uploading file:', error.response || error);
        }
    };


    const handleFileChange = (event) => {
        setFile(event.target.files[0]);
    };

    const handleUpload = () => {
        if (file) {
            uploadFile(file);
        } else {
            alert('Please select a file to upload.');
        }
    };

    const renderFileUploadSection = () => (
        <div className="file-upload-container">
            <div className="selection-and-template-container">
                {/* First Row: Selection Inputs */}
                <div className="school-selector-group">
                    <div className="select-wrapper">
                        <SelectInput
                            label="Select Project"
                            value={selectedProject || ""}
                            options={projectsList}
                            onChange={(e) => setSelectedProject(e.target.value)}
                            placeholder="Choose a project..."
                        />
                    </div>
                    <div className="select-wrapper">
                        <SelectInput
                            label="Select School"
                            value={selectedSchool || ""}
                            options={schoolList}
                            onChange={(e) => setSelectedSchool(e.target.value)}
                            placeholder="Choose a school..."
                        />
                    </div>
                    <div className="select-wrapper">
                        <SelectInput
                            label="Select Topic"
                            value={selectedTopics || ""}
                            options={topicData}
                            onChange={(e) => setSelectedTopics(e.target.value)}
                            placeholder="Choose a topic..."
                        />
                    </div>
                   
                    {(selectedProject || selectedSchool || selectedTopics) && (
                        <button
                            className="clear-school-button"
                            onClick={() => {
                                setSelectedProject(null);
                                setSelectedSchool(null);
                                setSelectedTopics(null);
                                getTopicData(null);
                            }}
                            title="Clear selection"
                        >
                            <ImCross className="clear-icon" />
                        </button>
                    )}
                </div>

                {/* Second Row: Template Buttons */}
                {selectedTopics && selectedSchool && selectedProject && (
                    <div className="template-buttons-row">
                        <div className="template-buttons-group">
                            <button className="download-button" onClick={handleDownloadTemplateClick} title="Download Template">
                                <MdFileDownload className="upload-icon" />
                                <span>Download Performance Template</span>
                            </button>
                        </div>
                        {/* <div style={{ dispaly: "flex" ,border: "1px red solid", }}>
                            <div>
                                <label htmlFor="fileInput" className="" title="Select File" >
                                    <MdFileUpload className="upload-icon" />
                                    <span>{file ? file?.name : "Upload Performance Template"}</span>
                                    <input
                                        id="fileInput"
                                        type="file"
                                        accept=".xlsx,.xls,.csv"
                                        onChange={handleFileChange}
                                        style={{ display: "none" }}
                                    />
                                </label></div>

                            {file && (
                                <div className="template-buttons-group">
                                    <button className="create-new-button" onClick={handleUpload} title="Upload Data">
                                        <MdFileUpload className="upload-icon" />
                                        <span>Upload</span>
                                    </button>
                                </div>
                            )}
                        </div> */}
                
                    </div>
                )}
            </div>
        </div>
    );

    return (
        <div className="project-page">
            <div className="header">
                <div className="heading-container">
                    <h2 className="project-heading">Performance Management</h2>
                </div>
                <div
                            style={{
                                display: "flex",
                                alignItems: "center",
                                border: "2px solid rgb(143, 144, 142)",
                                borderRadius: "4px",
                                overflow: "hidden",
                                width: "100%",
                                maxWidth: "600px",
                                height:"40px"
                            }}
                        >
                            <input
                                id="fileInput"
                                type="file"
                                style={{ display: "none" }}
                                onChange={handleFileChange}
                            />

                            <label
                                htmlFor="fileInput"
                                style={{
                                    flex: 1,
                                    padding: "10px 15px",
                                    cursor: "pointer",
                                    fontSize: "14px",
                                    display: "flex",
                                    alignItems: "center",
                                    gap: "10px",
                                }}
                            >
                                <MdFileUpload className="upload-icon" />
                                <span>
                                    {file ? file.name : "Click to upload marks"}
                                </span>
                            </label>

                            <button
                                className="create-new-button" 
                                 onClick={handleUpload} 
                            >
                                Upload
                            </button>
                        </div>
                {selectedSchool && selectedProject && (
                    <button
                        className="create-new-button"
                        onClick={saveAllPerformances}
                        title="Save Changes"
                    >
                        Save Changes
                    </button>
                )}
            </div>

            {renderFileUploadSection()}

            {!(selectedSchool && selectedProject) ? (
                <h2 className="project-heading">Please select relevant options to view Performance of Student</h2>
            ) : (
                <div className="ag-theme-quartz" style={{ height: "500px", width: "100%" }}>
                    <AgGridTable
                        rowData={rowDataWithTpoic}
                        columnDefs={columDefsWithTopic}
                        onCellValueChanged={handleCellValueChange}
                        defaultColDef={{
                            sortable: true,
                            filter: true,
                            floatingFilter: true,
                            resizable: true,
                            suppressSizeToFit: true,
                            flex: 1,
                        }}
                        pagination={true}
                        paginationPageSize={10}
                        rowHeight={48}
                        headerHeight={48}
                        animateRows={true}
                        enableCellTextSelection={true}
                        suppressMovableColumns={true}
                        suppressDragLeaveHidesColumns={true}
                        onGridSizeChanged={(params) => {
                            params.api.sizeColumnsToFit();
                        }}
                        onFirstDataRendered={(params) => {
                            params.api.sizeColumnsToFit();
                        }}
                        className="custom-ag-table"
                    />
                </div>
            )}

            {isModalVisible && (
                <ConfirmationModal
                    title="Confirm Deletion"
                    message="Do you really want to delete this Performance?"
                    onConfirm={deletePerformance}
                    onCancel={cancelDelete}
                />
            )}
            {showModal && (
                <SuccessModal
                    data={{ description: "Performance Updated Successfully!" }}
                    onClose={() => setShowModal(false)}
                />
            )}
            {showUploadSuccessModal && (
                <SuccessModal
                    data={{ description: "Performance Updated Successfully!" }}
                    onClose={() => setShowUploadSuccessModal(false)}
                />
            )}
        </div>
    );
}

export default Performance