import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Sidebar from "./common/Sidebar/Sidebar";
import Navbar from "./common/Navbar/Navbar";
import SchoolPage from "./features/school/SchoolPage";
import CreateSchool from "./features/school/CreateSchool";
import TeacherPage from "./features/teacher/TeacherPage";
import StudentPage from "./features/student/StudentPage";
import EditSchool from "./features/school/EditSchool";
import CreateTeacher from "./features/teacher/CreateTeacher";
import EditTeacher from "./features/teacher/EditTeacher";

import "./App.css"; // Global styles

const App: React.FC = () => {
  return (
    <Router>
      <Navbar /> {/* Ensure the Navbar is placed at the top */}
      <div className="app-layout">
        <Sidebar /> {/* Sidebar goes here */}
        <div className="main-content">
          <Routes>
            <Route path="/school" element={<SchoolPage />} />
            <Route path="/student" element={<StudentPage />} />
            <Route path="/create-school" element={<CreateSchool />} />
            <Route path="/edit-school/:id" element={<EditSchool />} />
            <Route path="/teacher" element={<TeacherPage />} />
            <Route path="/create-teacher" element={<CreateTeacher />} />
            <Route path="/edit-teacher/:id" element={<EditTeacher />} />
            <Route path="/" element={<SchoolPage />} /> {/* Default route */}
          </Routes>
        </div>
      </div>
    </Router>
  );
};

export default App;
