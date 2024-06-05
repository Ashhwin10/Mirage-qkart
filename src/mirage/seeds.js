import { Model } from "miragejs";

export const models = {
  user: Model,
  product: Model,
  cart: Model,
  addresses: Model,
};

export function seeds(server) {
  server.create("user", { username: "testuser", password: "11111111" });
  server.create("user", { username: "Ashwin", password: "11111111" });

  const productData = [
    {
      id: 1,
      name: "iPhone 9",
      price: 549,
      rating: 4.69,
      image: "https://cdn.dummyjson.com/product-images/1/thumbnail.jpg",
    },
    {
      id: 2,
      name: "iPhone X",
      price: 899,
      rating: 4.44,
      image: "https://cdn.dummyjson.com/product-images/2/thumbnail.jpg",
    },
    {
      id: 3,
      name: "Samsung Universe 9",
      price: 1249,
      rating: 4.09,
      image: "https://cdn.dummyjson.com/product-images/3/thumbnail.jpg",
    },
    {
      id: 4,
      name: "OPPOF19",
      price: 280,
      rating: 4.3,
      image: "https://cdn.dummyjson.com/product-images/4/thumbnail.jpg",
    },
    {
      id: 5,
      name: "Huawei P30",
      price: 499,
      rating: 4.09,
      image: "https://cdn.dummyjson.com/product-images/5/thumbnail.jpg",
    },
    {
      id: 6,
      name: "MacBook Pro",
      price: 1749,
      rating: 4.57,
      image: "https://cdn.dummyjson.com/product-images/6/thumbnail.png",
    },
    {
      id: 7,
      name: "Samsung Galaxy Book",
      price: 1499,
      rating: 4.25,
      image: "https://cdn.dummyjson.com/product-images/7/thumbnail.jpg",
    },
    {
      id: 8,
      name: "Microsoft Surface Laptop 4",
      price: 1499,
      rating: 4.43,
      image: "https://cdn.dummyjson.com/product-images/8/thumbnail.jpg",
    },
    {
      id: 9,
      name: "Infinix INBOOK",
      price: 1099,
      rating: 4.54,
      image: "https://cdn.dummyjson.com/product-images/9/thumbnail.jpg",
    },
    {
      id: 10,
      name: "HP Pavilion 15-DK1056WM",
      price: 1099,
      rating: 4.43,
      image: "https://cdn.dummyjson.com/product-images/10/thumbnail.jpeg",
    },
    {
      id: 11,
      name: "perfume Oil",
      price: 13,
      rating: 4.26,
      image: "https://cdn.dummyjson.com/product-images/11/thumbnail.jpg",
    },
    {
      id: 12,
      name: "Brown Perfume",
      price: 40,
      rating: 4,
      image: "https://cdn.dummyjson.com/product-images/12/thumbnail.jpg",
    },
  ];
  productData.forEach((product) => {
    server.create("product", product);
  });
}
