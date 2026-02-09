import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import api from '../../services/api';
import { FaArrowLeft, FaSave } from 'react-icons/fa';

const HouseForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditing = !!id;

  const [formData, setFormData] = useState({
    address: '',
    price: '',
    numberOfRooms: '',
    houseType: 'apartment',
    description: '',
    status: 'available',
    owner: '', // This should ideally be an Owner ID
  });

  // Fetch owners for the dropdown
  const [owners, setOwners] = useState([]);

  useEffect(() => {
    const fetchOwners = async () => {
      try {
        const { data } = await api.get('/owners');
        setOwners(data);
      } catch (error) {
        console.error('Failed to fetch owners', error);
      }
    };
    fetchOwners();
  }, []);

  useEffect(() => {
    if (isEditing) {
      const fetchHouse = async () => {
        try {
          const { data } = await api.get(`/houses/${id}`);
          setFormData({
            address: data.address,
            price: data.price,
            numberOfRooms: data.numberOfRooms,
            houseType: data.houseType,
            description: data.description || '',
            status: data.status,
            owner: data.owner?._id || data.owner || '',
          });
        } catch (error) {
          console.error('Failed to fetch house', error);
        }
      };
      fetchHouse();
    }
  }, [id, isEditing]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (isEditing) {
        await api.put(`/houses/${id}`, formData);
      } else {
        await api.post('/houses', formData);
      }
      navigate('/houses');
    } catch (error) {
      alert('Operation failed: ' + (error.response?.data?.message || error.message));
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <button onClick={() => navigate('/houses')} className="flex items-center text-slate-400 hover:text-white mb-6 gap-2 transition-colors">
        <FaArrowLeft /> Back to List
      </button>

      <div className="bg-slate-800 p-8 rounded-lg shadow-lg">
        <h2 className="text-2xl font-bold text-white mb-6">{isEditing ? 'Edit House' : 'Add New House'}</h2>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-slate-400 text-sm mb-2">Address</label>
              <input 
                type="text" 
                className={`w-full bg-slate-700 text-white px-4 py-3 rounded-lg focus:outline-none focus:ring-1 focus:ring-indigo-500 border border-slate-600 ${isEditing ? 'opacity-50 cursor-not-allowed' : ''}`}
                value={formData.address}
                onChange={(e) => setFormData({...formData, address: e.target.value})}
                required 
                disabled={isEditing}
              />
              {isEditing && <p className="text-xs text-slate-500 mt-1">Address cannot be changed after creation.</p>}
            </div>
            
            <div>
              <label className="block text-slate-400 text-sm mb-2">Price ($)</label>
              <input 
                type="number" 
                className="w-full bg-slate-700 text-white px-4 py-3 rounded-lg focus:outline-none focus:ring-1 focus:ring-indigo-500 border border-slate-600"
                value={formData.price}
                onChange={(e) => setFormData({...formData, price: e.target.value})}
                required 
              />
            </div>
            
            <div>
              <label className="block text-slate-400 text-sm mb-2">Number of Rooms</label>
              <input 
                type="number" 
                className="w-full bg-slate-700 text-white px-4 py-3 rounded-lg focus:outline-none focus:ring-1 focus:ring-indigo-500 border border-slate-600"
                value={formData.numberOfRooms}
                onChange={(e) => setFormData({...formData, numberOfRooms: e.target.value})}
                required 
              />
            </div>
            
            <div>
              <label className="block text-slate-400 text-sm mb-2">House Type</label>
              <select 
                className="w-full bg-slate-700 text-white px-4 py-3 rounded-lg focus:outline-none focus:ring-1 focus:ring-indigo-500 border border-slate-600"
                value={formData.houseType}
                onChange={(e) => setFormData({...formData, houseType: e.target.value})}
              >
                <option value="apartment">Apartment</option>
                <option value="villa">Villa</option>
                <option value="single house">Single House</option>
                <option value="other">Other</option>
              </select>
            </div>

            <div>
              <label className="block text-slate-400 text-sm mb-2">Status</label>
              <select 
                className="w-full bg-slate-700 text-white px-4 py-3 rounded-lg focus:outline-none focus:ring-1 focus:ring-indigo-500 border border-slate-600"
                value={formData.status}
                onChange={(e) => setFormData({...formData, status: e.target.value})}
              >
                <option value="available">Available</option>
                <option value="booked">Booked</option>
                <option value="maintenance">Maintenance</option>
              </select>
            </div>

            <div>
              <label className="block text-slate-400 text-sm mb-2">Owner</label>
              <select 
                className="w-full bg-slate-700 text-white px-4 py-3 rounded-lg focus:outline-none focus:ring-1 focus:ring-indigo-500 border border-slate-600"
                value={formData.owner}
                onChange={(e) => setFormData({...formData, owner: e.target.value})}
                required
              >
                <option value="">Select an Owner</option>
                {owners.map(owner => (
                  <option key={owner._id} value={owner._id}>
                    {owner.name} ({owner.nationalID})
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-slate-400 text-sm mb-2">Description</label>
            <textarea 
              className="w-full bg-slate-700 text-white px-4 py-3 rounded-lg focus:outline-none focus:ring-1 focus:ring-indigo-500 border border-slate-600 h-32"
              value={formData.description}
              onChange={(e) => setFormData({...formData, description: e.target.value})}
            ></textarea>
          </div>

          <div className="flex justify-end pt-4">
            <button type="submit" className="bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-3 rounded-lg font-semibold flex items-center gap-2 transition-colors shadow-lg shadow-indigo-500/30">
              <FaSave /> {isEditing ? 'Update House' : 'Create House'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default HouseForm;
