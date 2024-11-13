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
import ProjectAllocationPage from "./features/project-allocate/ProjectAllocationPage";
import ProjectAllocationViewPage from "./features/project-allocate/ProjectAllocationViewPage";
import Performance from "./features/Performance/Performance";
import AddPerformance from "./features/Performance/AddPerformance";
import EditPerformance from "./features/Performance/EditPerformance";
import AddStudentForm from "./features/student/AddStudentForm";
import EditStudentForm from "./features/student/EditStudentForm";
import ProjectCordinator from "./features/ProjectCoordinator/ProjectCordinator";
import AddProjectCoordinator from "./features/ProjectCoordinator/AddProjectCoordinator";
import EditProjectCoordinator from "./features/ProjectCoordinator/EditProjectCoordinator";

const App: React.FC = () => {
  return (
    <Router>
      <Navbar /> {/* Ensure the Navbar is placed at the top */}
      <div className="app-layout">
        <Sidebar /> {/* Sidebar goes here */}
        <div className="main-content">
          <Routes>
            {/* School Route */}
            <Route path="/school" element={<SchoolPage />} />
            <Route path="/create-school" element={<CreateSchool />} />
            <Route path="/edit-school/:id" element={<EditSchool />} />
            {/* Teacher Route */}
            <Route path="/teacher" element={<TeacherPage />} />
            <Route path="/create-teacher" element={<CreateTeacher />} />
            <Route path="/edit-teacher/:id" element={<EditTeacher />} />
            {/* Student Route */}
            <Route path="/student" element={<StudentPage />} />
            {/* Project Route */}
            <Route path="/projects" element={<ProjectPage />} />
            <Route path="/create-project" element={<CreateProject />} />
            <Route path="/edit-project/:id" element={<EditProject />} />
            {/* Project Allocation */}
            <Route
              path="/project-allocation"
              element={<ProjectAllocationPage />}
            />
            <Route
              path="/project-allocation-view"
              element={<ProjectAllocationViewPage />}
            />
            {/* performance routes */}
            <Route path="/performance" element={<Performance />} />
            <Route path="/add-performance" element={<AddPerformance />} />
            <Route path="/edit-performance/:id" element={<EditPerformance />} />
            {/* Home Page Route */}
            <Route path="/" element={<HomePage />} /> {/* Default route */}
            <Route path="/add-student" element={<AddStudentForm />} />
            <Route path="/edit-student/:id" element={<EditStudentForm />} />
            {/* project coordinator */}
            <Route path="/project-coordinator" element={<ProjectCordinator />} />
            <Route path="/add-coordinator" element={<AddProjectCoordinator />} />
            <Route path="/edit-coordinator/:id" element={<EditProjectCoordinator />} />
            
          </Routes>
        </div>
      </div>
    </Router>
  );
};

export default App;
