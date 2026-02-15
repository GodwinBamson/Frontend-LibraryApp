// // // working

// // import axios from "axios";

// // // Determine the correct API URL based on environment
// // const getApiUrl = () => {
// //   // For production on Render
// //   if (window.location.hostname === "frontend-libraryapp.onrender.com") {
// //     return "https://library-server-5rpq.onrender.com/api";
// //   }

// //   // For local development
// //   if (
// //     window.location.hostname === "localhost" ||
// //     window.location.hostname === "127.0.0.1"
// //   ) {
// //     return import.meta.env.VITE_API_URL || "http://localhost:5000/api";
// //   }

// //   // Fallback
// //   return import.meta.env.VITE_API_URL || "http://localhost:5000/api";
// // };

// // const API_URL = getApiUrl();
// // console.log("🔧 API Base URL:", API_URL);

// // // Create axios instance with proper configuration
// // const api = axios.create({
// //   baseURL: API_URL,
// //   timeout: 30000,
// //   withCredentials: true,
// //   headers: {
// //     "Content-Type": "application/json",
// //     Accept: "application/json",
// //   },
// // });

// // // Request interceptor
// // api.interceptors.request.use(
// //   (config) => {
// //     // Log the request
// //     console.log(
// //       `🚀 ${config.method?.toUpperCase()} request to: ${config.baseURL}${config.url}`,
// //     );

// //     // Add timestamp to prevent caching in production
// //     if (import.meta.env.PROD) {
// //       config.params = { ...config.params, _t: Date.now() };
// //     }

// //     // Attach token if exists
// //     const token = localStorage.getItem("token");
// //     if (token) {
// //       config.headers.Authorization = `Bearer ${token}`;
// //     }

// //     // Remove Content-Type for FormData (browser sets it)
// //     if (config.data instanceof FormData) {
// //       delete config.headers["Content-Type"];
// //     }

// //     return config;
// //   },
// //   (error) => {
// //     console.error("❌ Request interceptor error:", error);
// //     return Promise.reject(error);
// //   },
// // );

// // // Response interceptor
// // api.interceptors.response.use(
// //   (response) => {
// //     console.log(
// //       `✅ Response received: ${response.status} from ${response.config.url}`,
// //     );
// //     return response;
// //   },
// //   (error) => {
// //     if (error.response) {
// //       // Server responded with error status
// //       console.error("❌ Server error:", {
// //         status: error.response.status,
// //         data: error.response.data,
// //         url: error.config?.url,
// //         method: error.config?.method,
// //       });

// //       // Handle 401 Unauthorized
// //       if (error.response.status === 401) {
// //         console.log("🔒 Unauthorized - clearing auth data");
// //         localStorage.removeItem("token");
// //         localStorage.removeItem("user");

// //         // Only redirect if not already on login page
// //         if (!window.location.pathname.includes("/login")) {
// //           window.location.href = "/login";
// //         }
// //       }

// //       // Return a normalized error
// //       return Promise.reject({
// //         message:
// //           error.response.data?.message || `Error ${error.response.status}`,
// //         status: error.response.status,
// //         data: error.response.data,
// //       });
// //     } else if (error.request) {
// //       // Request made but no response
// //       console.error("❌ No response from server:", {
// //         request: error.request,
// //         url: error.config?.url,
// //         method: error.config?.method,
// //       });

// //       return Promise.reject({
// //         message:
// //           "Cannot connect to server. Please check your internet connection.",
// //         code: "NETWORK_ERROR",
// //       });
// //     } else {
// //       // Request setup error
// //       console.error("❌ Request setup error:", error.message);
// //       return Promise.reject({
// //         message: error.message || "An error occurred",
// //         code: "REQUEST_SETUP_ERROR",
// //       });
// //     }
// //   },
// // );

// // // Auth API endpoints
// // export const authAPI = {
// //   login: async (credentials) => {
// //     console.log("🔑 Attempting login for:", credentials.email);
// //     try {
// //       const response = await api.post("/auth/login", credentials);
// //       console.log("✅ Login successful:", response.data);
// //       return response;
// //     } catch (error) {
// //       console.error("❌ Login failed:", error);
// //       throw error;
// //     }
// //   },

// //   register: async (userData) => {
// //     console.log("📝 Attempting registration for:", userData.email);
// //     try {
// //       const response = await api.post("/auth/register", userData);
// //       console.log("✅ Registration successful:", response.data);
// //       return response;
// //     } catch (error) {
// //       console.error("❌ Registration failed:", error);
// //       throw error;
// //     }
// //   },

// //   getProfile: () => api.get("/auth/profile"),

// //   logout: () => {
// //     localStorage.removeItem("token");
// //     localStorage.removeItem("user");
// //     window.location.href = "/login";
// //   },
// // };

// // // Book API endpoints
// // export const bookAPI = {
// //   getAllBooks: () => api.get("/books"),
// //   getBookById: (id) => api.get(`/books/${id}`),
// //   createBook: (formData) => api.post("/books", formData),
// //   updateBook: (id, formData) => api.put(`/books/${id}`, formData),
// //   deleteBook: (id) => api.delete(`/books/${id}`),
// //   getPdf: (id) =>
// //     api.get(`/books/pdf/${id}`, {
// //       responseType: "blob",
// //       timeout: 60000,
// //       headers: {
// //         Accept: "application/pdf",
// //       },
// //     }),
// // };

// // export default api;




// import axios from "axios";

// /**
//  * Decide API base URL
//  * - Production → Render backend
//  * - Development → Local backend
//  */
// const API_URL = import.meta.env.PROD
//   ? "https://library-server-5rpq.onrender.com/api"
//   : "http://localhost:5000/api";

// console.log("🔧 API Base URL:", API_URL);

// const api = axios.create({
//   baseURL: API_URL,
//   timeout: 30000,
//   headers: {
//     "Content-Type": "application/json",
//     Accept: "application/json",
//   },
// });

// // --------------------
// // Request interceptor
// // --------------------
// api.interceptors.request.use(
//   (config) => {
//     console.log(
//       `🚀 ${config.method?.toUpperCase()} ${config.baseURL}${config.url}`,
//     );

//     const token = localStorage.getItem("token");
//     if (token) {
//       config.headers.Authorization = `Bearer ${token}`;
//     }

//     // Let browser set multipart headers
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
//     if (error.response) {
//       if (error.response.status === 401) {
//         localStorage.removeItem("token");
//         localStorage.removeItem("user");

//         if (!window.location.pathname.includes("/login")) {
//           window.location.href = "/login";
//         }
//       }

//       return Promise.reject({
//         message:
//           error.response.data?.message ||
//           `Error ${error.response.status}`,
//         status: error.response.status,
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
//   getAllBooks: () => api.get("/books"),
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

// export default api;
