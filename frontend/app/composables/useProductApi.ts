import type { ApiResponse } from "~/types/api";
import type { Product, SingleProductResponse } from "~/types/product";

export const useProductApi = () => {
   const { $api } = useNuxtApp();

   const getAllProducts = async () => {
      const response = await $api<ApiResponse<Product[]>>('/products');
      return response.data;
   }
   const getProductsByCollection = async (collection: string) => {
      const response = await $api<ApiResponse<Product[]>>(`/products/collections/${collection ?? ""}`);
      return response.data;
   }
   const getProductByCategory = async (category: string) => {
      const response = await $api<ApiResponse<Product[]>>(`/products/category/${category ?? ""}`);
      return response.data;
   }
   const getProductDetails = async (id: string) => {
      const response = await $api<ApiResponse<SingleProductResponse>>(`/products/${id}`);
      return response.data;
   }


   return {
      getAllProducts,
      getProductDetails,
      getProductsByCollection,
      getProductByCategory
   }
}