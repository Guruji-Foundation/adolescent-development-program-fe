import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Sidebar from './common/Sidebar/Sidebar';
import Navbar from './common/Navbar/Navbar'; 
import SchoolPage from './features/school/SchoolPage';
import CreateSchoolForm from './features/school/CreateSchoolForm';
import CreateSchoolForm1 from './features/school/CreateSchoolForm1';
import TeacherList from './features/teacher/TeacherPage';
import StudentPage from './features/student/StudentPage';
import './App.css'; // Global styles

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
            <Route path="/create-school" element={<CreateSchoolForm />} />
            <Route path="/create-school1" element={<CreateSchoolForm1 />} />
            <Route path="/" element={<SchoolPage />} /> {/* Default route */}
          </Routes>
        </div>
      </div>
    </Router>
  );
};

export default App;
