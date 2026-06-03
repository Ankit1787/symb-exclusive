import { defineStore } from "pinia";
import type { Product } from "~/types/product";

export const useWishlistStore = defineStore(
  "wishlist",
  () => {
    const items = ref<Product[]>([]);

    const add = (product: Product) => {
      if (!items.value.find((p) => p._id === product._id)) {
        items.value.push(product);
      }
    };

    const remove = (productId: string) => {
      items.value = items.value.filter((p) => p._id !== productId);
    };

    const toggle = (product: Product) => {
      const exists = items.value.find((p) => p._id === product._id);
      if (exists) remove(product._id);
      else add(product);
    };
    const clear = () => {
      items.value = [];
    };
    const contains = (productId: string) =>
      !!items.value.find((p) => p._id === productId);
    const count = computed(() => items.value.length);

    return { items, add, remove,clear, toggle, contains, count };
  },
  { persist: true },
);

export default useWishlistStore;
