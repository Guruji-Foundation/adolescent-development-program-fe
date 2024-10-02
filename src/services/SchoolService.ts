// src/services/SchoolService.ts
import axios from 'axios';
import { School } from '../types/School';

// Fetch all schools
export const fetchSchools = async (): Promise<School[]> => {
  const response = await axios.get('http://localhost:8080/schools');
  if (response.data && response.data.status) {
    return response.data.data.students; // Adjust the property according to API structure
  }
  return [];
};

// Delete a school by id
export const deleteSchool = async (id: number): Promise<void> => {
  await axios.delete(`http://localhost:8080/schools/${id}`);
};
