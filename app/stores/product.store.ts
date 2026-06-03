import { defineStore } from "pinia";
import type { Product } from "~/types/product";
export const useProductStore = defineStore("product", () => {
  const products = ref<Product[]>([]);
  const collections = ref<Product[]>([]);
  const currentProduct = ref<Product | null>(null);
  const similarProducts = ref<Product[]>([]);
  const saleProducts = ref<Product[]>([]);
  const bestSellers = ref<Product[]>([]);
  const newArrivals = ref<Product[]>([]);
  const featuredProducts = ref<Product[]>([]);
  const categories = ref<string[]>([]);
  const { getAllProducts, getProductDetails, getProductsByCollection } =
    useProductApi();
  const loading = ref(false);
  const addProduct = (product: Product) => {
    products.value.push(product);
  };
  
  const updateState = (collection: string, val: Product[]) => {
    switch (collection) {
      case "":
        products.value = val;
        break;

      case "best-seller":
        bestSellers.value = val;
        break;

      case "new-arrival":
        newArrivals.value = val;
        break;
      case "flash-sale":
        saleProducts.value = val;
        break;
      

      default:
        break;
    }
  };

  const removeProduct = (product: Product) => {
    products.value = products.value.filter((p) => p.id !== product.id);
  };
  const fetchProducts = async () => {
    try {
      loading.value = true;

      const response = await getAllProducts();
      products.value = response;
    } catch (err) {
    } finally {
      loading.value = false;
    }
  };
  const fetchSingleProduct = async (id: string) => {
    try {
      const response = await getProductDetails(id);
      currentProduct.value = response.product;
      similarProducts.value = response.similarProducts;
    } catch (err) {
    } finally {
    }
  };
  const fetchProductsByCollection = async (
    collection: string,
    commonstate: boolean = false,
  ) => {
    try {
      const response = await getProductsByCollection(collection);
      if (commonstate) collections.value = response;
      else updateState(collection, response);
    } catch (err) {
    } finally {
    }
  };

  return {
    products,
    similarProducts,
    currentProduct,
    addProduct,
    removeProduct,
    fetchProducts,
    fetchSingleProduct,
    fetchProductsByCollection,
    collections,
    saleProducts,
    bestSellers,
    newArrivals,
    featuredProducts,
    categories,
    loading,
  };
});
