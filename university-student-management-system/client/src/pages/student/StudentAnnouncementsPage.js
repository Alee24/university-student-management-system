import React, { useEffect, useState } from 'react';
import api from '../../api/api';

const StudentAnnouncementsPage = () => {
  const [announcements, setAnnouncements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchAnnouncements = async () => {
      try {
        setLoading(true);
        const res = await api.get('/announcements');
        setAnnouncements(res.data.announcements);
      } catch (err) {
        setError('Failed to fetch announcements');
      } finally {
        setLoading(false);
      }
    };
    fetchAnnouncements();
  }, []);

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Announcements</h1>
      {loading ? (
        <p>Loading...</p>
      ) : error ? (
        <p className="text-red-500">{error}</p>
      ) : (
        <ul className="space-y-2">
          {announcements.map((a) => (
            <li key={a.id} className="border-b pb-2">
              <h3 className="font-semibold">{a.title}</h3>
              <p className="text-sm text-gray-600">{new Date(a.created_at).toLocaleString()} {a.posted_by_name ? `by ${a.posted_by_name}` : ''}</p>
              <p className="mt-1">{a.message}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default StudentAnnouncementsPage;