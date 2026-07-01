import type { Product } from "~/types/product";

export const useProductSearch = () => {
  const { $api } = useNuxtApp();
  const productStore = useProductStore();
  const { products } = storeToRefs(productStore);

  const normalizeProducts = (response: unknown): Product[] => {
    const data = (response as { data?: Product[] })?.data ?? response;
    return Array.isArray(data) ? data : [];
  };

  const searchProducts = async (query: string) => {
    const term = query.trim();
    if (!term) return [];

    try {
      const response = await $api(`/products/search?q=${encodeURIComponent(term)}`);
      return normalizeProducts(response);
    } catch (error) {
      if (!products.value.length) {
        await productStore.fetchProducts();
      }

      const localResults = products.value.filter((product) => {
        const title = (product.title || "").toLowerCase();
        const category = (product.category || "").toLowerCase();
        const needle = term.toLowerCase();
        return title.includes(needle) || category.includes(needle);
      });

      if (localResults.length) return localResults;
      throw error;
    }
  };

  return {
    searchProducts,
  };
};
