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
} from "./APIURLs";

const apiServiceBased = HttpInterceptor();

export default {
  register: async (formData) => {
    return { message: "Registered Successfully" };
    // return apiServiceBased.post(`${AUTH}/register`, formData);
  },
  login: async (formData) => {
    if (
      formData.email == "rajeshpokharkar81@gmail.com" &&
      formData.password == "1234"
    ) {
      return {
        message: "Login Successfully",
        token: "admin",
      };
    } else if (
      formData.email == "akshaypokharkar51@gmail.com" &&
      formData.password == "1234"
    ) {
      return {
        message: "Login Successfully",
        token: "gef-coordinator",
      };
    } else if (
      formData.email == "rajeshpokharkar1124@gmail.com" &&
      formData.password == "1234"
    ) {
      return {
        message: "Login Successfully",
        token: "school-coordinator",
      };
    } else {
      return new Error("Login Failed");
    }

    // return apiServiceBased.post(`${AUTH}/login`, formData);
  },
  getProfile: async () => {
    const tokenvalue = localStorage.getItem("token");
    if (tokenvalue === "admin") {
      return {
        email: "rajeshpokharkar81@gmail.com",
        role: "admin",
        name: "Rajesh Pokharkar",
      };
    } else if (tokenvalue == "gef-coordinator") {
      return {
        email: "akshaypokharkar51@gmail.com",
        role: "gef-coordinator",
        name: "Akshay Pokharkar",
      };
    } else if (tokenvalue == "school-coordinator") {
      return {
        email: "rajeshpokharkar1124@gmail.com",
        role: "school-coordinator",
        name: "Akshay Pokharkar",
      };
    }

    // return apiServiceBased.get(`${AUTH}/profile`);
  },
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
        studentIds: [Number(studentId)],
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
        studentIds: [Number(studentId)],
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
    return apiServiceBased.put(`${PERFORMANCE}/students?schoolId=${schoolId}&projectId=${projectId}`, data);
  },

  //Student
  getStudentList: (selectedSchool) => {
    return apiServiceBased.get(`${STUDENTS}?schoolId=${selectedSchool?selectedSchool:""}`);
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
