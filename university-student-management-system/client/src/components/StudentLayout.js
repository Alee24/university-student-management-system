import React from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const StudentLayout = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const handleLogout = () => {
    logout();
    navigate('/login');
  };
  return (
    <div className="min-h-screen flex flex-col">
      <nav className="bg-green-600 text-white p-4 flex justify-between items-center">
        <div className="font-bold text-xl">Student Portal</div>
        <div className="space-x-4">
          <NavLink to="/student" className={({ isActive }) => (isActive ? 'underline' : '')}>Dashboard</NavLink>
          <NavLink to="/student/profile" className={({ isActive }) => (isActive ? 'underline' : '')}>My Profile</NavLink>
          <NavLink to="/student/courses" className={({ isActive }) => (isActive ? 'underline' : '')}>My Courses</NavLink>
          <NavLink to="/student/announcements" className={({ isActive }) => (isActive ? 'underline' : '')}>Announcements</NavLink>
          <button onClick={handleLogout} className="ml-4 bg-red-500 hover:bg-red-600 px-3 py-1 rounded">Logout</button>
        </div>
      </nav>
      <main className="flex-1 p-4">
        <Outlet />
      </main>
    </div>
  );
};

export default StudentLayout;