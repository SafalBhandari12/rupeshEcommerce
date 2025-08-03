"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Order } from "@/app/types";
import { formatPrice, formatDate } from "@/app/lib/utils";
import { Package, Users, ShoppingCart, TrendingUp } from "lucide-react";

const statusColors = {
  PENDING: "bg-yellow-100 text-yellow-800",
  PROCESSING: "bg-blue-100 text-blue-800",
  SHIPPED: "bg-purple-100 text-purple-800",
  DELIVERED: "bg-green-100 text-green-800",
  CANCELLED: "bg-red-100 text-red-800",
};

export default function AdminPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalOrders: 0,
    totalRevenue: 0,
    pendingOrders: 0,
    totalCustomers: 0,
  });

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
      return;
    }

    if (session?.user?.role !== "ADMIN") {
      router.push("/");
      return;
    }

    fetchOrders();
  }, [session, status, router]);

  const fetchOrders = async () => {
    try {
      const response = await fetch("/api/orders?admin=true");
      if (response.ok) {
        const data = await response.json();
        setOrders(data);
        calculateStats(data);
      }
    } catch (error) {
      console.error("Error fetching orders:", error);
    } finally {
      setLoading(false);
    }
  };

  const calculateStats = (orderData: Order[]) => {
    const totalOrders = orderData.length;
    const totalRevenue = orderData.reduce(
      (sum, order) => sum + Number(order.total),
      0
    );
    const pendingOrders = orderData.filter(
      (order) => order.status === "PENDING"
    ).length;
    const uniqueCustomers = new Set(orderData.map((order) => order.userId))
      .size;

    setStats({
      totalOrders,
      totalRevenue,
      pendingOrders,
      totalCustomers: uniqueCustomers,
    });
  };

  const updateOrderStatus = async (orderId: string, newStatus: string) => {
    try {
      const response = await fetch("/api/orders", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ orderId, status: newStatus }),
      });

      if (response.ok) {
        fetchOrders(); // Refresh orders
      }
    } catch (error) {
      console.error("Error updating order status:", error);
    }
  };

  if (status === "loading" || loading) {
    return (
      <div className='flex justify-center items-center min-h-screen'>
        <div className='animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600'></div>
      </div>
    );
  }

  if (!session || session.user.role !== "ADMIN") {
    return null;
  }

  return (
    <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8'>
      <h1 className='text-3xl font-bold text-gray-900 mb-8'>Admin Dashboard</h1>

      {/* Stats Cards */}
      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8'>
        <div className='bg-white p-6 rounded-lg border'>
          <div className='flex items-center'>
            <Package className='h-8 w-8 text-blue-600' />
            <div className='ml-4'>
              <p className='text-sm font-medium text-gray-600'>Total Orders</p>
              <p className='text-2xl font-bold text-gray-900'>
                {stats.totalOrders}
              </p>
            </div>
          </div>
        </div>

        <div className='bg-white p-6 rounded-lg border'>
          <div className='flex items-center'>
            <TrendingUp className='h-8 w-8 text-green-600' />
            <div className='ml-4'>
              <p className='text-sm font-medium text-gray-600'>Total Revenue</p>
              <p className='text-2xl font-bold text-gray-900'>
                {formatPrice(stats.totalRevenue)}
              </p>
            </div>
          </div>
        </div>

        <div className='bg-white p-6 rounded-lg border'>
          <div className='flex items-center'>
            <ShoppingCart className='h-8 w-8 text-yellow-600' />
            <div className='ml-4'>
              <p className='text-sm font-medium text-gray-600'>
                Pending Orders
              </p>
              <p className='text-2xl font-bold text-gray-900'>
                {stats.pendingOrders}
              </p>
            </div>
          </div>
        </div>

        <div className='bg-white p-6 rounded-lg border'>
          <div className='flex items-center'>
            <Users className='h-8 w-8 text-purple-600' />
            <div className='ml-4'>
              <p className='text-sm font-medium text-gray-600'>Customers</p>
              <p className='text-2xl font-bold text-gray-900'>
                {stats.totalCustomers}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Orders Table */}
      <div className='bg-white rounded-lg border'>
        <div className='px-6 py-4 border-b'>
          <h2 className='text-xl font-semibold text-gray-900'>Recent Orders</h2>
        </div>

        <div className='overflow-x-auto'>
          <table className='min-w-full divide-y divide-gray-200'>
            <thead className='bg-gray-50'>
              <tr>
                <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                  Order ID
                </th>
                <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                  Customer
                </th>
                <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                  Date
                </th>
                <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                  Total
                </th>
                <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                  Status
                </th>
                <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className='bg-white divide-y divide-gray-200'>
              {orders.map((order) => (
                <tr key={order.id}>
                  <td className='px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900'>
                    #{order.id.slice(-8)}
                  </td>
                  <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-500'>
                    {order.user.email}
                  </td>
                  <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-500'>
                    {formatDate(new Date(order.createdAt))}
                  </td>
                  <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-900'>
                    {formatPrice(Number(order.total))}
                  </td>
                  <td className='px-6 py-4 whitespace-nowrap'>
                    <span
                      className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        statusColors[order.status]
                      }`}
                    >
                      {order.status}
                    </span>
                  </td>
                  <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-500'>
                    <select
                      value={order.status}
                      onChange={(e) =>
                        updateOrderStatus(order.id, e.target.value)
                      }
                      className='text-sm border border-gray-300 rounded px-2 py-1'
                    >
                      <option value='PENDING'>Pending</option>
                      <option value='PROCESSING'>Processing</option>
                      <option value='SHIPPED'>Shipped</option>
                      <option value='DELIVERED'>Delivered</option>
                      <option value='CANCELLED'>Cancelled</option>
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
