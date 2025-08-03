"use client";

import Image from "next/image";
import { useSession } from "next-auth/react";
import { ShoppingCart } from "lucide-react";
import { Product } from "@/app/types";
import { useCartStore } from "@/app/store/cartStore";
import { formatPrice } from "@/app/lib/utils";

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const { data: session } = useSession();
  const { addToCart } = useCartStore();

  const handleAddToCart = async () => {
    if (session?.user?.id) {
      await addToCart(session.user.id, product.id);
    }
  };

  return (
    <div className='bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow'>
      <div className='relative h-48 w-full'>
        <Image
          src={product.imageUrl || "/placeholder-product.jpg"}
          alt={product.name}
          fill
          className='object-cover'
        />
      </div>

      <div className='p-4'>
        <h3 className='text-lg font-semibold text-gray-900 mb-2'>
          {product.name}
        </h3>

        {product.description && (
          <p className='text-gray-600 text-sm mb-3 line-clamp-2'>
            {product.description}
          </p>
        )}

        <div className='flex items-center justify-between mb-3'>
          <span className='text-2xl font-bold text-blue-600'>
            {formatPrice(Number(product.price))}
          </span>
          <span className='text-sm text-gray-500'>Stock: {product.stock}</span>
        </div>

        <div className='flex items-center justify-between'>
          <span className='text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded'>
            {product.category.name}
          </span>

          {session && product.stock > 0 ? (
            <button
              onClick={handleAddToCart}
              className='bg-blue-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-blue-700 flex items-center space-x-2'
            >
              <ShoppingCart className='h-4 w-4' />
              <span>Add to Cart</span>
            </button>
          ) : product.stock === 0 ? (
            <span className='text-red-500 text-sm font-medium'>
              Out of Stock
            </span>
          ) : (
            <span className='text-gray-500 text-sm'>Login to Purchase</span>
          )}
        </div>
      </div>
    </div>
  );
}
