import axios from 'axios';


const API_URL = 'http://localhost:5000/api/cart'; 


export const getCartCount = (id, token) => {
    return axios
      .get(`${API_URL}/count/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((response) => response.data)
      .catch((error) => {
        console.error('Error fetching cart count:', error);
        throw error;
      });
  };
  
  export const addToCart = (userId, productId, variantId, quantity, token) => {
    return axios
      .post(
        `${API_URL}/addtocart`,
        {
          userId,
          productId,
          variantId,
          quantity,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      )
      .then((response) => response.data)
      .catch((error) => {
        console.error('Error adding product to cart:', error);
        throw new Error(error.response?.data?.message || 'Failed to add to cart');
      });
  };
  
  export const getCart = (userId, token) => {
    return axios
      .get(`${API_URL}/${userId}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((response) => response.data)
      .catch((error) => {
        console.error('Error fetching cart:', error);
        throw error;
      });
  };
  
  export const updateCartItem = (userId, updateData, token) => {
    return axios
      .put(`${API_URL}/${userId}`, updateData, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((response) => response.data)
      .catch((error) => {
        console.error('Error updating cart item:', error);
        throw error;
      });
  };
  
  export const clearCart = (userId, token) => {
    return axios
      .delete(`${API_URL}/${userId}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((response) => response.data.message)
      .catch((error) => {
        console.error('Error clearing cart:', error);
        throw error;
      });
  };
  
  export const checkout = (userId, token) => {
    return axios
      .post(`${API_URL}/cart/checkout/${userId}`, {}, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((response) => response.data.message)
      .catch((error) => {
        console.error('Error during checkout:', error);
        throw error;
      });
  };
  
  export const removeCartItem = (userId, productId, variantId, token) => {
    return axios
      .delete(`${API_URL}/removefromcart/${userId}`, {
        headers: { Authorization: `Bearer ${token}` },
        data: { productId, variantId },
      })
      .then((response) => response.data.message)
      .catch((error) => {
        console.error('Error removing item from cart:', error);
        throw error;
      });
  };