import axios from 'axios';
import { Teacher } from '../types/Teacher';

// Function to fetch all students
export const fetchTeachers = async (): Promise<Teacher[]> => {
    try {
      const response = await axios.get('http://localhost:8080/teachers');
      if (response.data.status) {
        return response.data.data.teacherDetails;
      } else {
        throw new Error('Failed to fetch teachers');
      }
    } catch (error) {
      console.error('Error fetching student data:', error);
      throw error;
    }
  };