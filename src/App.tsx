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
            {/* Home Page Route */}
            <Route path="/" element={<SchoolPage />} /> {/* Default route */}
          </Routes>
        </div>
      </div>
    </Router>
  );
};

export default App;
