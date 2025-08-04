"use client";

import { useState, useEffect } from "react";
import { Plus, Edit, Trash2, Save, X, Loader2 } from "lucide-react";
import { Product, Category } from "@/app/types";
import { formatPrice } from "@/app/lib/utils";
import Image from "next/image";

interface AdminProductManagerProps {
  onClose?: () => void;
}

export default function AdminProductManager({
  onClose,
}: AdminProductManagerProps) {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDeleting, setIsDeleting] = useState<string | null>(null);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [isAddingNew, setIsAddingNew] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    imageUrl: "",
    stock: "",
    categoryId: "",
  });

  useEffect(() => {
    fetchProducts();
    fetchCategories();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await fetch("/api/products");
      if (response.ok) {
        const data = await response.json();
        setProducts(data);
      }
    } catch (error) {
      console.error("Error fetching products:", error);
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
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setIsSubmitting(true);
    try {
      const url = editingProduct
        ? `/api/products/${editingProduct.id}`
        : "/api/products";
      const method = editingProduct ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...formData,
          price: parseFloat(formData.price),
          stock: parseInt(formData.stock),
        }),
      });

      if (response.ok) {
        await fetchProducts();
        resetForm();
      } else {
        console.error("Error saving product");
      }
    } catch (error) {
      console.error("Error saving product:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEdit = (product: Product) => {
    setEditingProduct(product);
    setFormData({
      name: product.name,
      description: product.description || "",
      price: product.price.toString(),
      imageUrl: product.imageUrl || "",
      stock: product.stock.toString(),
      categoryId: product.categoryId,
    });
    setIsAddingNew(true);
  };

  const handleDelete = async (productId: string) => {
    if (confirm("Are you sure you want to delete this product?")) {
      setIsDeleting(productId);
      try {
        const response = await fetch(`/api/products/${productId}`, {
          method: "DELETE",
        });

        if (response.ok) {
          await fetchProducts();
        } else {
          console.error("Error deleting product");
        }
      } catch (error) {
        console.error("Error deleting product:", error);
      } finally {
        setIsDeleting(null);
      }
    }
  };

  const resetForm = () => {
    setFormData({
      name: "",
      description: "",
      price: "",
      imageUrl: "",
      stock: "",
      categoryId: "",
    });
    setEditingProduct(null);
    setIsAddingNew(false);
  };

  if (isLoading) {
    return (
      <div className='flex items-center justify-center p-8'>
        <div className='w-8 h-8 border-4 border-gray-300 border-t-gray-900 rounded-full animate-spin'></div>
      </div>
    );
  }

  return (
    <div className='bg-white rounded-2xl shadow-xl border border-gray-200 overflow-hidden'>
      <div className='bg-gray-50 px-6 py-4 border-b border-gray-200'>
        <div className='flex justify-between items-center'>
          <h2 className='text-2xl font-bold text-gray-900'>
            Product Management
          </h2>
          <div className='flex space-x-2'>
            <button
              onClick={() => setIsAddingNew(true)}
              className='bg-gray-900 hover:bg-gray-800 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-300 flex items-center space-x-2'
            >
              <Plus className='h-4 w-4' />
              <span>Add Product</span>
            </button>
            {onClose && (
              <button
                onClick={onClose}
                className='text-gray-500 hover:text-gray-700 p-2 rounded-lg transition-colors duration-300'
              >
                <X className='h-5 w-5' />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Add/Edit Form */}
      {isAddingNew && (
        <div className='p-6 border-b border-gray-200 bg-gray-50'>
          <h3 className='text-lg font-semibold text-gray-900 mb-4'>
            {editingProduct ? "Edit Product" : "Add New Product"}
          </h3>

          <form
            onSubmit={handleSubmit}
            className='grid grid-cols-1 md:grid-cols-2 gap-4'
          >
            <div>
              <label className='block text-sm font-medium text-gray-700 mb-2'>
                Name
              </label>
              <input
                type='text'
                name='name'
                value={formData.name}
                onChange={handleInputChange}
                className='w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-gray-500 text-gray-900 placeholder-gray-500'
                placeholder='Enter product name'
                required
              />
            </div>

            <div>
              <label className='block text-sm font-medium text-gray-700 mb-2'>
                Category
              </label>
              <select
                name='categoryId'
                value={formData.categoryId}
                onChange={handleInputChange}
                className='w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-gray-500 text-gray-900'
                required
              >
                <option value=''>Select a category</option>
                {categories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className='block text-sm font-medium text-gray-700 mb-2'>
                Price
              </label>
              <input
                type='number'
                name='price'
                value={formData.price}
                onChange={handleInputChange}
                step='0.01'
                className='w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-gray-500 text-gray-900 placeholder-gray-500'
                placeholder='0.00'
                required
              />
            </div>

            <div>
              <label className='block text-sm font-medium text-gray-700 mb-2'>
                Stock
              </label>
              <input
                type='number'
                name='stock'
                value={formData.stock}
                onChange={handleInputChange}
                className='w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-gray-500 text-gray-900 placeholder-gray-500'
                placeholder='0'
                required
              />
            </div>

            <div className='md:col-span-2'>
              <label className='block text-sm font-medium text-gray-700 mb-2'>
                Image URL
              </label>
              <input
                type='url'
                name='imageUrl'
                value={formData.imageUrl}
                onChange={handleInputChange}
                className='w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-gray-500 text-gray-900 placeholder-gray-500'
                placeholder='https://example.com/image.jpg'
              />
            </div>

            <div className='md:col-span-2'>
              <label className='block text-sm font-medium text-gray-700 mb-2'>
                Description
              </label>
              <textarea
                name='description'
                value={formData.description}
                onChange={handleInputChange}
                rows={3}
                className='w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-gray-500 text-gray-900 placeholder-gray-500'
                placeholder='Product description...'
              />
            </div>

            <div className='md:col-span-2 flex space-x-2'>
              <button
                type='submit'
                disabled={isSubmitting}
                className='bg-gray-900 hover:bg-gray-800 disabled:bg-gray-400 text-white px-6 py-2 rounded-lg text-sm font-medium transition-colors duration-300 flex items-center space-x-2'
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className='h-4 w-4 animate-spin' />
                    <span>Saving...</span>
                  </>
                ) : (
                  <>
                    <Save className='h-4 w-4' />
                    <span>{editingProduct ? "Update" : "Create"} Product</span>
                  </>
                )}
              </button>
              <button
                type='button'
                onClick={resetForm}
                disabled={isSubmitting}
                className='bg-gray-200 hover:bg-gray-300 disabled:bg-gray-100 text-gray-700 px-6 py-2 rounded-lg text-sm font-medium transition-colors duration-300 flex items-center space-x-2'
              >
                <X className='h-4 w-4' />
                <span>Cancel</span>
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Products List */}
      <div className='p-6'>
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
          {products.map((product) => (
            <div
              key={product.id}
              className='bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-300'
            >
              <div className='relative h-40 w-full'>
                <Image
                  src={product.imageUrl || "/placeholder-product.jpg"}
                  alt={product.name}
                  fill
                  className='object-cover rounded-t-lg'
                />
              </div>

              <div className='p-4'>
                <h3 className='font-semibold text-gray-900 mb-2'>
                  {product.name}
                </h3>
                <p className='text-sm text-gray-600 mb-2 line-clamp-2'>
                  {product.description}
                </p>

                <div className='flex justify-between items-center mb-3'>
                  <span className='text-lg font-bold text-gray-900'>
                    {formatPrice(Number(product.price))}
                  </span>
                  <span className='text-sm text-gray-500'>
                    Stock: {product.stock}
                  </span>
                </div>

                <div className='flex justify-between items-center'>
                  <span className='text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full'>
                    {product.category.name}
                  </span>

                  <div className='flex space-x-1'>
                    <button
                      onClick={() => handleEdit(product)}
                      disabled={isDeleting === product.id}
                      className='text-gray-600 hover:text-gray-900 p-1 rounded transition-colors duration-300 disabled:opacity-50 disabled:cursor-not-allowed'
                    >
                      <Edit className='h-4 w-4' />
                    </button>
                    <button
                      onClick={() => handleDelete(product.id)}
                      disabled={isDeleting === product.id}
                      className='text-gray-600 hover:text-red-600 p-1 rounded transition-colors duration-300 disabled:opacity-50 disabled:cursor-not-allowed'
                    >
                      {isDeleting === product.id ? (
                        <Loader2 className='h-4 w-4 animate-spin' />
                      ) : (
                        <Trash2 className='h-4 w-4' />
                      )}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {products.length === 0 && (
          <div className='text-center py-12'>
            <p className='text-gray-500'>
              No products found. Add some products to get started.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
