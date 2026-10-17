import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:5000/api",
  withCredentials: true,
});


// ==========================================
// ATTACH ACCESS TOKEN
// ==========================================

api.interceptors.request.use(
  (config) => {

    const token =
      localStorage.getItem(
        "accessToken"
      );

    if (token) {
      config.headers.Authorization =
        `Bearer ${token}`;
    }

    return config;
  },

  (error) => {
    return Promise.reject(error);
  }
);


// ==========================================
// RESPONSE ERROR HANDLER
// ==========================================

api.interceptors.response.use(
  (response) => response,

  (error) => {

    if (
      error.response?.status === 401
    ) {
      localStorage.removeItem(
        "accessToken"
      );
    }

    return Promise.reject(error);
  }
);


export default api;