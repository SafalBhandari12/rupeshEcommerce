"use client";

import Image from "next/image";
import { useSession } from "next-auth/react";
import { ShoppingCart, Loader2 } from "lucide-react";
import { Product } from "@/app/types";
import { useCartStore } from "@/app/store/cartStore";
import { formatPrice } from "@/app/lib/utils";

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const { data: session } = useSession();
  const { addToCart, isAddingToCart } = useCartStore();

  const handleAddToCart = async () => {
    if (session?.user?.id) {
      await addToCart(session.user.id, product.id);
    }
  };

  return (
    <div className='bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 border border-gray-100 group overflow-hidden'>
      <div className='relative h-48 w-full overflow-hidden'>
        <Image
          src={product.imageUrl || "/placeholder-product.jpg"}
          alt={product.name}
          fill
          className='object-cover transition-transform duration-500 group-hover:scale-105'
        />
        <div className='absolute inset-0 bg-gradient-to-t from-black/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300'></div>
        <div className='absolute top-3 right-3 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-medium text-gray-600 shadow-sm'>
          Stock: {product.stock}
        </div>
      </div>

      <div className='p-6'>
        <h3 className='text-lg font-semibold text-gray-900 mb-2 group-hover:text-gray-700 transition-colors duration-300'>
          {product.name}
        </h3>

        {product.description && (
          <p className='text-gray-500 text-sm mb-4 line-clamp-2 leading-relaxed'>
            {product.description}
          </p>
        )}

        <div className='flex items-center justify-between mb-4'>
          <span className='text-2xl font-bold text-gray-900'>
            {formatPrice(Number(product.price))}
          </span>
          <span className='text-xs text-gray-500 bg-gray-100 px-3 py-1 rounded-full font-medium'>
            {product.category.name}
          </span>
        </div>

        <div className='flex items-center justify-center'>
          {session && product.stock > 0 ? (
            <button
              onClick={handleAddToCart}
              disabled={isAddingToCart}
              className='w-full bg-gray-900 hover:bg-gray-800 disabled:bg-gray-400 text-white px-4 py-3 rounded-xl text-sm font-medium transition-all duration-300 transform hover:scale-105 disabled:transform-none flex items-center justify-center space-x-2 shadow-lg hover:shadow-xl disabled:shadow-none'
            >
              {isAddingToCart ? (
                <>
                  <Loader2 className='h-4 w-4 animate-spin' />
                  <span>Adding...</span>
                </>
              ) : (
                <>
                  <ShoppingCart className='h-4 w-4' />
                  <span>Add to Cart</span>
                </>
              )}
            </button>
          ) : product.stock === 0 ? (
            <span className='w-full text-center text-red-600 text-sm font-medium py-3 px-4 rounded-xl bg-red-50 border border-red-100'>
              Out of Stock
            </span>
          ) : (
            <span className='w-full text-center text-gray-500 text-sm py-3 px-4 rounded-xl bg-gray-50 border border-gray-100'>
              Login to Purchase
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
