// import axios from "axios";

// /**
//  * Decide API base URL
//  * - Production → Render backend
//  * - Development → Local backend
//  */
// const API_URL = import.meta.env.PROD
//   ? "https://library-server-5rpq.onrender.com/api"
//   : "http://localhost:5000/api";

// console.log(" API Base URL:", API_URL);

// const api = axios.create({
//   baseURL: API_URL,
//   timeout: 60000, // Increased timeout for PDF uploads
//   headers: {
//     "Content-Type": "application/json",
//     Accept: "application/json",
//   },
//   withCredentials: true,
// });

// // --------------------
// // Request interceptor
// // --------------------
// api.interceptors.request.use(
//   (config) => {
//     console.log(
//       ` ${config.method?.toUpperCase()} ${config.baseURL}${config.url}`,
//     );

//     const token = localStorage.getItem("token");
//     if (token) {
//       config.headers.Authorization = `Bearer ${token}`;
//     }

//     // Don't set Content-Type for FormData - let browser set it with boundary
//     if (config.data instanceof FormData) {
//       delete config.headers["Content-Type"];
//     }

//     return config;
//   },
//   (error) => Promise.reject(error),
// );

// // --------------------
// // Response interceptor
// // --------------------
// api.interceptors.response.use(
//   (response) => response,
//   (error) => {
//     console.error("API Error:", error);

//     if (error.response) {
//       console.log(
//         "Error response:",
//         error.response.status,
//         error.response.data,
//       );

//       if (error.response.status === 401) {
//         // Don't remove token for PDF access
//         if (!error.config.url.includes("/pdf/")) {
//           localStorage.removeItem("token");
//           localStorage.removeItem("user");

//           if (!window.location.pathname.includes("/login")) {
//             window.location.href = "/login";
//           }
//         }
//       }

//       return Promise.reject({
//         message:
//           error.response.data?.message || `Error ${error.response.status}`,
//         status: error.response.status,
//         data: error.response.data,
//       });
//     }

//     return Promise.reject({
//       message: "Cannot connect to server",
//       code: "NETWORK_ERROR",
//     });
//   },
// );

// // --------------------
// // Auth APIs
// // --------------------
// export const authAPI = {
//   login: (data) => api.post("/auth/login", data),
//   register: (data) => api.post("/auth/register", data),
//   getProfile: () => api.get("/auth/profile"),
//   logout: () => {
//     localStorage.removeItem("token");
//     localStorage.removeItem("user");
//     window.location.href = "/login";
//   },
// };

// // --------------------
// // Book APIs
// // --------------------
// export const bookAPI = {
//   getAllBooks: (params) => api.get("/books", { params }),
//   getBookById: (id) => api.get(`/books/${id}`),
//   createBook: (data) => api.post("/books", data),
//   updateBook: (id, data) => api.put(`/books/${id}`, data),
//   deleteBook: (id) => api.delete(`/books/${id}`),
//   getPdf: (id) =>
//     api.get(`/books/pdf/${id}`, {
//       responseType: "blob",
//       headers: { Accept: "application/pdf" },
//     }),
// };

// // --------------------
// // Borrow APIs
// // --------------------
// export const borrowAPI = {
//   borrowBook: (bookId) => api.post("/borrow", { bookId }),
//   returnBook: (borrowId) => api.put(`/borrow/${borrowId}/return`),
//   getUserBorrows: () => api.get("/borrow/my-borrows"),
//   getAllBorrows: () => api.get("/borrow"),
//   checkAvailability: (bookId) => api.get(`/borrow/check/${bookId}`),
//   renewBook: (borrowId) => api.put(`/borrow/${borrowId}/renew`),
//   getBorrowHistory: (bookId) => api.get(`/borrow/history/${bookId}`),
// };

// export default api;




import axios from "axios";

/**
 * Get API URL with mobile detection
 */
const getApiUrl = () => {
  // Production - always use Render URL
  if (import.meta.env.PROD) {
    return "https://library-server-5rpq.onrender.com/api";
  }
  
  // Development - detect if accessing via IP (mobile on same network)
  const hostname = window.location.hostname;
  const protocol = window.location.protocol;
  const port = "5000"; // Your backend port
  
  // If accessing via IP address (mobile device on same WiFi)
  if (hostname !== 'localhost' && hostname !== '127.0.0.1' && !hostname.includes('.')) {
    // Try to connect to the same host but with backend port
    return `${protocol}//${hostname}:${port}/api`;
  }
  
  // Check if it's a local network IP (192.168.x.x, 10.x.x.x, etc.)
  const isLocalIP = /^(192\.168\.|10\.|172\.(1[6-9]|2[0-9]|3[0-1]))/.test(hostname);
  if (isLocalIP) {
    return `${protocol}//${hostname}:${port}/api`;
  }
  
  // Default localhost
  return "http://localhost:5000/api";
};

const API_URL = getApiUrl();

// Log API info for debugging
console.log("📱 API Base URL:", API_URL);
console.log("📱 Environment:", {
  mode: import.meta.env.MODE,
  prod: import.meta.env.PROD,
  dev: import.meta.env.DEV,
  hostname: window.location.hostname,
  userAgent: navigator.userAgent
});

const api = axios.create({
  baseURL: API_URL,
  timeout: 120000, // Increased timeout for mobile (2 minutes)
  headers: {
    "Content-Type": "application/json",
    "Accept": "application/json",
    "X-Requested-With": "XMLHttpRequest",
    "Cache-Control": "no-cache, no-store, must-revalidate",
    "Pragma": "no-cache",
    "Expires": "0",
  },
  withCredentials: true,
});

// =============================================
// REQUEST INTERCEPTOR
// =============================================
api.interceptors.request.use(
  (config) => {
    // Log request (helpful for debugging)
    console.log(`📱 ${config.method?.toUpperCase()} ${config.baseURL}${config.url}`);
    
    // Add timestamp to avoid caching on mobile
    if (config.method?.toLowerCase() === 'get') {
      config.params = {
        ...config.params,
        _t: Date.now() // Cache busting
      };
    }

    // Add auth token
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    // Don't set Content-Type for FormData
    if (config.data instanceof FormData) {
      delete config.headers["Content-Type"];
    }

    // Add mobile detection header
    config.headers['X-Device-Type'] = /mobile|android|iphone|ipad|ipod/i.test(navigator.userAgent) ? 'mobile' : 'desktop';

    return config;
  },
  (error) => {
    console.error("📱 Request Error:", error);
    return Promise.reject(error);
  }
);

// =============================================
// RESPONSE INTERCEPTOR
// =============================================
api.interceptors.response.use(
  (response) => {
    console.log(`📱 Response: ${response.status} from ${response.config.url}`);
    return response;
  },
  (error) => {
    console.error("📱 API Error:", error);

    // Network error (mobile specific)
    if (error.code === 'ERR_NETWORK' || error.message === 'Network Error') {
      console.error("📱 Network Error - Check if server is running and accessible");
      
      // Try alternative URL if on mobile
      const isMobile = /mobile|android|iphone|ipad|ipod/i.test(navigator.userAgent);
      if (isMobile && !error.config._retry) {
        error.config._retry = true;
        
        // Try alternative URL construction
        const hostname = window.location.hostname;
        if (hostname !== 'localhost' && hostname !== '127.0.0.1') {
          const altUrl = `http://${hostname}:5000/api${error.config.url}`;
          console.log("📱 Retrying with alternative URL:", altUrl);
          return axios({
            ...error.config,
            url: altUrl,
            baseURL: undefined
          });
        }
      }
      
      return Promise.reject({
        message: "Cannot connect to server. Please check your internet connection.",
        code: "NETWORK_ERROR",
        mobile: true
      });
    }

    if (error.response) {
      console.log("📱 Error response:", error.response.status, error.response.data);

      // Handle 401 Unauthorized
      if (error.response.status === 401) {
        // Don't redirect for PDF access
        if (!error.config.url.includes('/pdf/')) {
          localStorage.removeItem("token");
          localStorage.removeItem("user");

          if (!window.location.pathname.includes("/login") && 
              !window.location.pathname.includes("/register")) {
            window.location.href = "/login";
          }
        }
      }

      // Handle CORS errors
      if (error.response.status === 0) {
        return Promise.reject({
          message: "CORS error. Please check server configuration.",
          status: 0,
          data: error.response.data,
          mobile: true
        });
      }

      return Promise.reject({
        message: error.response.data?.message || `Error ${error.response.status}`,
        status: error.response.status,
        data: error.response.data,
      });
    }

    return Promise.reject({
      message: "An unexpected error occurred",
      code: "UNKNOWN_ERROR",
    });
  },
);

// =============================================
// MOBILE TEST FUNCTION
// =============================================
export const testMobileConnection = async () => {
  try {
    const response = await api.get("/mobile-debug");
    return {
      success: true,
      data: response.data,
      message: "✅ Connected to server successfully!"
    };
  } catch (error) {
    return {
      success: false,
      error: error.message || "❌ Cannot connect to server",
      details: error
    };
  }
};

// =============================================
// AUTH APIS
// =============================================
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

// =============================================
// BOOK APIS
// =============================================
export const bookAPI = {
  getAllBooks: (params) => api.get("/books", { params }),
  getBookById: (id) => api.get(`/books/${id}`),
  createBook: (data) => api.post("/books", data),
  updateBook: (id, data) => api.put(`/books/${id}`, data),
  deleteBook: (id) => api.delete(`/books/${id}`),
  getPdf: (id) =>
    api.get(`/books/pdf/${id}`, {
      responseType: "blob",
      headers: { 
        Accept: "application/pdf",
        "Cache-Control": "no-cache"
      },
    }),
  // Mobile-optimized PDF view
  getPdfMobile: (id) => {
    return `${API_URL}/books/pdf/${id}#toolbar=0&navpanes=0&view=FitH`;
  }
};

// =============================================
// BORROW APIS
// =============================================
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