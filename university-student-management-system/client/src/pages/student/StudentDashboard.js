import React, { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import api from '../../api/api';

const StudentDashboard = () => {
  const { user } = useAuth();
  const [info, setInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchInfo = async () => {
      try {
        setLoading(true);
        const res = await api.get(`/students/${user.id}`);
        setInfo(res.data.student);
      } catch (err) {
        setError('Failed to fetch information');
      } finally {
        setLoading(false);
      }
    };
    if (user?.id) fetchInfo();
  }, [user]);

  if (loading) return <p>Loading...</p>;
  if (error) return <p className="text-red-500">{error}</p>;
  if (!info) return <p>No data</p>;

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Welcome, {info.full_name}</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-white p-4 rounded shadow">
          <h2 className="text-lg font-semibold mb-2">My Courses</h2>
          <ul className="list-disc pl-5">
            {info.courses && info.courses.length > 0 ? (
              info.courses.map((c) => (
                <li key={c.id}>{c.title} ({c.code})</li>
              ))
            ) : (
              <li>No courses enrolled</li>
            )}
          </ul>
        </div>
        <div className="bg-white p-4 rounded shadow">
          <h2 className="text-lg font-semibold mb-2">My Grades</h2>
          <ul className="list-disc pl-5">
            {info.grades && info.grades.length > 0 ? (
              info.grades.map((g) => (
                <li key={g.id}>{g.title} ({g.code}): {g.grade_value}</li>
              ))
            ) : (
              <li>No grades assigned</li>
            )}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default StudentDashboard;