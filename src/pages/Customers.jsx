import { useEffect, useState } from 'react';
import api from '../services/api';

const Customers = () => {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCustomers = async () => {
      try {
        const { data } = await api.get('/customers'); // Need to ensure this route exists or map from users/customers
        setCustomers(data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchCustomers();
  }, []);

  if (loading) return <div className="text-center text-slate-400 py-10">Loading...</div>;

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-white">Customers</h1>
      <div className="bg-slate-800 rounded-lg shadow-lg overflow-hidden">
         <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-700 text-slate-300">
                <th className="p-4">Name</th>
                <th className="p-4">Email</th>
                <th className="p-4">Joined Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-700">
              {customers.map((c) => (
                <tr key={c._id} className="text-slate-300 hover:bg-slate-700/50">
                  <td className="p-4 font-medium text-white">{c.name}</td>
                  <td className="p-4">{c.email}</td>
                  <td className="p-4">{new Date(c.createdAt).toLocaleDateString()}</td>
                </tr>
              ))}
               {customers.length === 0 && (
                <tr>
                   <td colSpan="3" className="p-8 text-center text-slate-500">No customers found.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Customers;
