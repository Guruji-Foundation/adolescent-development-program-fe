import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Sidebar from "./common/Sidebar/Sidebar";
import Navbar from "./common/Navbar/Navbar";
import SchoolPage from "./features/school/SchoolPage";
import CreateSchool from "./features/school/CreateSchool";
import TeacherList from "./features/teacher/TeacherPage";
import StudentPage from "./features/student/StudentPage";
import EditSchool from "./features/school/EditSchool";
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
            <Route path="/teacher" element={<TeacherList />} />
            <Route path="/student" element={<StudentPage />} />
            <Route path="/create-school" element={<CreateSchool/>} />
            <Route path="/edit-school/:id" element={<EditSchool />} />
            <Route path="/" element={<SchoolPage />} /> {/* Default route */}
          </Routes>
        </div>
      </div>
    </Router>
  );
};

export default App;
