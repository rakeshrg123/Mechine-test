import axios from 'axios';


const API_URL = 'http://localhost:5000/api/product'; 




export const createProduct = (productData, token) => {
    console.log(token);
    
    return axios.post(
      `${API_URL}/create`, 
      productData, 
      {
        headers: {
          Authorization: `Bearer ${token}`, // Attach the token
        },
      }
    );
  };

// Service to get a list of products
export const fetchProducts = (searchQuery = '',token) => {
    const url = searchQuery ? `${API_URL}/filter?name=${searchQuery}` : `${API_URL}/products`;
  
    return axios
      .get(url)
      .then(response => response.data)
      .catch(error => {
        console.error('Error fetching products:', error);
        throw error;
      });
  };
  
// Service to get product details by id
export const fetchProductById = (productId,token) => {
  return axios.get(`${API_URL}/products/${productId}`)
    .then(response => response.data)
    .catch(error => {
      console.error('Error fetching product details:', error);
      throw error;
    });
};

// Service to add a product to the cart
export const addToCart = (productId, quantity,token) => {
  return axios.post(`${API_URL}/cart`, { productId, quantity })
    .then(response => response.data)
    .catch(error => {
      console.error('Error adding to cart:', error);
      throw error;
    });
};

// Service to update product details (admin-only)
export const updateProduct = (productId, productData,token) => {
  return axios.put(`${API_URL}/update/${productId}`, productData, {
    headers: {
      Authorization: `Bearer ${token}`, // Attach the token
    },
  })
    .then(response => response.data)
    .catch(error => {
      console.error('Error updating product:', error);
      throw error;
    });
};

// Service to delete a product (admin-only)
export const deleteProduct = (productId,token) => {
  return axios.delete(`${API_URL}/delete/${productId}`)
    .then(response => response.data)
    .catch(error => {
      console.error('Error deleting product:', error);
      throw error;
    });
};
