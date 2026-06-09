import type { ApiResponse } from "~/types/api";

export const useOrderApi = () => {
   const { $api } = useNuxtApp();

   const getAllOrders = async () => {
      const response = await $api<ApiResponse<any[]>>('/orders');
      return response.data;
   };

   const getUserOrders = async () => {
      const response = await $api<ApiResponse<any[]>>(`/orders`);
      return response.data;
   };
   const getUserOrdersByStatus = async (status: string) => {
      const response = await $api<ApiResponse<any[]>>(`/orders/status/${status}`);
      return response.data;
   };

   const getOrderById = async (orderId: string) => {
      const response = await $api<ApiResponse<any>>(`/orders/${orderId}`);
      return response.data;
   };

   const createOrder = async (payload: any) => {
      const response = await $api<ApiResponse<any>>('/orders/create', {
         method: 'POST',
         body: payload
      });
      return response;
   };

   return {
      getAllOrders,
      getUserOrders,
      getOrderById,
      getUserOrdersByStatus,
      createOrder
   };
};
