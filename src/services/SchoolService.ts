// src/services/SchoolService.ts
import axios from "axios";

import MainAPI from "./MainAPI";
import { School } from "../types/School";

//create new school

export const createSchool = async (schoolData: Object) => {
  const response = await MainAPI.post("/schools", schoolData);
  return response;
};

// Fetch all schools
export const fetchSchools = async (): Promise<School[]> => {
  const response = await MainAPI.get("/schools");
  if (response.data && response.data.status) {
    return response.data.data.students; // Adjust the property according to API structure
  }
  return [];
};

// Delete a school by id
export const deleteSchool = async (id: number): Promise<void> => {
  await MainAPI.delete(`/schools/${id}`);
};

//Fetch school by id

export const fetchSchool = async (id: number): Promise<School | null> => {
  try {
    const response = await MainAPI.get(`/schools/${id}`);
    if (response.data && response.data.status) {
      return response.data.data; // Assuming `data` contains the school object
    }
    return null;
  } catch (error) {
    console.error("Error fetching school:", error);
    return null; // Return null in case of an error
  }
};

//update school data

export const updateSchool = async (id: number, schoolData: Object) => {
  const response = await MainAPI.put(`/schools/${id}`, schoolData);
  return response;
};
