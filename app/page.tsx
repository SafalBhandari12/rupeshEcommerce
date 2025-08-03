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
    <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8'>
      {/* Hero Section */}
      <div className='bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg text-white p-8 mb-12'>
        <div className='max-w-3xl'>
          <h1 className='text-4xl font-bold mb-4'>
            Welcome to Our ECommerce Store
          </h1>
          <p className='text-xl mb-6'>
            Discover amazing products at great prices. Shop now and enjoy fast
            delivery!
          </p>
          <Link
            href='/products'
            className='bg-white text-blue-600 px-6 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors'
          >
            Shop Now
          </Link>
        </div>
      </div>

      {/* Featured Products */}
      <section>
        <div className='flex justify-between items-center mb-8'>
          <h2 className='text-3xl font-bold text-gray-900'>
            Featured Products
          </h2>
          <Link
            href='/products'
            className='text-blue-600 hover:text-blue-800 font-semibold'
          >
            View All Products →
          </Link>
        </div>

        {isLoading ? (
          <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
            {[...Array(6)].map((_, i) => (
              <div
                key={i}
                className='bg-white rounded-lg shadow-md p-4 animate-pulse'
              >
                <div className='h-48 bg-gray-200 rounded mb-4'></div>
                <div className='h-4 bg-gray-200 rounded mb-2'></div>
                <div className='h-4 bg-gray-200 rounded w-2/3'></div>
              </div>
            ))}
          </div>
        ) : featuredProducts.length > 0 ? (
          <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
            {featuredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <div className='text-center py-12'>
            <p className='text-gray-500 text-lg'>No products available yet.</p>
            <p className='text-gray-400 text-sm mt-2'>
              Check back later or contact the administrator.
            </p>
          </div>
        )}
      </section>

      {/* Features */}
      <section className='mt-16'>
        <h2 className='text-3xl font-bold text-gray-900 text-center mb-12'>
          Why Choose Us?
        </h2>
        <div className='grid grid-cols-1 md:grid-cols-3 gap-8'>
          <div className='text-center'>
            <div className='bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4'>
              <svg
                className='w-8 h-8 text-blue-600'
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
            <h3 className='text-xl font-semibold mb-2'>Fast Delivery</h3>
            <p className='text-gray-600'>
              Quick and reliable shipping to your doorstep
            </p>
          </div>

          <div className='text-center'>
            <div className='bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4'>
              <svg
                className='w-8 h-8 text-green-600'
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
            <h3 className='text-xl font-semibold mb-2'>Quality Products</h3>
            <p className='text-gray-600'>
              Carefully curated items from trusted suppliers
            </p>
          </div>

          <div className='text-center'>
            <div className='bg-purple-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4'>
              <svg
                className='w-8 h-8 text-purple-600'
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
            <h3 className='text-xl font-semibold mb-2'>Best Prices</h3>
            <p className='text-gray-600'>
              Competitive pricing with regular discounts
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
