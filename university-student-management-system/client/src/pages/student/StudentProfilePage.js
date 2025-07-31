import React, { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import api from '../../api/api';

const StudentProfilePage = () => {
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
        setError('Failed to fetch profile');
      } finally {
        setLoading(false);
      }
    };
    if (user?.id) fetchInfo();
  }, [user]);

  if (loading) return <p>Loading...</p>;
  if (error) return <p className="text-red-500">{error}</p>;
  if (!info) return <p>No profile</p>;

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">My Profile</h1>
      <div className="bg-white p-4 rounded shadow max-w-lg">
        <p><strong>ID:</strong> {info.id}</p>
        <p><strong>Name:</strong> {info.full_name}</p>
        <p><strong>Username:</strong> {info.username}</p>
        <p><strong>Email:</strong> {info.email || '-'}</p>
        <p><strong>Department ID:</strong> {info.department_id || '-'}</p>
      </div>
    </div>
  );
};

export default StudentProfilePage;