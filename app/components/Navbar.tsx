"use client";

import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { ShoppingCart, User, LogOut, Package, Settings } from "lucide-react";
import { useCartStore } from "@/app/store/cartStore";
import { useEffect, useState } from "react";

export default function Navbar() {
  const { data: session } = useSession();
  const { getItemCount, fetchCartItems } = useCartStore();
  const itemCount = getItemCount();
  const [isScrolled, setIsScrolled] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (session?.user?.id && session.user.role !== "ADMIN") {
      fetchCartItems(session.user.id);
    }
  }, [session, fetchCartItems]);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    if (mounted) {
      window.addEventListener('scroll', handleScroll);
      return () => window.removeEventListener('scroll', handleScroll);
    }
  }, [mounted]);

  // Prevent hydration mismatch by rendering a simple navbar initially
  if (!mounted) {
    return (
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-md shadow-sm border-b border-gray-200/30">
        <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
          <div className='flex justify-between h-16'>
            <div className='flex items-center'>
              <Link href='/' className='text-2xl font-bold text-gray-900'>
                ECommerce
              </Link>
            </div>
            <div className='flex items-center space-x-4'>
              <Link href='/products' className='text-gray-600 hover:text-gray-900 px-3 py-2 rounded-lg text-sm font-medium'>
                Products
              </Link>
            </div>
          </div>
        </div>
      </nav>
    );
  }

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
      isScrolled 
        ? 'bg-white/80 backdrop-blur-xl shadow-2xl mt-4 mx-4 rounded-2xl border border-white/20' 
        : 'bg-white/70 backdrop-blur-lg shadow-lg border-b border-white/30'
    }`}>
      <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
        <div className='flex justify-between h-16'>
          <div className='flex items-center'>
            <Link href='/' className='text-2xl font-bold text-gray-900 hover:text-gray-700 transition-colors duration-300'>
              ECommerce
            </Link>
          </div>

          <div className='flex items-center space-x-2'>
            <Link
              href='/products'
              className='text-gray-700 hover:text-gray-900 px-4 py-2 rounded-xl text-sm font-medium transition-all duration-300 hover:bg-white/20'
            >
              Products
            </Link>

            {session ? (
              <>
                {session.user?.role === "ADMIN" ? (
                  // Admin Navigation
                  <>
                    <Link
                      href='/admin'
                      className='text-gray-700 hover:text-gray-900 px-4 py-2 rounded-xl text-sm font-medium transition-all duration-300 hover:bg-white/20 flex items-center space-x-2'
                    >
                      <Settings className='h-4 w-4' />
                      <span>Admin Panel</span>
                    </Link>
                    
                    <div className='flex items-center space-x-2 bg-gradient-to-r from-gray-800 to-gray-900 text-white px-4 py-2 rounded-xl border border-gray-700/50 shadow-lg'>
                      <User className='h-4 w-4' />
                      <span className='text-sm font-medium'>
                        Admin: {session.user?.name || session.user?.email}
                      </span>
                      <button
                        onClick={() => signOut()}
                        className='text-gray-300 hover:text-white p-1 rounded-lg transition-colors duration-200'
                        title="Sign Out"
                      >
                        <LogOut className='h-4 w-4' />
                      </button>
                    </div>
                  </>
                ) : (
                  // Regular User Navigation
                  <>
                    <Link
                      href='/cart'
                      className='relative text-gray-700 hover:text-gray-900 p-2 rounded-xl transition-all duration-300 hover:bg-white/20'
                    >
                      <ShoppingCart className='h-5 w-5' />
                      {itemCount > 0 && (
                        <span className='absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center animate-pulse shadow-lg'>
                          {itemCount}
                        </span>
                      )}
                    </Link>

                    <Link
                      href='/orders'
                      className='text-gray-700 hover:text-gray-900 p-2 rounded-xl transition-all duration-300 hover:bg-white/20'
                    >
                      <Package className='h-5 w-5' />
                    </Link>

                    <div className='flex items-center space-x-2 bg-white/20 backdrop-blur-sm px-4 py-2 rounded-xl border border-white/30'>
                      <User className='h-4 w-4 text-gray-600' />
                      <span className='text-sm text-gray-700 font-medium'>
                        {session.user?.name || session.user?.email}
                      </span>
                      <button
                        onClick={() => signOut()}
                        className='text-gray-500 hover:text-gray-700 p-1 rounded-lg transition-colors duration-200'
                        title="Sign Out"
                      >
                        <LogOut className='h-4 w-4' />
                      </button>
                    </div>
                  </>
                )}
              </>
            ) : (
              <>
                <Link
                  href='/login'
                  className='text-gray-700 hover:text-gray-900 px-4 py-2 rounded-xl text-sm font-medium transition-all duration-300 hover:bg-white/20'
                >
                  Login
                </Link>
                <Link
                  href='/signup'
                  className='bg-gradient-to-r from-gray-800 to-gray-900 text-white px-6 py-2 rounded-xl text-sm font-medium hover:from-gray-700 hover:to-gray-800 transition-all duration-300 shadow-lg'
                >
                  Sign Up
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
