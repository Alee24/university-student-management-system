import React, { useEffect, useState } from 'react';
import api from '../../api/api';

const DepartmentsPage = () => {
  const [departments, setDepartments] = useState([]);
  const [newDepartment, setNewDepartment] = useState({ name: '', description: '' });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const fetchDepartments = async () => {
      try {
        setLoading(true);
        const res = await api.get('/departments');
        setDepartments(res.data.departments);
      } catch (err) {
        setError('Failed to fetch departments');
      } finally {
        setLoading(false);
      }
    };
    fetchDepartments();
  }, []);

  const handleChange = (e) => {
    setNewDepartment({ ...newDepartment, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError('');
    try {
      const res = await api.post('/departments', newDepartment);
      setDepartments([res.data.department, ...departments]);
      setNewDepartment({ name: '', description: '' });
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create department');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Departments</h1>
      {error && <p className="text-red-500 mb-2">{error}</p>}
      <div className="mb-4 bg-white p-4 rounded shadow">
        <h2 className="text-lg font-semibold mb-2">Add Department</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block mb-1 font-medium" htmlFor="name">Name</label>
            <input
              type="text"
              id="name"
              name="name"
              value={newDepartment.name}
              onChange={handleChange}
              required
              className="w-full border border-gray-300 p-2 rounded"
            />
          </div>
          <div>
            <label className="block mb-1 font-medium" htmlFor="description">Description</label>
            <textarea
              id="description"
              name="description"
              value={newDepartment.description}
              onChange={handleChange}
              rows={3}
              className="w-full border border-gray-300 p-2 rounded"
            ></textarea>
          </div>
          <button
            type="submit"
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
            disabled={saving}
          >
            {saving ? 'Saving...' : 'Create'}
          </button>
        </form>
      </div>
      <div className="bg-white p-4 rounded shadow">
        <h2 className="text-lg font-semibold mb-2">Existing Departments</h2>
        {loading ? (
          <p>Loading...</p>
        ) : (
          <ul className="list-disc pl-5">
            {departments.map((dept) => (
              <li key={dept.id} className="mb-1">
                <span className="font-semibold">{dept.name}</span> – {dept.description}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default DepartmentsPage;