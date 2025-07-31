import React, { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import api from '../../api/api';

const StudentCoursesPage = () => {
  const { user } = useAuth();
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        setLoading(true);
        const res = await api.get(`/students/${user.id}`);
        setCourses(res.data.student.courses || []);
      } catch (err) {
        setError('Failed to fetch courses');
      } finally {
        setLoading(false);
      }
    };
    if (user?.id) fetchCourses();
  }, [user]);

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">My Courses</h1>
      {loading ? (
        <p>Loading...</p>
      ) : error ? (
        <p className="text-red-500">{error}</p>
      ) : (
        <ul className="list-disc pl-5">
          {courses.length > 0 ? (
            courses.map((c) => (
              <li key={c.id}>{c.title} ({c.code})</li>
            ))
          ) : (
            <li>No courses enrolled</li>
          )}
        </ul>
      )}
    </div>
  );
};

export default StudentCoursesPage;