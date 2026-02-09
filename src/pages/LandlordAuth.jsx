import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { UserCheck, Mail, Lock, Phone, CreditCard, MapPin, Loader2, ArrowLeft } from 'lucide-react';
import axios from 'axios';

const LandlordAuth = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    phoneNumber: '',
    nationalID: '',
    address: ''
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const endpoint = isLogin ? '/api/auth/landlord/login' : '/api/auth/landlord/register';
      const response = await axios.post(endpoint, formData);
      
      localStorage.setItem('landlordToken', response.data.token);
      localStorage.setItem('landlordData', JSON.stringify(response.data));
      
      navigate('/landlord/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Authentication failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md overflow-hidden relative">
        {/* Back Button */}
        <button 
          onClick={() => navigate('/')}
          className="absolute top-6 left-6 p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-full transition-colors"
        >
          <ArrowLeft size={20} />
        </button>

        <div className="p-8">
          <div className="flex flex-col items-center mb-8">
            <div className="bg-purple-100 p-4 rounded-2xl text-purple-600 mb-4">
              <UserCheck size={32} />
            </div>
            <h1 className="text-2xl font-bold text-slate-800">
              {isLogin ? 'Welcome Back, Landlord' : 'Become a Landlord'}
            </h1>
            <p className="text-slate-500 mt-2 text-center">
              {isLogin ? 'Login to manage your properties' : 'Register to start listing your properties'}
            </p>
          </div>

          {error && (
            <div className="bg-red-50 text-red-600 p-3 rounded-xl mb-6 text-sm flex items-center">
              <span className="mr-2">⚠️</span> {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {!isLogin && (
              <div className="relative">
                <input
                  type="text"
                  name="name"
                  placeholder="Full Name"
                  required
                  className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-100 rounded-xl focus:ring-2 focus:ring-purple-500 outline-none transition-all"
                  value={formData.name}
                  onChange={handleChange}
                />
                <UserCheck className="absolute left-4 top-3.5 text-slate-400" size={18} />
              </div>
            )}

            <div className="relative">
              <input
                type="email"
                name="email"
                placeholder="Email Address"
                required
                className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-100 rounded-xl focus:ring-2 focus:ring-purple-500 outline-none transition-all"
                value={formData.email}
                onChange={handleChange}
              />
              <Mail className="absolute left-4 top-3.5 text-slate-400" size={18} />
            </div>

            <div className="relative">
              <input
                type="password"
                name="password"
                placeholder="Password"
                required
                className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-100 rounded-xl focus:ring-2 focus:ring-purple-500 outline-none transition-all"
                value={formData.password}
                onChange={handleChange}
              />
              <Lock className="absolute left-4 top-3.5 text-slate-400" size={18} />
            </div>

            {!isLogin && (
              <>
                <div className="relative">
                  <input
                    type="tel"
                    name="phoneNumber"
                    placeholder="Phone Number"
                    required
                    className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-100 rounded-xl focus:ring-2 focus:ring-purple-500 outline-none transition-all"
                    value={formData.phoneNumber}
                    onChange={handleChange}
                  />
                  <Phone className="absolute left-4 top-3.5 text-slate-400" size={18} />
                </div>

                <div className="relative">
                  <input
                    type="text"
                    name="nationalID"
                    placeholder="National ID Number"
                    required
                    className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-100 rounded-xl focus:ring-2 focus:ring-purple-500 outline-none transition-all"
                    value={formData.nationalID}
                    onChange={handleChange}
                  />
                  <CreditCard className="absolute left-4 top-3.5 text-slate-400" size={18} />
                </div>

                <div className="relative">
                  <input
                    type="text"
                    name="address"
                    placeholder="Primary Address"
                    required
                    className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-100 rounded-xl focus:ring-2 focus:ring-purple-500 outline-none transition-all"
                    value={formData.address}
                    onChange={handleChange}
                  />
                  <MapPin className="absolute left-4 top-3.5 text-slate-400" size={18} />
                </div>
              </>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-purple-600 hover:bg-purple-700 text-white font-bold py-3 rounded-xl shadow-lg hover:shadow-purple-500/20 transition-all flex items-center justify-center disabled:opacity-70"
            >
              {loading ? <Loader2 className="animate-spin" size={20} /> : (isLogin ? 'Sign In' : 'Create Account')}
            </button>
          </form>

          <div className="mt-8 text-center pt-6 border-t border-slate-100">
            <p className="text-slate-600 text-sm">
              {isLogin ? "New to the platform?" : "Already have an account?"}
              <button 
                onClick={() => setIsLogin(!isLogin)}
                className="ml-2 text-purple-600 font-bold hover:underline"
              >
                {isLogin ? 'Register Now' : 'Sign In'}
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LandlordAuth;
