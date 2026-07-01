import { defineStore } from "pinia";
import type { CartItem, Product, ProductVariant } from "~/types/product";


export const useCartStore = defineStore(
  "cart",
  () => {
    const items = ref<CartItem[]>([]);

    const addToCart = (product: Product, qty = 1, selectedVariant: ProductVariant) => {
      const existing = items.value.find((i) => i.product._id === product._id && selectedVariant.color.code === i.selectedVariant.color.code && selectedVariant.size === i.selectedVariant.size);
      if (existing) {
        existing.quantity += qty;
      } else {
        items.value.push({ product, quantity: qty, selectedVariant });
      }
    };

    const increase = (productId: string, selectedVariant: ProductVariant) => {
      const it = items.value.find((i) => i.product._id === productId && selectedVariant.color.code === i.selectedVariant.color.code && selectedVariant.size === i.selectedVariant.size);
      if (it) it.quantity++;
    };

    const decrease = (productId: string, selectedVariant: ProductVariant) => {
      const it = items.value.find((i) => i.product._id === productId && selectedVariant.color.code === i.selectedVariant.color.code && selectedVariant.size === i.selectedVariant.size);
      if (it) {
        it.quantity = Math.max(1, it.quantity - 1);
      }
    };
    const remove = (
      productId: string,
      selectedVariant: ProductVariant
    ) => {
      items.value = items.value.filter(
        (item) =>
          !(
            item.product._id === productId &&
            item.selectedVariant.color.code ===
            selectedVariant.color.code &&
            item.selectedVariant.size ===
            selectedVariant.size
          )
      );
    };

    const clear = () => {
      items.value = [];
    };


    const totalItems = computed(() =>
      items.value.reduce((s, i) => s + i.quantity, 0),
    );

    return { items, addToCart, increase, decrease, remove, clear, totalItems };
  },
  { persist: true },
);

export default useCartStore;
