
import { 
  Users, 
  ShoppingBag, 
  Image as ImageIcon, 
  FileText, 
  TrendingUp, 
  ArrowUpRight,
  ArrowDownRight
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

// Mock data - Replace with real data from your Supabase database
const salesData = [
  { month: 'Jan', sales: 4000 },
  { month: 'Feb', sales: 3000 },
  { month: 'Mar', sales: 5000 },
  { month: 'Apr', sales: 2780 },
  { month: 'May', sales: 1890 },
  { month: 'Jun', sales: 2390 },
  { month: 'Jul', sales: 3490 },
];

const userActivityData = [
  { day: 'Mon', users: 24 },
  { day: 'Tue', users: 13 },
  { day: 'Wed', users: 98 },
  { day: 'Thu', users: 39 },
  { day: 'Fri', users: 48 },
  { day: 'Sat', users: 38 },
  { day: 'Sun', users: 43 },
];

const stats = [
  {
    title: 'Total Users',
    value: '2,847',
    change: '+12.5%',
    increasing: true,
    icon: Users,
    color: 'bg-blue-500'
  },
  {
    title: 'Total Sales',
    value: '₦234,500',
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

export default function Overview() {
  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Dashboard Overview</h1>
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <TrendingUp size={16} className="text-green-500" />
          <span>Last updated: {new Date().toLocaleDateString()}</span>
        </div>
      </div>

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
              <span className="text-sm text-gray-600">vs last month</span>
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
                data={salesData}
                margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
              >
                <defs>
                  <linearGradient id="salesGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#4F46E5" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#4F46E5" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Area 
                  type="monotone" 
                  dataKey="sales" 
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
          {[
            { action: 'New user registration', time: '2 minutes ago' },
            { action: 'New order placed', time: '15 minutes ago' },
            { action: 'Photo uploaded', time: '1 hour ago' },
            { action: 'Blog post published', time: '2 hours ago' }
          ].map((activity, index) => (
            <div 
              key={index}
              className="flex items-center justify-between py-3 border-b border-gray-100 last:border-0"
            >
              <span className="text-gray-700">{activity.action}</span>
              <span className="text-sm text-gray-500">{activity.time}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}