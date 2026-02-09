import { useEffect, useState } from 'react';
import api from '../services/api';

const Payments = () => {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPayments = async () => {
      try {
        const { data } = await api.get('/payments'); 
        setPayments(data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchPayments();
  }, []);

  if (loading) return <div className="text-center text-slate-400 py-10">Loading...</div>;

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-white">Payments</h1>
       <div className="bg-slate-800 rounded-lg shadow-lg overflow-hidden">
         <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-700 text-slate-300">
                <th className="p-4">Ref</th>
                <th className="p-4">Customer</th>
                <th className="p-4">Amount</th>
                <th className="p-4">Method</th>
                <th className="p-4">Date</th>
                <th className="p-4">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-700">
              {payments.map((p) => (
                <tr key={p._id} className="text-slate-300 hover:bg-slate-700/50">
                  <td className="p-4 font-mono text-xs text-slate-400">{p._id.substring(0, 8)}...</td>
                  <td className="p-4">{p.customer?.name || 'Unknown'}</td>
                  <td className="p-4 font-bold text-white">${p.amount}</td>
                  <td className="p-4 capitalize">{p.paymentMethod}</td>
                  <td className="p-4">{new Date(p.paymentDate).toLocaleDateString()}</td>
                  <td className="p-4">
                     <span className={`px-2 py-1 rounded text-xs font-semibold ${
                      p.paymentStatus === 'paid' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-red-500/20 text-red-400'
                    }`}>
                      {p.paymentStatus.toUpperCase()}
                    </span>
                  </td>
                </tr>
              ))}
               {payments.length === 0 && (
                <tr>
                   <td colSpan="6" className="p-8 text-center text-slate-500">No payments found.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Payments;
