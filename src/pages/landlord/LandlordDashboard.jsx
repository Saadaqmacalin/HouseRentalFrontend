import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { 
  Home, 
  Users, 
  DollarSign, 
  AlertCircle, 
  TrendingUp, 
  Plus, 
  Calendar,
  Building2,
  CheckCircle2,
  Clock
} from 'lucide-react';

const LandlordDashboard = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const token = localStorage.getItem('landlordToken');
        const res = await axios.get('/api/landlords/stats', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setStats(res.data);
      } catch (err) {
        console.error('Error fetching stats:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  if (loading) return (
    <div className="flex items-center justify-center h-64">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
    </div>
  );

  const statCards = [
    { label: 'Total Properties', value: stats?.totalHouses || 0, icon: <Home className="text-blue-600" />, color: 'bg-blue-50' },
    { label: 'Rented Units', value: stats?.rentedHouses || 0, icon: <Building2 className="text-green-600" />, color: 'bg-green-50' },
    { label: 'Vacant Units', value: stats?.vacantHouses || 0, icon: <Clock className="text-orange-600" />, color: 'bg-orange-50' },
    { label: 'Unpaid This Month', value: stats?.unpaidRentCount || 0, icon: <AlertCircle className="text-red-600" />, color: 'bg-red-50' }
  ];

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Landlord Dashboard</h1>
          <p className="text-slate-500">Welcome back! Here's what's happening today.</p>
        </div>
        <button 
          onClick={() => navigate('/landlord/houses/new')}
          className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-xl font-bold flex items-center shadow-lg hover:shadow-purple-500/20 transition-all"
        >
          <Plus className="mr-2" size={20} /> Add Property
        </button>
      </div>

      {/* Financial Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100 flex items-center justify-between">
          <div>
            <p className="text-slate-500 font-medium">Expected Income</p>
            <h3 className="text-3xl font-bold text-slate-800 mt-1">${stats?.expectedIncome?.toLocaleString() || 0}</h3>
            <p className="text-xs text-slate-400 mt-2 uppercase tracking-wider font-bold italic">Total Monthly Rent</p>
          </div>
          <div className="bg-blue-100 p-4 rounded-2xl text-blue-600">
            <DollarSign size={32} />
          </div>
        </div>
        <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100 flex items-center justify-between">
          <div>
            <p className="text-slate-500 font-medium">Collected So Far</p>
            <h3 className="text-3xl font-bold text-green-600 mt-1">${stats?.collectedThisMonth?.toLocaleString() || 0}</h3>
            <div className="flex items-center mt-2 text-green-600 font-bold text-sm">
              <TrendingUp size={16} className="mr-1" />
              {stats?.expectedIncome > 0 ? Math.round((stats.collectedThisMonth / stats.expectedIncome) * 100) : 0}% of target
            </div>
          </div>
          <div className="bg-green-100 p-4 rounded-2xl text-green-600">
            <TrendingUp size={32} />
          </div>
        </div>
      </div>

      {/* Quick Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((card, idx) => (
          <div key={idx} className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
            <div className={`${card.color} w-12 h-12 rounded-xl flex items-center justify-center mb-4`}>
              {card.icon}
            </div>
            <p className="text-slate-500 text-sm font-medium">{card.label}</p>
            <h4 className="text-2xl font-bold text-slate-800 mt-1">{card.value}</h4>
          </div>
        ))}
      </div>

      {/* Secondary Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 bg-slate-900 rounded-3xl p-8 text-white flex flex-col justify-between relative overflow-hidden h-48 md:h-auto">
          <div className="z-10">
            <h2 className="text-2xl font-bold mb-2">Efficient Management</h2>
            <p className="text-slate-400 max-w-md">Our tenant management system helps you track payments and bookings automatically.</p>
          </div>
          <button 
            onClick={() => navigate('/landlord/tenants')}
            className="z-10 bg-white text-slate-900 px-6 py-2 rounded-xl font-bold w-fit mt-6 hover:bg-slate-100 transition-colors"
          >
            View Tenants
          </button>
          <Building2 className="absolute -right-12 -bottom-12 text-slate-800 w-64 h-64 opacity-20 rotate-12" />
        </div>
        <div className="bg-purple-600 rounded-3xl p-8 text-white">
          <Calendar className="mb-4" />
          <h2 className="text-xl font-bold mb-2">February Review</h2>
          <p className="text-purple-100 text-sm mb-6">You have 3 monthly rent renewals coming up next week.</p>
          <div className="space-y-4">
             <div className="bg-purple-500/50 p-3 rounded-lg flex items-center">
                <div className="bg-purple-300 w-2 h-2 rounded-full mr-3" />
                <span className="text-sm font-medium">Villa #12 - Renew Feb 14</span>
             </div>
             <div className="bg-purple-500/50 p-3 rounded-lg flex items-center">
                <div className="bg-purple-300 w-2 h-2 rounded-full mr-3" />
                <span className="text-sm font-medium">Apt #45 - Renew Feb 16</span>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LandlordDashboard;
