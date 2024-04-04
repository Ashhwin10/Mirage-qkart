// MirageJS setup

import { createServer, Model, Response } from "miragejs";

export function MirageSetup() {
  createServer({
    models: {
      user: Model,
      product: Model,
      cart: Model,
      addresses: Model,
    },

    seeds(server) {
      server.create("user", { username: "testuser", password: "11111111" });

      // Pre-setting the cart products
      //   const products = [
      //     { id: 1, name: "iPhone 9", price: 549, rating: 4.69, image: "https://cdn.dummyjson.com/product-images/1/thumbnail.jpg" },
      //     { id: 2, name: "iPhone X", price: 899, rating: 4.44, image: "https://cdn.dummyjson.com/product-images/2/thumbnail.jpg" },

      //   ];
      //   products.forEach((product) => server.create("product", product));
      //   const cart = server.create("cart");
      // const items = [
      //   { product: products[0], qty: 1 },
      //   { product: products[1], qty: 1 },
      // ];
      // cart.update({ items });
    },

    routes() {
      // Post request for register page
      this.post("/api/register", (schema, request) => {
        const requestData = JSON.parse(request.requestBody);
        const existingUser = schema.users.findBy({
          username: requestData.username,
        });
        let newUser = null;

        if (existingUser) {
          newUser = {
            success: false,
            message: "Username already exists, please choose another one",
          };
        } else {
          newUser = schema.users.create(requestData);
          newUser = {
            success: true,
            message: "Username is available",
            data: newUser,
          };
        }

        return newUser;
      });

      // Post request for login page
      this.post("/api/login", (schema, request) => {
        const requestData = JSON.parse(request.requestBody);
        const { username, password } = requestData;

        const user = schema.users.findBy({ username, password });
        let balance = 5000;
        if (user) {
          return {
            success: true,
            message: "Logged in successfully",
            data: {
              username,
              balance,
            },
          };
        } else {
          return {
            success: false,
            message: "Invalid username or password",
          };
        }
      });

      // get request to fetch the products.
      this.get("/api/products", () => {
        return {
          products: [
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
              image:
                "https://cdn.dummyjson.com/product-images/10/thumbnail.jpeg",
            },
            {
              id: 11,
              name: "perfume Oil",
              price: 13,
              rating: 4.26,
              image:
                "https://cdn.dummyjson.com/product-images/11/thumbnail.jpg",
            },
            {
              id: 12,
              name: "Brown Perfume",
              price: 40,
              rating: 4,
              image:
                "https://cdn.dummyjson.com/product-images/12/thumbnail.jpg",
            },
          ],
        };
      });

        // get request for search functionality
        this.get("/products/search", (schema, request) => {
          const { value } = request.queryParams;
          const products = schema.db.products.where(product =>
              product.name.toLowerCase().includes(value.toLowerCase())
          );
          return { products };
      });

      // post request to add products to the cart and edit the quantity of the product.

      this.post("/api/cart", (schema, request) => {
        const requestData = JSON.parse(request.requestBody);
        const { productId, qty, name } = requestData;
        let cart = schema.carts.first() || schema.carts.create();

        if (!Array.isArray(cart.items)) {
          cart.update({ items: [] });
        }
        const existingItem = cart.items.findIndex(
          (item) => item.productId === productId
        );
        if (existingItem !== -1) {
          const updatedItems = cart.items.map((item, index) => {
            if (index === existingItem) {
              return { ...item, qty };
            }
            return item;
          });
          cart.update({ items: updatedItems });
        } else {
          cart.update({
            items: [...cart.items, { productId, name, qty }],
          });
        }

        return cart;
      });

      // get request to fetch the cart details
      this.get("/api/cart", (schema, request) => {
        const cart = schema.carts.first();
        return cart;
      });

      // post request to add addresses
      this.post("/api/checkout/addresses", (schema, request) => {
        const requestData = JSON.parse(request.requestBody);
        const { address } = requestData;
        const createdAddress = schema.addresses.create({ address });

        return createdAddress;
      });


      // get request to fetch and display the addresses
      this.get("/api/checkout/addresses", (schema, request) => {
        const addresses = schema.db.addresses;
        return addresses;
      });

          // post request to delete the addresses
      this.delete("/api/checkout/addresses/:id", (schema, request) => {
        let addressId = request.params.id;
        let address = schema.addresses.find(addressId);
        address.destroy(addressId);
      });

      // Post request for checkout
      this.post("/api/finalcheckout", (schema, request) => {
        const requestData = JSON.parse(request.requestBody);
        const { items, addresses } = requestData;
        let finalData = [items, addresses];
        console.log(" final Checkout Data", finalData);
        return finalData;
      });
      // Post call to clear the cart after checkout
      this.post("/api/clearcart", (schema, request) => {
        const cart = schema.carts.first();
        cart.update({ items: [] });
        return cart;
      });
    },
  });
}
