// axios.js

import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: 'http://localhost:4000/api', // Replace with your backend API base URL
});

axiosInstance.interceptors.request.use(
  (config) => {
    const userInfo = JSON.parse(localStorage.getItem('userInfo'));
    if (userInfo && userInfo.token) {
      config.headers.Authorization = `Bearer ${userInfo.token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default axiosInstance;
