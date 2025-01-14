import axios from "axios";

const API_URL = "http://localhost:5000/api/product"; 


export const createVariant = (productId, variantData, token) => {
  return axios.post(
    `${API_URL}/${productId}/variants`,
    variantData,
    {
      headers: { Authorization: `Bearer ${token}` },
    }
  );
};

export const getVariants = (productId, token) => {
  return axios.get(`${API_URL}/${productId}/variants`, {
    headers: { Authorization: `Bearer ${token}` },
  });
};


export const updateVariant = (productId, variantId, variantData, token) => {
  return axios.put(
    `${API_URL}/${productId}/variants/${variantId}`,
    variantData,
    {
      headers: { Authorization: `Bearer ${token}` },
    }
  );
};


export const deleteVariant = (productId, variantId, token) => {
  return axios.delete(
    `${API_URL}/${productId}/variants/${variantId}`,
    {
      headers: { Authorization: `Bearer ${token}` },
    }
  );
};
