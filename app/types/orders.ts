import type { Address } from "./api";
import type { ProductVariant } from "./product";

export interface Order {
  _id: string;
  orderNumber: string;
  createdAt?: Date| string|number;
  total: number;
  status: "Delivered" | "Cancelled" |"Pending" | "Confirmed" | "Shipped"|"Returned";
  address:Address;
  items: {
    productId: string;
    title: string;
    price:number;
    thumbnail: string;
    quantity: number;
    variant:ProductVariant
  }[];
    orderTimeline?:orderTimeline[]
paymentMethod?: string;
paymentStatus?: "pending" | "completed" | "failed";
  notes?: string;
    updatedAt?: Date;

}

export interface orderTimeline{
    title?:string,
    date?:string,
    description?:string
}
