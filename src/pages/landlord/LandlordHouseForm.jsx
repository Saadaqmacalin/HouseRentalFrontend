import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import api from '../../services/api';
import { 
  ArrowLeft, 
  MapPin, 
  DollarSign, 
  Bed, 
  Type, 
  FileText, 
  Loader2,
  Sparkles
} from 'lucide-react';

const LandlordHouseForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditing = !!id;
  
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    address: '',
    price: '',
    numberOfRooms: '',
    houseType: 'apartment',
    description: ''
  });

  useEffect(() => {
    if (isEditing) {
      const fetchHouse = async () => {
        try {
          const res = await api.get('/landlords/houses');
          const house = res.data.find(h => h._id === id);
          if (house) setFormData(house);
        } catch (err) {
          console.error('Error fetching house:', err);
        }
      };
      fetchHouse();
    }
  }, [id, isEditing]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const url = isEditing ? `/landlords/houses/${id}` : '/landlords/houses';
      const method = isEditing ? 'put' : 'post';
      
      await api[method](url, formData);
      
      navigate('/landlord/houses');
    } catch (err) {
      console.error('Error saving house:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-8">
      <div className="flex items-center space-x-4">
        <button 
          onClick={() => navigate('/landlord/houses')}
          className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-full transition-colors"
        >
          <ArrowLeft size={24} />
        </button>
        <h1 className="text-2xl font-bold text-slate-800">
          {isEditing ? 'Edit Property' : 'List New Property'}
        </h1>
      </div>

      <div className="bg-white rounded-3xl shadow-sm border border-slate-100 p-8">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label className="text-sm font-bold text-slate-700">Property Address</label>
            <div className="relative">
              <input
                required
                className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-100 rounded-xl focus:ring-2 focus:ring-purple-500 outline-none transition-all"
                placeholder="e.g. 123 Luxury Ave, Marina Bay"
                value={formData.address}
                onChange={(e) => setFormData({...formData, address: e.target.value})}
              />
              <MapPin className="absolute left-4 top-3.5 text-slate-400" size={18} />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-700">Monthly Rent ($)</label>
              <div className="relative">
                <input
                  required
                  type="number"
                  className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-100 rounded-xl focus:ring-2 focus:ring-purple-500 outline-none transition-all"
                  placeholder="2500"
                  value={formData.price}
                  onChange={(e) => setFormData({...formData, price: e.target.value})}
                />
                <DollarSign className="absolute left-4 top-3.5 text-slate-400" size={18} />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-700">Total Rooms</label>
              <div className="relative">
                <input
                  required
                  type="number"
                  className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-100 rounded-xl focus:ring-2 focus:ring-purple-500 outline-none transition-all"
                  placeholder="4"
                  value={formData.numberOfRooms}
                  onChange={(e) => setFormData({...formData, numberOfRooms: e.target.value})}
                />
                <Bed className="absolute left-4 top-3.5 text-slate-400" size={18} />
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-bold text-slate-700">Property Type</label>
            <select 
              className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-xl focus:ring-2 focus:ring-purple-500 outline-none transition-all appearance-none"
              value={formData.houseType}
              onChange={(e) => setFormData({...formData, houseType: e.target.value})}
            >
              <option value="apartment">Apartment</option>
              <option value="villa">Villa</option>
              <option value="single house">Single House</option>
              <option value="other">Other</option>
            </select>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-bold text-slate-700">Detailed Description</label>
            <textarea 
              rows="4"
              className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-xl focus:ring-2 focus:ring-purple-500 outline-none transition-all resize-none"
              placeholder="Tell us about the features, amenities, and location highlights..."
              value={formData.description}
              onChange={(e) => setFormData({...formData, description: e.target.value})}
            />
          </div>

          {!isEditing && (
            <div className="bg-purple-50 p-4 rounded-2xl flex items-center border border-purple-100">
              <Sparkles className="text-purple-600 mr-3 shrink-0" size={20} />
              <p className="text-sm text-purple-700 font-medium">
                Magic! A professional property photo will be automatically assigned to your listing once published.
              </p>
            </div>
          )}

          <div className="pt-4">
            <button
              disabled={loading}
              className="w-full bg-purple-600 hover:bg-purple-700 text-white font-bold py-4 rounded-2xl shadow-lg hover:shadow-purple-500/20 transition-all flex items-center justify-center disabled:opacity-70"
            >
              {loading ? <Loader2 className="animate-spin" size={24} /> : (isEditing ? 'Update Property' : 'Publish Property')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LandlordHouseForm;
