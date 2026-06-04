import { defineStore } from "pinia";
import type { Ref } from "vue";
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
  const productsLoading = ref(false);
  const collectionLoading = ref(false);
  const productDetailsLoading = ref(false);
  const relatedProductsLoading = ref(false);
  const bestSellerLoading = ref(false);
  const newArrivalLoading = ref(false);
  const flashSaleLoading = ref(false);
  const featuredLoading = ref(false);
  const loading = computed(() => productsLoading.value);

  const collectionLoadingMap: Record<string, Ref<boolean>> = {
    "": productsLoading,
    "best-seller": bestSellerLoading,
    "new-arrival": newArrivalLoading,
    "flash-sale": flashSaleLoading,
    featured: featuredLoading,
  };

  const setCollectionLoading = (
    collection: string,
    value: boolean,
    commonstate = false,
  ) => {
    if (commonstate) {
      collectionLoading.value = value;
      return;
    }

    const target = collectionLoadingMap[collection];
    if (target) target.value = value;
  };

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

      case "featured":
        featuredProducts.value = val;
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
      productsLoading.value = true;

      const response = await getAllProducts();
      products.value = response;
    } catch (err) {
    } finally {
      productsLoading.value = false;
    }
  };
  const fetchSingleProduct = async (id: string) => {
    try {
      productDetailsLoading.value = true;
      relatedProductsLoading.value = true;
      const response = await getProductDetails(id);
      currentProduct.value = response.product;
      similarProducts.value = response.similarProducts;
    } catch (err) {
    } finally {
      productDetailsLoading.value = false;
      relatedProductsLoading.value = false;
    }
  };
  const fetchProductsByCollection = async (
    collection: string,
    commonstate: boolean = false,
  ) => {
    try {
      setCollectionLoading(collection, true, commonstate);
      const response = await getProductsByCollection(collection);
      if (commonstate) collections.value = response;
      else updateState(collection, response);
    } catch (err) {
    } finally {
      setCollectionLoading(collection, false, commonstate);
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
    productsLoading,
    collectionLoading,
    productDetailsLoading,
    relatedProductsLoading,
    bestSellerLoading,
    newArrivalLoading,
    flashSaleLoading,
    featuredLoading,
  };
});
