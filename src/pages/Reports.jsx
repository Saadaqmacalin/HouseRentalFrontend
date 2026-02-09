import { useState, useEffect } from 'react';
import api from '../services/api';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  LineChart, Line, AreaChart, Area, Cell, PieChart, Pie
} from 'recharts';
import { FaHome, FaBook, FaUsers, FaDollarSign, FaFileExport, FaArrowUp, FaCalendarAlt } from 'react-icons/fa';

const Reports = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  // Mock data for charts since backend is simple aggregates
  const monthlyData = [
    { name: 'Jan', revenue: 4000, bookings: 24 },
    { name: 'Feb', revenue: 3000, bookings: 13 },
    { name: 'Mar', revenue: 2000, bookings: 98 },
    { name: 'Apr', revenue: 2780, bookings: 39 },
    { name: 'May', revenue: 1890, bookings: 48 },
    { name: 'Jun', revenue: 2390, bookings: 38 },
    { name: 'Jul', revenue: 3490, bookings: 43 },
  ];

  const propertyTypeData = [
    { name: 'Apartment', value: 40 },
    { name: 'Villa', value: 30 },
    { name: 'Townhouse', value: 20 },
    { name: 'Studio', value: 10 },
  ];

  const COLORS = ['#6366f1', '#818cf8', '#a5b4fc', '#c7d2fe'];

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const { data } = await api.get('/reports/dashboard');
        setStats(data);
      } catch (error) {
        console.error('Error fetching stats:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  const exportCSV = () => {
    if (!stats) return;
    const headers = ['Metric', 'Value'];
    const rows = [
      ['Total Houses', stats.totalHouses],
      ['Total Bookings', stats.totalBookings],
      ['Total Customers', stats.totalCustomers],
      ['Total Revenue', `$${stats.totalRevenue}`],
    ];
    
    let csvContent = "data:text/csv;charset=utf-8," 
      + headers.join(",") + "\n"
      + rows.map(e => e.join(",")).join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "rental_report_2026.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (loading) return (
    <div className="p-8 flex items-center justify-center min-h-[400px]">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
    </div>
  );

  return (
    <div className="p-4 md:p-8 bg-slate-950 min-h-screen">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-4">
        <div>
          <h1 className="text-3xl font-black text-white tracking-tight flex items-center gap-3">
             <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-600/30">
                <FaFileExport className="text-sm" />
             </div>
             Reports & Analytics
          </h1>
          <p className="text-slate-500 mt-1 font-medium">Detailed overview of your property rental performance</p>
        </div>
        <button 
          onClick={exportCSV}
          className="flex items-center gap-2 bg-slate-900 border border-slate-800 text-slate-300 hover:text-white px-6 py-3 rounded-xl font-bold transition-all hover:bg-slate-800 active:scale-95 shadow-xl"
        >
          <FaFileExport className="text-indigo-500" />
          Export CSV
        </button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
        <StatCard 
          title="Total Houses" 
          value={stats?.totalHouses} 
          icon={<FaHome />} 
          color="bg-blue-500" 
          trend="+5.2%"
        />
        <StatCard 
          title="Total Bookings" 
          value={stats?.totalBookings} 
          icon={<FaBook />} 
          color="bg-indigo-500" 
          trend="+12.4%"
        />
        <StatCard 
          title="Total Customers" 
          value={stats?.totalCustomers} 
          icon={<FaUsers />} 
          color="bg-purple-500" 
          trend="+8.1%"
        />
        <StatCard 
          title="Total Revenue" 
          value={`$${stats?.totalRevenue?.toLocaleString()}`} 
          icon={<FaDollarSign />} 
          color="bg-emerald-500" 
          trend="+18.7%"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-10">
        {/* Main Revenue Chart */}
        <div className="lg:col-span-2 bg-slate-900/50 backdrop-blur-xl border border-slate-800 p-8 rounded-3xl shadow-2xl">
          <div className="flex justify-between items-center mb-8">
            <h3 className="text-xl font-bold text-white uppercase tracking-wider text-sm flex items-center gap-2">
              <span className="w-2 h-2 bg-indigo-500 rounded-full animate-pulse"></span>
              Revenue Growth
            </h3>
            <div className="flex gap-2">
               <span className="px-3 py-1 bg-indigo-500/10 text-indigo-400 text-[10px] font-black rounded-lg uppercase">Monthly Analysis</span>
            </div>
          </div>
          <div className="h-[350px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={monthlyData}>
                <defs>
                  <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
                <XAxis dataKey="name" stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `$${value}`} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #1e293b', borderRadius: '12px', fontSize: '12px' }}
                  itemStyle={{ color: '#fff' }}
                />
                <Area type="monotone" dataKey="revenue" stroke="#6366f1" strokeWidth={3} fillOpacity={1} fill="url(#colorRev)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Property Type Mix */}
        <div className="bg-slate-900/50 backdrop-blur-xl border border-slate-800 p-8 rounded-3xl shadow-2xl">
          <h3 className="text-xl font-bold text-white uppercase tracking-wider text-sm mb-8 flex items-center gap-2">
             <span className="w-2 h-2 bg-purple-500 rounded-full"></span>
             Property Mix
          </h3>
          <div className="h-[250px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={propertyTypeData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {propertyTypeData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-6 space-y-3">
             {propertyTypeData.map((item, i) => (
               <div key={item.name} className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2 text-slate-400">
                    <div className="w-2 h-2 rounded-full" style={{ backgroundColor: COLORS[i] }}></div>
                    {item.name}
                  </div>
                  <span className="text-white font-bold">{item.value}%</span>
               </div>
             ))}
          </div>
        </div>
      </div>

      {/* Recent Activity Section */}
      <div className="bg-slate-900/90 backdrop-blur-xl border border-slate-800 rounded-3xl overflow-hidden shadow-2xl">
        <div className="p-8 border-b border-slate-800 flex justify-between items-center">
            <h3 className="text-xl font-bold text-white">Recent Activity</h3>
            <span className="text-xs font-bold text-slate-500 uppercase tracking-widest">Live Updates</span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-950/50">
                <th className="px-8 py-4 text-xs font-black text-slate-500 uppercase tracking-widest">User Booked</th>
                <th className="px-8 py-4 text-xs font-black text-slate-500 uppercase tracking-widest">House Address</th>
                <th className="px-8 py-4 text-xs font-black text-slate-500 uppercase tracking-widest">Type</th>
                <th className="px-8 py-4 text-xs font-black text-slate-500 uppercase tracking-widest">Price</th>
                <th className="px-8 py-4 text-xs font-black text-slate-500 uppercase tracking-widest">Date Booked</th>
                <th className="px-8 py-4 text-xs font-black text-slate-500 uppercase tracking-widest">Rental Start</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {stats?.recentBookings.map((booking) => (
                <tr key={booking._id} className="hover:bg-indigo-500/5 transition-colors group">
                  <td className="px-8 py-5">
                    <div className="flex items-center gap-3">
                       <div className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center border border-slate-700 text-[10px] font-bold text-indigo-400">
                          {booking.customer?.name?.[0]}
                       </div>
                       <div>
                         <p className="text-sm font-bold text-white">{booking.customer?.name}</p>
                         <p className="text-[10px] text-slate-500">{booking.customer?.email}</p>
                       </div>
                    </div>
                  </td>
                  <td className="px-8 py-5">
                    <div className="flex items-center gap-2">
                       <FaHome className="text-indigo-500 text-xs" />
                       <span className="text-sm font-medium text-slate-300">{booking.house?.address}</span>
                    </div>
                  </td>
                  <td className="px-8 py-5">
                    <span className="px-3 py-1 bg-indigo-500/10 text-indigo-400 text-[10px] font-black rounded-lg uppercase">
                       {booking.house?.houseType}
                    </span>
                  </td>
                  <td className="px-8 py-5">
                    <span className="text-sm font-bold text-white">${booking.house?.price?.toLocaleString()}</span>
                  </td>
                  <td className="px-8 py-5">
                    <div className="flex items-center gap-2 text-slate-400 text-sm">
                       <FaCalendarAlt className="text-[10px]" />
                       {new Date(booking.bookingDate).toLocaleDateString()}
                    </div>
                  </td>
                  <td className="px-8 py-5">
                    <div className="flex items-center gap-2 text-emerald-400 text-sm font-bold">
                       <FaCalendarAlt className="text-[10px]" />
                       {new Date(booking.startDate).toLocaleDateString()}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

const StatCard = ({ title, value, icon, color, trend }) => (
  <div className="bg-slate-950 border border-slate-800 p-6 rounded-3xl shadow-xl hover:border-indigo-500/50 transition-all duration-300 group">
    <div className="flex justify-between items-start mb-4">
      <div className={`w-12 h-12 ${color} bg-opacity-10 rounded-2xl flex items-center justify-center text-xl shadow-inner`}>
        <div className={`${color.replace('bg-', 'text-')}`}>
           {icon}
        </div>
      </div>
      <div className="flex items-center gap-1 text-emerald-400 text-xs font-bold bg-emerald-400/10 px-2 py-1 rounded-lg">
         <FaArrowUp className="text-[10px]" />
         {trend}
      </div>
    </div>
    <p className="text-slate-500 text-xs font-bold uppercase tracking-widest mb-1">{title}</p>
    <h3 className="text-3xl font-black text-white tracking-tighter group-hover:text-indigo-400 transition-colors">
      {value}
    </h3>
  </div>
);

export default Reports;
