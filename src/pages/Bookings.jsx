import { useEffect, useState } from 'react';
import api from '../services/api';

const Bookings = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const { data } = await api.get('/bookings');
        setBookings(data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchBookings();
  }, []);

  if (loading) return <div className="text-center text-slate-400 py-10">Loading...</div>;

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-white">Bookings</h1>
      <div className="bg-slate-800 rounded-lg shadow-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-700 text-slate-300">
                <th className="p-4">Reference</th>
                <th className="p-4">Customer</th>
                <th className="p-4">House</th>
                <th className="p-4">Start Date</th>
                <th className="p-4">End Date</th>
                <th className="p-4">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-700">
              {bookings.map((booking) => (
                <tr key={booking._id} className="text-slate-300 hover:bg-slate-700/50">
                  <td className="p-4 font-mono text-xs text-slate-400">{booking._id.substring(0, 8)}...</td>
                  <td className="p-4">{booking.customer?.name || 'Unknown'}</td>
                  <td className="p-4">{booking.house?.address || 'Unknown'}</td>
                  <td className="p-4">{new Date(booking.startDate).toLocaleDateString()}</td>
                  <td className="p-4">{new Date(booking.endDate).toLocaleDateString()}</td>
                  <td className="p-4">
                    <span className={`px-2 py-1 rounded text-xs font-semibold ${
                      booking.bookingStatus === 'approved' ? 'bg-emerald-500/20 text-emerald-400' :
                      booking.bookingStatus === 'cancelled' ? 'bg-red-500/20 text-red-400' :
                      'bg-amber-500/20 text-amber-400'
                    }`}>
                      {booking.bookingStatus.toUpperCase()}
                    </span>
                  </td>
                </tr>
              ))}
              {bookings.length === 0 && (
                <tr>
                   <td colSpan="6" className="p-8 text-center text-slate-500">No bookings found.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Bookings;
