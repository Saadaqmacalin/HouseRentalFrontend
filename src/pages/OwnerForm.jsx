import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import api from '../services/api';
import { FaArrowLeft, FaSave } from 'react-icons/fa';

const OwnerForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditing = !!id;

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phoneNumber: '',
    nationalID: '',
    address: '',
  });

  useEffect(() => {
    if (isEditing) {
      const fetchOwner = async () => {
        try {
          const { data } = await api.get(`/owners/${id}`);
          setFormData({
            name: data.name,
            email: data.email,
            phoneNumber: data.phoneNumber,
            nationalID: data.nationalID,
            address: data.address,
          });
        } catch (error) {
          console.error('Failed to fetch owner', error);
        }
      };
      fetchOwner();
    }
  }, [id, isEditing]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (isEditing) {
        await api.put(`/owners/${id}`, formData);
      } else {
        await api.post('/owners', formData);
      }
      navigate('/owners');
    } catch (error) {
      alert('Operation failed: ' + (error.response?.data?.message || error.message));
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <button onClick={() => navigate('/owners')} className="flex items-center text-slate-400 hover:text-white mb-6 gap-2 transition-colors">
        <FaArrowLeft /> Back to List
      </button>

      <div className="bg-slate-800 p-8 rounded-lg shadow-lg">
        <h2 className="text-2xl font-bold text-white mb-6">{isEditing ? 'Edit Owner' : 'Add New Owner'}</h2>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-slate-400 text-sm mb-2">Full Name</label>
              <input 
                type="text" 
                className="w-full bg-slate-700 text-white px-4 py-3 rounded-lg focus:outline-none focus:ring-1 focus:ring-indigo-500 border border-slate-600"
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
                required 
              />
            </div>
            
            <div>
              <label className="block text-slate-400 text-sm mb-2">Email Address</label>
              <input 
                type="email" 
                className="w-full bg-slate-700 text-white px-4 py-3 rounded-lg focus:outline-none focus:ring-1 focus:ring-indigo-500 border border-slate-600"
                value={formData.email}
                onChange={(e) => setFormData({...formData, email: e.target.value})}
                required 
              />
            </div>
            
            <div>
              <label className="block text-slate-400 text-sm mb-2">Phone Number</label>
              <input 
                type="text" 
                className="w-full bg-slate-700 text-white px-4 py-3 rounded-lg focus:outline-none focus:ring-1 focus:ring-indigo-500 border border-slate-600"
                value={formData.phoneNumber}
                onChange={(e) => setFormData({...formData, phoneNumber: e.target.value})}
                required 
              />
            </div>
            
            <div>
              <label className="block text-slate-400 text-sm mb-2">National ID</label>
              <input 
                type="text" 
                className="w-full bg-slate-700 text-white px-4 py-3 rounded-lg focus:outline-none focus:ring-1 focus:ring-indigo-500 border border-slate-600"
                value={formData.nationalID}
                onChange={(e) => setFormData({...formData, nationalID: e.target.value})}
                required 
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-slate-400 text-sm mb-2">Address</label>
              <textarea 
                className="w-full bg-slate-700 text-white px-4 py-3 rounded-lg focus:outline-none focus:ring-1 focus:ring-indigo-500 border border-slate-600 h-24"
                value={formData.address}
                onChange={(e) => setFormData({...formData, address: e.target.value})}
                required 
              ></textarea>
            </div>
          </div>

          <div className="flex justify-end pt-4">
            <button type="submit" className="bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-3 rounded-lg font-semibold flex items-center gap-2 transition-colors shadow-lg shadow-indigo-500/30">
              <FaSave /> {isEditing ? 'Update Owner' : 'Create Owner'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default OwnerForm;
