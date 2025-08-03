"use client";

import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { ShoppingCart, User, LogOut, Package, Settings } from "lucide-react";
import { useCartStore } from "@/app/store/cartStore";
import { useEffect } from "react";

export default function Navbar() {
  const { data: session } = useSession();
  const { getItemCount, fetchCartItems } = useCartStore();
  const itemCount = getItemCount();

  useEffect(() => {
    if (session?.user?.id) {
      fetchCartItems(session.user.id);
    }
  }, [session, fetchCartItems]);

  return (
    <nav className='bg-white shadow-lg border-b'>
      <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
        <div className='flex justify-between h-16'>
          <div className='flex items-center'>
            <Link href='/' className='text-2xl font-bold text-blue-600'>
              ECommerce
            </Link>
          </div>

          <div className='flex items-center space-x-4'>
            <Link
              href='/products'
              className='text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium'
            >
              Products
            </Link>

            {session ? (
              <>
                <Link
                  href='/cart'
                  className='relative text-gray-700 hover:text-blue-600 p-2'
                >
                  <ShoppingCart className='h-6 w-6' />
                  {itemCount > 0 && (
                    <span className='absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center'>
                      {itemCount}
                    </span>
                  )}
                </Link>

                <Link
                  href='/orders'
                  className='text-gray-700 hover:text-blue-600 p-2'
                >
                  <Package className='h-6 w-6' />
                </Link>

                {session.user?.role === "ADMIN" && (
                  <Link
                    href='/admin'
                    className='text-gray-700 hover:text-blue-600 p-2'
                  >
                    <Settings className='h-6 w-6' />
                  </Link>
                )}

                <div className='flex items-center space-x-2'>
                  <User className='h-5 w-5 text-gray-600' />
                  <span className='text-sm text-gray-700'>
                    {session.user?.name || session.user?.email}
                  </span>
                  <button
                    onClick={() => signOut()}
                    className='text-gray-700 hover:text-red-600 p-1'
                  >
                    <LogOut className='h-5 w-5' />
                  </button>
                </div>
              </>
            ) : (
              <div className='flex items-center space-x-2'>
                <Link
                  href='/login'
                  className='text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium'
                >
                  Login
                </Link>
                <Link
                  href='/signup'
                  className='bg-blue-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-blue-700'
                >
                  Sign Up
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
