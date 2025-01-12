import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Sidebar from "./common/Navigation/Sidebar/Sidebar";
import Navbar from "./common/Navigation/Navbar/Navbar";
import SchoolPage from "./features/school/SchoolPage";
import CreateSchool from "./features/school/CreateSchool";
import TeacherPage from "./features/teacher/TeacherPage";
import StudentPage from "./features/student/StudentPage";
import EditSchool from "./features/school/EditSchool";
import CreateTeacher from "./features/teacher/CreateTeacher";
import EditTeacher from "./features/teacher/EditTeacher";
import CreateProject from "./features/project/CreateProject";

import "./App.css"; // Global styles
import ProjectPage from "./features/project/ProjectPage";
import EditProject from "./features/project/EditProject";
import HomePage from "./features/homepage";

import Performance from "./features/Performance/Performance";
import AddPerformance from "./features/Performance/AddPerformance";
import EditPerformance from "./features/Performance/EditPerformance";
import TopicsPage from "./features/topics/TopicsPage";
import CreateTopic from "./features/topics/CreateTopic";
import EditTopic from "./features/topics/EditTopic";
import AddStudentForm from "./features/student/AddStudentForm";
import EditStudentForm from "./features/student/EditStudentForm";
import ProjectCordinator from "./features/ProjectCoordinator/ProjectCordinator";
import AddProjectCoordinator from "./features/ProjectCoordinator/AddProjectCoordinator";
import EditProjectCoordinator from "./features/ProjectCoordinator/EditProjectCoordinator";
import AssignProjectToSchoolPage from "./features/project-allocate/AssignProjectToSchoolPage";
import AssignProjectToSchool from "./features/project-allocate/AssignProjectToSchool";
import EditAssignProjectToSchool from "./features/project-allocate/EditAssignProjectToSchool";
import ProjectAssign from "./features/project-allocate/ProjectAssign";
import SchoolCordinator from "./features/schoolCoordinator/SchoolCordinator";
import AddSchoolCoordinator from "./features/schoolCoordinator/AddSchoolCoordinator";
import EditSchoolCoordinator from "./features/schoolCoordinator/EditSchoolCoordinator";
import Login from "./features/Auth/Login";
import ProtectedRoute from "./common/ProtectedRoute";
import AccessDenied from "./Pages/AccessDenied";

const App: React.FC = () => {
  return (
    <Router>
      <Navbar /> {/* Ensure the Navbar is placed at the top */}
      <div className="app-layout">
        <Sidebar /> {/* Sidebar goes here */}
        <div className="main-content">
          <Routes>
            <Route
              path="/school"
              element={
                <ProtectedRoute roles={["admin", "gef-coordinator"]}>
                  <SchoolPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/create-school"
              element={
                <ProtectedRoute roles={["admin", "gef-coordinator"]}>
                  <CreateSchool />
                </ProtectedRoute>
              }
            />
            <Route
              path="/edit-school/:id"
              element={
                <ProtectedRoute roles={["admin", "gef-coordinator"]}>
                  <EditSchool />
                </ProtectedRoute>
              }
            />
            {/* Teacher Route */}
            <Route
              path="/teacher"
              element={
                <ProtectedRoute
                  roles={["admin", "gef-coordinator", "school-coordinator"]}
                >
                  <TeacherPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/create-teacher"
              element={
                <ProtectedRoute
                  roles={["admin", "gef-coordinator", "school-coordinator"]}
                >
                  <CreateTeacher />
                </ProtectedRoute>
              }
            />
            <Route
              path="/edit-teacher/:id"
              element={
                <ProtectedRoute
                  roles={["admin", "gef-coordinator", "school-coordinator"]}
                >
                  <EditTeacher />
                </ProtectedRoute>
              }
            />
            {/* Student Route */}
            <Route
              path="/student"
              element={
                <ProtectedRoute
                  roles={["admin", "gef-coordinator", "school-coordinator"]}
                >
                  <StudentPage />
                </ProtectedRoute>
              }
            />
            {/* Project Route */}
            <Route
              path="/projects"
              element={
                <ProtectedRoute roles={["admin", "gef-coordinator"]}>
                  <ProjectPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/create-project"
              element={
                <ProtectedRoute roles={["admin", "gef-coordinator"]}>
                  <CreateProject />
                </ProtectedRoute>
              }
            />
            <Route
              path="/edit-project/:id"
              element={
                <ProtectedRoute roles={["admin", "gef-coordinator"]}>
                  <EditProject />
                </ProtectedRoute>
              }
            />
            {/* Project Route */}
            <Route
              path="/topics"
              element={
                <ProtectedRoute roles={["admin", "gef-coordinator"]}>
                  <TopicsPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/create-topic"
              element={
                <ProtectedRoute roles={["admin", "gef-coordinator"]}>
                  <CreateTopic />
                </ProtectedRoute>
              }
            />
            <Route
              path="/edit-topic/:id"
              element={
                <ProtectedRoute roles={["admin", "gef-coordinator"]}>
                  <EditTopic />
                </ProtectedRoute>
              }
            />
            {/* Project Allocation */}
            <Route
              path="/project-assign"
              element={
                <ProtectedRoute roles={["admin", "gef-coordinator"]}>
                  <ProjectAssign />
                </ProtectedRoute>
              }
            />
            {/* <Route
              path="/project-assign-school"
              element={<AssignProjectToSchoolPage />}
            /> */}
            <Route
              path="/project/school/assign"
              element={
                <ProtectedRoute roles={["admin", "gef-coordinator"]}>
                  <AssignProjectToSchool />
                </ProtectedRoute>
              }
            />
            <Route
              path="/project/:projectId/school/:schoolId/assign"
              element={
                <ProtectedRoute roles={["admin", "gef-coordinator"]}>
                  <EditAssignProjectToSchool />
                </ProtectedRoute>
              }
            />
            {/* performance routes */}
            <Route
              path="/performance"
              element={
                <ProtectedRoute
                  roles={["admin", "gef-coordinator", "school-coordinator"]}
                >
                  <Performance />
                </ProtectedRoute>
              }
            />
            <Route
              path="/add-performance"
              element={
                <ProtectedRoute
                  roles={["admin", "gef-coordinator", "school-coordinator"]}
                >
                  <AddPerformance />
                </ProtectedRoute>
              }
            />
            <Route
              path="/edit-performance/:id"
              element={
                <ProtectedRoute
                  roles={["admin", "gef-coordinator", "school-coordinator"]}
                >
                  <EditPerformance />
                </ProtectedRoute>
              }
            />
            {/* Home Page Route */}
            <Route path="/" element={<HomePage />} /> {/* Default route */}
            <Route
              path="/add-student"
              element={
                <ProtectedRoute
                  roles={["admin", "gef-coordinator", "school-coordinator"]}
                >
                  <AddStudentForm />{" "}
                </ProtectedRoute>
              }
            />
            <Route
              path="/edit-student/:id"
              element={
                <ProtectedRoute
                  roles={["admin", "gef-coordinator", "school-coordinator"]}
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
                <ProtectedRoute roles={["admin", "gef-coordinator"]}>
                  <SchoolCordinator />
                </ProtectedRoute>
              }
            />
            <Route
              path="/add-school-coordinator"
              element={
                <ProtectedRoute roles={["admin", "gef-coordinator"]}>
                  <AddSchoolCoordinator />
                </ProtectedRoute>
              }
            />
            <Route
              path="/edit-school-coordinator/:id"
              element={
                <ProtectedRoute roles={["admin", "gef-coordinator"]}>
                  <EditSchoolCoordinator />
                </ProtectedRoute>
              }
            />
            <Route path="/accessdenied" element={<AccessDenied />} />
            <Route path="/login" element={<Login />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
};

export default App;
