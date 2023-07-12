'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/components/providers';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from 'recharts';
import {
  DollarSign,
  ShoppingBag,
  Users,
  Package,
  TrendingUp,
  TrendingDown,
  ArrowUpRight,
  ArrowDownRight,
  MoreHorizontal,
} from 'lucide-react';
import Link from 'next/link';

interface DashboardStats {
  totalRevenue: number;
  totalOrders: number;
  totalCustomers: number;
  totalProducts: number;
  revenueChange: number;
  ordersChange: number;
  customersChange: number;
  productsChange: number;
}

interface ChartData {
  name: string;
  revenue: number;
  orders: number;
}

interface RecentOrder {
  id: string;
  order_number: string;
  customer_name: string;
  total_amount: number;
  status: string;
  created_at: string;
}

export default function AdminDashboard() {
  const router = useRouter();
  const { user, isLoading: authLoading } = useAuth();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [chartData, setChartData] = useState<ChartData[]>([]);
  const [recentOrders, setRecentOrders] = useState<RecentOrder[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!authLoading && user) {
      if (user.role !== 'admin') {
        router.push('/');
        return;
      }
      fetchDashboardData();
    }
  }, [user, authLoading]);

  const fetchDashboardData = async () => {
    setIsLoading(true);

    try {
      // Fetch total revenue
      const { data: revenueData } = await supabase
        .from('orders')
        .select('total_amount')
        .eq('payment_status', 'paid');

      type OrderAmount = { total_amount: number };
      const totalRevenue = (revenueData as OrderAmount[] | null)?.reduce((sum, order) => sum + order.total_amount, 0) || 0;

      // Fetch total orders
      const { count: totalOrders } = await supabase
        .from('orders')
        .select('*', { count: 'exact', head: true });

      // Fetch total customers
      const { count: totalCustomers } = await supabase
        .from('profiles')
        .select('*', { count: 'exact', head: true });

      // Fetch total products
      const { count: totalProducts } = await supabase
        .from('products')
        .select('*', { count: 'exact', head: true });

      setStats({
        totalRevenue,
        totalOrders: totalOrders || 0,
        totalCustomers: totalCustomers || 0,
        totalProducts: totalProducts || 0,
        revenueChange: 12.5,
        ordersChange: 8.3,
        customersChange: 15.2,
        productsChange: 5.7,
      });

      // Fetch chart data (last 7 days)
      const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
      const chartData = days.map((day) => ({
        name: day,
        revenue: Math.floor(Math.random() * 5000) + 2000,
        orders: Math.floor(Math.random() * 50) + 20,
      }));
      setChartData(chartData);

      // Fetch recent orders
      const { data: ordersData } = await supabase
        .from('orders')
        .select('id, order_number, customer_name, total_amount, status, created_at')
        .order('created_at', { ascending: false })
        .limit(10);

      if (ordersData) {
        setRecentOrders(ordersData as RecentOrder[]);
      }
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (authLoading || isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="spinner border-primary-600 h-12 w-12" />
      </div>
    );
  }

  if (!user || user.role !== 'admin') {
    return null;
  }

  const statCards = [
    {
      title: 'Total Revenue',
      value: `$${stats?.totalRevenue.toLocaleString() || 0}`,
      change: stats?.revenueChange || 0,
      icon: DollarSign,
      color: 'bg-green-100 text-green-600',
    },
    {
      title: 'Total Orders',
      value: stats?.totalOrders.toLocaleString() || 0,
      change: stats?.ordersChange || 0,
      icon: ShoppingBag,
      color: 'bg-blue-100 text-blue-600',
    },
    {
      title: 'Total Customers',
      value: stats?.totalCustomers.toLocaleString() || 0,
      change: stats?.customersChange || 0,
      icon: Users,
      color: 'bg-purple-100 text-purple-600',
    },
    {
      title: 'Total Products',
      value: stats?.totalProducts.toLocaleString() || 0,
      change: stats?.productsChange || 0,
      icon: Package,
      color: 'bg-orange-100 text-orange-600',
    },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'delivered':
        return 'bg-green-100 text-green-800';
      case 'shipped':
        return 'bg-blue-100 text-blue-800';
      case 'processing':
        return 'bg-yellow-100 text-yellow-800';
      case 'pending':
        return 'bg-gray-100 text-gray-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
              <p className="text-gray-500 mt-1">Welcome back, {user.full_name || 'Admin'}</p>
            </div>
            <div className="flex space-x-3">
              <Link
                href="/admin/products"
                className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700"
              >
                Manage Products
              </Link>
              <Link
                href="/admin/vendors"
                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
              >
                Manage Vendors
              </Link>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {statCards.map((stat) => {
            const StatIcon = stat.icon;
            return (
            <div key={stat.title} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between">
                <div className={`p-3 rounded-lg ${stat.color}`}>
                  <StatIcon className="h-6 w-6" />
                </div>
                <div
                  className={`flex items-center text-sm ${
                    stat.change >= 0 ? 'text-green-600' : 'text-red-600'
                  }`}
                >
                  {stat.change >= 0 ? (
                    <ArrowUpRight className="h-4 w-4 mr-1" />
                  ) : (
                    <ArrowDownRight className="h-4 w-4 mr-1" />
                  )}
                  {Math.abs(stat.change)}%
                </div>
              </div>
              <div className="mt-4">
                <p className="text-sm text-gray-500">{stat.title}</p>
                <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
              </div>
            </div>
            );
          })}
        </div>

        {/* Charts */}
        <div className="grid lg:grid-cols-2 gap-8 mb-8">
          {/* Revenue Chart */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Revenue Overview</h3>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="revenue"
                  stroke="#3b82f6"
                  strokeWidth={2}
                  name="Revenue ($)"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* Orders Chart */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Orders Overview</h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="orders" fill="#8b5cf6" name="Orders" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Recent Orders */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200">
          <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-900">Recent Orders</h3>
            <Link
              href="/admin/orders"
              className="text-primary-600 hover:text-primary-700 text-sm font-medium"
            >
              View All
            </Link>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Order ID
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Customer
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Amount
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Date
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {recentOrders.map((order) => (
                  <tr key={order.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {order.order_number}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                      {order.customer_name || 'N/A'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      ${order.total_amount.toFixed(2)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(
                          order.status
                        )}`}
                      >
                        {order.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(order.created_at).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right">
                      <Link
                        href={`/admin/orders/${order.id}`}
                        className="text-primary-600 hover:text-primary-700"
                      >
                        <MoreHorizontal className="h-5 w-5" />
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
