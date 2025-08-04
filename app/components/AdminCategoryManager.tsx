"use client";

import { useState, useEffect } from "react";
import { Plus, Edit, Trash2, Save, X, Loader2 } from "lucide-react";
import { Category } from "@/app/types";

interface AdminCategoryManagerProps {
  onClose?: () => void;
}

export default function AdminCategoryManager({
  onClose,
}: AdminCategoryManagerProps) {
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDeleting, setIsDeleting] = useState<string | null>(null);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [isAddingNew, setIsAddingNew] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
  });

  useEffect(() => {
    fetchCategories();
  }, []);

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
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
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
      const url = editingCategory
        ? `/api/categories/${editingCategory.id}`
        : "/api/categories";
      const method = editingCategory ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        await fetchCategories();
        resetForm();
      } else {
        console.error("Error saving category");
      }
    } catch (error) {
      console.error("Error saving category:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEdit = (category: Category) => {
    setEditingCategory(category);
    setFormData({
      name: category.name,
      description: category.description || "",
    });
    setIsAddingNew(true);
  };

  const handleDelete = async (categoryId: string) => {
    if (
      confirm(
        "Are you sure you want to delete this category? This will also delete all products in this category."
      )
    ) {
      setIsDeleting(categoryId);
      try {
        const response = await fetch(`/api/categories/${categoryId}`, {
          method: "DELETE",
        });

        if (response.ok) {
          await fetchCategories();
        } else {
          console.error("Error deleting category");
        }
      } catch (error) {
        console.error("Error deleting category:", error);
      } finally {
        setIsDeleting(null);
      }
    }
  };

  const resetForm = () => {
    setFormData({
      name: "",
      description: "",
    });
    setEditingCategory(null);
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
            Category Management
          </h2>
          <div className='flex space-x-2'>
            <button
              onClick={() => setIsAddingNew(true)}
              className='bg-gray-900 hover:bg-gray-800 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-300 flex items-center space-x-2'
            >
              <Plus className='h-4 w-4' />
              <span>Add Category</span>
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
            {editingCategory ? "Edit Category" : "Add New Category"}
          </h3>

          <form onSubmit={handleSubmit} className='space-y-4'>
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
                placeholder='Enter category name'
                required
              />
            </div>

            <div>
              <label className='block text-sm font-medium text-gray-700 mb-2'>
                Description
              </label>
              <textarea
                name='description'
                value={formData.description}
                onChange={handleInputChange}
                rows={3}
                className='w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-gray-500 text-gray-900 placeholder-gray-500'
                placeholder='Category description...'
              />
            </div>

            <div className='flex space-x-2'>
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
                    <span>
                      {editingCategory ? "Update" : "Create"} Category
                    </span>
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

      {/* Categories List */}
      <div className='p-6'>
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
          {categories.map((category) => (
            <div
              key={category.id}
              className='bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-300 p-4'
            >
              <div className='flex justify-between items-start mb-3'>
                <h3 className='font-semibold text-gray-900 text-lg'>
                  {category.name}
                </h3>
                <div className='flex space-x-1'>
                  <button
                    onClick={() => handleEdit(category)}
                    disabled={isDeleting === category.id}
                    className='text-gray-600 hover:text-gray-900 p-1 rounded transition-colors duration-300 disabled:opacity-50 disabled:cursor-not-allowed'
                  >
                    <Edit className='h-4 w-4' />
                  </button>
                  <button
                    onClick={() => handleDelete(category.id)}
                    disabled={isDeleting === category.id}
                    className='text-gray-600 hover:text-red-600 p-1 rounded transition-colors duration-300 disabled:opacity-50 disabled:cursor-not-allowed'
                  >
                    {isDeleting === category.id ? (
                      <Loader2 className='h-4 w-4 animate-spin' />
                    ) : (
                      <Trash2 className='h-4 w-4' />
                    )}
                  </button>
                </div>
              </div>

              {category.description && (
                <p className='text-sm text-gray-600 mb-3'>
                  {category.description}
                </p>
              )}

              <div className='text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full inline-block'>
                ID: {category.id.slice(-8)}
              </div>
            </div>
          ))}
        </div>

        {categories.length === 0 && (
          <div className='text-center py-12'>
            <p className='text-gray-500'>
              No categories found. Add some categories to get started.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
