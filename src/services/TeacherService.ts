import axios from "axios";
import { Teacher } from "../types/Teacher";
import MainAPI from "./MainAPI";

// Function to fetch all students
export const fetchTeachers = async (): Promise<Teacher[]> => {
  try {
    const response = await MainAPI.get("/teachers");
    if (response.data.status) {
      return response.data.data.teacherDetails;
    } else {
      throw new Error("Failed to fetch teachers");
    }
  } catch (error) {
    console.error("Error fetching student data:", error);
    throw error;
  }
};
// create new teacher
export const createTeacher = async (techerData: any) => {
  const response = await MainAPI.post("/teachers", techerData);
  return response;
};

//Fetch teacher by id

export const fetchTeacher = async (id: number): Promise<Teacher | null> => {
  try {
    const response = await MainAPI.get(`/teachers/${id}`);
    if (response.data && response.data.status) {
      return response.data.data; // Assuming `data` contains the school object
    }
    return null;
  } catch (error) {
    console.error("Error fetching school:", error);
    return null; // Return null in case of an error
  }
};

// Delete a school by id
export const deleteTeacher = async (id: number): Promise<void> => {
  await MainAPI.delete(`/teachers/${id}`);
};

//update school data

export const updateTeacher = async (id: number, schoolData: Object) => {
  const response = await MainAPI.put(`/teachers/${id}`, schoolData);
  return response;
};
