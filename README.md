# E-commerce Application with Product Variants

## Overview
This is a full-stack e-commerce application with product variants. The application allows users to register, login, manage their cart, and interact with products and variants. It also includes an admin dashboard for managing products and variants.

## Tech Stack
- **Backend:** Node.js, Express, MongoDB (Atlas)
- **Frontend:** React, Redux, MUI, Axios
- **State Management:** Redux
- **Styling:** Material UI and SASS
- **Containerization:** Docker

## Backend Setup

### Prerequisites
- Node.js
- MongoDB Atlas account (for database setup)
- JWT Secret for authentication

### Installation
1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/e-commerce-app.git
   cd e-commerce-app/backend
## Install dependencies:

npm install

## Set up MongoDB Atlas:

Create a cluster in MongoDB Atlas and get the connection string.
Set the MONGODB_URI environment variable in .env file (or Docker).

## Start the server:


npm start
Frontend Setup
Prerequisites
Node.js
JWT token from the backend
Installation
## Clone the repository:


git clone https://github.com/yourusername/e-commerce-app.git
cd e-commerce-app/frontend
## Install dependencies:


npm install
## Run the React app:


npm start
Running with Docker
## Clone the repository:


git clone https://github.com/yourusername/e-commerce-app.git
cd e-commerce-app
## Build the Docker containers:
docker-compose build
## Start the containers:


docker-compose up
Access the frontend at http://localhost.

Access the backend API at http://localhost:5000.

API Endpoints
## User Authentication:

POST /api/auth/register: Register a new user.
POST /api/auth/login: Login an existing user.
## Product Management (Admin only):

GET /api/product: List all products.
POST /api/product: Create a new product.
PUT /api/product/:id: Update a product.
DELETE /api/product/:id: Delete a product.
## Variant Management:

POST /api/product/:productId/variants: Add a new variant to a product.
GET /api/product/:productId/variants: List all variants for a product.
PUT /api/product/:productId/variants/:variantId: Update a variant.
DELETE /api/product/:productId/variants/:variantId: Delete a variant.
## Cart Management:

POST /api/cart/addtocart: Add product to cart.
GET /api/cart/:userId: View user cart.
PUT /api/cart/:userId: Update cart item.
DELETE /api/cart/:userId: Clear cart.
