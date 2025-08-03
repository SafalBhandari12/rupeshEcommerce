"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import ProductCard from "@/app/components/ProductCard";
import { Product } from "@/app/types";

export default function Home() {
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchFeaturedProducts = async () => {
      try {
        const response = await fetch("/api/products");
        if (response.ok) {
          const products = await response.json();
          setFeaturedProducts(products.slice(0, 6)); // Show first 6 products
        }
      } catch (error) {
        console.error("Error fetching products:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchFeaturedProducts();
  }, []);

  return (
    <div className='pt-20'>
      {/* Hero Section */}
      <div className='bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white py-20'>
        <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
          <div className='text-center relative'>
            {/* Animated background elements */}
            <div className='absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full animate-pulse'></div>
            <div className='absolute bottom-0 left-0 w-24 h-24 bg-white/3 rounded-full animate-bounce'></div>
            <div className='absolute top-1/2 right-1/4 w-16 h-16 bg-gray-600/20 rounded-full animate-ping'></div>
            
            <div className='relative z-10'>
              <h1 className='text-5xl md:text-6xl font-bold mb-6 text-white leading-tight'>
                Welcome to Our <span className='text-gray-300'>ECommerce Store</span>
              </h1>
              <p className='text-xl md:text-2xl mb-8 text-gray-200 leading-relaxed max-w-2xl mx-auto'>
                Discover amazing products at great prices. Shop now and enjoy fast
                delivery with our premium collection!
              </p>
              <Link
                href='/products'
                className='inline-block bg-white text-gray-900 px-8 py-4 rounded-2xl font-semibold hover:bg-gray-100 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-2xl'
              >
                Shop Now →
              </Link>
            </div>
          </div>
        </div>
      </div>

      <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16'>
        {/* Featured Products */}
        <section>
          <div className='flex justify-between items-center mb-12'>
            <h2 className='text-4xl font-bold text-gray-900'>
              Featured Products
          </h2>
          <Link
            href='/products'
            className='bg-white px-6 py-3 text-gray-700 hover:text-gray-900 font-semibold transition-all duration-300 hover:scale-105 rounded-2xl border border-gray-200 shadow-sm hover:shadow-lg'
          >
            View All Products →
          </Link>
        </div>

        {isLoading ? (
          <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8'>
            {[...Array(6)].map((_, i) => (
              <div
                key={i}
                className='bg-white rounded-2xl shadow-sm p-6 animate-pulse border border-gray-100'
              >
                <div className='h-48 bg-gray-200 rounded-xl mb-4'></div>
                <div className='h-4 bg-gray-200 rounded-lg mb-3'></div>
                <div className='h-4 bg-gray-200 rounded-lg w-2/3'></div>
              </div>
            ))}
          </div>
        ) : featuredProducts.length > 0 ? (
          <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8'>
            {featuredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <div className='text-center py-16 bg-white rounded-2xl border border-gray-100 shadow-sm'>
            <div className='w-16 h-16 border-4 border-gray-300 border-t-gray-900 rounded-full animate-spin mx-auto mb-4'></div>
            <p className='text-gray-500 text-lg mb-2'>No products available yet.</p>
            <p className='text-gray-400 text-sm'>
              Check back later or contact the administrator.
            </p>
          </div>
        )}
      </section>

      {/* Features */}
      <section className='mt-20'>
        <h2 className='text-4xl font-bold text-center mb-16 text-gray-900'>
          Why Choose Us?
        </h2>
        <div className='grid grid-cols-1 md:grid-cols-3 gap-8'>
          <div className='bg-white text-center p-8 rounded-2xl border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-500 transform hover:-translate-y-1 group'>
            <div className='bg-gray-900 w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg group-hover:shadow-2xl'>
              <svg
                className='w-10 h-10 text-white'
                fill='none'
                stroke='currentColor'
                viewBox='0 0 24 24'
              >
                <path
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  strokeWidth={2}
                  d='M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4'
                />
              </svg>
            </div>
            <h3 className='text-2xl font-semibold mb-4 text-gray-800 group-hover:text-gray-900 transition-colors duration-300'>Fast Delivery</h3>
            <p className='text-gray-600 leading-relaxed'>
              Quick and reliable shipping to your doorstep with premium packaging
            </p>
          </div>

          <div className='bg-white text-center p-8 rounded-2xl border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-500 transform hover:-translate-y-1 group'>
            <div className='bg-green-600 w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg group-hover:shadow-2xl'>
              <svg
                className='w-10 h-10 text-white'
                fill='none'
                stroke='currentColor'
                viewBox='0 0 24 24'
              >
                <path
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  strokeWidth={2}
                  d='M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z'
                />
              </svg>
            </div>
            <h3 className='text-2xl font-semibold mb-4 text-gray-800 group-hover:text-green-600 transition-colors duration-300'>Quality Products</h3>
            <p className='text-gray-600 leading-relaxed'>
              Carefully curated items from trusted suppliers worldwide
            </p>
          </div>

          <div className='bg-white text-center p-8 rounded-2xl border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-500 transform hover:-translate-y-1 group'>
            <div className='bg-blue-600 w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg group-hover:shadow-2xl'>
              <svg
                className='w-10 h-10 text-white'
                fill='none'
                stroke='currentColor'
                viewBox='0 0 24 24'
              >
                <path
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  strokeWidth={2}
                  d='M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1'
                />
              </svg>
            </div>
            <h3 className='text-2xl font-semibold mb-4 text-gray-800 group-hover:text-blue-600 transition-colors duration-300'>Best Prices</h3>
            <p className='text-gray-600 leading-relaxed'>
              Competitive pricing with regular discounts and exclusive offers
            </p>
          </div>
        </div>
      </section>
      </div>
    </div>
  );
}
