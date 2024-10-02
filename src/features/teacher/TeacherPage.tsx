import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FaEdit, FaTrashAlt } from 'react-icons/fa';
import './TeacherPage.css'; // Assuming your styles are in TeacherPage.css
import { Teacher } from '../../types/Teacher';
import { fetchTeachers } from '../../services/TeacherService';

const TeacherPage: React.FC = () => {
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchTeachers()
      .then((teacherData) => {
        if (teacherData && teacherData.length) {
          setTeachers(teacherData); // Ensure data is properly set
        } else {
          setTeachers([]); // Set to an empty array if no data is found
        }
        setLoading(false);
      })
      .catch((error) => {
        setError('Error fetching teacher data');
        console.error('Error fetching teacher data:', error);
        setLoading(false);
      });
  }, []);

  const handleEdit = (id: number) => {
    console.log('Edit teacher with id:', id);
  };

  const handleDelete = (id: number) => {
    console.log('Delete teacher with id:', id);
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div className="teacher-page">
      {/* Header Section */}
      <div className="header">
        <div className="heading-container">
          <h2 className="teacher-heading">Teachers</h2>
          <p className="subheading">List of Teachers</p>
        </div>
        <button className="create-new-button">Create New</button>
      </div>

      {/* Teacher Table */}
      {teachers.length > 0 ? (
        <table className="teacher-table">
          <thead>
            <tr>
              <th>Teacher Name</th>
              <th>Experience (Years)</th>
              <th>School Name</th>
              <th>School Address</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {teachers.map((teacher) => (
              <tr key={teacher.id}>
                <td>{teacher.name}</td>
                <td>{teacher.experience}</td>
                <td>{teacher.schoolDetails.name}</td>
                <td>{teacher.schoolDetails.address}</td>
                <td>
                  <button onClick={() => handleEdit(teacher.id)} className="action-button edit-button">
                    <FaEdit />
                  </button>
                  <button onClick={() => handleDelete(teacher.id)} className="action-button delete-button">
                    <FaTrashAlt />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <div>No teachers available</div>
      )}
    </div>
  );
};

export default TeacherPage;
