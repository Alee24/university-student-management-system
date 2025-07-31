import React, { useEffect, useState } from 'react';
import api from '../../api/api';

const AnnouncementsPage = () => {
  const [announcements, setAnnouncements] = useState([]);
  const [formData, setFormData] = useState({ title: '', message: '' });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);

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

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError('');
    try {
      const res = await api.post('/announcements', formData);
      setAnnouncements([res.data.announcement, ...announcements]);
      setFormData({ title: '', message: '' });
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create announcement');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this announcement?')) return;
    try {
      await api.delete(`/announcements/${id}`);
      setAnnouncements(announcements.filter((a) => a.id !== id));
    } catch (err) {
      alert('Failed to delete announcement');
    }
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Announcements</h1>
      {error && <p className="text-red-500 mb-2">{error}</p>}
      <div className="mb-4 bg-white p-4 rounded shadow">
        <h2 className="text-lg font-semibold mb-2">New Announcement</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block mb-1 font-medium" htmlFor="title">Title</label>
            <input
              type="text"
              id="title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              required
              className="w-full border border-gray-300 p-2 rounded"
            />
          </div>
          <div>
            <label className="block mb-1 font-medium" htmlFor="message">Message</label>
            <textarea
              id="message"
              name="message"
              value={formData.message}
              onChange={handleChange}
              rows={3}
              required
              className="w-full border border-gray-300 p-2 rounded"
            ></textarea>
          </div>
          <button
            type="submit"
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
            disabled={saving}
          >
            {saving ? 'Posting...' : 'Post'}
          </button>
        </form>
      </div>
      <div className="bg-white p-4 rounded shadow">
        <h2 className="text-lg font-semibold mb-2">Existing Announcements</h2>
        {loading ? (
          <p>Loading...</p>
        ) : (
          <ul className="space-y-2">
            {announcements.map((a) => (
              <li key={a.id} className="border-b pb-2">
                <h3 className="font-semibold">{a.title}</h3>
                <p className="text-sm text-gray-600">{new Date(a.created_at).toLocaleString()} {a.posted_by_name ? `by ${a.posted_by_name}` : ''}</p>
                <p className="mt-1">{a.message}</p>
                <button
                  onClick={() => handleDelete(a.id)}
                  className="mt-1 text-red-500 hover:underline text-sm"
                >
                  Delete
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default AnnouncementsPage;