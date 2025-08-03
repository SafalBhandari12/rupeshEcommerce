"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import ProductCard from "@/app/components/ProductCard";
import { Product, Category } from "@/app/types";
import { Search, Grid, List } from "lucide-react";
        <div className='text-center py-12'>
          <p className='text-gray-500 text-lg'>No products found.</p>
        </div>
      )}
    </div>
  );
}es";
import { Search, Grid, List } from "lucide-react";

export default function ProductsPage() {
  const { data: session } = useSession();
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState<'category' | 'grid'>('category');

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

  // Group products by category for category view
  const productsByCategory = categories.reduce((acc, category) => {
    const categoryProducts = products.filter(product => product.categoryId === category.id);
    if (categoryProducts.length > 0) {
      acc[category.id] = {
        category,
        products: categoryProducts
      };
    }
    return acc;
  }, {} as Record<string, { category: Category; products: Product[] }>);

  return (
    <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 mt-20'>
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
              className='w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-500 focus:border-gray-500'
            />
          </div>

          {/* Category Filter */}
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className='px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-500 focus:border-gray-500'
          >
            <option value=''>All Categories</option>
            {categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>

          {/* View Mode Toggle */}
          <div className='flex bg-gray-100 rounded-lg p-1'>
            <button
              onClick={() => setViewMode('category')}
              className={`px-3 py-1 rounded-md text-sm font-medium transition-all duration-200 flex items-center space-x-2 ${
                viewMode === 'category'
                  ? 'bg-white text-gray-900 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <List className='h-4 w-4' />
              <span>By Category</span>
            </button>
            <button
              onClick={() => setViewMode('grid')}
              className={`px-3 py-1 rounded-md text-sm font-medium transition-all duration-200 flex items-center space-x-2 ${
                viewMode === 'grid'
                  ? 'bg-white text-gray-900 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <Grid className='h-4 w-4' />
              <span>Grid View</span>
            </button>
          </div>
        </div>
      </div>

      {/* Products Display */}
      {loading ? (
        <div className='flex justify-center items-center py-12'>
          <div className='animate-spin rounded-full h-8 w-8 border-b-2 border-gray-600'></div>
        </div>
      ) : viewMode === 'category' && !selectedCategory && !searchTerm ? (
        // Category View - Only show when no specific category is selected and no search
        <div className='space-y-12'>
          {Object.values(productsByCategory).map(({ category, products: categoryProducts }) => (
            <div key={category.id} className='space-y-6'>
              <div className='flex items-center justify-between'>
                <h2 className='text-2xl font-bold text-gray-900'>{category.name}</h2>
                <div className='text-sm text-gray-500'>
                  {categoryProducts.length} {categoryProducts.length === 1 ? 'product' : 'products'}
                </div>
              </div>
              
              <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6'>
                {categoryProducts.slice(0, 8).map((product) => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    showAddToCart={!!session}
                  />
                ))}
              </div>
              
              {categoryProducts.length > 8 && (
                <div className='text-center'>
                  <button
                    onClick={() => setSelectedCategory(category.id)}
                    className='bg-gray-900 text-white px-6 py-2 rounded-lg hover:bg-gray-800 transition-colors duration-200'
                  >
                    View All {category.name} Products
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      ) : (
        // Grid View or Filtered View
        <>
          {selectedCategory && (
            <div className='mb-6 flex items-center justify-between'>
              <h2 className='text-xl font-semibold text-gray-900'>
                {categories.find(c => c.id === selectedCategory)?.name} Products
              </h2>
              <button
                onClick={() => setSelectedCategory('')}
                className='text-gray-600 hover:text-gray-900 text-sm font-medium'
              >
                View All Categories
              </button>
            </div>
          )}
          
          <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6'>
            {products.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                showAddToCart={!!session}
              />
            ))}
          </div>
          
          {products.length === 0 && (
            <div className='text-center py-12'>
              <p className='text-gray-500 text-lg'>No products found.</p>
            </div>
          )}
        </>
      )}
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
