# Step 1: Set up the Node.js app
FROM node:16

# Set the working directory
WORKDIR /app

# Copy package.json and package-lock.json to install dependencies
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the backend code
COPY . .

# Expose the port that the backend API will run on (default is 5000)
EXPOSE 5000

# Start the backend server (using "dev" script with nodemon for development)
CMD ["npm", "run", "dev"]
