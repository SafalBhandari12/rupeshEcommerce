"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import ProductCard from "@/app/components/ProductCard";
import { Product, Category } from "@/app/types";
import { Search } from "lucide-react";

export default function ProductsPage() {
  const { data: session } = useSession();
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProducts();
    fetchCategories();
  }, [selectedCategory, searchTerm]);

  const fetchProducts = async () => {
    try {
      const params = new URLSearchParams();
      if (selectedCategory) params.append("categoryId", selectedCategory);
      if (searchTerm) params.append("search", searchTerm);

      const response = await fetch(`/api/products?${params}`);
      if (response.ok) {
        const data = await response.json();
        setProducts(data);
      }
    } catch (error) {
      console.error("Error fetching products:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await fetch("/api/categories");
      if (response.ok) {
        const data = await response.json();
        setCategories(data);
      }
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  return (
    <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8'>
      <div className='mb-8'>
        <h1 className='text-3xl font-bold text-gray-900 mb-6'>Products</h1>

        {/* Search and Filter */}
        <div className='flex flex-col sm:flex-row gap-4 mb-6'>
          {/* Search */}
          <div className='relative flex-1'>
            <Search className='absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5' />
            <input
              type='text'
              placeholder='Search products...'
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className='w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500'
            />
          </div>

          {/* Category Filter */}
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className='px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500'
          >
            <option value=''>All Categories</option>
            {categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Products Grid */}
      {loading ? (
        <div className='flex justify-center items-center py-12'>
          <div className='animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600'></div>
        </div>
      ) : (
        <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6'>
          {products.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              showAddToCart={!!session}
            />
          ))}
        </div>
      )}

      {!loading && products.length === 0 && (
        <div className='text-center py-12'>
          <p className='text-gray-500 text-lg'>No products found.</p>
        </div>
      )}
    </div>
  );
}
