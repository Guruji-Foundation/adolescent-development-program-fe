
import axios from 'axios';
import { Student } from '../types/Student';
import { StudentResponse } from '../types/StudentResponse';

// Function to fetch all students
export const fetchStudents = async (): Promise<Student[]> => {
  try {
    const response = await axios.get('http://localhost:8080/students');
    if (response.data.status) {
      return response.data.data.students;
    } else {
      throw new Error('Failed to fetch students');
    }
  } catch (error) {
    console.error('Error fetching student data:', error);
    throw error;
  }
};

// Function to create a new student
export const createStudent = async (studentData: Student): Promise<Student> => {
  try {
    const response = await axios.post('http://localhost:8080/students', studentData);
    return response.data;
  } catch (error) {
    console.error('Error creating new student:', error);
    throw error;
  }
};

// Function to update student details
export const updateStudent = async (studentId: number, updatedData: Partial<Student>): Promise<Student> => {
  try {
    const response = await axios.put(`http://localhost:8080/students/${studentId}`, updatedData);
    return response.data;
  } catch (error) {
    console.error('Error updating student:', error);
    throw error;
  }
};

// Function to delete a student
export const deleteStudent = async (studentId: number): Promise<void> => {
  try {
    await axios.delete(`http://localhost:8080/students/${studentId}`);
  } catch (error) {
    console.error('Error deleting student:', error);
    throw error;
  }
};
