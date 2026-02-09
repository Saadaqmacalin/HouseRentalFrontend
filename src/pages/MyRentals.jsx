import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import { 
  Home, 
  Calendar, 
  Clock, 
  ChevronRight, 
  ArrowLeft,
  CheckCircle2,
  XCircle,
  LogOut,
  MapPin,
  DollarSign
} from 'lucide-react';

const MyRentals = () => {
  const [rentals, setRentals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [endingId, setEndingId] = useState(null);
  const { user } = useAuth();
  const navigate = useNavigate();

  const fetchRentals = async () => {
    try {
      const { data } = await api.get('/bookings');
      // Filter for current user's active/pending rentals
      setRentals(data);
    } catch (error) {
      console.error('Error fetching rentals:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!user) {
      navigate('/customer-auth');
      return;
    }
    fetchRentals();
  }, [user]);

  const handleEndLease = async (bookingId) => {
    if (!window.confirm('Are you sure you want to stop renting this house? This action cannot be undone.')) {
      return;
    }

    setEndingId(bookingId);
    try {
      await api.put(`/bookings/${bookingId}/end`);
      alert('Lease ended successfully!');
      fetchRentals();
    } catch (error) {
      console.error('Error ending lease:', error);
      alert(error.response?.data?.message || 'Failed to end lease');
    } finally {
      setEndingId(null);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'approved': return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20';
      case 'pending': return 'bg-amber-500/10 text-amber-400 border-amber-500/20';
      case 'ended': return 'bg-slate-500/10 text-slate-400 border-slate-500/20';
      default: return 'bg-red-500/10 text-red-400 border-red-500/20';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0a0a0c] flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0a0a0c] text-white font-sans selection:bg-indigo-500/30">
      {/* Premium Header */}
      <header className="sticky top-0 z-50 bg-[#0a0a0c]/80 backdrop-blur-xl border-b border-white/5">
        <div className="container mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-6">
            <Link to="/rent" className="p-2 hover:bg-white/5 rounded-full transition-colors group">
              <ArrowLeft className="text-slate-400 group-hover:text-white transition-colors" />
            </Link>
            <div>
              <h1 className="text-xl font-bold tracking-tight">My Rentals</h1>
              <p className="text-xs text-slate-500 mt-0.5">Manage your active tenancies</p>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="hidden md:block text-right">
              <p className="text-sm font-medium">{user?.name}</p>
              <p className="text-[10px] text-slate-500 uppercase tracking-widest">Premium Renter</p>
            </div>
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center font-bold shadow-lg shadow-indigo-500/20">
              {user?.name?.charAt(0)}
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-6 py-12">
        {rentals.length === 0 ? (
          <div className="max-w-md mx-auto text-center py-20">
            <div className="w-20 h-20 bg-white/5 rounded-3xl flex items-center justify-center mx-auto mb-6 transform rotate-3">
              <Home size={32} className="text-slate-600" />
            </div>
            <h2 className="text-2xl font-bold mb-3">No rentals found</h2>
            <p className="text-slate-400 mb-8 leading-relaxed">
              You haven't rented any houses yet. Explore our premium listings and find your dream home today.
            </p>
            <Link 
              to="/rent" 
              className="inline-flex items-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white px-8 py-3.5 rounded-2xl font-bold transition-all hover:scale-[1.02] active:scale-[0.98] shadow-xl shadow-indigo-600/20"
            >
              Browse Houses <ChevronRight size={18} />
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {rentals.map((rental) => (
              <div 
                key={rental._id}
                className="group relative bg-white/5 border border-white/5 rounded-[32px] overflow-hidden hover:border-white/10 transition-all duration-500"
              >
                <div className="p-8">
                  <div className="flex justify-between items-start mb-8">
                    <div className="flex gap-4">
                      <div className="w-16 h-16 rounded-2xl bg-white/5 flex items-center justify-center border border-white/10 group-hover:scale-110 transition-transform duration-500">
                        <Home className="text-indigo-400" />
                      </div>
                      <div>
                        <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border mb-3 ${getStatusColor(rental.bookingStatus)}`}>
                          {rental.bookingStatus === 'approved' && <CheckCircle2 size={12} />}
                          {rental.bookingStatus === 'pending' && <Clock size={12} />}
                          {rental.bookingStatus === 'ended' && <XCircle size={12} />}
                          {rental.bookingStatus}
                        </div>
                        <h3 className="text-lg font-bold group-hover:text-indigo-400 transition-colors line-clamp-1">
                          {rental.house?.address || 'Loading address...'}
                        </h3>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-6 mb-8">
                    <div className="space-y-4">
                      <div className="flex items-center gap-3 text-slate-400">
                        <div className="p-2 bg-white/5 rounded-lg text-indigo-400">
                           <Calendar size={14} />
                        </div>
                        <div>
                          <p className="text-[10px] uppercase tracking-widest text-slate-500">Lease Started</p>
                          <p className="text-sm font-medium text-slate-200">
                            {new Date(rental.startDate).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                          </p>
                        </div>
                      </div>
                    </div>
                    
                    <div className="space-y-4">
                      <div className="flex items-center gap-3 text-slate-400">
                        <div className="p-2 bg-white/5 rounded-lg text-emerald-400">
                           <DollarSign size={14} />
                        </div>
                        <div>
                          <p className="text-[10px] uppercase tracking-widest text-slate-500">Monthly Rent</p>
                          <p className="text-sm font-medium text-slate-200">${rental.house?.price || 0}</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {rental.bookingStatus === 'approved' && (
                    <div className="pt-6 border-t border-white/5 flex items-center justify-between gap-4">
                       <button
                        onClick={() => handleEndLease(rental._id)}
                        disabled={endingId === rental._id}
                        className="flex-1 bg-red-500/10 hover:bg-red-500/20 text-red-400 py-4 rounded-2xl font-bold transition-all flex items-center justify-center gap-2 border border-red-500/20 hover:border-red-500/40 disabled:opacity-50"
                      >
                        {endingId === rental._id ? (
                          <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-white"></div>
                        ) : (
                          <>
                            Stop Renting <LogOut size={18} />
                          </>
                        )}
                      </button>
                    </div>
                  )}

                  {rental.bookingStatus === 'ended' && (
                    <div className="p-4 bg-white/5 border border-white/10 rounded-2xl text-center italic">
                      <p className="text-slate-500 text-xs">
                        This tenancy was completed on {rental.endDate ? new Date(rental.endDate).toLocaleDateString() : 'N/A'}.
                      </p>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default MyRentals;
