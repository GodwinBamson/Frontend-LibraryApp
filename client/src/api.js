
// import axios from 'axios';

// // Get base URL from environment
// const getBaseURL = () => {
//     if (import.meta.env.PROD) {
//         return import.meta.env.VITE_API_URL || 'https://your-backend.onrender.com/api';
//     }
//     return 'http://localhost:5000/api';
// };

// const API_URL = getBaseURL();

// const api = axios.create({
//     baseURL: API_URL,
//     timeout: 30000, // 30 second timeout for file uploads
// });

// // Request interceptor
// api.interceptors.request.use(
//     (config) => {
//         const token = localStorage.getItem('token');
//         if (token) {
//             config.headers.Authorization = `Bearer ${token}`;
//         }
        
//         // Don't set Content-Type for FormData
//         if (config.data instanceof FormData) {
//             delete config.headers['Content-Type'];
//         }
        
//         // Add timestamp to prevent caching in production
//         if (import.meta.env.PROD) {
//             config.params = {
//                 ...config.params,
//                 _t: Date.now()
//             };
//         }
        
//         return config;
//     },
//     (error) => {
//         return Promise.reject(error);
//     }
// );

// // Response interceptor
// api.interceptors.response.use(
//     (response) => response,
//     (error) => {
//         if (error.response) {
//             console.error('❌ Server error:', {
//                 status: error.response.status,
//                 data: error.response.data
//             });
            
//             if (error.response.status === 401) {
//                 localStorage.removeItem('token');
//                 localStorage.removeItem('user');
//                 window.location.href = '/login';
//             }
            
//             // Handle validation errors
//             if (error.response.status === 400) {
//                 return Promise.reject(error.response.data);
//             }
//         } else if (error.request) {
//             console.error('❌ No response received');
//             error.message = 'Cannot connect to server. Please check your internet connection.';
//         }
        
//         return Promise.reject(error);
//     }
// );

// export const bookAPI = {
//     getAllBooks: () => api.get('/books'),
//     getBookById: (id) => api.get(`/books/${id}`),
//     createBook: (formData) => api.post('/books', formData),
//     updateBook: (id, formData) => api.put(`/books/${id}`, formData),
//     deleteBook: (id) => api.delete(`/books/${id}`),
//     getPdf: (id) => api.get(`/books/pdf/${id}`, { 
//         responseType: 'blob',
//         timeout: 60000 // 60 second timeout for PDF downloads
//     }),
// };

// export const authAPI = {
//     login: (credentials) => api.post('/auth/login', credentials),
//     register: (userData) => api.post('/auth/register', userData),
//     getProfile: () => api.get('/auth/profile'),
// };

// export default api;



// import axios from 'axios';

// // Base URL for API
// const getBaseURL = () => {
//     // Use deployed backend URL in production
//     if (import.meta.env.PROD) {
//         return import.meta.env.VITE_API_URL || 'https://library-server-5rpq.onrender.com/api';
//     }
//     // Use localhost for development
//     return 'http://localhost:5000/api';
// };

// const API_URL = getBaseURL();

// const api = axios.create({
//     baseURL: API_URL,
//     timeout: 30000, // 30 second timeout for file uploads
// });

// // Request interceptor
// api.interceptors.request.use(
//     (config) => {
//         const token = localStorage.getItem('token');
//         if (token) {
//             config.headers.Authorization = `Bearer ${token}`;
//         }

//         // Remove Content-Type for FormData uploads
//         if (config.data instanceof FormData) {
//             delete config.headers['Content-Type'];
//         }

//         // Add timestamp to prevent caching in production
//         if (import.meta.env.PROD) {
//             config.params = {
//                 ...config.params,
//                 _t: Date.now(),
//             };
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
//             console.error('❌ Server error:', {
//                 status: error.response.status,
//                 data: error.response.data,
//             });

//             if (error.response.status === 401) {
//                 // Clear auth on unauthorized
//                 localStorage.removeItem('token');
//                 localStorage.removeItem('user');
//                 window.location.href = '/login';
//             }

//             if (error.response.status === 400) {
//                 // Validation error
//                 return Promise.reject(error.response.data);
//             }
//         } else if (error.request) {
//             console.error('❌ No response received');
//             error.message = 'Cannot connect to server. Please check your internet connection.';
//         }

//         return Promise.reject(error);
//     }
// );

// // Book API endpoints
// export const bookAPI = {
//     getAllBooks: () => api.get('/books'),
//     getBookById: (id) => api.get(`/books/${id}`),
//     createBook: (formData) => api.post('/books', formData),
//     updateBook: (id, formData) => api.put(`/books/${id}`, formData),
//     deleteBook: (id) => api.delete(`/books/${id}`),
//     getPdf: (id) =>
//         api.get(`/books/pdf/${id}`, {
//             responseType: 'blob',
//             timeout: 60000, // 60 seconds for PDF
//         }),
// };

// // Auth API endpoints
// export const authAPI = {
//     login: (credentials) => api.post('/auth/login', credentials),
//     register: (userData) => api.post('/auth/register', userData),
//     getProfile: () => api.get('/auth/profile'),
// };

// export default api;



// import axios from 'axios';

// // Base URL for API
// const getBaseURL = () => {
//     // Use deployed backend URL in production
//     if (import.meta.env.PROD) {
//         return 'https://library-server-5rpq.onrender.com/api';
//     }
//     // Use localhost for development
//     return 'http://localhost:5000/api';
// };

// const API_URL = getBaseURL();

// // Create axios instance
// const api = axios.create({
//     baseURL: API_URL,
//     timeout: 30000, // 30 second timeout
// });

// // --------------------
// // Request interceptor
// // --------------------
// api.interceptors.request.use(
//     (config) => {
//         // Attach token if exists
//         const token = localStorage.getItem('token');
//         if (token) {
//             config.headers.Authorization = `Bearer ${token}`;
//         }

//         // Remove Content-Type for FormData (axios sets it automatically)
//         if (config.data instanceof FormData) {
//             delete config.headers['Content-Type'];
//         }

//         // Add timestamp to prevent caching in production
//         if (import.meta.env.PROD) {
//             config.params = {
//                 ...config.params,
//                 _t: Date.now(),
//             };
//         }

//         return config;
//     },
//     (error) => Promise.reject(error)
// );

// // --------------------
// // Response interceptor
// // --------------------
// api.interceptors.response.use(
//     (response) => response,
//     (error) => {
//         if (error.response) {
//             console.error('❌ Server error:', {
//                 status: error.response.status,
//                 data: error.response.data,
//             });

//             if (error.response.status === 401) {
//                 // Unauthorized → clear auth and redirect to login
//                 localStorage.removeItem('token');
//                 localStorage.removeItem('user');
//                 window.location.href = '/login';
//             }

//             if (error.response.status === 400) {
//                 // Validation errors
//                 return Promise.reject(error.response.data);
//             }
//         } else if (error.request) {
//             console.error('❌ No response received from server');
//             error.message = 'Cannot connect to server. Please check your internet connection.';
//         }

//         return Promise.reject(error);
//     }
// );

// // --------------------
// // Book API endpoints
// // --------------------
// export const bookAPI = {
//     getAllBooks: () => api.get('/books'),
//     getBookById: (id) => api.get(`/books/${id}`),
//     createBook: (formData) => api.post('/books', formData),
//     updateBook: (id, formData) => api.put(`/books/${id}`, formData),
//     deleteBook: (id) => api.delete(`/books/${id}`),
//     getPdf: (id) =>
//         api.get(`/books/pdf/${id}`, {
//             responseType: 'blob',
//             timeout: 60000, // 60 seconds for PDF downloads
//         }),
// };

// // --------------------
// // Auth API endpoints
// // --------------------
// export const authAPI = {
//     login: (credentials) => api.post('/auth/login', credentials),
//     register: (userData) => api.post('/auth/register', userData),
//     getProfile: () => api.get('/auth/profile'),
// };

// // Export default axios instance
// export default api;





// src/services/api.js
import axios from 'axios';

// Base URL (switches automatically based on env)
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// Create axios instance
const api = axios.create({
  baseURL: API_URL,
  timeout: 30000, // 30s timeout
});

// --------------------
// Request interceptor
// --------------------
api.interceptors.request.use(
  (config) => {
    // Attach token if exists
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`; // FIXED
    }

    // Remove Content-Type for FormData (browser sets it)
    if (config.data instanceof FormData) {
      delete config.headers['Content-Type'];
    }

    // Prevent caching in production
    if (import.meta.env.PROD) {
      config.params = { ...config.params, _t: Date.now() };
    }

    return config;
  },
  (error) => Promise.reject(error)
);

// --------------------
// Response interceptor
// --------------------
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      console.error('❌ Server error:', {
        status: error.response.status,
        data: error.response.data,
      });

      if (error.response.status === 401) {
        // Unauthorized → clear auth and redirect to login
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        window.location.href = '/login';
      }

      if (error.response.status === 400) {
        return Promise.reject(error.response.data);
      }
    } else if (error.request) {
      console.error('❌ No response received from server');
      error.message = 'Cannot connect to server. Please check your internet connection.';
    }

    return Promise.reject(error);
  }
);

// --------------------
// Book API endpoints
// --------------------
export const bookAPI = {
  getAllBooks: () => api.get('/books'),
  getBookById: (id) => api.get(`/books/${id}`),
  createBook: (formData) => api.post('/books', formData),
  updateBook: (id, formData) => api.put(`/books/${id}`, formData),
  deleteBook: (id) => api.delete(`/books/${id}`),
  getPdf: (id) => api.get(`/books/pdf/${id}`, { responseType: 'blob', timeout: 60000 }),
};

// --------------------
// Auth API endpoints
// --------------------
export const authAPI = {
  login: (credentials) => api.post('/auth/login', credentials),
  register: (userData) => api.post('/auth/register', userData),
  getProfile: () => api.get('/auth/profile'),
};

export default api;

