import React, { useState, useEffect } from "react";
import LoadingSpinner from "../../common/FeedbackComponents/Loading/LoadingSpinner";
import apiServices from "../../common/ServiCeProvider/Services";
import { FaEdit, FaTrashAlt } from "react-icons/fa";
import { ImCross, ImDownload2, ImUpload2 } from "react-icons/im";
import { useNavigate } from "react-router-dom";
import ConfirmationModal from "../../common/FeedbackComponents/Confirmation/ConfirmationModal";
import AgGridTable from "../../common/GloabalComponent/AgGridTable";
import useError from "../../hooks/useError";
import SelectInput from "../../common/FormInput/SelectInput";
import SuccessModal from "../../common/FeedbackComponents/Sucess/SuccessModal";
import axios from "axios";
import "../../CSS/Main.css";
import { MdFileDownload, MdFileUpload } from "react-icons/md";
import "./Performance.css";
import Toast from "../../common/FeedbackComponents/Toast/Toast";
const apiUrl = process.env.REACT_APP_API_BASE_URL;
function Performance() {
  const navigate = useNavigate();
  const handelAddPerformance = () => {
    navigate("/add-performance");
  };
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
  const [columDefsWithTopic, setColumDefsWithTopic] = useState([]);
  const [rowDataWithTpoic, setRowDataWithTopic] = useState([]);
  const [editedData, setEditedData] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedTopics, setSelectedTopics] = useState(null);
  const [file, setFile] = useState(null);
  const [showUploadSuccessModal, setShowUploadSuccessModal] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [toastType, setToastType] = useState("warning");
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = React.useRef(null);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

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
        getPerformanceData();
      }
    } catch (err) {
      console.log("Error in Deleting", err);
    }
  };

  const handleEdit = (id) => {
    navigate(`/edit-performance/${id}`);
  };

  const getPerformanceData = async () => {
    try {
      const data = (await apiServices.getPerformanceList())?.data?.data
        ?.performances;
      const rData = data?.map((item) => ({
        ...item,
        studentName: studentData?.find((data) => item?.studentId == data?.id)
          ?.name,
        topicName: topicData?.find((data) => item?.topicId == data?.id)?.name,
      }));
      setPerfomaceData(rData);
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  const getTopicData = async (selectedProjectId) => {
    try {
      const res = (await apiServices.getAllTopicList(selectedProjectId))?.data
        ?.data?.topics;
      if (res && res.length > 0) {
        setTopicData(res);
      }
    } catch (err) {
      console.log("Error", err);
    }
  };

  const getStudentData = async () => {
    try {
      const res = (await apiServices.getStudentList())?.data?.data?.students;
      if (res && res.length > 0) {
        setStudentData(res);
      }
    } catch (err) {
      console.log("Error", err);
    }
  };

  useEffect(() => {
    getTopicData(null);
    getStudentData();
  }, []);

  useEffect(() => {
    getPerformanceData();
  }, [studentData, topicData]);

  const getProjectList = async () => {
    if (selectedSchool) {
      try {
        // setLoading(true);
        const res = (await apiServices.getAllProjectList(selectedSchool))?.data
          ?.data?.projects;
        setProjectsList(res);
      } catch (err) {
        setError(err.message);
      } finally {
        // setLoading(false);
      }
    }
  };

  useEffect(() => {
    // apiServices
    //     .getAllProjectList()
    //     .then((res) => {
    //         res = res?.data?.data?.projects;
    //         // console.log(res);
    //         if (res && res.length > 0) {
    //             setProjectsList(res);
    //         } else {
    //             setProjectsList([]);
    //         }
    //     })
    //     .catch((error) => {
    //         setError("Error fetching school data.");
    //         console.error("Error fetching school data:", error);
    //     });

    getSchoolData();
  }, []);

  useEffect(() => {
    if (selectedSchool) {
      getProjectList();
    }
  }, [selectedSchool]);

  const getSchoolData = async () => {
    try {
      const res = (await apiServices.getAllSchoolList())?.data?.data?.schools;
      if (res && res.length > 0) {
        setSchoolList(res);
      }
    } catch (err) {
      console.log("Error", err);
    }
  };

  const getPerformanceDetailsBasedOnProjectAndSchool = async () => {
    try {
      const response = await apiServices.getPerformanceListBySchoolAndProject(
        selectedSchool,
        selectedProject
      );
      const rowData2 = response?.data?.data?.studentPerformances?.map(
        (student) => {
          const row = {
            studentName: student.studentName,
            studentId: student.studentId,
          };

          student.topics.forEach((topic) => {
            row[`${topic.topicId}_beforeInterventionMark`] =
              topic.beforeInterventionMark;
            row[`${topic.topicId}_afterInterventionMark`] =
              topic.afterInterventionMark;
          });

          return row;
        }
      );
      setRowDataWithTopic(rowData2);
    } catch (err) {}
  };

  useEffect(() => {
    if (selectedProject && selectedSchool) {
      getTopicData(selectedProject);
      getPerformanceDetailsBasedOnProjectAndSchool();
    }
  }, [selectedProject, selectedSchool]);

  useEffect(() => {
    if (selectedProject && selectedSchool) {
      const filteredTopics =
        selectedTopics > 0
          ? topicData?.filter((item) => item?.id == selectedTopics)
          : topicData;

      const columnDefs2 = filteredTopics?.map((item) => ({
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
          },
        ],
      }));

      setColumDefsWithTopic([
        {
          headerName: "Student Name",
          field: "studentName",
          flex: 1,
          minWidth: 300,
          pinned: "left",
        },
        ...columnDefs2,
      ]);
    }
  }, [topicData, selectedTopics]);

  const handleCellValueChange = (params) => {
    const updatedRow = params.data;
    setEditedData((prev) => {
      const existingIndex = prev.findIndex(
        (row) => row.studentName === updatedRow.studentName
      );
      if (existingIndex > -1) {
        const updated = [...prev];
        updated[existingIndex] = updatedRow;
        return updated;
      } else {
        return [...prev, updatedRow];
      }
    });
    setHasUnsavedChanges(true);
  };

  const prepareDataForPost = () => {
    if (editedData?.length == 0) return null;
    const studentPerformances = editedData.map((student) => {
      const topics = Object.entries(student)
        .filter(
          ([key]) =>
            key.includes("_beforeInterventionMark") ||
            key.includes("_afterInterventionMark")
        )
        .reduce((acc, [key, value]) => {
          const [topicId, field] = key.split("_");

          let topic = acc.find((t) => t.topicId === Number(topicId));
          if (!topic) {
            topic = {
              topicId: Number(topicId),
              beforeInterventionMark: 0,
              afterInterventionMark: 0,
            };
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
        const res = await apiServices.saveAllPerformanceTable(
          selectedSchool,
          selectedProject,
          postData
        );
        if (res?.data?.status) {
          setEditedData([]);
          setShowModal(true);
          setHasUnsavedChanges(false);
        }
      } else {
        return;
      }
    } catch (err) {
      throw err;
    }
  };

  const downloadCsvData = (data, filename) => {
    const fileBlob = new Blob([data], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });
    const fileUrl = window.URL.createObjectURL(fileBlob);
    const link = document.createElement("a");

    link.href = fileUrl;
    link.setAttribute("download", filename);
    document.body.appendChild(link);

    link.click();
    document.body.removeChild(link);
  };

  const extractFilenameFromHeaderString = (rawString) => {
    if (!rawString) return "download.xlsx"; // Default filename if header is missing

    const filenameMatch = rawString.match(/filename="([^"]+)"/);
    return filenameMatch ? filenameMatch[1] : "download.xlsx";
  };

  const handleDownloadTemplateClick = async () => {
    if (!selectedTopics) {
      setShowToast(true);
      setToastMessage("Please select a topic before downloading the template");
      setToastType("warning");
      setTimeout(() => setShowToast(false), 3000);
      return;
    }

    try {
      const requestBody = {
        schoolId: Number(selectedSchool),
        projectId: Number(selectedProject),
        topicIds: [Number(selectedTopics)],
      };
      const response = await apiServices.downloadPerformanceTemplate(requestBody);

      // Check if the response is actually a blob (successful download)
      if (response.data instanceof Blob) {
        downloadCsvData(response.data, "Performance");
      } else {
        setShowToast(true);
        setToastMessage("Failed to download template. Please try again.");
        setToastType("danger");
      }
    } catch (error) {
      console.error("Download error:", error);

      // Get the error message from the API response
      const errorMessage =
        error.response?.data?.messages?.[0]?.message ||
        "An unexpected error occurred";

      setShowToast(true);
      setToastMessage(errorMessage);
      setToastType("danger");
      setTimeout(() => setShowToast(false), 3000);
    }
  };

  const handleFileChange = (event) => {
    const selectedFile = event.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
      uploadFile(selectedFile);
    }
    // Reset the input value immediately after getting the file
    if (event.target) {
      event.target.value = "";
    }
  };

  const handleUploadClick = () => {
    if (!selectedTopics) {
      setShowToast(true);
      setToastMessage("Please select a topic before uploading the file");
      setToastType("warning");
      setTimeout(() => setShowToast(false), 3000);
      return;
    }
    fileInputRef.current?.click();
  };

  const uploadFile = async (file) => {
    setIsUploading(true);
    try {
      const response = await apiServices.uploadFile('/performances/upload', file);

      if (response?.status) {
        setFile(null);
        setShowUploadSuccessModal(true);
        // Refresh the table data
        if (selectedProject && selectedSchool) {
          await getPerformanceDetailsBasedOnProjectAndSchool();
        }
      }
    } catch (error) {
      console.error("Error uploading file:", error.response || error);
      setShowToast(true);
      setToastMessage("Error uploading file. Please try again.");
      setToastType("danger");
      setTimeout(() => setShowToast(false), 3000);
    } finally {
      setIsUploading(false);
    }
  };

  const renderFileUploadSection = () => (
    <div className="file-upload-container">
      <div className="selection-and-template-container">
        {/* First Row: Selection Inputs */}
        <div className="school-selector-group">
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
              label="Select Project"
              value={selectedProject || ""}
              options={projectsList}
              onChange={(e) => setSelectedProject(e.target.value)}
              placeholder="Choose a project..."
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
      </div>
    </div>
  );

  return (
    <div className="project-page">
      {isUploading && <LoadingSpinner />}
      <div className="header">
        <div className="heading-container">
          <h2 className="project-heading">Performance Management</h2>
        </div>
        <div style={{ display: "flex", gap: "10px" }}>
          <div className="download-container">
            <button
              className="icon-button"
              onClick={handleDownloadTemplateClick}
              title="Download Template"
            >
              <MdFileDownload className="button-icon" />
            </button>
          </div>
          <div className="upload-container">
            <input
              ref={fileInputRef}
              type="file"
              style={{ display: "none" }}
              onChange={handleFileChange}
            />
            <button
              className="icon-button"
              onClick={handleUploadClick}
              title="Upload Marks"
            >
              <MdFileUpload className="button-icon" />
            </button>
          </div>
        </div>
      </div>

      {renderFileUploadSection()}

      {!(selectedSchool && selectedProject) ? (
        <h2 className="project-heading">
          Please select relevant options to view Performance of Student
        </h2>
      ) : (
        <>
          <div style={{ marginBottom: "80px" }}>
            <div
              className="ag-theme-quartz"
              style={{ height: "500px", width: "100%" }}
            >
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
          </div>
          <div
            style={{
              position: "fixed",
              bottom: 0,
              left: 0,
              right: 0,
              padding: "15px",
              background: "white",
              boxShadow: "0 -2px 10px rgba(0,0,0,0.1)",
              zIndex: 1000,
              display: "flex",
              justifyContent: "flex-end",
            }}
          >
            <button
              className={`create-new-button ${
                hasUnsavedChanges ? "unsaved-changes" : ""
              }`}
              onClick={saveAllPerformances}
              title="Save Changes"
              style={{
                background: hasUnsavedChanges ? "#007bff" : "#6c757d",
                animation: hasUnsavedChanges ? "pulse 2s infinite" : "none",
              }}
            >
              {hasUnsavedChanges ? "Save Changes*" : "Save Changes"}
            </button>
          </div>
        </>
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
      {showToast && (
        <Toast
          type={toastType}
          message={toastMessage}
          onClose={() => setShowToast(false)}
        />
      )}
      {hasUnsavedChanges && (
        <div
          style={{
            position: "fixed",
            top: "20px",
            right: "20px",
            background: "#fff3cd",
            color: "#856404",
            padding: "10px 20px",
            borderRadius: "4px",
            boxShadow: "0 2px 5px rgba(0,0,0,0.2)",
            zIndex: 1000,
          }}
        >
          You have unsaved changes
        </div>
      )}
    </div>
  );
}

export default Performance;
