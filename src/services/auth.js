import axios from 'axios';

export const login = async (credentials) => {
  try {
    const response = await axios.post('https://fakestoreapi.com/auth/login', {
  "username": "johnd",
  "password": "m38rmF$",
  credentials
}
);
    console.log('Login Response:', response.data); // Debug token
    if (!response.data.token) {
      throw new Error('No token received from server.');
    }
    return response.data.token;
  } catch (error) {
    console.error('Login Error:', error.response ? error.response.data : error.message);
    if (error.response) {
      throw new Error(
        error.response.data.message || 'Login failed. Invalid username or password.'
      );
    } else if (error.request) {
      throw new Error('Network error. Please check your connection.');
    } else {
      throw new Error('An unexpected error occurred during login.');
    }
  }
};