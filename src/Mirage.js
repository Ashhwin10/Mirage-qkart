// MirageJS setup

import { createServer, Model } from "miragejs";


export function MirageSetup(){
  
    createServer({
  
      models: {
        user: Model,
      },
    
      routes() {

        // Post request for register page
        this.post("/api/register", (schema, request) => {
          const requestData = JSON.parse(request.requestBody);
          const newUser = schema.users.create(requestData);
          return newUser;
        });

        // Post request for login page
        this.post("/api/login", (schema, request) => {
          const requestData = JSON.parse(request.requestBody); 
          const { username, password } = requestData; 
    
          const user = schema.users.findBy({ username, password });
          if (user) {
            return {
              success: true,
              message: "Logged in successfully",
            };
          } else {
            return {
              success: false,
              message: "Invalid username or password",
            };
          }
        });
      },
    });
  }