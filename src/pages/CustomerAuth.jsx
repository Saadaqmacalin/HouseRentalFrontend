import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, useLocation } from 'react-router-dom';
import { FaUser, FaEnvelope, FaLock, FaArrowRight, FaHome } from 'react-icons/fa';

const CustomerAuth = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  const { loginCustomer, registerCustomer } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const returnTo = location.state?.returnTo || '/rent';

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    if (!isLogin && formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      setLoading(false);
      return;
    }

    const result = isLogin 
      ? await loginCustomer(formData.email, formData.password)
      : await registerCustomer({ name: formData.name, email: formData.email, password: formData.password });

    if (result.success) {
      navigate(returnTo);
    } else {
      setError(result.message);
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-4">
      {/* Branding / Home Link */}
      <button 
        onClick={() => navigate('/rent')}
        className="mb-8 flex items-center gap-2 text-slate-400 hover:text-white transition-colors group"
      >
        <FaHome className="group-hover:-translate-x-1 transition-transform" /> 
        <span>Back to House Browser</span>
      </button>

      <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-2xl">
        {/* Toggle Header */}
        <div className="flex border-b border-slate-800">
          <button 
            onClick={() => setIsLogin(true)}
            className={`flex-1 py-6 text-sm font-bold uppercase tracking-wider transition-all ${isLogin ? 'text-indigo-500 bg-slate-900' : 'text-slate-500 bg-slate-950/50 hover:bg-slate-900/50'}`}
          >
            Login
          </button>
          <button 
            onClick={() => setIsLogin(false)}
            className={`flex-1 py-6 text-sm font-bold uppercase tracking-wider transition-all ${!isLogin ? 'text-indigo-500 bg-slate-900' : 'text-slate-500 bg-slate-950/50 hover:bg-slate-900/50'}`}
          >
            Register
          </button>
        </div>

        <div className="p-8 md:p-10">
          <div className="mb-8 text-center">
            <h2 className="text-3xl font-extrabold text-white mb-2">
              {isLogin ? 'Welcome Back' : 'Create Account'}
            </h2>
            <p className="text-slate-400">
               {isLogin ? 'Enter your details to access your account' : 'Join us to start renting your next home'}
            </p>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 text-red-500 rounded-xl text-center text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            {!isLogin && (
              <div className="relative">
                <FaUser className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" />
                <input 
                  type="text"
                  name="name"
                  placeholder="Full Name"
                  required
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl py-4 pl-12 pr-4 text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all placeholder:text-slate-600"
                />
              </div>
            )}

            <div className="relative">
              <FaEnvelope className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" />
              <input 
                type="email"
                name="email"
                placeholder="Email Address"
                required
                value={formData.email}
                onChange={handleChange}
                className="w-full bg-slate-800 border border-slate-700 rounded-xl py-4 pl-12 pr-4 text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all placeholder:text-slate-600"
              />
            </div>

            <div className="relative">
              <FaLock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" />
              <input 
                type="password"
                name="password"
                placeholder="Password"
                required
                value={formData.password}
                onChange={handleChange}
                className="w-full bg-slate-800 border border-slate-700 rounded-xl py-4 pl-12 pr-4 text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all placeholder:text-slate-600"
              />
            </div>

            {!isLogin && (
              <div className="relative">
                <FaLock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" />
                <input 
                  type="password"
                  name="confirmPassword"
                  placeholder="Confirm Password"
                  required
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl py-4 pl-12 pr-4 text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all placeholder:text-slate-600"
                />
              </div>
            )}

            <button 
              type="submit"
              disabled={loading}
              className="w-full py-4 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-xl transition-all shadow-lg shadow-indigo-600/20 flex items-center justify-center gap-2 group disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
              ) : (
                <>
                   {isLogin ? 'Sign In' : 'Create Account'}
                   <FaArrowRight className="group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </button>
          </form>

          <div className="mt-8 pt-8 border-t border-slate-800 text-center">
            <p className="text-slate-500 text-sm">
                {isLogin ? "Don't have an account?" : "Already have an account?"}
                <button 
                  onClick={() => { setIsLogin(!isLogin); setError(''); }}
                  className="ml-2 text-indigo-500 font-bold hover:underline"
                >
                  {isLogin ? 'Register Now' : 'Login here'}
                </button>
            </p>
          </div>
        </div>
      </div>

      {/* Footer Info */}
      <p className="mt-12 text-slate-600 text-xs uppercase tracking-widest">
        Secure Access • House Rental Platform 2026
      </p>
    </div>
  );
};

export default CustomerAuth;
