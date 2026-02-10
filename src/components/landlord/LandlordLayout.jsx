import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { 
  BarChart3, 
  Home, 
  Users, 
  LogOut, 
  Building2,
  Settings
} from 'lucide-react';

const LandlordLayout = () => {
  const navigate = useNavigate();
  const landlord = JSON.parse(localStorage.getItem('landlordData') || '{}');

  const handleLogout = () => {
    localStorage.removeItem('landlordToken');
    localStorage.removeItem('landlordData');
    localStorage.removeItem('user');
    navigate('/landlord/login');
  };

  const menuItems = [
    { label: 'Dashboard', icon: <BarChart3 size={20} />, path: '/landlord/dashboard' },
    { label: 'Properties', icon: <Building2 size={20} />, path: '/landlord/houses' },
    { label: 'Tenants', icon: <Users size={20} />, path: '/landlord/tenants' },
  ];

  return (
    <div className="w-64 h-screen bg-white border-r border-slate-100 flex flex-col">
      <div className="p-8">
        <h1 className="text-2xl font-bold text-slate-900 flex items-center">
          <Home className="text-purple-600 mr-2" /> RentEase
        </h1>
        <div className="mt-8 p-4 bg-slate-50 rounded-2xl flex items-center space-x-3">
          <div className="w-10 h-10 bg-purple-600 rounded-full flex items-center justify-center text-white font-bold">
            {landlord.name?.charAt(0) || 'L'}
          </div>
          <div className="overflow-hidden">
            <p className="text-sm font-bold text-slate-900 truncate">{landlord.name || 'Landlord'}</p>
            <p className="text-xs text-slate-500 truncate">Owner Account</p>
          </div>
        </div>
      </div>

      <nav className="flex-1 px-4 space-y-1">
        {menuItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) => `
              flex items-center px-4 py-3 rounded-xl transition-all font-medium
              ${isActive 
                ? 'bg-purple-600 text-white shadow-lg shadow-purple-200' 
                : 'text-slate-600 hover:bg-slate-50 hover:text-purple-600'}
            `}
          >
            <span className="mr-3">{item.icon}</span>
            {item.label}
          </NavLink>
        ))}
      </nav>

      <div className="p-4 border-t border-slate-100">
        <button 
          onClick={handleLogout}
          className="w-full flex items-center px-4 py-3 text-red-500 hover:bg-red-50 rounded-xl transition-colors font-medium"
        >
          <LogOut size={20} className="mr-3" />
          Logout
        </button>
      </div>
    </div>
  );
};

export default LandlordLayout;
