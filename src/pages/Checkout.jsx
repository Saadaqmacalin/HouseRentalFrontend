import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import api from '../services/api';
import { 
  CreditCard, 
  Banknote, 
  ArrowRight, 
  ShieldCheck, 
  ArrowLeft,
  Home,
  CheckCircle2,
  DollarSign
} from 'lucide-react';

const Checkout = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { bookingId, amount, address } = location.state || {};

  const [method, setMethod] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  if (!bookingId) {
    return (
      <div className="min-h-screen bg-[#0a0a0c] flex items-center justify-center p-6">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-white mb-4">No Session Found</h2>
          <button 
            onClick={() => navigate('/rent')}
            className="bg-indigo-600 text-white px-8 py-3 rounded-2xl font-bold"
          >
            Back to Houses
          </button>
        </div>
      </div>
    );
  }

  const handlePayment = async () => {
    if (!method) return;
    
    setLoading(true);
    try {
      await api.post('/payments', {
        bookingId,
        amount,
        paymentMethod: method
      });
      setSuccess(true);
      setTimeout(() => {
        navigate('/my-rentals');
      }, 3000);
    } catch (error) {
      console.error('Payment error:', error);
      alert('Payment failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen bg-[#0a0a0c] flex items-center justify-center p-6">
        <div className="max-w-md w-full text-center space-y-8 animate-in fade-in zoom-in duration-500">
           <div className="w-24 h-24 bg-emerald-500/20 rounded-full flex items-center justify-center mx-auto border-4 border-emerald-500/30">
              <CheckCircle2 className="text-emerald-500" size={48} />
           </div>
           <div>
              <h2 className="text-4xl font-black text-white mb-4">Payment Success!</h2>
              <p className="text-slate-400">Your booking for <span className="text-white font-bold">{address}</span> has been confirmed. Redirecting you to your rentals...</p>
           </div>
           <div className="pt-8">
              <div className="h-1 w-full bg-white/5 rounded-full overflow-hidden">
                <div className="h-full bg-emerald-500 animate-[progress_3s_ease-in-out]"></div>
              </div>
           </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0a0a0c] text-white font-sans selection:bg-indigo-500/30">
      <header className="container mx-auto px-6 h-20 flex items-center justify-between border-b border-white/5">
        <button 
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors group"
        >
          <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
          <span className="text-sm font-bold">Back</span>
        </button>
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center">
            <Home size={16} />
          </div>
          <span className="font-black text-sm tracking-tighter">SECURE CHECKOUT</span>
        </div>
        <div className="w-10"></div> {/* Spacer */}
      </header>

      <main className="container mx-auto px-6 py-12">
        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* Left: Summary */}
          <div className="lg:col-span-7 space-y-8">
             <section>
                <h1 className="text-4xl font-black tracking-tight mb-4">Complete your booking.</h1>
                <p className="text-slate-400 max-w-lg">Finalize your house rental by selecting a payment method. Your lease starts as soon as the payment is processed.</p>
             </section>

             <div className="bg-white/5 border border-white/5 rounded-[32px] overflow-hidden">
                <div className="p-8">
                   <h2 className="text-sm font-bold uppercase tracking-widest text-indigo-400 mb-8">Selected Property</h2>
                   <div className="flex gap-6">
                      <div className="w-32 h-32 rounded-2xl bg-white/5 flex items-center justify-center border border-white/10 shrink-0">
                         <Home size={40} className="text-slate-700" />
                      </div>
                      <div className="space-y-3">
                         <p className="text-xl font-bold">{address}</p>
                         <div className="flex items-center gap-4 text-sm text-slate-400">
                            <span className="flex items-center gap-1.5 bg-white/5 px-3 py-1 rounded-full border border-white/5">
                               <ShieldCheck size={14} className="text-emerald-500" /> Secure Lease
                            </span>
                            <span className="flex items-center gap-1.5 bg-white/5 px-3 py-1 rounded-full border border-white/5">
                               <CheckCircle2 size={14} className="text-indigo-500" /> Verified 2026
                            </span>
                         </div>
                      </div>
                   </div>
                </div>
                <div className="bg-white/5 px-8 py-6 flex flex-wrap gap-8 border-t border-white/5">
                   <div className="space-y-1">
                      <p className="text-[10px] uppercase font-bold tracking-widest text-slate-500">Lease Amount</p>
                      <p className="text-xl font-black text-white">${amount} <span className="text-slate-500 text-xs font-normal">/ month</span></p>
                   </div>
                </div>
             </div>
          </div>

          {/* Right: Payment */}
          <div className="lg:col-span-5">
             <div className="bg-white/5 border border-white/5 rounded-[32px] p-8 sticky top-32">
                <h2 className="text-xl font-bold mb-8">Choose Payment Method</h2>
                
                <div className="space-y-4 mb-8">
                   {[
                     { id: 'card', label: 'Credit / Debit Card', icon: CreditCard, color: 'text-indigo-400' },
                     { id: 'cash', label: 'Cash Payment', icon: Banknote, color: 'text-emerald-400' },
                     { id: 'transfer', label: 'Bank Transfer', icon: ArrowRight, color: 'text-purple-400' }
                   ].map((item) => (
                     <label 
                       key={item.id}
                       className={`flex items-center justify-between p-6 rounded-2xl border transition-all cursor-pointer ${
                         method === item.id 
                           ? 'bg-indigo-600/10 border-indigo-600 ring-1 ring-indigo-600/20' 
                           : 'bg-white/5 border-white/5 hover:border-white/10'
                       }`}
                     >
                       <div className="flex items-center gap-4">
                         <div className={`p-2 rounded-lg bg-white/5 ${item.color}`}>
                           <item.icon size={20} />
                         </div>
                         <span className="font-bold">{item.label}</span>
                       </div>
                       <input 
                         type="radio" 
                         name="payment" 
                         className="hidden" 
                         onChange={() => setMethod(item.id)}
                       />
                       <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${
                         method === item.id ? 'border-indigo-600 bg-indigo-600' : 'border-white/10'
                       }`}>
                         {method === item.id && <div className="w-2 h-2 bg-white rounded-full"></div>}
                       </div>
                     </label>
                   ))}
                </div>

                <div className="space-y-6 pt-6 border-t border-white/5 mr-4">
                   <div className="flex justify-between items-center px-2">
                      <span className="text-slate-400 font-medium">Total due today</span>
                      <span className="text-2xl font-black text-white">${amount}</span>
                   </div>

                   <button
                     onClick={handlePayment}
                     disabled={loading || !method}
                     className="w-full bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 disabled:grayscale py-5 rounded-2xl font-bold text-lg flex items-center justify-center gap-3 shadow-xl shadow-indigo-600/20 transition-all hover:scale-[1.02] active:scale-[0.98]"
                   >
                     {loading ? (
                        <div className="animate-spin rounded-full h-6 w-6 border-t-2 border-white"></div>
                     ) : (
                       <>
                         Pay Securely Now <DollarSign size={20} />
                       </>
                     )}
                   </button>

                   <div className="flex items-center justify-center gap-2 text-[10px] text-slate-500 uppercase tracking-widest font-bold">
                      <ShieldCheck size={12} className="text-indigo-500" /> SSL SECURED • 256-BIT ENCRYPTION
                   </div>
                </div>
             </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Checkout;
