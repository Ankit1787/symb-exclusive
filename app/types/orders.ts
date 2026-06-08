import type { Address } from "./api";
import type { ProductVariant } from "./product";

export interface Order {
  _id: string;
  orderNumber: string;
  createdAt?: Date| string|number;
  total: number;
  status: "Delivered" | "Cancelled" | "In Transit";
  address:Address;
  items: {
    productId: string;
    title: string;
    thumbnail: string;
    quantity: number;
    variant:ProductVariant
  }[];
}