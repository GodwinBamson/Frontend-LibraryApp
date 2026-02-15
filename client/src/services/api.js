





// import axios from 'axios';

// // Use environment variable with fallback to Render URL
// const API_URL = import.meta.env.VITE_API_URL || "https://library-server-5rpq.onrender.com/api";

// console.log("🔧 API Base URL:", API_URL);
// console.log("🔧 Using VITE_API_URL:", import.meta.env.VITE_API_URL);

// const api = axios.create({
//     baseURL: API_URL,
//     timeout: 30000,
//     headers: {
//         'Content-Type': 'application/json',
//         Accept: 'application/json',
//     },
// });

// // Request interceptor
// api.interceptors.request.use(
//     (config) => {
//         console.log(`🚀 ${config.method?.toUpperCase()} ${config.baseURL}${config.url}`);
        
//         const token = localStorage.getItem('token');
//         if (token) {
//             config.headers.Authorization = `Bearer ${token}`;
//         }
        
//         // Handle FormData
//         if (config.data instanceof FormData) {
//             delete config.headers['Content-Type'];
//         }
        
//         return config;
//     },
//     (error) => Promise.reject(error)
// );

// // Response interceptor
// api.interceptors.response.use(
//     (response) => response,
//     (error) => {
//         if (error.response) {
//             // Handle 401 Unauthorized
//             if (error.response.status === 401) {
//                 localStorage.removeItem('token');
//                 localStorage.removeItem('user');
//                 if (!window.location.pathname.includes('/login')) {
//                     window.location.href = '/login';
//                 }
//             }
            
//             return Promise.reject({
//                 message: error.response.data?.message || `Error ${error.response.status}`,
//                 status: error.response.status,
//             });
//         }
        
//         // Network errors
//         return Promise.reject({
//             message: "Cannot connect to server",
//             code: "NETWORK_ERROR",
//         });
//     }
// );

// // Auth APIs
// export const authAPI = {
//     login: (data) => api.post('/auth/login', data),
//     register: (data) => api.post('/auth/register', data),
//     getProfile: () => api.get('/auth/profile'),
//     logout: () => {
//         localStorage.removeItem('token');
//         localStorage.removeItem('user');
//         window.location.href = '/login';
//     },
// };

// // Book APIs
// export const bookAPI = {
//     getAllBooks: (params) => api.get('/books', { params }),
//     getBookById: (id) => api.get(`/books/${id}`),
//     createBook: (data) => api.post('/books', data),
//     updateBook: (id, data) => api.put(`/books/${id}`, data),
//     deleteBook: (id) => api.delete(`/books/${id}`),
//     getPdf: (id) => 
//         api.get(`/books/pdf/${id}`, {
//             responseType: 'blob',
//             headers: { Accept: 'application/pdf' },
//         }),
// };

// // Borrow APIs (if you have them)
// export const borrowAPI = {
//     borrowBook: (bookId) => api.post('/borrow/borrow', { bookId }),
//     returnBook: (bookId) => api.post('/borrow/return', { bookId }),
//     getMyBooks: () => api.get('/borrow/my-books'),
// };

// export default api;






import axios from "axios";

/**
 * Decide API base URL
 * - Production → Render backend
 * - Development → Local backend
 */
const API_URL = import.meta.env.PROD
  ? "https://library-server-5rpq.onrender.com/api"
  : "http://localhost:5000/api";

console.log("🔧 API Base URL:", API_URL);

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
      `🚀 ${config.method?.toUpperCase()} ${config.baseURL}${config.url}`,
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
          error.response.data?.message ||
          `Error ${error.response.status}`,
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
  getAllBooks: () => api.get("/books"),
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

export default api;