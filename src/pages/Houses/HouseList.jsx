import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../../services/api';
import { FaPlus, FaEdit, FaTrash, FaSearch } from 'react-icons/fa';

const HouseList = () => {
  const [houses, setHouses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalHouses, setTotalHouses] = useState(0);
  const housesPerPage = 10;

  const fetchHouses = async () => {
    try {
      setLoading(true);
      const { data } = await api.get(`/houses?page=${currentPage}&limit=${housesPerPage}&search=${searchTerm}`); 
      setHouses(data.houses || []);
      setTotalPages(data.totalPages || 1);
      setTotalHouses(data.total || 0);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHouses();
  }, [currentPage]);

  // Debounce search
  useEffect(() => {
    const timer = setTimeout(() => {
        if (currentPage !== 1) {
            setCurrentPage(1);
        } else {
            fetchHouses();
        }
    }, 500);
    return () => clearTimeout(timer);
  }, [searchTerm]);

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this house?')) {
      try {
        await api.delete(`/houses/${id}`);
        setHouses(houses.filter(h => h._id !== id));
      } catch (error) {
        alert('Failed to delete');
      }
    }
  };

  const filteredHouses = houses.filter(house => 
    house.address.toLowerCase().includes(searchTerm.toLowerCase()) || 
    house.houseType.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) return <div className="text-center text-slate-400 py-10">Loading...</div>;

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-white">Houses Management</h2>
        <Link to="/houses/new" className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors">
          <FaPlus /> Add New House
        </Link>
      </div>

      <div className="bg-slate-800 p-4 rounded-lg shadow-lg mb-6">
        <div className="relative max-w-md">
          <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" />
          <input 
            type="text" 
            className="w-full bg-slate-700 text-white pl-10 pr-4 py-2 rounded-lg focus:outline-none focus:ring-1 focus:ring-indigo-500 border border-slate-600"
            placeholder="Search by address or type..." 
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
                <th className="p-4 font-semibold">Address</th>
                <th className="p-4 font-semibold">Type</th>
                <th className="p-4 font-semibold">Price</th>
                <th className="p-4 font-semibold">Rooms</th>
                <th className="p-4 font-semibold">Status</th>
                <th className="p-4 font-semibold">Owner</th>
                <th className="p-4 font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-700">
              {houses.map((house) => (
                <tr key={house._id} className="text-slate-300 hover:bg-slate-700/50 transition-colors">
                  <td className="p-4">{house.address}</td>
                  <td className="p-4">{house.houseType}</td>
                  <td className="p-4">${house.price}</td>
                  <td className="p-4">{house.numberOfRooms}</td>
                  <td className="p-4">
                    <span className={`px-2 py-1 rounded text-xs font-semibold ${
                      house.status === 'available' 
                        ? 'bg-emerald-500/20 text-emerald-400' 
                        : 'bg-red-500/20 text-red-400'
                    }`}>
                      {house.status}
                    </span>
                  </td>
                  <td className="p-4">{house.owner?.name || 'N/A'}</td>
                  <td className="p-4">
                    <div className="flex gap-2">
                      <Link to={`/houses/edit/${house._id}`} className="p-2 bg-slate-700 hover:bg-slate-600 rounded text-blue-400 transition-colors">
                        <FaEdit />
                      </Link>
                      <button onClick={() => handleDelete(house._id)} className="p-2 bg-slate-700 hover:bg-slate-600 rounded text-red-400 transition-colors">
                        <FaTrash />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {houses.length === 0 && (
                <tr>
                  <td colSpan="7" className="p-8 text-center text-slate-500">No houses found.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="mt-8 flex flex-col sm:flex-row justify-between items-center gap-4 bg-slate-800 p-4 rounded-xl border border-slate-700">
          <p className="text-slate-400 text-sm">
            Showing <span className="text-white font-bold">{houses.length}</span> of <span className="text-white font-bold">{totalHouses}</span> properties
          </p>
          <div className="flex items-center gap-2">
            <button 
              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className="px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-slate-300 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed transition-all text-sm font-semibold"
            >
              Previous
            </button>
            <div className="flex gap-1">
              {[...Array(totalPages)].map((_, i) => (
                <button
                  key={i + 1}
                  onClick={() => setCurrentPage(i + 1)}
                  className={`w-10 h-10 rounded-lg font-bold flex items-center justify-center transition-all text-sm ${
                    currentPage === i + 1 
                      ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/20' 
                      : 'bg-slate-700 border border-slate-600 text-slate-400 hover:text-white hover:bg-slate-600'
                  }`}
                >
                  {i + 1}
                </button>
              ))}
            </div>
            <button 
              onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
              className="px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-slate-300 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed transition-all text-sm font-semibold"
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default HouseList;
