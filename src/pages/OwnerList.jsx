import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import { FaPlus, FaEdit, FaTrash, FaSearch, FaUserTie } from 'react-icons/fa';

const OwnerList = () => {
  const [owners, setOwners] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  const fetchOwners = async () => {
    try {
      const { data } = await api.get('/owners');
      setOwners(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOwners();
  }, []);

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this owner?')) {
      try {
        await api.delete(`/owners/${id}`);
        setOwners(owners.filter(o => o._id !== id));
      } catch (error) {
        alert('Failed to delete');
      }
    }
  };

  const filteredOwners = owners.filter(owner => 
    owner.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    owner.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    owner.nationalID.includes(searchTerm)
  );

  if (loading) return <div className="text-center text-slate-400 py-10">Loading...</div>;

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-white">Owners Management</h2>
        <Link to="/owners/new" className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors">
          <FaPlus /> Add New Owner
        </Link>
      </div>

      <div className="bg-slate-800 p-4 rounded-lg shadow-lg mb-6">
        <div className="relative max-w-md">
          <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" />
          <input 
            type="text" 
            className="w-full bg-slate-700 text-white pl-10 pr-4 py-2 rounded-lg focus:outline-none focus:ring-1 focus:ring-indigo-500 border border-slate-600"
            placeholder="Search by name, email or National ID..." 
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
                <th className="p-4 font-semibold">National ID</th>
                <th className="p-4 font-semibold">Address</th>
                <th className="p-4 font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-700">
              {filteredOwners.map((owner) => (
                <tr key={owner._id} className="text-slate-300 hover:bg-slate-700/50 transition-colors">
                  <td className="p-4 flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-amber-500/20 flex items-center justify-center text-amber-400">
                        <FaUserTie />
                    </div>
                    {owner.name}
                  </td>
                  <td className="p-4">{owner.email}</td>
                  <td className="p-4">{owner.phoneNumber}</td>
                  <td className="p-4 font-mono text-xs">{owner.nationalID}</td>
                  <td className="p-4 truncate max-w-xs">{owner.address}</td>
                  <td className="p-4">
                    <div className="flex gap-2">
                      <Link to={`/owners/edit/${owner._id}`} className="p-2 bg-slate-700 hover:bg-slate-600 rounded text-blue-400 transition-colors">
                        <FaEdit />
                      </Link>
                      <button onClick={() => handleDelete(owner._id)} className="p-2 bg-slate-700 hover:bg-slate-600 rounded text-red-400 transition-colors">
                        <FaTrash />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {filteredOwners.length === 0 && (
                <tr>
                  <td colSpan="6" className="p-8 text-center text-slate-500">No owners found.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default OwnerList;
