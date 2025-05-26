import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './modules/auth/context/AuthContext';
import AppLayout from './components/layout/AppLayout';
import LoginPage from './modules/auth/components/LoginPage';
import DashboardPage from './components/dashboard/DashboardPage';
import StudentsPage from './modules/students/components/StudentsPage';
import GradesPage from './components/grades/GradesPage';
import AttendancePage from './components/attendance/AttendancePage';
import SubjectsPage from './components/subjects/SubjectsPage';
import CoursesPage from './components/courses/CoursesPage';
import SettingsPage from './components/settings/SettingsPage';
import LoginLogPage from './components/settings/LoginLogPage';
import NotFoundPage from './components/common/NotFoundPage';

const AppRouter: React.FC = () => {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          
          <Route path="/" element={<AppLayout />}>
            <Route index element={<DashboardPage />} />
            <Route path="students" element={<StudentsPage />} />
            <Route path="subjects" element={<SubjectsPage />} />
            <Route path="courses" element={<CoursesPage />} />
            <Route path="grades" element={<GradesPage />} />
            <Route path="attendance" element={<AttendancePage />} />
            <Route path="settings" element={<SettingsPage />} />
            <Route path="settings/login-log" element={<LoginLogPage />} />
          </Route>
          
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
};

export default AppRouter;