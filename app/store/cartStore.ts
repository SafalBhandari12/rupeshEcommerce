import { create } from "zustand";
import { CartItem } from "@/app/types";

interface CartStore {
  items: CartItem[];
  isLoading: boolean;
  fetchCartItems: (userId: string) => Promise<void>;
  addToCart: (
    userId: string,
    productId: string,
    quantity?: number
  ) => Promise<void>;
  updateQuantity: (itemId: string, quantity: number) => Promise<void>;
  removeFromCart: (itemId: string) => Promise<void>;
  clearCart: (userId: string) => Promise<void>;
  getTotal: () => number;
  getItemCount: () => number;
}

export const useCartStore = create<CartStore>((set, get) => ({
  items: [],
  isLoading: false,

  fetchCartItems: async (userId: string) => {
    set({ isLoading: true });
    try {
      const response = await fetch(`/api/cart?userId=${userId}`);
      if (response.ok) {
        const items = await response.json();
        set({ items });
      }
    } catch (error) {
      console.error("Failed to fetch cart items:", error);
    } finally {
      set({ isLoading: false });
    }
  },

  addToCart: async (userId: string, productId: string, quantity = 1) => {
    try {
      const response = await fetch("/api/cart", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, productId, quantity }),
      });

      if (response.ok) {
        await get().fetchCartItems(userId);
      }
    } catch (error) {
      console.error("Failed to add to cart:", error);
    }
  },

  updateQuantity: async (itemId: string, quantity: number) => {
    try {
      const response = await fetch("/api/cart", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ itemId, quantity }),
      });

      if (response.ok) {
        const { items } = get();
        const userId = items[0]?.userId;
        if (userId) {
          await get().fetchCartItems(userId);
        }
      }
    } catch (error) {
      console.error("Failed to update quantity:", error);
    }
  },

  removeFromCart: async (itemId: string) => {
    try {
      const response = await fetch("/api/cart", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ itemId }),
      });

      if (response.ok) {
        const { items } = get();
        const userId = items[0]?.userId;
        if (userId) {
          await get().fetchCartItems(userId);
        }
      }
    } catch (error) {
      console.error("Failed to remove from cart:", error);
    }
  },

  clearCart: async (userId: string) => {
    try {
      const response = await fetch(`/api/cart/clear`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId }),
      });

      if (response.ok) {
        set({ items: [] });
      }
    } catch (error) {
      console.error("Failed to clear cart:", error);
    }
  },

  getTotal: () => {
    const { items } = get();
    return items.reduce(
      (total, item) => total + item.product.price * item.quantity,
      0
    );
  },

  getItemCount: () => {
    const { items } = get();
    return items.reduce((count, item) => count + item.quantity, 0);
  },
}));
