import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { 
  Users, 
  Search, 
  MapPin, 
  Phone, 
  Mail, 
  Calendar,
  CheckCircle2,
  XCircle,
  MoreVertical,
  DollarSign
} from 'lucide-react';

const LandlordTenants = () => {
  const navigate = useNavigate();
  const [tenants, setTenants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchTenants = async () => {
      try {
        const token = localStorage.getItem('landlordToken');
        const res = await axios.get('/api/landlords/tenants', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setTenants(res.data);
      } catch (err) {
        console.error('Error fetching tenants:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchTenants();
  }, []);

  const handleMarkPaid = async (bookingId) => {
    try {
      const token = localStorage.getItem('landlordToken');
      await axios.post(`/api/landlords/mark-paid/${bookingId}`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      // Refresh list
      const res = await axios.get('/api/landlords/tenants', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setTenants(res.data);
    } catch (err) {
      console.error('Error marking as paid:', err);
    }
  };

  const filteredTenants = tenants.filter(t => 
    t.customer?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    t.house?.address?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) return (
    <div className="flex items-center justify-center h-64">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
    </div>
  );

  return (
    <div className="space-y-8">
      <div>
        <div className="flex items-center text-sm text-slate-400 mb-2 space-x-2">
          <span 
            onClick={() => navigate('/landlord/dashboard')}
            className="hover:text-purple-600 cursor-pointer transition-colors"
          >
            Dashboard
          </span>
          <span>/</span>
          <span className="text-slate-600 font-medium">Tenants</span>
        </div>
        <h1 className="text-2xl font-bold text-slate-800">Tenant Management</h1>
        <p className="text-slate-500">Track active rentals and rent payment status.</p>
      </div>

      <div className="flex bg-white p-4 rounded-2xl shadow-sm border border-slate-100">
        <div className="relative flex-1">
          <input
            type="text"
            placeholder="Search by tenant name or property..."
            className="w-full pl-11 pr-4 py-2 bg-slate-50 border border-slate-100 rounded-xl focus:ring-2 focus:ring-purple-500 outline-none transition-all"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <Search className="absolute left-4 top-2.5 text-slate-400" size={18} />
        </div>
      </div>

      <div className="bg-white rounded-3xl overflow-hidden shadow-sm border border-slate-100">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-100">
              <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Tenant</th>
              <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Property</th>
              <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Payment Status</th>
              <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Contact</th>
              <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {filteredTenants.map((item) => (
              <tr key={item._id} className="hover:bg-slate-50 transition-colors">
                <td className="px-6 py-4">
                  <div className="flex items-center">
                    <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-bold mr-3">
                      {item.customer?.name?.charAt(0)}
                    </div>
                    <div>
                      <p className="font-bold text-slate-800">{item.customer?.name}</p>
                      <p className="text-xs text-slate-400">ID: ...{item._id.slice(-6)}</p>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <p className="text-sm font-medium text-slate-700 max-w-[200px] truncate">{item.house?.address}</p>
                  <p className="text-xs text-purple-600 font-bold">${item.house?.price}/mo</p>
                </td>
                <td className="px-6 py-4">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold ${
                    item.latestPaymentStatus === 'paid' 
                    ? 'bg-green-100 text-green-700' 
                    : 'bg-red-100 text-red-700 animate-pulse'
                  }`}>
                    {item.latestPaymentStatus === 'paid' ? <CheckCircle2 size={12} className="mr-1" /> : <XCircle size={12} className="mr-1" />}
                    {item.latestPaymentStatus === 'paid' ? 'Marked Paid' : 'Pending Payment'}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <div className="flex gap-2">
                    <a href={`tel:${item.customer?.phoneNumber}`} className="p-2 bg-slate-100 rounded-lg text-slate-600 hover:bg-blue-50 hover:text-blue-600 transition-colors">
                      <Phone size={16} />
                    </a>
                    <a href={`mailto:${item.customer?.email}`} className="p-2 bg-slate-100 rounded-lg text-slate-600 hover:bg-blue-50 hover:text-blue-600 transition-colors">
                      <Mail size={16} />
                    </a>
                  </div>
                </td>
                <td className="px-6 py-4 text-right">
                  {item.latestPaymentStatus !== 'paid' && (
                    <button 
                      onClick={() => handleMarkPaid(item._id)}
                      className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-xl text-sm font-bold shadow-lg shadow-green-200 transition-all flex items-center ml-auto"
                    >
                      <DollarSign size={14} className="mr-1" /> Mark Paid
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {filteredTenants.length === 0 && (
          <div className="py-20 text-center">
            <Users className="mx-auto text-slate-200 mb-4" size={48} />
            <p className="text-slate-400 font-medium">No active tenants found.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default LandlordTenants;
