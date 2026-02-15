import axios from "axios";

/**
 * Decide API base URL
 * - Production → Render backend
 * - Development → Local backend
 */
const API_URL = import.meta.env.PROD
  ? "https://library-server-5rpq.onrender.com/api"
  : "http://localhost:5000/api";

console.log(" API Base URL:", API_URL);

const api = axios.create({
  baseURL: API_URL,
  timeout: 30000,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

// --------------------
// Request interceptor
// --------------------
api.interceptors.request.use(
  (config) => {
    console.log(
      ` ${config.method?.toUpperCase()} ${config.baseURL}${config.url}`,
    );

    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    // Let browser set multipart headers
    if (config.data instanceof FormData) {
      delete config.headers["Content-Type"];
    }

    return config;
  },
  (error) => Promise.reject(error),
);

// --------------------
// Response interceptor
// --------------------
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      if (error.response.status === 401) {
        localStorage.removeItem("token");
        localStorage.removeItem("user");

        if (!window.location.pathname.includes("/login")) {
          window.location.href = "/login";
        }
      }

      return Promise.reject({
        message:
          error.response.data?.message || `Error ${error.response.status}`,
        status: error.response.status,
      });
    }

    return Promise.reject({
      message: "Cannot connect to server",
      code: "NETWORK_ERROR",
    });
  },
);

// --------------------
// Auth APIs
// --------------------
export const authAPI = {
  login: (data) => api.post("/auth/login", data),
  register: (data) => api.post("/auth/register", data),
  getProfile: () => api.get("/auth/profile"),
  logout: () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    window.location.href = "/login";
  },
};

// --------------------
// Book APIs
// --------------------
export const bookAPI = {
  getAllBooks: (params) => api.get("/books", { params }), // Added params support for search/filter
  getBookById: (id) => api.get(`/books/${id}`),
  createBook: (data) => api.post("/books", data),
  updateBook: (id, data) => api.put(`/books/${id}`, data),
  deleteBook: (id) => api.delete(`/books/${id}`),
  getPdf: (id) =>
    api.get(`/books/pdf/${id}`, {
      responseType: "blob",
      headers: { Accept: "application/pdf" },
    }),
};

// --------------------
// Borrow APIs - ADD THIS SECTION
// --------------------
export const borrowAPI = {
  borrowBook: (bookId) => api.post("/borrow", { bookId }),
  returnBook: (borrowId) => api.put(`/borrow/${borrowId}/return`),
  getUserBorrows: () => api.get("/borrow/my-borrows"),
  getAllBorrows: () => api.get("/borrow"),
  checkAvailability: (bookId) => api.get(`/borrow/check/${bookId}`),
  renewBook: (borrowId) => api.put(`/borrow/${borrowId}/renew`),
  getBorrowHistory: (bookId) => api.get(`/borrow/history/${bookId}`),
};

export default api;
