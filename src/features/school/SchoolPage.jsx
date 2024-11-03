import React, { useEffect, useState } from "react";
import { FaEdit, FaTrashAlt } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { deleteSchool } from "../../services/SchoolService";
import ConfirmationModal from "../../common/FeedbackComponents/Confirmation/ConfirmationModal";
import Tooltip from "../../common/FeedbackComponents/Tooltip/ToolTip";
import "../../CSS/Main.css";
import "./SchoolPage.css";
import useFetchSchools from "../../hooks/useFetchSchools";
import useError from "../../hooks/useError";
import ErrorMessage from "../../common/FormInput/ErrorMessage";
import LoadingSpinner from "../../common/FeedbackComponents/Loading/LoadingSpinner"; // Import loading spinner
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-quartz.css';
import AgGridTable from "../../common/GloabalComponent/AgGridTable";
import apiServices from "../../common/ServiCeProvider/Services";

// const SchoolPage: React.FC = () => {
//   const [schools, setSchools] = useState<School[]>([]);
//   const [loading, setLoading] = useState<boolean>(true);
//   const [error, setError] = useState<string | null>(null);
//   const navigate = useNavigate(); 
//   useEffect(() => {
//     // Fetch school data from the service
//     fetchSchools()
//       .then((data) => {
//         if (data && data.length > 0) {
//           setSchools(data);
//         } else {
//           setSchools([]); // If no schools exist, set an empty array
//         }
//         setLoading(false);
//       })
//       .catch((error) => {
//         setError('Error fetching school data.');
//         console.error('Error fetching school data:', error);
//         setLoading(false);
//       });
//   }, []);
//   const handleEdit = (id: number) => {
//       console.log('Edit school with id:', id);
//   };

//   const handleDelete = (id: number) => {
//       console.log('Delete school with id:', id);
//   };

//   const handleCreateNew = () => {
//       navigate('/create-school');
//     };

//   if (loading) {
//       return <div>Loading...</div>;
//     }

//     if (error) {
//       return <div>{error}</div>;
//     }

//   return (
//       <div className="school-page">
//           {/* Header Section */}
//           <div className="header">
//               <div className="heading-container">
//                   <h2 className="school-heading">School</h2>
//                   <p className="subheading">List of Schools</p>
//               </div>
//               <button className="create-new-button" onClick={handleCreateNew}>Create New</button>
//           </div>

//           {/* School Table */}
//           <table className="school-table">
//               <thead>
//                   <tr>
//                       <th>School Name</th>
//                       <th>Address</th>
//                       <th>Principal Name</th>
//                       <th>Principal Contact</th>
//                       <th>Managing Trustee</th>
//                       <th>Trustee Contact</th>
//                       <th>Action</th>
//                   </tr>
//               </thead>
//               <tbody>
//                   {schools.map((school) => (
//                       <tr key={school.id}>
//                           <td>{school.name}</td>
//                           <td>{school.address}</td>
//                           <td>{school.principalName}</td>
//                           <td>{school.principalContactNo}</td>
//                           <td>{school.managingTrustee}</td>
//                           <td>{school.trusteeContactInfo}</td>
//                           <td>
//                               <button onClick={() => handleEdit(school.id)} className="action-button edit-button">
//                                   <FaEdit />
//                               </button>
//                               <button onClick={() => handleDelete(school.id)} className="action-button delete-button">
//                                   <FaTrashAlt />
//                               </button>
//                           </td>
//                       </tr>
//                   ))}
//               </tbody>
//           </table>
//       </div>
//   );
// };

function SchoolPage() {
  const [selectedSchoolId, setSelectedSchoolId] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [schoolRowData, setSchoolRowData] = useState([])
  const navigate = useNavigate();
  const { schools, setSchools, loading } = useFetchSchools();
  const { errors, setError, clearError } = useError();


  const handleDelete = (id) => {
    setSelectedSchoolId(id);
    setIsModalVisible(true);
  };

  const confirmDelete = () => {
    if (selectedSchoolId !== null) {
      deleteSchool(selectedSchoolId)
        .then(() => {
          const updatedSchools = schools.filter(
            (school) => school.id !== selectedSchoolId
          );
          setSchools(updatedSchools);
          setSelectedSchoolId(null);
          setIsModalVisible(false);
        })
        .catch((error) => {
          console.error("Error deleting school:", error);
          setError("Failed to delete school. Please try again later.");
        });
    }
  };

  const cancelDelete = () => {
    setSelectedSchoolId(null);
    setIsModalVisible(false);
  };

  const handleCreateNew = () => {
    navigate("/create-school");
  };

  const handleEdit = (id) => {
    console.log(id)
    navigate(`/edit-school/${id}`);
  };

  const getSchooList = async () => {
    try {
      const data = (await apiServices.getAllSchollList())?.data?.data?.students;
      const rowData = data?.map((item) => ({
        id: item?.id,
        name: item?.name,
        address: item?.address,
        principalName: item?.principalName,
        principalContactNo: item?.principalContactNo,
        managingTrustee: item?.managingTrustee,
        trusteeContactInfo: item?.trusteeContactInfo,
      }))
      setSchoolRowData(rowData)
    } catch (err) {
      throw err;
    }
  }

  useEffect(() => {
    getSchooList();
  }, [])

  if (loading) {
    return <LoadingSpinner />;
  }
  if (errors.length > 0) {
    clearError();
    return <div>{errors.length > 0 && <ErrorMessage errors={errors} />}</div>;
  }

  const columDefs = [
    {
      headerCheckboxSelection: true,
      checkboxSelection: true,
      width: 50,
    },
    {
      headerName: "School Name",
      field: "name",
      filter: true,
      floatingFilter: true,
    },
    {
      headerName: "Address",
      field: "address",
      filter: true,
      floatingFilter: true,
    },
    {
      headerName: "Principal Name",
      field: "principalName",
      filter: true,
      floatingFilter: true,
    },
    {
      headerName: "Managing Trusteet",
      field: "principalContactNo",
      filter: true,
      floatingFilter: true,
    },
    {
      headerName: "Trustee Contact",
      field: "managingTrustee",
      filter: true,
      floatingFilter: true,
    },
    {
      headerName: "Action",
      filter: true,
      floatingFilter: true,
      cellRenderer: (params) => {
        return (
          <div>
            <button onClick={() => handleEdit(params?.data?.id)} className="action-button edit-button">
              <FaEdit />
            </button>
            <button onClick={() => handleDelete(params?.data?.id)} className="action-button delete-button">
              <FaTrashAlt />
            </button>
          </div>
        )
      }
    },
  ]

  const tempData = [
    {
      name: "Greenfield High School",
      address: "123 Main St, Springfield",
      principalName: "John Doe",
      principalContactNo: "555-1234",
      managingTrustee: "Jane Smith",
      trusteeContactInfo: "jane.smith@example.com",
    },
    {
      name: "Riverside Academy",
      address: "456 Elm St, Riverside",
      principalName: "Alice Johnson",
      principalContactNo: "555-5678",
      managingTrustee: "Robert Williams",
      trusteeContactInfo: "robert.williams@example.com",
    },
    {
      name: "Sunrise Elementary",
      address: "789 Oak St, Lakeside",
      principalName: "Michael Brown",
      principalContactNo: "555-8765",
      managingTrustee: "Linda Davis",
      trusteeContactInfo: "linda.davis@example.com",
    },
  ];



  return (
    <div className="school-page">
      <div className="header">
        <div className="heading-container">
          <h2 className="school-heading">School</h2>
          <p className="subheading">List of Schools</p>
        </div>
        <button
          className="g-button create-new-button"
          onClick={handleCreateNew}
        >
          Create New
        </button>
      </div>

      <div className="ag-theme-quartz" style={{ height: "500px" }}>
        <AgGridTable
          rowData={schoolRowData}
          columnDefs={columDefs}
        />
      </div>
    </div>
  )
}

export default SchoolPage;
