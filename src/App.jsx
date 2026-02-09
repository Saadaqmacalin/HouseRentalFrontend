import { Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import HouseList from './pages/Houses/HouseList';
import HouseForm from './pages/Houses/HouseForm';
import Bookings from './pages/Bookings';
import Customers from './pages/Customers';
import Payments from './pages/Payments';
import Reports from './pages/Reports';
import Users from './pages/Users';
import OwnerList from './pages/OwnerList';
import OwnerForm from './pages/OwnerForm';
import RentHouse from './pages/RentHouse';
import CustomerAuth from './pages/CustomerAuth';
import Layout from './components/Layout';
import './index.css';

import RoleSelection from './pages/RoleSelection';
import LandlordAuth from './pages/LandlordAuth';
import LandlordLayout from './components/landlord/LandlordLayout';
import LandlordDashboard from './pages/landlord/LandlordDashboard';
import LandlordHouses from './pages/landlord/LandlordHouses';
import LandlordTenants from './pages/landlord/LandlordTenants';
import LandlordHouseForm from './pages/landlord/LandlordHouseForm';
import MyRentals from './pages/MyRentals';
import Checkout from './pages/Checkout';

const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();
  if (loading) return <div className="flex justify-center items-center h-screen">Loading...</div>;
  if (!user) return <Navigate to="/login" />;
  return children;
};

const LandlordProtectedRoute = ({ children }) => {
  const token = localStorage.getItem('landlordToken');
  if (!token) return <Navigate to="/landlord/login" />;
  return children;
};

function App() {
  return (
    <AuthProvider>
        <Routes>
          <Route path="/" element={<RoleSelection />} />
          <Route path="/login" element={<Login />} />
          <Route path="/landlord/login" element={<LandlordAuth />} />
          <Route path="/rent" element={<RentHouse />} />
          <Route path="/customer-auth" element={<CustomerAuth />} />
          <Route path="/my-rentals" element={<MyRentals />} />
          <Route path="/checkout" element={<Checkout />} />
          
          {/* Admin Routes */}
          <Route element={<ProtectedRoute><Layout /></ProtectedRoute>}>
             <Route path="/admin/dashboard" element={<Dashboard />} />
             <Route path="/houses" element={<HouseList />} />
             <Route path="/houses/new" element={<HouseForm />} />
             <Route path="/houses/edit/:id" element={<HouseForm />} />
             <Route path="/bookings" element={<Bookings />} />
             <Route path="/owners" element={<OwnerList />} />
             <Route path="/owners/new" element={<OwnerForm />} />
             <Route path="/owners/edit/:id" element={<OwnerForm />} />
             <Route path="/customers" element={<Customers />} />
             <Route path="/payments" element={<Payments />} />
             <Route path="/reports" element={<Reports />} />
             <Route path="/users" element={<Users />} />
          </Route>

          {/* Landlord Routes */}
          <Route path="/landlord/*" element={<LandlordProtectedRoute><div className="flex bg-slate-50 min-h-screen"><LandlordLayout /><div className="flex-1 p-8 overflow-y-auto h-screen"><Routes><Route index element={<Navigate to="dashboard" />} /><Route path="dashboard" element={<LandlordDashboard />} /><Route path="houses" element={<LandlordHouses />} /><Route path="houses/new" element={<LandlordHouseForm />} /><Route path="houses/edit/:id" element={<LandlordHouseForm />} /><Route path="tenants" element={<LandlordTenants />} /><Route path="*" element={<Navigate to="dashboard" />} /></Routes></div></div></LandlordProtectedRoute>} />
        </Routes>
    </AuthProvider>
  );
}

export default App;
