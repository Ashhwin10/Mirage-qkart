
export function routes() {
  this.post("/api/register", (schema, request) => {
    const requestData = JSON.parse(request.requestBody);
    const existingUser = schema.users.findBy({
      username: requestData.username,
    });
    let newUser = null;

    if (existingUser) {
      return {
        success: false,
        message: "Username is not available",
      };
    } else {
      newUser = schema.users.create(requestData);
      return {
        success: true,
        message: "Username is available",
        data: newUser,
      };
    }
  });


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

 
  this.get("/api/products", (schema) => {
    return schema.products.all();
  });

  
  this.get("/products/search", (schema, request) => {
    const { value } = request.queryParams;
    const products = schema.db.products.where((product) =>
      product.name.toLowerCase().includes(value.toLowerCase())
    );
    return { products };
  });

 

  this.post("/api/cart", (schema, request) => {
    const { productId, qty, name } = JSON.parse(request.requestBody);
    const cart = schema.carts.first() || schema.carts.create({ items: [] });

    const existingItemIndex = cart.items.findIndex( 
      (item) => item.productId === productId
    );
    if (existingItemIndex !== -1) {
      cart.items[existingItemIndex] = {...cart.items[existingItemIndex],qty, };
    } else {
      cart.items.push({ productId, name, qty });
    }
    return cart;
  });

  this.get("/api/cart", (schema, request) => {
    return schema.carts.first();
  });


  this.post("/api/checkout/addresses", (schema, request) => {
    const { address } = JSON.parse(request.requestBody);
    return schema.addresses.create({ address });
  });


  this.get("/api/checkout/addresses", (schema, request) => {
    return schema.db.addresses;
  });

  
  this.delete("/api/checkout/addresses/:id", (schema, request) => {
    const addressId = request.params.id;
    return schema.addresses.find(addressId).destroy();

  });

 
  this.post("/api/finalcheckout", (schema, request) => {
    const { items, addresses } = JSON.parse(request.requestBody);
    return [items, addresses];
  });

  
  this.post("/api/clearcart", (schema, request) => {
    return schema.carts.first().update({ items: [] });
    
  });
}
