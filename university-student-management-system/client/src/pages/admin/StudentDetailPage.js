import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import api from '../../api/api';

const StudentDetailPage = () => {
  const { id } = useParams();
  const [student, setStudent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchStudent = async () => {
      try {
        setLoading(true);
        const res = await api.get(`/students/${id}`);
        setStudent(res.data.student);
      } catch (err) {
        setError('Failed to fetch student');
      } finally {
        setLoading(false);
      }
    };
    fetchStudent();
  }, [id]);

  if (loading) return <p>Loading...</p>;
  if (error) return <p className="text-red-500">{error}</p>;
  if (!student) return <p>No student found</p>;

  return (
    <div>
      <h1 className="text-2xl font-bold mb-2">Student Details</h1>
      <div className="bg-white p-4 rounded shadow">
        <p><strong>ID:</strong> {student.id}</p>
        <p><strong>Name:</strong> {student.full_name}</p>
        <p><strong>Username:</strong> {student.username}</p>
        <p><strong>Email:</strong> {student.email || '-'}</p>
        <p><strong>Department ID:</strong> {student.department_id || '-'}</p>
        <h2 className="text-xl font-semibold mt-4 mb-2">Courses</h2>
        <ul className="list-disc pl-5">
          {student.courses && student.courses.length > 0 ? (
            student.courses.map((c) => (
              <li key={c.id}>{c.title} ({c.code})</li>
            ))
          ) : (
            <li>No courses enrolled</li>
          )}
        </ul>
        <h2 className="text-xl font-semibold mt-4 mb-2">Grades</h2>
        <ul className="list-disc pl-5">
          {student.grades && student.grades.length > 0 ? (
            student.grades.map((g) => (
              <li key={g.id}>{g.title} ({g.code}): {g.grade_value}</li>
            ))
          ) : (
            <li>No grades assigned</li>
          )}
        </ul>
      </div>
    </div>
  );
};

export default StudentDetailPage;