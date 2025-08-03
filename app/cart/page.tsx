"use client";

import { useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useCartStore } from "@/app/store/cartStore";
import { formatPrice } from "@/app/lib/utils";
import { Minus, Plus, Trash2, ShoppingBag } from "lucide-react";
import Image from "next/image";

export default function CartPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const {
    items,
    isLoading,
    fetchCartItems,
    updateQuantity,
    removeFromCart,
    getTotal,
  } = useCartStore();

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
      return;
    }

    if (session?.user?.id) {
      fetchCartItems(session.user.id);
    }
  }, [session, status, router, fetchCartItems]);

  const handleQuantityChange = (itemId: string, newQuantity: number) => {
    if (newQuantity > 0) {
      updateQuantity(itemId, newQuantity);
    }
  };

  const handleRemoveItem = (itemId: string) => {
    removeFromCart(itemId);
  };

  const handleCheckout = async () => {
    if (!session?.user?.id) return;

    try {
      const response = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: session.user.id }),
      });

      if (response.ok) {
        router.push("/orders");
      } else {
        alert("Failed to create order");
      }
    } catch (error) {
      console.error("Error creating order:", error);
      alert("Failed to create order");
    }
  };

  if (status === "loading" || isLoading) {
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
    <div className='max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 mt-20'>
      <h1 className='text-3xl font-bold text-gray-900 mb-8'>Shopping Cart</h1>

      {items.length === 0 ? (
        <div className='text-center py-12'>
          <ShoppingBag className='mx-auto h-12 w-12 text-gray-400 mb-4' />
          <h2 className='text-xl font-semibold text-gray-900 mb-2'>
            Your cart is empty
          </h2>
          <p className='text-gray-500 mb-6'>
            Add some products to get started!
          </p>
          <button
            onClick={() => router.push("/products")}
            className='bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors'
          >
            Browse Products
          </button>
        </div>
      ) : (
        <div className='space-y-6'>
          {/* Cart Items */}
          <div className='space-y-4'>
            {items.map((item) => (
              <div
                key={item.id}
                className='flex items-center space-x-4 bg-white p-4 rounded-lg border'
              >
                <div className='flex-shrink-0'>
                  <Image
                    src={item.product.imageUrl || "/images/placeholder.jpg"}
                    alt={item.product.name}
                    width={80}
                    height={80}
                    className='rounded-lg object-cover'
                  />
                </div>

                <div className='flex-1'>
                  <h3 className='text-lg font-semibold text-gray-900'>
                    {item.product.name}
                  </h3>
                  <p className='text-gray-500'>{item.product.category.name}</p>
                  <p className='text-blue-600 font-semibold'>
                    {formatPrice(Number(item.product.price))}
                  </p>
                </div>

                <div className='flex items-center space-x-2'>
                  <button
                    onClick={() =>
                      handleQuantityChange(item.id, item.quantity - 1)
                    }
                    className='p-1 rounded-md hover:bg-gray-100'
                  >
                    <Minus className='h-4 w-4' />
                  </button>

                  <span className='text-lg font-semibold px-3'>
                    {item.quantity}
                  </span>

                  <button
                    onClick={() =>
                      handleQuantityChange(item.id, item.quantity + 1)
                    }
                    className='p-1 rounded-md hover:bg-gray-100'
                  >
                    <Plus className='h-4 w-4' />
                  </button>
                </div>

                <div className='text-right'>
                  <p className='text-lg font-semibold text-gray-900'>
                    {formatPrice(Number(item.product.price) * item.quantity)}
                  </p>
                  <button
                    onClick={() => handleRemoveItem(item.id)}
                    className='text-red-500 hover:text-red-700 mt-1'
                  >
                    <Trash2 className='h-4 w-4' />
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Cart Summary */}
          <div className='bg-gray-50 p-6 rounded-lg'>
            <div className='flex justify-between items-center mb-4'>
              <span className='text-lg font-semibold'>Total:</span>
              <span className='text-2xl font-bold text-blue-600'>
                {formatPrice(getTotal())}
              </span>
            </div>

            <button
              onClick={handleCheckout}
              className='w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition-colors font-semibold'
            >
              Proceed to Checkout
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
