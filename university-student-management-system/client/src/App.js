import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';

// Pages
import LoginPage from './pages/LoginPage';
import AdminDashboard from './pages/admin/AdminDashboard';
import StudentsPage from './pages/admin/StudentsPage';
import StudentDetailPage from './pages/admin/StudentDetailPage';
import NewStudentPage from './pages/admin/NewStudentPage';
import CoursesPage from './pages/admin/CoursesPage';
import NewCoursePage from './pages/admin/NewCoursePage';
import DepartmentsPage from './pages/admin/DepartmentsPage';
import AnnouncementsPage from './pages/admin/AnnouncementsPage';
import StudentDashboard from './pages/student/StudentDashboard';
import StudentProfilePage from './pages/student/StudentProfilePage';
import StudentCoursesPage from './pages/student/StudentCoursesPage';
import StudentAnnouncementsPage from './pages/student/StudentAnnouncementsPage';

// Layouts
import ProtectedRoute from './components/ProtectedRoute';
import AdminLayout from './components/AdminLayout';
import StudentLayout from './components/StudentLayout';

function App() {
  const { user } = useAuth();
  return (
    <Routes>
      {/* Public routes */}
      <Route path="/login" element={<LoginPage />} />

      {/* Redirect root to dashboard based on role */}
      <Route
        path="/"
        element={
          user ? <Navigate to={`/${user.role}`} replace /> : <Navigate to="/login" replace />
        }
      />

      {/* Protected routes for admin */}
      <Route element={<ProtectedRoute roles={['admin']} />}> 
        <Route path="/admin" element={<AdminLayout />}> 
          <Route index element={<AdminDashboard />} />
          <Route path="students" element={<StudentsPage />} />
          <Route path="students/new" element={<NewStudentPage />} />
          <Route path="students/:id" element={<StudentDetailPage />} />
          <Route path="courses" element={<CoursesPage />} />
          <Route path="courses/new" element={<NewCoursePage />} />
          <Route path="departments" element={<DepartmentsPage />} />
          <Route path="announcements" element={<AnnouncementsPage />} />
        </Route>
      </Route>

      {/* Protected routes for students */}
      <Route element={<ProtectedRoute roles={['student']} />}> 
        <Route path="/student" element={<StudentLayout />}> 
          <Route index element={<StudentDashboard />} />
          <Route path="profile" element={<StudentProfilePage />} />
          <Route path="courses" element={<StudentCoursesPage />} />
          <Route path="announcements" element={<StudentAnnouncementsPage />} />
        </Route>
      </Route>

      {/* Catch-all redirect */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;