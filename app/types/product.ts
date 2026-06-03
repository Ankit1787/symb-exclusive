
export interface Product {
  _id: string;
  id: string;
  title: string;
  description: string;
  price: number;
  mrp: number;
  discountPercentage: number;
  images: string[];
  thumbnail:string,
  returnPolicy?:string,
  category: string;
  rating?: number;
  stock?: number;
}

export interface SingleProductResponse{
  product:Product
  similarProducts:Product[]
}