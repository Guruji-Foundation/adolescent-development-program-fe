import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

//navigation import
import Sidebar from "./common/Navigation/Sidebar/Sidebar";
import Navbar from "./common/Navigation/Navbar/Navbar";

//school feature import
import SchoolPage from "./features/school/SchoolPage";
import CreateSchool from "./features/school/CreateSchool";
import StudentPage from "./features/student/StudentPage";
import EditSchool from "./features/school/EditSchool";

//teacher feature import
import CreateTeacher from "./features/teacher/CreateTeacher";
import EditTeacher from "./features/teacher/EditTeacher";
import CreateProject from "./features/project/CreateProject";
import TeacherPage from "./features/teacher/TeacherPage";

//project feature import
import ProjectPage from "./features/project/ProjectPage";
import EditProject from "./features/project/EditProject";

//performance feature import
import Performance from "./features/Performance/Performance";
import AddPerformance from "./features/Performance/AddPerformance";
import EditPerformance from "./features/Performance/EditPerformance";

//topic feature import
import TopicsPage from "./features/topics/TopicsPage";
import CreateTopic from "./features/topics/CreateTopic";
import EditTopic from "./features/topics/EditTopic";

//student feature import
import AddStudentForm from "./features/student/AddStudentForm";
import EditStudentForm from "./features/student/EditStudentForm";

//project coordinator feature import
import ProjectCordinator from "./features/ProjectCoordinator/ProjectCordinator";
import AddProjectCoordinator from "./features/ProjectCoordinator/AddProjectCoordinator";
import EditProjectCoordinator from "./features/ProjectCoordinator/EditProjectCoordinator";

//Assign Project feature import
import AssignProjectToSchool from "./features/project-allocate/AssignProjectToSchool";
import EditAssignProjectToSchool from "./features/project-allocate/EditAssignProjectToSchool";
import ProjectAssign from "./features/project-allocate/ProjectAssign";

//school coordinator feature import
import SchoolCordinator from "./features/schoolCoordinator/SchoolCordinator";
import AddSchoolCoordinator from "./features/schoolCoordinator/AddSchoolCoordinator";
import EditSchoolCoordinator from "./features/schoolCoordinator/EditSchoolCoordinator";

//pages import
import Login from "./features/Auth/Login";
// Remove this import line
// import AccessDenied from "./Pages/AccessDenied";
import HomePage from "./Pages/homepage";

//routes restriction feature import
import ProtectedRoute from "./common/ProtectedRoute";

//css files
import "./App.css"; // Global styles
import ErrorPageForUpload from "./common/ErrorPageForUpload";

const App = () => {
  return (
    <Router>
      <Navbar />
      <div className="app-layout">
        <Sidebar />
        <div className="main-content">
          <Routes>
            {/* school routes */}
            <Route
              path="/school"
              element={
                <ProtectedRoute roles={["admin", "project-coordinator"]}>
                  <SchoolPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/errorpageforupload"
              element={
               <ErrorPageForUpload/>
              }
            />
            <Route
              path="/create-school"
              element={
                <ProtectedRoute roles={["admin", "project-coordinator"]}>
                  <CreateSchool />
                </ProtectedRoute>
              }
            />
            <Route
              path="/edit-school/:id"
              element={
                <ProtectedRoute roles={["admin", "project-coordinator"]}>
                  <EditSchool />
                </ProtectedRoute>
              }
            />
            {/* Teacher Route */}
            <Route
              path="/teacher"
              element={
                <ProtectedRoute
                  roles={["admin", "project-coordinator", "school-coordinator"]}
                >
                  <TeacherPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/create-teacher"
              element={
                <ProtectedRoute
                  roles={["admin", "project-coordinator", "school-coordinator"]}
                >
                  <CreateTeacher />
                </ProtectedRoute>
              }
            />
            <Route
              path="/edit-teacher/:id"
              element={
                <ProtectedRoute
                  roles={["admin", "project-coordinator", "school-coordinator"]}
                >
                  <EditTeacher />
                </ProtectedRoute>
              }
            />

            {/* Project Route */}
            <Route
              path="/projects"
              element={
                <ProtectedRoute roles={["admin", "project-coordinator"]}>
                  <ProjectPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/create-project"
              element={
                <ProtectedRoute roles={["admin", "project-coordinator"]}>
                  <CreateProject />
                </ProtectedRoute>
              }
            />
            <Route
              path="/edit-project/:id"
              element={
                <ProtectedRoute roles={["admin", "project-coordinator"]}>
                  <EditProject />
                </ProtectedRoute>
              }
            />
            {/* Topic Route */}
            <Route
              path="/topics"
              element={
                <ProtectedRoute roles={["admin", "project-coordinator"]}>
                  <TopicsPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/create-topic"
              element={
                <ProtectedRoute roles={["admin", "project-coordinator"]}>
                  <CreateTopic />
                </ProtectedRoute>
              }
            />
            <Route
              path="/edit-topic/:id"
              element={
                <ProtectedRoute roles={["admin", "project-coordinator"]}>
                  <EditTopic />
                </ProtectedRoute>
              }
            />
            {/* Project Allocation */}
            <Route
              path="/project-assign"
              element={
                <ProtectedRoute roles={["admin", "project-coordinator"]}>
                  <ProjectAssign />
                </ProtectedRoute>
              }
            />
            <Route
              path="/project/school/assign"
              element={
                <ProtectedRoute roles={["admin", "project-coordinator"]}>
                  <AssignProjectToSchool />
                </ProtectedRoute>
              }
            />
            <Route
              path="/project/:projectId/school/:schoolId/assign"
              element={
                <ProtectedRoute roles={["admin", "project-coordinator"]}>
                  <EditAssignProjectToSchool />
                </ProtectedRoute>
              }
            />
            {/* performance routes */}
            <Route
              path="/performance"
              element={
                <ProtectedRoute
                  roles={["admin", "project-coordinator", "school-coordinator"]}
                >
                  <Performance />
                </ProtectedRoute>
              }
            />
            <Route
              path="/add-performance"
              element={
                <ProtectedRoute
                  roles={["admin", "project-coordinator", "school-coordinator"]}
                >
                  <AddPerformance />
                </ProtectedRoute>
              }
            />
            <Route
              path="/edit-performance/:id"
              element={
                <ProtectedRoute
                  roles={["admin", "project-coordinator", "school-coordinator"]}
                >
                  <EditPerformance />
                </ProtectedRoute>
              }
            />
            {/* student routes */}
            <Route
              path="/add-student"
              element={
                <ProtectedRoute
                  roles={["admin", "project-coordinator", "school-coordinator"]}
                >
                  <AddStudentForm />{" "}
                </ProtectedRoute>
              }
            />
            <Route
              path="/student"
              element={
                <ProtectedRoute
                  roles={["admin", "project-coordinator", "school-coordinator"]}
                >
                  <StudentPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/edit-student/:id"
              element={
                <ProtectedRoute
                  roles={["admin", "project-coordinator", "school-coordinator"]}
                >
                  <EditStudentForm />{" "}
                </ProtectedRoute>
              }
            />
            {/* project coordinator */}
            <Route
              path="/project-coordinator"
              element={
                <ProtectedRoute roles={["admin"]}>
                  <ProjectCordinator />
                </ProtectedRoute>
              }
            />
            <Route
              path="/add-coordinator"
              element={
                <ProtectedRoute roles={["admin"]}>
                  <AddProjectCoordinator />
                </ProtectedRoute>
              }
            />
            <Route
              path="/edit-coordinator/:id"
              element={
                <ProtectedRoute roles={["admin"]}>
                  <EditProjectCoordinator />
                </ProtectedRoute>
              }
            />
            {/* School coordinator */}
            <Route
              path="/school-coordinator"
              element={
                <ProtectedRoute roles={["admin", "project-coordinator"]}>
                  <SchoolCordinator />
                </ProtectedRoute>
              }
            />
            <Route
              path="/add-school-coordinator"
              element={
                <ProtectedRoute roles={["admin", "project-coordinator"]}>
                  <AddSchoolCoordinator />
                </ProtectedRoute>
              }
            />
            <Route
              path="/edit-school-coordinator/:id"
              element={
                <ProtectedRoute roles={["admin", "project-coordinator"]}>
                  <EditSchoolCoordinator />
                </ProtectedRoute>
              }
            />
            {/* pages */}
            <Route path="/" element={<HomePage />} />
            <Route path="/login" element={<Login />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
};

export default App;
