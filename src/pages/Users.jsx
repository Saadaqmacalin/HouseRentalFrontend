import { useEffect, useState } from 'react';
import api from '../services/api';
import { FaPlus, FaEdit, FaTrash, FaUserShield, FaSearch } from 'react-icons/fa';
import { useAuth } from '../context/AuthContext';

const Users = () => {
  const { user } = useAuth();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  
  // Form State
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    phoneNumber: '',
    role: 'staff',
  });

  const fetchUsers = async () => {
    try {
      const { data } = await api.get('/users');
      setUsers(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingUser) {
        // Update
        const { data } = await api.put(`/users/${editingUser._id}`, formData);
        setUsers(users.map(u => u._id === data._id ? data : u));
      } else {
        // Create
        const { data } = await api.post('/auth/register', formData);
        setUsers([...users, data]);
      }
      setShowModal(false);
      resetForm();
    } catch (error) {
      alert(error.response?.data?.message || 'Operation failed');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      try {
        await api.delete(`/users/${id}`);
        setUsers(users.filter(u => u._id !== id));
      } catch (error) {
        alert('Failed to delete');
      }
    }
  };

  const openEditModal = (user) => {
    setEditingUser(user);
    setFormData({
      name: user.name,
      email: user.email,
      password: '', // Leave blank to keep existing
      phoneNumber: user.phoneNumber,
      role: user.role,
    });
    setShowModal(true);
  };

  const resetForm = () => {
    setEditingUser(null);
    setFormData({
      name: '',
      email: '',
      password: '',
      phoneNumber: '',
      role: 'staff',
    });
    setShowModal(false);
  };

  // Filter
  const filteredUsers = users.filter(u => 
    u.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    u.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) return <div className="text-center text-slate-400 py-10">Loading...</div>;
  
  if (user?.role !== 'admin') return <div className="text-center text-red-400 py-10">Access Denied</div>;

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-white">User Management</h2>
        <button onClick={() => setShowModal(true)} className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors">
          <FaPlus /> Add New User
        </button>
      </div>

      <div className="bg-slate-800 p-4 rounded-lg shadow-lg mb-6">
        <div className="relative max-w-md">
          <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" />
          <input 
            type="text" 
            className="w-full bg-slate-700 text-white pl-10 pr-4 py-2 rounded-lg focus:outline-none focus:ring-1 focus:ring-indigo-500 border border-slate-600"
            placeholder="Search users..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <div className="bg-slate-800 rounded-lg shadow-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-700 text-slate-300">
                <th className="p-4 font-semibold">Name</th>
                <th className="p-4 font-semibold">Email</th>
                <th className="p-4 font-semibold">Phone</th>
                <th className="p-4 font-semibold">Role</th>
                <th className="p-4 font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-700">
              {filteredUsers.map((u) => (
                <tr key={u._id} className="text-slate-300 hover:bg-slate-700/50 transition-colors">
                  <td className="p-4 flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-indigo-500/20 flex items-center justify-center text-indigo-400">
                      <FaUserShield />
                    </div>
                    {u.name}
                  </td>
                  <td className="p-4">{u.email}</td>
                  <td className="p-4">{u.phoneNumber}</td>
                  <td className="p-4">
                    <span className={`px-2 py-1 rounded text-xs font-semibold ${
                      u.role === 'admin' 
                        ? 'bg-purple-500/20 text-purple-400' 
                        : 'bg-blue-500/20 text-blue-400'
                    }`}>
                      {u.role.toUpperCase()}
                    </span>
                  </td>
                  <td className="p-4">
                    <div className="flex gap-2">
                      <button onClick={() => openEditModal(u)} className="p-2 bg-slate-700 hover:bg-slate-600 rounded text-blue-400 transition-colors">
                        <FaEdit />
                      </button>
                      {u.role !== 'admin' && ( // Prevent deleting admins roughly, ideally check if it's self
                        <button onClick={() => handleDelete(u._id)} className="p-2 bg-slate-700 hover:bg-slate-600 rounded text-red-400 transition-colors">
                          <FaTrash />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-slate-800 p-8 rounded-lg shadow-2xl w-full max-w-md">
            <h3 className="text-xl font-bold text-white mb-6">{editingUser ? 'Edit User' : 'Add New User'}</h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-slate-400 text-sm mb-1">Name</label>
                <input 
                  type="text" 
                  className="w-full bg-slate-700 text-white px-4 py-2 rounded focus:outline-none focus:ring-1 focus:ring-indigo-500"
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  required 
                />
              </div>
              <div>
                <label className="block text-slate-400 text-sm mb-1">Email</label>
                <input 
                  type="email" 
                  className="w-full bg-slate-700 text-white px-4 py-2 rounded focus:outline-none focus:ring-1 focus:ring-indigo-500"
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                  required 
                />
              </div>
              <div>
                <label className="block text-slate-400 text-sm mb-1">Phone Number</label>
                <input 
                  type="text" 
                  className="w-full bg-slate-700 text-white px-4 py-2 rounded focus:outline-none focus:ring-1 focus:ring-indigo-500"
                  value={formData.phoneNumber}
                  onChange={(e) => setFormData({...formData, phoneNumber: e.target.value})}
                  required 
                />
              </div>
              <div>
                <label className="block text-slate-400 text-sm mb-1">Role</label>
                <select 
                  className="w-full bg-slate-700 text-white px-4 py-2 rounded focus:outline-none focus:ring-1 focus:ring-indigo-500"
                  value={formData.role}
                  onChange={(e) => setFormData({...formData, role: e.target.value})}
                >
                  <option value="staff">Staff</option>
                  <option value="admin">Admin</option>
                </select>
              </div>
              <div>
                <label className="block text-slate-400 text-sm mb-1">Password {editingUser && '(Leave blank to keep)'}</label>
                <input 
                  type="password" 
                  className="w-full bg-slate-700 text-white px-4 py-2 rounded focus:outline-none focus:ring-1 focus:ring-indigo-500"
                  value={formData.password}
                  onChange={(e) => setFormData({...formData, password: e.target.value})}
                  required={!editingUser}
                />
              </div>
              <div className="flex justify-end gap-3 mt-6">
                <button type="button" onClick={resetForm} className="px-4 py-2 text-slate-300 hover:text-white">Cancel</button>
                <button type="submit" className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2 rounded transition-colors">Save</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Users;
