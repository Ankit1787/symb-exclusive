import type { Order } from "~/types/orders";

export const products = [
  {
    id: 1,
    name: "HAVIT HV-G92 Gamepad",
    price: 120,
    oldPrice: 160,
    rating: 88,
    reviews: 88,
    tag: "-40%",
    art: "gamepad",
    color: "#f4f4f4",
  },
  {
    id: 2,
    name: "AK-900 Wired Keyboard",
    price: 960,
    oldPrice: 1160,
    rating: 75,
    reviews: 75,
    tag: "-35%",
    art: "keyboard",
    color: "#f4f4f4",
  },
  {
    id: 3,
    name: "IPS LCD Gaming Monitor",
    price: 370,
    oldPrice: 400,
    rating: 99,
    reviews: 99,
    tag: "-30%",
    art: "monitor",
    color: "#f4f4f4",
  },
  {
    id: 4,
    name: "S-Series Comfort Chair",
    price: 375,
    oldPrice: 400,
    rating: 99,
    reviews: 99,
    tag: "-25%",
    art: "chair",
    color: "#f4f4f4",
  },
  {
    id: 5,
    name: "The north coat",
    price: 260,
    oldPrice: 360,
    rating: 65,
    reviews: 65,
    art: "jacket",
    color: "#f4f4f4",
  },
  {
    id: 6,
    name: "Gucci duffle bag",
    price: 960,
    oldPrice: 1160,
    rating: 65,
    reviews: 65,
    art: "bag",
    color: "#f4f4f4",
  },
  {
    id: 7,
    name: "RGB liquid CPU Cooler",
    price: 160,
    oldPrice: 170,
    rating: 65,
    reviews: 65,
    art: "cooler",
    color: "#f4f4f4",
  },
  {
    id: 8,
    name: "Small BookSelf",
    price: 360,
    rating: 65,
    reviews: 65,
    art: "shelf",
    color: "#f4f4f4",
  },
  {
    id: 9,
    name: "Breed Dry Dog Food",
    price: 100,
    rating: 35,
    reviews: 35,
    art: "dog-food",
    color: "#f4f4f4",
  },
  {
    id: 10,
    name: "CANON EOS DSLR Camera",
    price: 360,
    rating: 95,
    reviews: 95,
    art: "camera",
    color: "#f4f4f4",
  },
  {
    id: 11,
    name: "ASUS FHD Gaming Laptop",
    price: 700,
    rating: 325,
    reviews: 325,
    art: "laptop",
    color: "#f4f4f4",
  },
  {
    id: 12,
    name: "Curology Product Set",
    price: 500,
    rating: 145,
    reviews: 145,
    art: "skincare",
    color: "#f4f4f4",
  },
  {
    id: 13,
    name: "Kids Electric Car",
    price: 960,
    rating: 65,
    reviews: 65,
    tag: "NEW",
    art: "car",
    color: "#f4f4f4",
  },
  {
    id: 14,
    name: "Jr. Zoom Soccer Cleats",
    price: 1160,
    rating: 35,
    reviews: 35,
    art: "shoe",
    color: "#f4f4f4",
  },
  {
    id: 15,
    name: "GP11 Shooter USB Gamepad",
    price: 660,
    rating: 55,
    reviews: 55,
    tag: "NEW",
    art: "pad",
    color: "#f4f4f4",
  },
  {
    id: 16,
    name: "Quilted Satin Jacket",
    price: 660,
    rating: 55,
    reviews: 55,
    art: "jacket-green",
    color: "#f4f4f4",
  },
];

export const cartItems = [
  { ...products[0], qty: 2 },
  { ...products[2], qty: 1 },
];
export const CategoriesMap: Record<string, string> = {
  fragrances: "Fragrances",
  furniture: "Furniture",
  groceries: "Groceries",
  "home-decoration": "Home Decoration",
  "kitchen-accessories": "Kitchen Accessories",
  laptops: "Laptops",
  "mens-shirts": "Men's Shirts",
  "mens-shoes": "Men's Shoes",
  "mens-watches": "Men's Watches",
  "mobile-accessories": "Mobile Accessories",
  motorcycle: "Motorcycle",
  "skin-care": "Skin Care",
  smartphones: "Smartphones",
};
export const categories = Object.values(CategoriesMap);


export const browseCategories = [
  { name: "Phones", image: "/assets/cellphone.svg",to:"smartphones" },
  {
    name: "Computers",
    image: "/assets/computer.svg",
    to:"laptops"
  },
  {
    name: "SmartWatch",
    image: "/assets/smartwatch.svg",
    to:"mens-watches"
  },
  {
    name: "Camera",
    image: "/assets/camera.svg",
    to:"mobile-accessories"
  },
  {
    name: "HeadPhones",
    image: "/assets/headphone.svg",
    to:"mobile-accessories"
  },
  {
    name: "Gaming",
    image: "/assets/gamepad.svg",
    to:"mobile-accessories"
  },
];
export const dummyOrders: Order[] = [
  {
    "_id": "ORD001",
    "orderNumber": "EX-902341",
    "total": 1250,
    "status": "Delivered",
    "createdAt": "2025-10-24T10:30:00.000Z",
    "address": {
      "addressLine1": "Sector 21",
      "addressLine2": "",
      "city": "Faridabad",
      "state": "Haryana",
      "postalCode": "121001",
      "country": "India"
    },
    "items": [
      {
        "productId": "6a1e8ff77f4639b97ce64d4e",
        "title": "HAVIT HV-G92 Gamepad",
        "thumbnail": "https://cdn.dummyjson.com/product-images/fragrances/calvin-klein-ck-one/thumbnail.webp",
        "quantity": 1,
        "variant": {
          "color": {
            "name": "Black",
            "code": "#000000"
          },
          "size": "M",
          "stock": 10
        }
      },
      {
        "productId": "6a1e8ff77f4639b97ce64d4f",
        "title": "AK-900 Wired Keyboard",
        "thumbnail": "https://cdn.dummyjson.com/product-images/fragrances/chanel-coco-noir-eau-de/thumbnail.webp",
        "quantity": 1,
        "variant": {
          "color": {
            "name": "White",
            "code": "#FFFFFF"
          },
          "size": "L",
          "stock": 12
        }
      }
    ]
  },
  {
    "_id": "ORD002",
    "orderNumber": "EX-902342",
    "total": 340,
    "status": "In Transit",
    "createdAt": "2025-10-26T12:20:00.000Z",
    "address": {
      "addressLine1": "DLF Phase 3",
      "addressLine2": "",
      "city": "Gurgaon",
      "state": "Haryana",
      "postalCode": "122001",
      "country": "India"
    },
    "items": [
      {
        "productId": "6a1e8ff77f4639b97ce64d50",
        "title": "IPS LCD Gaming Monitor",
        "thumbnail": "https://cdn.dummyjson.com/product-images/fragrances/dior-j'adore/thumbnail.webp",
        "quantity": 1,
        "variant": {
          "color": {
            "name": "Black",
            "code": "#000000"
          },
          "size": "XL",
          "stock": 6
        }
      }
    ]
  },
  {
    "_id": "ORD003",
    "orderNumber": "EX-902343",
    "total": 5400,
    "status": "Cancelled",
    "createdAt": "2025-11-01T09:15:00.000Z",
    "address": {
      "addressLine1": "MG Road",
      "addressLine2": "",
      "city": "Bangalore",
      "state": "Karnataka",
      "postalCode": "560001",
      "country": "India"
    },
    "items": [
      {
        "productId": "6a1e8ff77f4639b97ce64d51",
        "title": "Comfort Chair",
        "thumbnail": "https://cdn.dummyjson.com/product-images/fragrances/dolce-shine-eau-de/thumbnail.webp",
        "quantity": 2,
        "variant": {
          "color": {
            "name": "Gray",
            "code": "#6B7280"
          },
          "size": "L",
          "stock": 15
        }
      }
    ]
  },
  {
    "_id": "ORD004",
    "orderNumber": "EX-902344",
    "total": 1899,
    "status": "Delivered",
    "createdAt": "2025-11-03T14:10:00.000Z",
    "address": {
      "addressLine1": "Civil Lines",
      "addressLine2": "",
      "city": "Delhi",
      "state": "Delhi",
      "postalCode": "110001",
      "country": "India"
    },
    "items": [
      {
        "productId": "6a1e8ff77f4639b97ce64d52",
        "title": "Men's T-Shirt",
        "thumbnail": "https://cdn.dummyjson.com/product-images/fragrances/gucci-bloom-eau-de/thumbnail.webp",
        "quantity": 3,
        "variant": {
          "color": {
            "name": "Black",
            "code": "#000000"
          },
          "size": "M",
          "stock": 20
        }
      }
    ]
  },
  {
    "_id": "ORD005",
    "orderNumber": "EX-902345",
    "total": 799,
    "status": "In Transit",
    "createdAt": "2025-11-05T16:40:00.000Z",
    "address": {
      "addressLine1": "Rajendra Nagar",
      "addressLine2": "",
      "city": "Patna",
      "state": "Bihar",
      "postalCode": "800001",
      "country": "India"
    },
    "items": [
      {
        "productId": "6a1e8ff77f4639b97ce64d53",
        "title": "Women's Hoodie",
        "thumbnail": "https://cdn.dummyjson.com/product-images/furniture/annibale-colombo-bed/thumbnail.webp",
        "quantity": 1,
        "variant": {
          "color": {
            "name": "Red",
            "code": "#DC2626"
          },
          "size": "L",
          "stock": 10
        }
      }
    ]
  },
  {
    "_id": "ORD006",
    "orderNumber": "EX-902346",
    "total": 1499,
    "status": "Delivered",
    "createdAt": "2025-11-08T11:30:00.000Z",
    "address": {
      "addressLine1": "Sector 62",
      "addressLine2": "",
      "city": "Noida",
      "state": "UP",
      "postalCode": "201301",
      "country": "India"
    },
    "items": [
      {
        "productId": "6a1e8ff77f4639b97ce64d54",
        "title": "Running Shoes",
        "thumbnail": "https://cdn.dummyjson.com/product-images/furniture/annibale-colombo-sofa/thumbnail.webp",
        "quantity": 1,
        "variant": {
          "color": {
            "name": "Blue",
            "code": "#2563EB"
          },
          "size": "XL",
          "stock": 8
        }
      }
    ]
  },
  {
    "_id": "ORD007",
    "orderNumber": "EX-902347",
    "total": 999,
    "status": "Delivered",
    "createdAt": "2025-11-12T08:00:00.000Z",
    "address": {
      "addressLine1": "Banjara Hills",
      "addressLine2": "",
      "city": "Hyderabad",
      "state": "Telangana",
      "postalCode": "500034",
      "country": "India"
    },
    "items": [
      {
        "productId": "6a1e8ff77f4639b97ce64d55",
        "title": "Denim Jacket",
        "thumbnail": "https://cdn.dummyjson.com/product-images/furniture/bedside-table-african-cherry/thumbnail.webp",
        "quantity": 1,
        "variant": {
          "color": {
            "name": "Blue",
            "code": "#2563EB"
          },
          "size": "L",
          "stock": 9
        }
      }
    ]
  },
  {
    "_id": "ORD008",
    "orderNumber": "EX-902348",
    "total": 499,
    "status": "Cancelled",
    "createdAt": "2025-11-15T15:25:00.000Z",
    "address": {
      "addressLine1": "Anna Nagar",
      "addressLine2": "",
      "city": "Chennai",
      "state": "Tamil Nadu",
      "postalCode": "600040",
      "country": "India"
    },
    "items": [
      {
        "productId": "6a1e8ff77f4639b97ce64d56",
        "title": "Polo Shirt",
        "thumbnail": "https://cdn.dummyjson.com/product-images/furniture/knoll-saarinen-executive-conference-chair/thumbnail.webp",
        "quantity": 1,
        "variant": {
          "color": {
            "name": "White",
            "code": "#FFFFFF"
          },
          "size": "M",
          "stock": 15
        }
      }
    ]
  },
  {
    "_id": "ORD009",
    "orderNumber": "EX-902349",
    "total": 699,
    "status": "Delivered",
    "createdAt": "2025-11-18T09:50:00.000Z",
    "address": {
      "addressLine1": "Lalbagh",
      "addressLine2": "",
      "city": "Lucknow",
      "state": "UP",
      "postalCode": "226001",
      "country": "India"
    },
    "items": [
      {
        "productId": "6a1e8ff77f4639b97ce64d57",
        "title": "Sports Shorts",
        "thumbnail": "https://cdn.dummyjson.com/product-images/furniture/wooden-bathroom-sink-with-mirror/thumbnail.webp",
        "quantity": 2,
        "variant": {
          "color": {
            "name": "Black",
            "code": "#000000"
          },
          "size": "L",
          "stock": 12
        }
      }
    ]
  },
  {
    "_id": "ORD010",
    "orderNumber": "EX-902350",
    "total": 2200,
    "status": "In Transit",
    "createdAt": "2025-11-20T13:15:00.000Z",
    "address": {
      "addressLine1": "Andheri West",
      "addressLine2": "",
      "city": "Mumbai",
      "state": "Maharashtra",
      "postalCode": "400053",
      "country": "India"
    },
    "items": [
      {
        "productId": "6a1e8ff77f4639b97ce64d4e",
        "title": "HAVIT HV-G92 Gamepad",
        "thumbnail": "https://cdn.dummyjson.com/product-images/fragrances/calvin-klein-ck-one/thumbnail.webp",
        "quantity": 2,
        "variant": {
          "color": {
            "name": "Black",
            "code": "#000000"
          },
          "size": "L",
          "stock": 7
        }
      }
    ]
  }
]