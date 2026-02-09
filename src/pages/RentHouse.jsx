import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import { FaSearch, FaHome, FaMapMarkerAlt, FaDollarSign, FaBed, FaFilter, FaUser, FaFacebook, FaGithub, FaEnvelope, FaPhone } from 'react-icons/fa';

const RentHouse = () => {
  const [houses, setHouses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [totalHouses, setTotalHouses] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [filters, setFilters] = useState({
    search: '',
    minPrice: '',
    maxPrice: '',
    type: ''
  });
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedHouse, setSelectedHouse] = useState(null);
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [bookingData, setBookingData] = useState({
    startDate: new Date().toISOString().split('T')[0]
  });
  const [isBooking, setIsBooking] = useState(false);
  const housesPerPage = 6;

  const { user, logout } = useAuth();
  const navigate = useNavigate();

  // Debounce search effect
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(filters.search);
      setCurrentPage(1); // Reset to first page when search changes
    }, 500);
    return () => clearTimeout(timer);
  }, [filters.search]);

  const fetchHouses = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (debouncedSearch) params.append('address', debouncedSearch);
      if (filters.minPrice) params.append('minPrice', filters.minPrice);
      if (filters.maxPrice) params.append('maxPrice', filters.maxPrice);
      if (filters.type) params.append('houseType', filters.type);
      params.append('page', currentPage);
      params.append('limit', housesPerPage);

      const { data } = await api.get(`/houses?${params.toString()}`);
      setHouses(data.houses);
      setTotalHouses(data.total);
      setTotalPages(data.pages);
    } catch (error) {
      console.error('Error fetching houses:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHouses();
  }, [debouncedSearch, filters.minPrice, filters.maxPrice, filters.type, currentPage]);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({ ...prev, [name]: value }));
    if (name !== 'search') {
      setCurrentPage(1); // Reset page for price or type changes
    }
  };

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const handleRent = (house) => {
    if (!user) {
      navigate('/customer-auth', { state: { returnTo: `/rent`, houseId: house._id } });
      return;
    }
    setSelectedHouse(house);
    setShowBookingModal(true);
  };

  const handleConfirmRent = async (e) => {
    e.preventDefault();
    if (!bookingData.startDate) {
      alert('Please select a start date.');
      return;
    }

    setIsBooking(true);
    try {
      const { data } = await api.post('/bookings', {
        houseId: selectedHouse._id,
        startDate: bookingData.startDate
      });
      
      setShowBookingModal(false);
      // Navigate to checkout with booking details
      navigate('/checkout', { 
        state: { 
          bookingId: data._id, 
          amount: selectedHouse.price,
          address: selectedHouse.address
        } 
      });
    } catch (error) {
      console.error('Booking error:', error);
      alert(error.response?.data?.message || 'Failed to create booking. Please try again.');
    } finally {
      setIsBooking(false);
    }
  };

  const houseTypes = [...new Set(houses.map(h => h.houseType))];

  const houseImages = [
    '1613977257363-707ba9349b07', // luxury villa
    '1512917774080-9991f1c4c750', // white modern house
    '1600585154340-be6161a56a0c', // modern kitchen
    '1580587767531-50d4f13451df', // luxury estate
    '1600585154542-63084a9871df', // exterior pool
    '1570129477492-45c003edd2be', // big house
    '1583608205776-bfd35f0d9f83', // minimalist architecture
    '1600596542815-ffad4c1539a9', // poolside villa
    '1600047509807-ba8f99d2cdde', // contemporary mansion
    '1600566753190-17f09a0a22da', // airy living room
    '1600571405810-72133b30303e'  // stylish dining
  ];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-200 pb-12">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-transparent backdrop-blur-sm border-b border-white/5">
        <div className="container mx-auto px-4 h-20 flex items-center justify-between">
          <div className="flex items-center gap-2 group cursor-pointer" onClick={() => navigate('/rent')}>
             <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-indigo-600/30">
                <FaHome className="text-xl" />
             </div>
             <span className="text-xl font-black text-white tracking-tight group-hover:text-indigo-400 transition-colors">HOUSE<span className="text-indigo-500">RENT</span></span>
          </div>

          <div className="flex items-center gap-6">
            {user ? (
               <div className="flex items-center gap-4 lg:gap-6">
                  <Link 
                    to="/my-rentals" 
                    className="flex items-center gap-2 text-indigo-400 hover:text-indigo-300 font-bold transition-all hover:scale-105"
                  >
                    <div className="w-10 h-10 rounded-xl bg-indigo-500/10 flex items-center justify-center border border-indigo-500/20">
                       <FaHome className="text-sm" />
                    </div>
                    <span className="hidden md:inline text-sm">My Rentals</span>
                  </Link>

                  <div className="flex items-center gap-4">
                    <div className="hidden md:block text-right">
                      <p className="text-sm font-bold text-white leading-none">{user.name}</p>
                      <p className="text-[10px] text-slate-500 uppercase tracking-widest">{user.role || 'Customer'}</p>
                    </div>
                    <div className="w-10 h-10 bg-slate-800 rounded-full flex items-center justify-center border border-slate-700">
                      <FaUser className="text-slate-400 text-sm" />
                    </div>
                    <button 
                      onClick={() => { logout(); navigate('/rent'); }}
                      className="text-sm text-slate-400 hover:text-white transition-colors border border-slate-800 px-4 py-2 rounded-lg hover:bg-slate-800"
                    >
                      Logout
                    </button>
                  </div>
               </div>
            ) : (
                <div className="flex items-center gap-4">
                    <button 
                        onClick={() => navigate('/login')}
                        className="text-sm text-slate-400 hover:text-white transition-colors hidden sm:block"
                    >
                        Owner Login
                    </button>
                    <button 
                        onClick={() => navigate('/customer-auth')}
                        className="bg-indigo-600 hover:bg-indigo-500 text-white px-6 py-2.5 rounded-xl font-bold transition-all hover:scale-[1.05] active:scale-[0.95] text-sm"
                    >
                        Sign In
                    </button>
                </div>
            )}
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="relative h-[480px] w-full flex items-center justify-center overflow-hidden">
        {/* Background Image */}
        <div className="absolute inset-0 z-0">
            <img 
                src="https://images.unsplash.com/photo-1628592102751-ba83b0314276?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80" 
                className="w-full h-full object-cover object-center opacity-90"
                alt="Elite Masterpiece Residence"
            />
        </div>

        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-slate-950/40 z-10"></div>
        
        {/* Hero Content */}
        <div className="relative z-20 text-center px-4 max-w-4xl pt-20">
          <div className="inline-block px-4 py-1.5 mb-6 rounded-full bg-indigo-600/20 border border-indigo-500/30 backdrop-blur-md">
            <span className="text-indigo-400 text-xs font-bold uppercase tracking-widest">Premium House Rental</span>
          </div>
          <h1 className="text-4xl md:text-6xl font-black text-white mb-4 tracking-tighter leading-tight drop-shadow-2xl">
             <span className="block mb-1 overflow-hidden">
                <span className="inline-block animate-slide-up">Discover Your</span>
             </span>
             <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-300 via-indigo-500 to-indigo-200 drop-shadow-sm italic font-serif py-1">
                Perfect Sanctuary
             </span>
          </h1>
          <p className="text-md md:text-xl text-slate-300 max-w-xl mx-auto font-light tracking-wide drop-shadow-md">
            Where luxury meets comfort in every square foot.
          </p>
        </div>
      </div>

      {/* Top Filter Bar */}
      <div className="container mx-auto px-4 -mt-10 mb-12 relative z-20">
        <div className="bg-slate-900/90 backdrop-blur-xl border border-slate-800 p-4 rounded-2xl shadow-2xl flex flex-wrap items-center gap-4">
          {/* Search */}
          <div className="flex-1 min-w-[200px] relative">
            <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" />
            <input 
              type="text"
              name="search"
              value={filters.search}
              onChange={handleFilterChange}
              placeholder="Search location or type..."
              className="w-full bg-slate-800/50 border border-slate-700 rounded-xl py-3 pl-12 pr-4 text-white focus:ring-2 focus:ring-indigo-500 outline-none transition-all placeholder:text-slate-600"
            />
          </div>

          {/* Type */}
          <div className="w-full md:w-auto min-w-[150px]">
            <select 
              name="type"
              value={filters.type}
              onChange={handleFilterChange}
              className="w-full bg-slate-800/50 border border-slate-700 rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
            >
              <option value="">All Types</option>
              {houseTypes.map(type => (
                <option key={type} value={type}>{type}</option>
              ))}
            </select>
          </div>

          {/* Price Range */}
          <div className="flex items-center gap-2">
            <div className="relative w-28">
              <FaDollarSign className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 text-xs" />
              <input 
                type="number"
                name="minPrice"
                placeholder="Min"
                value={filters.minPrice}
                onChange={handleFilterChange}
                className="w-full bg-slate-800/50 border border-slate-700 rounded-xl pl-8 pr-3 py-3 text-white text-sm focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
              />
            </div>
            <span className="text-slate-600">-</span>
            <div className="relative w-28">
              <FaDollarSign className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 text-xs" />
              <input 
                type="number"
                name="maxPrice"
                placeholder="Max"
                value={filters.maxPrice}
                onChange={handleFilterChange}
                className="w-full bg-slate-800/50 border border-slate-700 rounded-xl pl-8 pr-3 py-3 text-white text-sm focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
              />
            </div>
          </div>

          <button 
            onClick={() => { setFilters({ search: '', minPrice: '', maxPrice: '', type: '' }); setCurrentPage(1); }}
            className="px-6 py-3 text-sm text-slate-400 hover:text-white transition-colors border border-slate-800 rounded-xl hover:bg-slate-800 md:ml-auto"
          >
            Reset
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-2xl font-bold text-white">
              Available Houses <span className="text-slate-500 font-normal text-lg ml-2">({totalHouses})</span>
          </h2>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3, 4, 5, 6].map(i => (
              <div key={i} className="h-[400px] bg-slate-900 border border-slate-800 rounded-2xl animate-pulse"></div>
            ))}
          </div>
        ) : houses.length > 0 ? (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {houses.map((house, index) => (
                <div 
                  key={house._id} 
                  className="group bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden hover:border-indigo-500/50 transition-all duration-300 hover:shadow-2xl hover:shadow-indigo-500/10"
                >
                  <div className="relative h-60 overflow-hidden">
                    <img 
                        src={`https://images.unsplash.com/photo-${houseImages[index % houseImages.length]}?auto=format&fit=crop&w=600&q=70`} 
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                        alt={house.address}
                        onError={(e) => { 
                          e.target.onerror = null; 
                          e.target.src = "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=600&q=70";
                        }}
                    />
                    <div className="absolute top-4 right-4 bg-indigo-600 text-white px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider backdrop-blur-md bg-opacity-80">
                      {house.houseType}
                    </div>
                    <div className="absolute bottom-4 left-4 bg-slate-900/90 backdrop-blur-md px-4 py-2 rounded-xl border border-slate-700">
                        <span className="text-2xl font-bold text-white">${house.price}</span>
                        <span className="text-slate-400 text-sm ml-1">/ month</span>
                    </div>
                  </div>

                  <div className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-start gap-2">
                        <FaMapMarkerAlt className="text-indigo-500 mt-1" />
                        <div>
                           <h3 className="text-xl font-bold text-white group-hover:text-indigo-400 transition-colors line-clamp-1">{house.address}</h3>
                           <p className="text-slate-500 text-sm">Near City Center, Apartment</p>
                        </div>
                      </div>
                    </div>

                    <div className="flex gap-6 mb-8 py-4 border-y border-slate-800/50">
                        <div className="flex items-center gap-2 text-slate-400">
                           <FaBed className="text-indigo-500/70" />
                           <span className="text-sm font-medium">{house.numberOfRooms} Rooms</span>
                        </div>
                        <div className="flex items-center gap-2 text-slate-400">
                           <FaHome className="text-indigo-500/70" />
                           <span className="text-sm font-medium">{house.status}</span>
                        </div>
                    </div>

                    <button 
                      onClick={() => handleRent(house)}
                      className="w-full py-4 bg-slate-800 hover:bg-indigo-600 text-white font-bold rounded-xl transition-all duration-300 group-hover:bg-indigo-600 shadow-lg"
                    >
                      Rent This House
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Pagination Controls */}
            {totalPages > 1 && (
              <div className="mt-12 flex justify-center items-center gap-2">
                <button 
                  onClick={() => paginate(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="px-4 py-2 bg-slate-900 border border-slate-800 rounded-xl text-slate-400 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                >
                  Previous
                </button>
                
                {[...Array(totalPages)].map((_, i) => (
                  <button
                    key={i + 1}
                    onClick={() => paginate(i + 1)}
                    className={`w-10 h-10 rounded-xl font-bold flex items-center justify-center transition-all ${
                      currentPage === i + 1 
                        ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/30' 
                        : 'bg-slate-900 border border-slate-800 text-slate-400 hover:text-white hover:bg-slate-800'
                    }`}
                  >
                    {i + 1}
                  </button>
                ))}

                <button 
                  onClick={() => paginate(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className="px-4 py-2 bg-slate-900 border border-slate-800 rounded-xl text-slate-400 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                >
                  Next
                </button>
              </div>
            )}
          </>
        ) : (
          <div className="text-center py-20 bg-slate-900 rounded-2xl border border-slate-800 border-dashed">
              <FaHome className="text-6xl text-slate-800 mx-auto mb-4" />
              <h3 className="text-2xl font-bold text-white mb-2">No matching houses</h3>
              <p className="text-slate-500">Try adjusting your filters or search term.</p>
              <button 
                  onClick={() => { setFilters({ search: '', minPrice: '', maxPrice: '', type: '' }); setCurrentPage(1); }}
                  className="mt-6 text-indigo-500 font-bold hover:underline"
              >
                  Clear all filters
              </button>
          </div>
        )}
      </div>

      {/* Footer */}
      <footer className="mt-20 border-t border-slate-800 bg-slate-900/50 pt-16 pb-8">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
            {/* Brand Column */}
            <div className="space-y-6">
              <div className="flex items-center gap-2 group cursor-pointer" onClick={() => navigate('/rent')}>
                 <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center text-white">
                    <FaHome className="text-xl" />
                 </div>
                 <span className="text-xl font-black text-white tracking-tight">HOUSE<span className="text-indigo-500">RENT</span></span>
              </div>
              <p className="text-slate-400 text-sm leading-relaxed">
                Elevating the house rental experience with premium properties and seamless technology. Your dream home is just a click away.
              </p>
            </div>

            {/* Quick Links */}
            <div>
              <h4 className="text-white font-bold mb-6">Quick Links</h4>
              <ul className="space-y-4 text-sm text-slate-400">
                <li><button onClick={() => navigate('/rent')} className="hover:text-indigo-400 transition-colors">Browse Houses</button></li>
                <li><button onClick={() => navigate('/customer-auth')} className="hover:text-indigo-400 transition-colors">Customer Login</button></li>
                <li><button onClick={() => navigate('/login')} className="hover:text-indigo-400 transition-colors">Owner Console</button></li>
                <li><a href="#" className="hover:text-indigo-400 transition-colors">How it Works</a></li>
              </ul>
            </div>

            {/* Support */}
            <div>
              <h4 className="text-white font-bold mb-6">Support</h4>
              <ul className="space-y-4 text-sm text-slate-400">
                <li><a href="#" className="hover:text-indigo-400 transition-colors">Help Center</a></li>
                <li><a href="#" className="hover:text-indigo-400 transition-colors">Terms of Service</a></li>
                <li><a href="#" className="hover:text-indigo-400 transition-colors">Privacy Policy</a></li>
                <li><a href="#" className="hover:text-indigo-400 transition-colors">Contact Us</a></li>
              </ul>
            </div>

            {/* Newsletter */}
            <div>
              <h4 className="text-white font-bold mb-6">Stay Updated</h4>
              <p className="text-slate-400 text-sm mb-4">Subscribe to get the latest listings.</p>
              <div className="relative">
                <input 
                  type="email" 
                  placeholder="Email address"
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl py-3 px-4 text-sm text-white focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                />
                <button className="absolute right-2 top-1.5 bg-indigo-600 hover:bg-indigo-500 text-white px-4 py-1.5 rounded-lg text-xs font-bold transition-all">
                  Join
                </button>
              </div>
            </div>
          </div>

          <div className="pt-8 border-t border-slate-800/50 flex flex-col md:flex-row justify-between items-center gap-4 text-slate-500 text-xs tracking-widest uppercase">
            <div className="flex flex-col items-center md:items-start gap-1">
              <p>© 2026 HouseRent Platform. All Rights Reserved.</p>
              <p className="normal-case tracking-normal text-slate-400">
                Developed by <span className="text-indigo-400 font-bold">Eng Sadak Mohamed Ali</span>
              </p>
            </div>
            <div className="flex flex-col items-center md:items-end gap-3 normal-case tracking-normal">
              <div className="flex gap-4 items-center text-slate-400 text-sm">
                <a href="mailto:sadakmohamed.dev@gmail.com" className="flex items-center gap-1 hover:text-indigo-400 transition-colors">
                  <FaEnvelope className="text-indigo-500" /> sadakmohamed.dev@gmail.com
                </a>
                <span className="text-slate-700 hidden md:inline">|</span>
                <a href="tel:016945202" className="flex items-center gap-1 hover:text-indigo-400 transition-colors">
                  <FaPhone className="text-indigo-500" /> 016945202
                </a>
              </div>
              <div className="flex gap-6 text-xl">
                 <a href="https://www.facebook.com/share/178fzLN3og/" target="_blank" rel="noopener noreferrer" className="text-slate-400 hover:text-[#1877F2] transition-colors">
                    <FaFacebook />
                 </a>
                 <a href="https://github.com/Saadaqmacalin" target="_blank" rel="noopener noreferrer" className="text-slate-400 hover:text-white transition-colors">
                    <FaGithub />
                 </a>
              </div>
            </div>
          </div>
        </div>
      </footer>

      {/* Booking Modal */}
      {showBookingModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
          <div className="bg-slate-900 border border-slate-800 w-full max-w-md rounded-3xl overflow-hidden shadow-2xl animate-in fade-in zoom-in duration-300">
            <div className="p-8">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-2xl font-bold text-white">Rent House</h3>
                <button 
                  onClick={() => setShowBookingModal(false)}
                  className="text-slate-500 hover:text-white transition-colors"
                >
                  ✕
                </button>
              </div>

              <div className="mb-6 p-4 bg-slate-800/50 rounded-2xl border border-slate-700/50">
                <p className="text-indigo-400 text-xs font-bold uppercase tracking-widest mb-1">Selected Property</p>
                <p className="text-white font-bold truncate">{selectedHouse?.address}</p>
                <p className="text-slate-400 text-sm">${selectedHouse?.price} / month</p>
              </div>

              <form onSubmit={handleConfirmRent} className="space-y-4">
                <div>
                  <label className="block text-slate-400 text-sm font-medium mb-1.5 ml-1">Start Date</label>
                  <input 
                    type="date"
                    required
                    min={new Date().toISOString().split('T')[0]}
                    value={bookingData.startDate}
                    onChange={(e) => setBookingData({...bookingData, startDate: e.target.value})}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                  />
                </div>

                <div className="p-4 bg-indigo-500/10 border border-indigo-500/20 rounded-2xl">
                  <p className="text-indigo-400 text-xs font-bold uppercase tracking-widest mb-1">Flexible Lease</p>
                  <p className="text-slate-300 text-[11px] leading-relaxed">
                    Your lease is flexible. You only need to provide a start date. You can choose to end your rental period anytime through the platform.
                  </p>
                </div>

                <div className="pt-4">
                  <button 
                    type="submit"
                    disabled={isBooking}
                    className="w-full py-4 bg-indigo-600 hover:bg-indigo-500 disabled:bg-indigo-600/50 text-white font-bold rounded-xl transition-all shadow-lg shadow-indigo-600/20 flex items-center justify-center gap-2"
                  >
                    {isBooking ? (
                      <>
                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                        Processing...
                      </>
                    ) : 'Confirm Rental Request'}
                  </button>
                  <p className="text-center text-[11px] text-slate-500 mt-4 leading-relaxed">
                    By confirming, you agree to our terms of service and the landlord's rental policy.
                  </p>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default RentHouse;
