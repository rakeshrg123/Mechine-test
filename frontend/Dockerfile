# Step 1: Build the React app using Node.js
FROM node:16 AS build

# Set the working directory
WORKDIR /app

# Copy package.json and package-lock.json to install dependencies
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the frontend code
COPY . .

# Build the React app for production
RUN npm run build

# Step 2: Serve the React app using Nginx
FROM nginx:alpine

# Copy the build from the previous step into the Nginx container
COPY --from=build /app/build /usr/share/nginx/html

# Expose the port that Nginx is listening on
EXPOSE 80

# Start the Nginx server
CMD ["nginx", "-g", "daemon off;"]
