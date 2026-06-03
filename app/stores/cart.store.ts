import { defineStore } from "pinia";
import type { Product } from "~/types/product";

export interface CartItem {
  product: Product;
  quantity: number;
}

export const useCartStore = defineStore(
  "cart",
  () => {
    const items = ref<CartItem[]>([]);

    const addToCart = (product: Product, qty = 1) => {
      const existing = items.value.find((i) => i.product._id === product._id);
      if (existing) {
        existing.quantity += qty;
      } else {
        items.value.push({ product, quantity: qty });
      }
    };

    const increase = (productId: string) => {
      const it = items.value.find((i) => i.product._id === productId);
      if (it) it.quantity++;
    };

    const decrease = (productId: string) => {
      const it = items.value.find((i) => i.product._id === productId);
      if (it) {
        it.quantity = Math.max(1, it.quantity - 1);
      }
    };

    const remove = (productId: string) => {
      items.value = items.value.filter((i) => i.product._id !== productId);
    };

    const clear = () => {
      items.value = [];
    };
    const addMultipleToCart = (products: Product[]) => {
      products.forEach((product) => {
        addToCart(product);
      });
    };

    const totalItems = computed(() =>
      items.value.reduce((s, i) => s + i.quantity, 0),
    );

    return { items, addToCart,addMultipleToCart, increase, decrease, remove, clear, totalItems };
  },
  { persist: true },
);

export default useCartStore;
