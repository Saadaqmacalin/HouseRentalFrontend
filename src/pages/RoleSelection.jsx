import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Home, UserCheck, ArrowRight } from 'lucide-react';

const RoleSelection = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <div className="max-w-4xl w-full grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* User Card */}
        <div 
          onClick={() => navigate('/rent')}
          className="bg-white rounded-3xl p-8 shadow-xl hover:shadow-2xl transition-all cursor-pointer group border-2 border-transparent hover:border-blue-500 overflow-hidden relative"
        >
          <div className="absolute top-0 right-0 p-6 opacity-10 group-hover:scale-110 transition-transform">
            <Home size={120} />
          </div>
          <div className="bg-blue-100 w-16 h-16 rounded-2xl flex items-center justify-center mb-6 text-blue-600 group-hover:scale-110 transition-transform">
            <Home size={32} />
          </div>
          <h2 className="text-3xl font-bold text-slate-800 mb-4">I'm a Renter</h2>
          <p className="text-slate-600 mb-8 leading-relaxed">
            I want to browse available houses, find a perfect home, and manage my bookings.
          </p>
          <div className="flex items-center text-blue-600 font-semibold text-lg group-hover:translate-x-2 transition-transform">
            Find a Home <ArrowRight className="ml-2" />
          </div>
        </div>

        {/* Owner Card */}
        <div 
          onClick={() => navigate('/landlord/login')}
          className="bg-white rounded-3xl p-8 shadow-xl hover:shadow-2xl transition-all cursor-pointer group border-2 border-transparent hover:border-purple-500 overflow-hidden relative"
        >
          <div className="absolute top-0 right-0 p-6 opacity-10 group-hover:scale-110 transition-transform">
            <UserCheck size={120} />
          </div>
          <div className="bg-purple-100 w-16 h-16 rounded-2xl flex items-center justify-center mb-6 text-purple-600 group-hover:scale-110 transition-transform">
            <UserCheck size={32} />
          </div>
          <h2 className="text-3xl font-bold text-slate-800 mb-4">I'm a Landlord</h2>
          <p className="text-slate-600 mb-8 leading-relaxed">
            I want to list my properties, track my monthly rent, and manage my tenants.
          </p>
          <div className="flex items-center text-purple-600 font-semibold text-lg group-hover:translate-x-2 transition-transform">
            Manage Properties <ArrowRight className="ml-2" />
          </div>
        </div>
      </div>


      <div className="absolute bottom-8 right-8">
        <button
          onClick={() => navigate('/login')}
          className="text-slate-400 hover:text-slate-600 text-sm font-medium transition-colors"
        >
          Admin Login
        </button>
      </div>
    </div>
  );
};

export default RoleSelection;
