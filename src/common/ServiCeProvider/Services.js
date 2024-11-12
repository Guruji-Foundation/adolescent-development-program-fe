import HttpInterceptor from "./HttpInterceptor";
import {
  SCHOOL,
  TEACHER,
  PROJECT,
  PERFORMANCE,
  STUDENTS,
  STUDENT,
  TOPIC,
} from "./APIURLs";

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

  //get all Topic list
  getAllTopicList: async (projectId) => {
    if (projectId)
      return apiServiceBased.get(`${TOPIC}?projectId=${projectId}`);
    else return apiServiceBased.get(TOPIC);
  },

  //fetch one school
  fetchTopic: async (id) => {
    return apiServiceBased.get(`${TOPIC}/${id}`);
  },

  //create school
  createTopic: async (topicData) => {
    return apiServiceBased.post(TOPIC, topicData);
  },

  //delete school
  deleteTopic: async (id) => {
    return apiServiceBased.delete(`${TOPIC}/${id}`);
  },

  //update school
  updateTopic: async (id, topicData) => {
    return apiServiceBased.put(`${TOPIC}/${id}`, topicData);
  },
  //---------------------------

  //Project api methods

  //get all project list
  getAllProjectList: async (schoolId) => {
    // console.log("form service " + schoolId);
    if (schoolId) return apiServiceBased.get(`${PROJECT}?schoolId=${schoolId}`);
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

  allocateProjectToStudent: async (studentId, projectId) => {
    return apiServiceBased.post(`${PROJECT}/${projectId}/students/allocate`, {
      studentIds: [Number(studentId)],
    });
  },
  deAllocateProjectToStudent: async (studentId, projectId) => {
    return apiServiceBased.post(
      `${PROJECT}/${projectId}/students/de-allocate`,
      {
        studentIds: [Number(studentId)],
      }
    );
  },
  //---------------------------

  //Students
  getAllStudentList: async (schoolId) => {
    console.log("form service student " + schoolId);
    if (schoolId)
      return apiServiceBased.get(`${STUDENT}/?schoolId=${schoolId}`);
    return apiServiceBased.get(STUDENT);
  },
  getAllUnAllocatedStudents: async (schoolId, projectId) => {
    console.log("form service student " + schoolId + " Prject " + projectId);
    if (schoolId)
      return apiServiceBased.get(
        `${STUDENT}${PROJECT}?schoolId=${schoolId}&projectId=${projectId}`
      );
    return apiServiceBased.get(STUDENT);
  },
  getPerformanceList: () => {
    return apiServiceBased.get(`${PERFORMANCE}`);
  },

  savePerformance: (data) => {
    return apiServiceBased.post(PERFORMANCE, data);
  },

  getPerformanceById: (id) => {
    return apiServiceBased.get(`${PERFORMANCE}/${id}`);
  },

  editPerformance: (id, data) => {
    return apiServiceBased.put(`${PERFORMANCE}/${id}`, data);
  },

  getStudentList: () => {
    return apiServiceBased.get(`${STUDENTS}`);
  },
};
