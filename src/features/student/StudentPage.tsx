import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FaEdit, FaTrashAlt } from 'react-icons/fa';
import './StudentPage.css'; 
import { fetchStudents } from '../../services/StudentService';
import { Student } from '../../types/Student';



const StudentPage: React.FC = () => {
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Fetch student data from the service
    fetchStudents()
      .then((data) => {
        if (data && data.length > 0) {
          setStudents(data);
        } else {
          setStudents([]); // If no students exist, set an empty array
        }
        setLoading(false);
      })
      .catch((error) => {
        setError('Error fetching student data.');
        console.error('Error fetching student data:', error);
        setLoading(false);
      });
  }, []);

  const handleEdit = (id: number) => {
    console.log('Edit student with id:', id);
  };

  const handleDelete = (id: number) => {
    console.log('Delete student with id:', id);
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div className="student-page">
      {/* Header Section */}
      <div className="header">
        <div className="heading-container">
          <h2 className="student-heading">Students</h2>
          <p className="subheading">List of Students</p>
        </div>
        <button className="create-new-button">Create New</button>
      </div>

      {/* Student Table */}
      <table className="student-table">
        <thead>
          <tr>
            <th>Student Name</th>
            <th>Date of Birth</th>
            <th>Address</th>
            <th>Phone Number</th>
            <th>Email</th>
            <th>Parent Name</th>
            <th>Parent Occupation</th>
            <th>Parent Contact</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {students.map((student) => (
            <tr key={student.id}>
              <td>{student.name}</td>
              <td>{student.dob}</td>
              <td>{student.address}</td>
              <td>{student.phoneNumber}</td>
              <td>{student.email}</td>
              <td>{student.parent.name}</td>
              <td>{student.parent.occupation}</td>
              <td>{student.parent.phoneNumber}</td>
              <td>
                <button onClick={() => handleEdit(student.id)} className="action-button edit-button">
                  <FaEdit />
                </button>
                <button onClick={() => handleDelete(student.id)} className="action-button delete-button">
                  <FaTrashAlt />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default StudentPage;
