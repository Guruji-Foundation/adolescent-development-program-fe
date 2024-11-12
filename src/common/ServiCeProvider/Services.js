import HttpInterceptor from "./HttpInterceptor";
import { SCHOOL, TEACHER, PROJECT, PERFORMANCE, STUDENTS } from "./APIURLs";

const apiServiceBased = HttpInterceptor();

export default {
  //school api methods

  //get all school list
  getAllSchoolList: async () => {
    return apiServiceBased.get(SCHOOL);
  },

  //fetch one school
  fetchSchool: async (id) => {
    return apiServiceBased.get(`${SCHOOL}/${id}`);
  },

  //create school
  createSchool: async (schoolData) => {
    return apiServiceBased.post(SCHOOL, schoolData);
  },

  //delete school
  deleteSchool: async (id) => {
    return apiServiceBased.delete(`${SCHOOL}/${id}`);
  },

  //update school
  updateSchool: async (id, schoolData) => {
    return apiServiceBased.put(`${SCHOOL}/${id}`, schoolData);
  },
  //---------------------------

  //Teacher api methods

  //get all teacher list
  getAllTeacherList: async () => {
    return apiServiceBased.get(TEACHER);
  },

  //fetch one Teacher
  fetchTeacher: async (id) => {
    return apiServiceBased.get(`${TEACHER}/${id}`);
  },

  //create Teacher
  createTeacher: async (teacherData) => {
    return apiServiceBased.post(TEACHER, teacherData);
  },

  //delete Teacher
  deleteTeacher: async (id) => {
    return apiServiceBased.delete(`${TEACHER}/${id}`);
  },

  //update Teacher
  updateTeacher: async (id, teacherData) => {
    return apiServiceBased.put(`${TEACHER}/${id}`, teacherData);
  },
  //---------------------------

  //Project api methods

  //get all project list
  getAllProjectList: async () => {
    return apiServiceBased.get(PROJECT);
  },

  //fetch one project
  fetchProject: async (id) => {
    return apiServiceBased.get(`${PROJECT}/${id}`);
  },

  //create Project
  createProject: async (projectData) => {
    return apiServiceBased.post(PROJECT, projectData);
  },

  //delete Project
  deleteProject: async (id) => {
    return apiServiceBased.delete(`${PROJECT}/${id}`);
  },

  //update Project
  updateProject: async (id, projectData) => {
    return apiServiceBased.put(`${PROJECT}/${id}`, projectData);
  },
  //---------------------------

  getPerformanceList: () => {
    return apiServiceBased.get(`${PERFORMANCE}`);
  },

  savePerformance: (data) => {
    return apiServiceBased.post(PERFORMANCE, data);
  },

  getPerformanceById: (id) => {
    return apiServiceBased.get(`${PERFORMANCE}/${id}`)
  },

  editPerformance: (id, data) => {
    return apiServiceBased.put(`${PERFORMANCE}/${id}`, data);
  },

  deletePerformance: async (id) => {
    return apiServiceBased.delete(`${PERFORMANCE}/${id}`);
  },
  
  //Student
  getStudentList: () => {
    return apiServiceBased.get(`${STUDENTS}`);
  },

  addStudent:(data)=>{
    return apiServiceBased.post(STUDENTS, data);

  },

  deleteStudent:(id)=>{
    return apiServiceBased.delete(`${STUDENTS}/${id}`);
  },

  editStudent: (id, data) => {
    return apiServiceBased.put(`${STUDENTS}/${id}`, data);
  },

  getStudentDetailsById:(id)=>{
    return apiServiceBased.get(`${STUDENTS}/${id}`)
  },
};
