import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { 
  FaHome, 
  FaBuilding, 
  FaCalendarCheck, 
  FaUsers, 
  FaMoneyBillWave, 
  FaChartBar, 
  FaUserShield,
  FaSignOutAlt,
  FaUserTie
} from 'react-icons/fa';

const Sidebar = () => {
  const { user, logout } = useAuth();
  const location = useLocation();

  const isActive = (path) => location.pathname === path;

  return (
    <div className="w-64 bg-slate-900 border-r border-slate-800 flex flex-col h-screen fixed left-0 top-0">
      <div className="p-6">
        <h2 className="text-2xl font-bold text-indigo-500">RentalAdmin</h2>
        <p className="text-sm text-slate-400 mt-1">Welcome, {user?.name}</p>
      </div>

      <nav className="flex-1 px-4 space-y-2 overflow-y-auto">
        <Link to="/" className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${isActive('/') ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:bg-slate-800 hover:text-white'}`}>
          <FaHome /> Dashboard
        </Link>
        <Link to="/houses" className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${isActive('/houses') ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:bg-slate-800 hover:text-white'}`}>
          <FaBuilding /> Houses
        </Link>
        <Link to="/owners" className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${isActive('/owners') ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:bg-slate-800 hover:text-white'}`}>
          <FaUserTie /> Owners
        </Link>
        <Link to="/bookings" className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${isActive('/bookings') ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:bg-slate-800 hover:text-white'}`}>
          <FaCalendarCheck /> Bookings
        </Link>
        <Link to="/customers" className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${isActive('/customers') ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:bg-slate-800 hover:text-white'}`}>
          <FaUsers /> Customers
        </Link>
        <Link to="/payments" className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${isActive('/payments') ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:bg-slate-800 hover:text-white'}`}>
          <FaMoneyBillWave /> Payments
        </Link>
        <Link to="/reports" className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${isActive('/reports') ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:bg-slate-800 hover:text-white'}`}>
          <FaChartBar /> Reports
        </Link>
        {user?.role === 'admin' && (
          <Link to="/users" className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${isActive('/users') ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:bg-slate-800 hover:text-white'}`}>
            <FaUserShield /> Users
          </Link>
        )}
      </nav>

      <div className="p-4 border-t border-slate-800">
        <button onClick={logout} className="flex items-center gap-3 px-4 py-3 w-full text-left text-slate-400 hover:text-red-400 hover:bg-slate-800 rounded-lg transition-colors">
          <FaSignOutAlt /> Logout
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
