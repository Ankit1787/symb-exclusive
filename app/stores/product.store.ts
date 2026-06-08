import { defineStore } from "pinia";
import type { Ref } from "vue";
import type { Product, SingleProductResponse } from "~/types/product";

type FetchOptions = {
  force?: boolean;
};

export const useProductStore = defineStore("product", () => {
  const products = ref<Product[]>([]);
  const collections = ref<Product[]>([]);
  const  categoryProducts = ref<Product[]>([]);
  const currentProduct = ref<Product | null>(null);
  const similarProducts = ref<Product[]>([]);
  const saleProducts = ref<Product[]>([]);
  const bestSellers = ref<Product[]>([]);
  const newArrivals = ref<Product[]>([]);
  const featuredProducts = ref<Product[]>([]);
  const categories = ref<string[]>([]);
  const { getAllProducts, getProductDetails, getProductsByCollection, getProductByCategory } =
    useProductApi();
  const productsLoading = ref(false);
  const collectionLoading = ref(false);
  const categoryProductsLoading = ref(false);
  const productDetailsLoading = ref(false);
  const relatedProductsLoading = ref(false);
  const bestSellerLoading = ref(false);
  const newArrivalLoading = ref(false);
  const flashSaleLoading = ref(false);
  const featuredLoading = ref(false);
  const loading = computed(() => productsLoading.value);
  const collectionCache = ref<Record<string, Product[]>>({});
  const categoryProductsCache = ref<Record<string, Product[]>>({});
  const productCache = ref<Record<string, SingleProductResponse>>({});
  const productsRequest = shallowRef<Promise<void> | null>(null);
  const collectionRequests = shallowRef<Record<string, Promise<void>>>({});
  const categoryRequests = shallowRef<Record<string, Promise<void>>>({});
  const productRequests = shallowRef<Record<string, Promise<void>>>({});

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
  const fetchProducts = async (options: FetchOptions = {}) => {
    if (!options.force && products.value.length) return;
    if (productsRequest.value) return productsRequest.value;

    productsRequest.value = (async () => {
    try {
      productsLoading.value = true;

      const response = await getAllProducts();
      products.value = response;
    } catch (err) {
    } finally {
      productsLoading.value = false;
      productsRequest.value = null;
    }
    })();

    return productsRequest.value;
  };
  const fetchSingleProduct = async (id: string, options: FetchOptions = {}) => {
    if (!options.force && productCache.value[id]) {
      currentProduct.value = productCache.value[id].product;
      similarProducts.value = productCache.value[id].similarProducts;
      return;
    }
    if (productRequests.value[id]) {
      await productRequests.value[id];
      if (productCache.value[id]) {
        currentProduct.value = productCache.value[id].product;
        similarProducts.value = productCache.value[id].similarProducts;
      }
      return;
    }

    productRequests.value[id] = (async () => {
    try {
      productDetailsLoading.value = true;
      relatedProductsLoading.value = true;
      const response = await getProductDetails(id);
      currentProduct.value = response.product;
      similarProducts.value = response.similarProducts;
      productCache.value[id] = response;
    } catch (err) {
    } finally {
      productDetailsLoading.value = false;
      relatedProductsLoading.value = false;
      delete productRequests.value[id];
    }
    })();

    return productRequests.value[id];
  };
  const fetchProductsByCollection = async (
    collection: string,
    commonstate: boolean = false,
    options: FetchOptions = {},
  ) => {
    if (!options.force && collectionCache.value[collection]) {
      const cachedProducts = collectionCache.value[collection];
      if (commonstate) collections.value = cachedProducts;
      else updateState(collection, cachedProducts);
      return;
    }
    if (collectionRequests.value[collection]) {
      await collectionRequests.value[collection];
      const cachedProducts = collectionCache.value[collection];
      if (cachedProducts) {
        if (commonstate) collections.value = cachedProducts;
        else updateState(collection, cachedProducts);
      }
      return;
    }

    collectionRequests.value[collection] = (async () => {
    try {
      setCollectionLoading(collection, true, commonstate);
      const response = await getProductsByCollection(collection);
      collectionCache.value[collection] = response;
      if (commonstate) collections.value = response;
      else updateState(collection, response);
    } catch (err) {
    } finally {
      setCollectionLoading(collection, false, commonstate);
      delete collectionRequests.value[collection];
    }
    })();

    return collectionRequests.value[collection];
  };
  const fetchProductsByCategory = async (
    category: string,
    options: FetchOptions = {},
  ) => {
    if (!options.force && categoryProductsCache.value[category]) {
      categoryProducts.value = categoryProductsCache.value[category];
      return;
    }
    if (categoryRequests.value[category]) {
      await categoryRequests.value[category];
      const cachedProducts = categoryProductsCache.value[category];
      if (cachedProducts) {
        categoryProducts.value = cachedProducts;
      }
      return;
    }

    categoryRequests.value[category] = (async () => {
      try {
        categoryProductsLoading.value = true;
        const response = await getProductByCategory(category);
        categoryProductsCache.value[category] = response;
        categoryProducts.value = response;
      } catch (err) {
        console.error("Error fetching products by category:", err);
      } finally {
        categoryProductsLoading.value = false;
        delete categoryRequests.value[category];
      }
    })();

    return categoryRequests.value[category];
  };

  const fetchHomeProducts = async (options: FetchOptions = {}) => {
    await Promise.all([
      fetchProducts(options),
      fetchProductsByCollection("best-seller", false, options),
      fetchProductsByCollection("new-arrival", false, options),
      fetchProductsByCollection("flash-sale", false, options),
      fetchProductsByCollection("featured", false, options),
    ]);
  };

  return {
    products,
    similarProducts,
    currentProduct,
    addProduct,
    removeProduct,
    fetchProducts,
    fetchHomeProducts,
    fetchSingleProduct,
    fetchProductsByCollection,
    fetchProductsByCategory,
    collections,
    categoryProducts,
    saleProducts,
    bestSellers,
    newArrivals,
    featuredProducts,
    categories,
    loading,
    productsLoading,
    collectionLoading,
    categoryProductsLoading,
    productDetailsLoading,
    relatedProductsLoading,
    bestSellerLoading,
    newArrivalLoading,
    flashSaleLoading,
    featuredLoading,
  };
});
