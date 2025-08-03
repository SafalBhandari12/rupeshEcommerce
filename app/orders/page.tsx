"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Order } from "@/app/types";
import { formatPrice, formatDate } from "@/app/lib/utils";
import { Package, Calendar, CreditCard } from "lucide-react";

const statusColors = {
  PENDING: "bg-yellow-100 text-yellow-800",
  PROCESSING: "bg-blue-100 text-blue-800",
  SHIPPED: "bg-purple-100 text-purple-800",
  DELIVERED: "bg-green-100 text-green-800",
  CANCELLED: "bg-red-100 text-red-800",
};

export default function OrdersPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
      return;
    }

    if (session?.user?.id) {
      fetchOrders();
    }
  }, [session, status, router]);

  const fetchOrders = async () => {
    try {
      const response = await fetch(`/api/orders?userId=${session?.user?.id}`);
      if (response.ok) {
        const data = await response.json();
        setOrders(data);
      }
    } catch (error) {
      console.error("Error fetching orders:", error);
    } finally {
      setLoading(false);
    }
  };

  if (status === "loading" || loading) {
    return (
      <div className='flex justify-center items-center min-h-screen'>
        <div className='animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600'></div>
      </div>
    );
  }

  if (!session) {
    return null;
  }

  return (
    <div className='max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8'>
      <h1 className='text-3xl font-bold text-gray-900 mb-8'>My Orders</h1>

      {orders.length === 0 ? (
        <div className='text-center py-12'>
          <Package className='mx-auto h-12 w-12 text-gray-400 mb-4' />
          <h2 className='text-xl font-semibold text-gray-900 mb-2'>
            No orders yet
          </h2>
          <p className='text-gray-500 mb-6'>
            When you place orders, they'll appear here.
          </p>
          <button
            onClick={() => router.push("/products")}
            className='bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors'
          >
            Start Shopping
          </button>
        </div>
      ) : (
        <div className='space-y-6'>
          {orders.map((order) => (
            <div key={order.id} className='bg-white border rounded-lg p-6'>
              {/* Order Header */}
              <div className='flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4'>
                <div className='flex items-center space-x-3 mb-2 sm:mb-0'>
                  <Package className='h-5 w-5 text-gray-400' />
                  <span className='text-sm text-gray-500'>
                    Order #{order.id.slice(-8)}
                  </span>
                </div>

                <span
                  className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                    statusColors[order.status]
                  }`}
                >
                  {order.status}
                </span>
              </div>

              {/* Order Details */}
              <div className='grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4'>
                <div className='flex items-center space-x-2 text-sm text-gray-600'>
                  <Calendar className='h-4 w-4' />
                  <span>
                    Ordered on {formatDate(new Date(order.createdAt))}
                  </span>
                </div>

                <div className='flex items-center space-x-2 text-sm text-gray-600'>
                  <CreditCard className='h-4 w-4' />
                  <span>Total: {formatPrice(Number(order.total))}</span>
                </div>
              </div>

              {/* Order Items */}
              <div className='space-y-3'>
                <h4 className='font-semibold text-gray-900'>Items:</h4>
                {order.orderItems.map((item) => (
                  <div
                    key={item.id}
                    className='flex items-center justify-between py-2 border-b border-gray-100 last:border-b-0'
                  >
                    <div>
                      <p className='font-medium text-gray-900'>
                        {item.product.name}
                      </p>
                      <p className='text-sm text-gray-500'>
                        Quantity: {item.quantity} ×{" "}
                        {formatPrice(Number(item.price))}
                      </p>
                    </div>
                    <p className='font-semibold text-gray-900'>
                      {formatPrice(Number(item.price) * item.quantity)}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
