import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../services/api';
import { 
  Building2, 
  MapPin, 
  Bed, 
  Plus, 
  MoreVertical, 
  Edit2, 
  Trash2, 
  Search,
  Filter
} from 'lucide-react';

const LandlordHouses = () => {
  const navigate = useNavigate();
  const [houses, setHouses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalHouses, setTotalHouses] = useState(0);
  const housesPerPage = 6;

  const fetchHouses = async () => {
    try {
      setLoading(true);
      const res = await api.get(`/landlords/houses?page=${currentPage}&limit=${housesPerPage}`);
      setHouses(res.data.houses || []);
      setTotalPages(res.data.totalPages || 1);
      setTotalHouses(res.data.total || 0);
    } catch (err) {
      console.error('Error fetching houses:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHouses();
  }, [currentPage]);

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this property? This action cannot be undone.')) return;
    
    try {
      await api.delete(`/landlords/houses/${id}`);
      fetchHouses();
    } catch (err) {
      console.error('Error deleting house:', err);
      alert('Failed to delete property.');
    }
  };

  const filteredHouses = houses.filter(house => 
    house.address?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    house.houseType?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) return (
    <div className="flex items-center justify-center h-64">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
    </div>
  );

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <div className="flex items-center text-sm text-slate-400 mb-2 space-x-2">
            <span 
              onClick={() => navigate('/landlord/dashboard')}
              className="hover:text-purple-600 cursor-pointer transition-colors"
            >
              Dashboard
            </span>
            <span>/</span>
            <span className="text-slate-600 font-medium">Properties</span>
          </div>
          <h1 className="text-2xl font-bold text-slate-800">My Properties</h1>
          <p className="text-slate-500">Manage your property listings and their status.</p>
        </div>
        <button 
          onClick={() => navigate('/landlord/houses/new')}
          className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-xl font-bold flex items-center shadow-lg hover:shadow-purple-500/20 transition-all"
        >
          <Plus className="mr-2" size={20} /> New Property
        </button>
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col sm:flex-row gap-4 bg-white p-4 rounded-2xl shadow-sm border border-slate-100">
        <div className="relative flex-1">
          <input
            type="text"
            placeholder="Search by address or type..."
            className="w-full pl-11 pr-4 py-2 bg-slate-50 border border-slate-100 rounded-xl focus:ring-2 focus:ring-purple-500 outline-none transition-all"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <Search className="absolute left-4 top-2.5 text-slate-400" size={18} />
        </div>
        <button className="flex items-center px-4 py-2 text-slate-600 border border-slate-200 rounded-xl hover:bg-slate-50 transition-colors">
          <Filter size={18} className="mr-2" /> Filters
        </button>
      </div>
      {/* Properties Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {filteredHouses.length > 0 ? filteredHouses.map((house) => (
          <div key={house._id} className="bg-white rounded-3xl overflow-hidden shadow-sm border border-slate-100 group hover:shadow-xl transition-all duration-300">
            <div className="relative h-48">
              <img 
                src={house.imageUrl || 'https://images.unsplash.com/photo-1568605114967-8130f3a36994?ixlib=rb-4.0.3&w=1000&q=80'} 
                alt={house.address}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute top-4 right-4 bg-white/90 backdrop-blur p-2 rounded-xl shadow-lg cursor-pointer hover:bg-white transition-colors">
                <MoreVertical size={18} className="text-slate-700" />
              </div>
              <div className={`absolute bottom-4 left-4 px-3 py-1 rounded-lg text-xs font-bold uppercase tracking-wider backdrop-blur bg-white/90 ${
                house.status === 'available' ? 'text-green-600' : 'text-orange-600'
              }`}>
                {house.status}
              </div>
            </div>
            
            <div className="p-6">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="font-bold text-slate-800 line-clamp-1">{house.address}</h3>
                  <div className="flex items-center text-slate-400 text-sm mt-1">
                    <MapPin size={14} className="mr-1" /> {house.houseType}
                  </div>
                </div>
                <p className="text-purple-600 font-bold text-xl">${house.price}</p>
              </div>

              <div className="flex items-center gap-4 text-slate-600 text-sm mb-6 border-y border-slate-50 py-3">
                <div className="flex items-center">
                  <Bed size={16} className="mr-2 text-slate-400" /> {house.numberOfRooms} Rooms
                </div>
                <div className="flex items-center">
                  <Building2 size={16} className="mr-2 text-slate-400" /> {house.numberOfRooms > 3 ? 'Villa' : 'Apartment'}
                </div>
              </div>

              <div className="flex gap-2">
                <button 
                  onClick={() => navigate(`/landlord/houses/edit/${house._id}`)}
                  className="flex-1 bg-slate-50 hover:bg-slate-100 text-slate-600 py-2 rounded-xl font-medium transition-colors flex items-center justify-center"
                >
                  <Edit2 size={16} className="mr-2" /> Edit
                </button>
                <button 
                  onClick={() => handleDelete(house._id)}
                  className="px-4 bg-red-50 hover:bg-red-100 text-red-500 py-2 rounded-xl transition-colors flex items-center justify-center"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          </div>
        )) : (
          <div className="col-span-full py-20 text-center bg-slate-50 rounded-3xl border-2 border-dashed border-slate-200">
            <Building2 className="mx-auto text-slate-300 mb-4" size={48} />
            <h3 className="text-lg font-bold text-slate-500">No properties found</h3>
            <p className="text-slate-400">Try adjusting your search or add a new listing.</p>
          </div>
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="mt-12 flex flex-col sm:flex-row justify-between items-center gap-6 bg-white p-6 rounded-[32px] shadow-sm border border-slate-100">
           <p className="text-slate-500 text-sm font-medium">
             Showing <span className="text-slate-900 font-bold">{houses.length}</span> of <span className="text-slate-900 font-bold">{totalHouses}</span> properties
           </p>
           <div className="flex items-center gap-3">
             <button 
               onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
               disabled={currentPage === 1}
               className="px-5 py-2.5 bg-slate-50 border border-slate-100 rounded-xl text-slate-600 hover:bg-slate-100 disabled:opacity-30 disabled:cursor-not-allowed transition-all text-sm font-bold"
             >
               Prev
             </button>
             <div className="flex gap-2">
               {[...Array(totalPages)].map((_, i) => (
                 <button
                   key={i + 1}
                   onClick={() => setCurrentPage(i + 1)}
                   className={`w-10 h-10 rounded-xl font-bold flex items-center justify-center transition-all text-sm ${
                     currentPage === i + 1 
                       ? 'bg-purple-600 text-white shadow-lg shadow-purple-500/30' 
                       : 'bg-slate-50 border border-slate-100 text-slate-400 hover:text-slate-600 hover:bg-slate-100'
                   }`}
                 >
                   {i + 1}
                 </button>
               ))}
             </div>
             <button 
               onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
               disabled={currentPage === totalPages}
               className="px-5 py-2.5 bg-slate-50 border border-slate-100 rounded-xl text-slate-600 hover:bg-slate-100 disabled:opacity-30 disabled:cursor-not-allowed transition-all text-sm font-bold"
             >
               Next
             </button>
           </div>
        </div>
      )}
    </div>
  );
};

export default LandlordHouses;
