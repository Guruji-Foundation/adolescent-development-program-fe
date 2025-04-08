import HttpInterceptor from "./HttpInterceptor";
import {
  SCHOOL,
  TEACHER,
  PROJECT,
  PERFORMANCE,
  STUDENTS,
  STUDENT,
  PROJECT_COORDINATOR,
  TOPIC,
  AUTH, // Add AUTH to the import list
} from "./APIURLs";

const apiServiceBased = HttpInterceptor();

export default {
  register: async (formData) => {
    return { message: "Registered Successfully" };
    // return apiServiceBased.post(`${AUTH}/register`, formData);
  },
  login: async (formData) => {
    try {
      const response = await apiServiceBased.post(`/auth/login`, {
        email: formData.email,
        password: formData.password
      });
      
      if (response.data?.status && response.data?.data?.token) {
        // Store all user data in localStorage
        localStorage.setItem('token', response.data.data.token);
        localStorage.setItem('role', response.data.data.role);
        localStorage.setItem('email', formData.email);
        
        return {
          status: true,
          message: "Login Successfully",
          token: response.data.data.token,
          role: response.data.data.role,
          expiresIn: response.data.data.expiresIn
        };
      }
      
      return {
        status: false,
        message: response.data?.messages?.[0]?.message || "Invalid username or password"
      };
      
    } catch (error) {
      return {
        status: false,
        message: error.response?.data?.messages?.[0]?.message || 
                error.message || 
                "Invalid username or password"
      };
    }
  },
  // Add this method to your Services object
  logout: () => {
    try {
      // Clear all authentication-related data from localStorage
      localStorage.removeItem('token');
      localStorage.removeItem('role');
      localStorage.removeItem('email');
      localStorage.removeItem('name');
      
      return true;
    } catch (error) {
      console.error('Logout error:', error);
      return false;
    }
  },

    // return apiServiceBased.post(`${AUTH}/login`, formData);
  getProfile: async () => {
    try {
      const storedEmail = localStorage.getItem("email");
      const storedName = localStorage.getItem("name");
      const storedRole = (localStorage.getItem("role") || "").toLowerCase();

      return {
        email: storedEmail || "teacher@gurujifoundation.in",
        name: storedName || "John Doe",
        role: storedRole || "TEACHER"
      };
    } catch (error) {
      throw new Error("Failed to load user profile");
    }
  },

  //school api methods
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
  getAllTeacherList: async (schoolId) => {
    if (schoolId) {
      return apiServiceBased.get(`${TEACHER}?schoolId=${schoolId}`);
    } else return apiServiceBased.get(TEACHER);
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

  allocateProjectToStudent: async (schoolId, projectId, studentId) => {
    return apiServiceBased.post(
      `${PROJECT}/${projectId}/schools/students/assign`,
      {
        schoolId: schoolId,
        studentIds: studentId,
      }
    );
  },
  deAllocateProjectToStudent: async (schoolId, projectId, studentId) => {
    console.log("form serviec");
    console.log(projectId + " " + schoolId + " " + studentId);
    return apiServiceBased.post(
      `${PROJECT}/${projectId}/schools/students/un-assign`,
      {
        schoolId: schoolId,
        studentIds: studentId,
      }
    );
  },

  assignProjectToSchool: async (projectId, assignProjectData) => {
    return apiServiceBased.post(
      `${PROJECT}/${projectId}/schools/assign`,
      assignProjectData
    );
  },
  getProjectBySchool: async (schoolId) => {
    console.log(schoolId);
    if (schoolId != null && schoolId && schoolId != "null")
      return apiServiceBased.get(`${PROJECT}/schools?schoolId=${schoolId}`);
    else return apiServiceBased.get(`${PROJECT}/schools`);
  },

  getUnassignedSchoolByProjectId: async (projectId) => {
    return apiServiceBased.get(
      `${SCHOOL}${PROJECT}/un-assign?projectId=${projectId}`
    );
  },

  fetchProjectByProjectIdAndSchoolId: async (schoolId, projectId) => {
    if (schoolId && projectId) {
      return apiServiceBased.get(
        `${PROJECT}/${projectId}/schools?schoolId=${schoolId}`
      );
    }
  },
  updateProjectByProjectIdAndSchoolId: (
    schoolId,
    projectId,
    assignProjectData
  ) => {
    if (schoolId && projectId) {
      return apiServiceBased.put(
        `${PROJECT}/${projectId}/schools?schoolId=${schoolId}`,
        assignProjectData
      );
    }
  },

  unassignProjectByProjectIdAndSchoolId: async (schoolId, projectId) => {
    return apiServiceBased.delete(
      `${PROJECT}/${projectId}/schools?schoolId=${schoolId}`
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
        `${STUDENT}${PROJECT}/unassigned-students?schoolId=${schoolId}&projectId=${projectId}`
      );
    return apiServiceBased.get(STUDENT);
  },
  getAllAllocatedStudents: async (schoolId, projectId) => {
    console.log("form service student " + schoolId + " Prject " + projectId);
    if (schoolId)
      return apiServiceBased.get(
        `${STUDENT}${PROJECT}/assigned-students?schoolId=${schoolId}&projectId=${projectId}`
      );
    return apiServiceBased.get(STUDENT);
  },

  downloadStudentListBySchoolId: (id) => {
    return apiServiceBased.get(`${STUDENT}/download?schoolId=${id}`, {
      responseType: "blob", // Ensure the response is treated as a binary blob
    });
  },

  //performance
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

  deletePerformance: async (id) => {
    return apiServiceBased.delete(`${PERFORMANCE}/${id}`);
  },

  getPerformanceListBySchoolAndProject: (schoolId, projectId) => {
    return apiServiceBased.get(
      `${PERFORMANCE}/students?schoolId=${schoolId}&projectId=${projectId}`
    );
  },

  saveAllPerformanceTable: (schoolId, projectId, data) => {
    return apiServiceBased.put(
      `${PERFORMANCE}/students?schoolId=${schoolId}&projectId=${projectId}`,
      data
    );
  },

  downloadPerformanceTemplate: (data) => {
    return apiServiceBased.post(`${PERFORMANCE}/download`, data, {
      responseType: "blob",
    });
  },

  //Student
  getStudentList: (selectedSchool) => {
    return apiServiceBased.get(
      `${STUDENTS}?schoolId=${selectedSchool ? selectedSchool : ""}`
    );
    return apiServiceBased.get(
      `${STUDENTS}?schoolId=${selectedSchool ? selectedSchool : ""}`
    );
  },

  addStudent: (data) => {
    return apiServiceBased.post(STUDENTS, data);
  },

  deleteStudent: (id) => {
    return apiServiceBased.delete(`${STUDENTS}/${id}`);
  },

  editStudent: (id, data) => {
    return apiServiceBased.put(`${STUDENTS}/${id}`, data);
  },

  getStudentDetailsById: (id) => {
    return apiServiceBased.get(`${STUDENTS}/${id}`);
  },

  //PROJECT COORDINATOR
  getProjectCoOrdinatorList: () => {
    return apiServiceBased.get(`${PROJECT_COORDINATOR}`);
  },

  deleteCoOrdinator: async (id) => {
    return apiServiceBased.delete(`${PROJECT_COORDINATOR}/${id}`);
  },

  addProjectCoordinator: (data) => {
    return apiServiceBased.post(PROJECT_COORDINATOR, data);
  },

  getCoordinatorDetailsById: (id) => {
    return apiServiceBased.get(`${PROJECT_COORDINATOR}/${id}`);
  },

  editCoordinatorDetails: (id, data) => {
    return apiServiceBased.put(`${PROJECT_COORDINATOR}/${id}`, data);
  },

  //school corordinatro
  getSchoolCoOrdinatorList: () => {
    return apiServiceBased.get(`${PROJECT_COORDINATOR}`);
  },

  deleteSchoolCoOrdinator: async (id) => {
    return apiServiceBased.delete(`${PROJECT_COORDINATOR}/${id}`);
  },

  addSchoolCoordinator: (data) => {
    return apiServiceBased.post(PROJECT_COORDINATOR, data);
  },

  getSchoolCoordinatorDetailsById: (id) => {
    return apiServiceBased.get(`${PROJECT_COORDINATOR}/${id}`);
  },

  editSchoolCoordinatorDetails: (id, data) => {
    return apiServiceBased.put(`${PROJECT_COORDINATOR}/${id}`, data);
  },
};
