export type CollectionType = "best-seller" | "new-arrival" | "flash-sale" | "featured" | string;

export interface ProductColor {
  name: string;
  code: string;
}

export interface ProductVariant {
  color: ProductColor;
  size: "XS" | "S" | "M" | "L" | "XL" | "XXL";
  stock: number;
  price?: number;
  discountPercentage?: number;
  _id?: string;
  id?: number;
}

export interface IProduct {
  _id: string;
  id?: number;
  title: string;
  description: string;
  category: string;
  mrp: number;
  price: number;
  discountPercentage: number;
  rating: number;
  stock: number;
  tags: string[];
  collections?: CollectionType[];
  brand: string;
  warrantyInformation?: string;
  shippingInformation?: string;
  returnPolicy?: string;
  images: string[];
  thumbnail: string;
  variants: ProductVariant[];
}

export interface Product extends IProduct {
  selectedSize?: string;
  selectedColor?: string;
}
export interface ProductVariant {
  color: {
    name: string;
    code: string;
  };
  size: "XS" | "S" | "M" | "L" | "XL" | "XXL";
  stock: number;
}
export interface CartItem {
  product: Product;
  quantity: number;

  selectedVariant: ProductVariant;
}

export interface SingleProductResponse {
  product: Product;
  similarProducts: Product[];
}