import React, { useEffect, useState } from 'react';
import api from '../../api/api';

const AdminDashboard = () => {
  const [stats, setStats] = useState({ students: 0, courses: 0, departments: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true);
        const [studentsRes, coursesRes, departmentsRes] = await Promise.all([
          api.get('/students'),
          api.get('/courses'),
          api.get('/departments'),
        ]);
        setStats({
          students: studentsRes.data.students.length,
          courses: coursesRes.data.courses.length,
          departments: departmentsRes.data.departments.length,
        });
      } catch (err) {
        setError('Failed to load statistics');
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Admin Dashboard</h1>
      {loading ? (
        <p>Loading...</p>
      ) : error ? (
        <p className="text-red-500">{error}</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-white shadow rounded p-4 border-t-4 border-blue-500">
            <h2 className="text-lg font-semibold">Students</h2>
            <p className="text-4xl mt-2">{stats.students}</p>
          </div>
          <div className="bg-white shadow rounded p-4 border-t-4 border-green-500">
            <h2 className="text-lg font-semibold">Courses</h2>
            <p className="text-4xl mt-2">{stats.courses}</p>
          </div>
          <div className="bg-white shadow rounded p-4 border-t-4 border-purple-500">
            <h2 className="text-lg font-semibold">Departments</h2>
            <p className="text-4xl mt-2">{stats.departments}</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;