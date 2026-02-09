import { useEffect, useState } from 'react';
import api from '../services/api';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import {
  FaHome,
  FaCalendarCheck,
  FaUsers,
  FaMoneyBillWave,
} from 'react-icons/fa';

const Dashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const { data } = await api.get('/reports/dashboard');
        setStats(data);
      } catch (error) {
        console.error('Error fetching dashboard stats:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (loading)
    return <div className="text-center text-gray-400 py-10">Loading...</div>;

  if (!stats)
    return <div className="text-center text-red-400 py-10">Failed to load data</div>;

  const cards = [
    {
      title: 'Total Houses',
      value: stats.totalHouses,
      icon: <FaHome />,
      bg: 'bg-indigo-500/10',
      text: 'text-indigo-500',
    },
    {
      title: 'Total Bookings',
      value: stats.totalBookings,
      icon: <FaCalendarCheck />,
      bg: 'bg-amber-500/10',
      text: 'text-amber-500',
    },
    {
      title: 'Total Customers',
      value: stats.totalCustomers,
      icon: <FaUsers />,
      bg: 'bg-emerald-500/10',
      text: 'text-emerald-500',
    },
    {
      title: 'Total Revenue',
      value: `$${stats.totalRevenue?.toLocaleString()}`,
      icon: <FaMoneyBillWave />,
      bg: 'bg-pink-500/10',
      text: 'text-pink-500',
    },
  ];

  const chartData = [
    { name: 'Jan', revenue: 4000 },
    { name: 'Feb', revenue: 3000 },
    { name: 'Mar', revenue: 2000 },
    { name: 'Apr', revenue: 2780 },
    { name: 'May', revenue: 1890 },
    { name: 'Jun', revenue: 2390 },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <h1 className="text-2xl font-semibold text-gray-100">
        Dashboard Overview
      </h1>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {cards.map((card, index) => (
          <div
            key={index}
            className="bg-slate-800 rounded-xl p-6 flex items-center justify-between shadow-lg"
          >
            <div>
              <p className="text-sm text-gray-400">{card.title}</p>
              <p className="text-3xl font-bold text-white mt-1">
                {card.value}
              </p>
            </div>
            <div
              className={`w-12 h-12 rounded-full flex items-center justify-center text-xl ${card.bg} ${card.text}`}
            >
              {card.icon}
            </div>
          </div>
        ))}
      </div>

      {/* Charts + Recent Bookings */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Revenue Chart */}
        <div className="lg:col-span-2 bg-slate-800 rounded-xl p-6 shadow-lg">
          <h2 className="text-lg font-semibold text-white mb-4">
            Revenue Analytics
          </h2>

          <div className="h-[320px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                <XAxis dataKey="name" stroke="#94a3b8" />
                <YAxis stroke="#94a3b8" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#020617',
                    borderColor: '#334155',
                  }}
                  itemStyle={{ color: '#e5e7eb' }}
                />
                <Legend />
                <Bar
                  dataKey="revenue"
                  fill="#6366f1"
                  radius={[6, 6, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Recent Bookings */}
        <div className="bg-slate-800 rounded-xl p-6 shadow-lg">
          <h2 className="text-lg font-semibold text-white mb-4">
            Recent Bookings
          </h2>

          <div className="space-y-4">
            {stats.recentBookings.length === 0 && (
              <p className="text-gray-400 text-sm">No recent bookings</p>
            )}

            {stats.recentBookings.map((booking) => (
              <div
                key={booking._id}
                className="flex items-center gap-4 bg-slate-700/40 p-4 rounded-lg"
              >
                <div className="w-10 h-10 rounded-full bg-emerald-500/20 flex items-center justify-center text-emerald-400">
                  <FaCalendarCheck />
                </div>

                <div>
                  <p className="text-sm font-bold text-white">
                    {booking.customer?.name || 'Unknown'}
                  </p>
                  <p className="text-xs text-gray-400 flex items-center gap-1">
                    {booking.house?.address || 'Unknown House'} 
                    <span className="text-[10px] px-1 bg-indigo-500/20 text-indigo-400 rounded uppercase font-bold">
                       {booking.house?.houseType}
                    </span>
                  </p>
                </div>

                <div className="ml-auto text-right">
                  <p className="text-xs font-bold text-white">${booking.house?.price?.toLocaleString()}</p>
                  <p className="text-[10px] text-gray-400">
                    {new Date(booking.bookingDate).toLocaleDateString()}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
