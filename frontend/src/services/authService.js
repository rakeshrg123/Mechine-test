import axios from 'axios';
import { setUser, removeUser } from '../store/authSlice';
import  store  from '../store/store'; 


const API_URL = 'http://localhost:5000/api/auth'; 


export const register = (userData) => {
  return axios.post(`${API_URL}/register`, userData)
    .then(response => {
      console.log(response);
      
      return;
    })
    .catch(error => {
      console.error("Registration failed:", error.response.data.message);
      throw error; // Handle error as per your need
    });
};

// Login function (returns a promise)
export const login = (credentials) => {
  return axios.post(`${API_URL}/login`, credentials)
    .then(response => {
      // Assuming the response contains a 'user' object and a JWT token
      const user = response.data

      // Store user data and token
      store.dispatch(setUser(user));

      // Optionally, store the token in localStorage or cookies for authentication persistence
      window.localStorage.setItem('authToken', user.token);

      return user;
    })
    .catch(error => {
      console.error("Login failed:", error);
      throw error; // Handle error as per your need
    });
};

// Logout function (returns a promise)
export const logout = () => {
  return new Promise((resolve) => {
    // Remove user data and token
    store.dispatch(removeUser());
    window.localStorage.removeItem('authToken');
    resolve();
  });
};

