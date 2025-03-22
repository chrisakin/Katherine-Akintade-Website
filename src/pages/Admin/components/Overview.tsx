import { useEffect, useState } from 'react';
import { 
  Users, 
  ShoppingBag, 
  Image as ImageIcon, 
  FileText,  
  ArrowUpRight,
  ArrowDownRight,
  Calendar,
  Filter
} from 'lucide-react';
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  BarChart,
  Bar
} from 'recharts';
import { format, subDays, startOfDay, endOfDay } from 'date-fns';
import { getAnalytics } from '../../../lib/analytics';

interface AnalyticsData {
  activeUsers: number;
  totalSales: number;
  activities: any[];
  salesData: any[];
  userActivityData: any[];
}

interface FilterDates {
  startDate: Date;
  endDate: Date;
}

export default function Overview() {
  const [analyticsData, setAnalyticsData] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [filterDates, setFilterDates] = useState<FilterDates>({
    startDate: subDays(new Date(), 30),
    endDate: new Date()
  });
  const [showFilters, setShowFilters] = useState(false);

  const fetchData = async () => {
    setLoading(true);
    const data = await getAnalytics(
      startOfDay(filterDates.startDate),
      endOfDay(filterDates.endDate)
    );
    if (data) {
      setAnalyticsData({
        ...data,
        activities: data.activities || [],
        salesData: data.salesData || [],
        userActivityData: data.userActivityData || [],
      });
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchData();
  }, [filterDates]);

  // Process sales data for chart
  const processedSalesData = analyticsData?.salesData?.map(sale => ({
    date: format(new Date(sale.created_at), 'MMM dd'),
    amount: sale.amount
  })) || [];

  // Process user activity data for chart
  const processedUserData = analyticsData?.userActivityData?.reduce((acc: any, session: any) => {
    const date = format(new Date(session.created_at), 'EEE');
    acc[date] = (acc[date] || 0) + 1;
    return acc;
  }, {}) || {};

  const userActivityData = Object.entries(processedUserData).map(([day, count]) => ({
    day,
    users: count
  }));

  const stats = [
    {
      title: 'Active Users',
      value: analyticsData?.activeUsers.toString() || '0',
      change: '+12.5%',
      increasing: true,
      icon: Users,
      color: 'bg-blue-500'
    },
    {
      title: 'Total Sales',
      value: `₦${(analyticsData?.totalSales || 0).toLocaleString()}`,
      change: '+23.1%',
      increasing: true,
      icon: ShoppingBag,
      color: 'bg-green-500'
    },
    {
      title: 'Photos Uploaded',
      value: '1,234',
      change: '+18.2%',
      increasing: true,
      icon: ImageIcon,
      color: 'bg-purple-500'
    },
    {
      title: 'Blog Posts',
      value: '45',
      change: '-2.4%',
      increasing: false,
      icon: FileText,
      color: 'bg-orange-500'
    }
  ];

  if (loading) {
    return (
      <div className="animate-pulse space-y-8">
        <div className="h-8 bg-gray-200 rounded w-1/4"></div>
        <div className="grid grid-cols-4 gap-6">
          {[1, 2, 3, 4].map(n => (
            <div key={n} className="h-32 bg-gray-200 rounded"></div>
          ))}
        </div>
        <div className="grid grid-cols-2 gap-8">
          <div className="h-80 bg-gray-200 rounded"></div>
          <div className="h-80 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Dashboard Overview</h1>
        <div className="flex items-center gap-4">
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center gap-2 px-4 py-2 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
          >
            <Filter size={18} />
            Filter
          </button>
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Calendar size={16} />
            <span>
              {format(filterDates.startDate, 'MMM dd, yyyy')} - {format(filterDates.endDate, 'MMM dd, yyyy')}
            </span>
          </div>
        </div>
      </div>

      {showFilters && (
        <div className="bg-white p-6 rounded-xl shadow-sm">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Start Date
              </label>
              <input
                type="date"
                value={format(filterDates.startDate, 'yyyy-MM-dd')}
                onChange={(e) => setFilterDates(prev => ({
                  ...prev,
                  startDate: new Date(e.target.value)
                }))}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none 
                  focus:ring-2 focus:ring-gray-400 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                End Date
              </label>
              <input
                type="date"
                value={format(filterDates.endDate, 'yyyy-MM-dd')}
                onChange={(e) => setFilterDates(prev => ({
                  ...prev,
                  endDate: new Date(e.target.value)
                }))}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none 
                  focus:ring-2 focus:ring-gray-400 focus:border-transparent"
              />
            </div>
          </div>
        </div>
      )}

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <div 
            key={index}
            className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow"
          >
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm text-gray-600 mb-1">{stat.title}</p>
                <h3 className="text-2xl font-bold">{stat.value}</h3>
              </div>
              <div className={`p-3 rounded-lg ${stat.color} bg-opacity-10`}>
                <stat.icon size={24} className={stat.color.replace('bg-', 'text-')} />
              </div>
            </div>
            <div className="flex items-center gap-1 mt-4">
              {stat.increasing ? (
                <ArrowUpRight size={16} className="text-green-500" />
              ) : (
                <ArrowDownRight size={16} className="text-red-500" />
              )}
              <span className={`text-sm ${
                stat.increasing ? 'text-green-500' : 'text-red-500'
              }`}>
                {stat.change}
              </span>
              <span className="text-sm text-gray-600">vs last period</span>
            </div>
          </div>
        ))}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Sales Chart */}
        <div className="bg-white p-6 rounded-xl shadow-sm">
          <h3 className="text-lg font-semibold mb-6">Sales Overview</h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart
                data={processedSalesData}
                margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
              >
                <defs>
                  <linearGradient id="salesGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#4F46E5" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#4F46E5" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Area 
                  type="monotone" 
                  dataKey="amount" 
                  stroke="#4F46E5" 
                  fillOpacity={1} 
                  fill="url(#salesGradient)" 
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* User Activity Chart */}
        <div className="bg-white p-6 rounded-xl shadow-sm">
          <h3 className="text-lg font-semibold mb-6">User Activity</h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={userActivityData}
                margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="day" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="users" fill="#8884d8" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-white p-6 rounded-xl shadow-sm">
        <h3 className="text-lg font-semibold mb-6">Recent Activity</h3>
        <div className="space-y-4">
          {analyticsData?.activities?.map((activity, index) => (
            <div 
              key={index}
              className="flex items-center justify-between py-3 border-b border-gray-100 last:border-0"
            >
              <span className="text-gray-700">{activity.action}</span>
              <span className="text-sm text-gray-500">
                {format(new Date(activity.created_at), 'MMM d, h:mm a')}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}