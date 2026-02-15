
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



// working

import axios from 'axios';

// Determine the correct API URL based on environment
const getApiUrl = () => {
    // For production on Render
    if (window.location.hostname === 'frontend-libraryapp.onrender.com') {
        return 'https://library-server-5rpq.onrender.com/api';
    }
    
    // For local development
    if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
        return import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
    }
    
    // Fallback
    return import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
};

const API_URL = getApiUrl();
console.log('🔧 API Base URL:', API_URL);

// Create axios instance with proper configuration
const api = axios.create({
    baseURL: API_URL,
    timeout: 30000,
    withCredentials: true,
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
    }
});

// Request interceptor
api.interceptors.request.use(
    (config) => {
        // Log the request
        console.log(`🚀 ${config.method?.toUpperCase()} request to: ${config.baseURL}${config.url}`);
        
        // Add timestamp to prevent caching in production
        if (import.meta.env.PROD) {
            config.params = { ...config.params, _t: Date.now() };
        }
        
        // Attach token if exists
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        
        // Remove Content-Type for FormData (browser sets it)
        if (config.data instanceof FormData) {
            delete config.headers['Content-Type'];
        }
        
        return config;
    },
    (error) => {
        console.error('❌ Request interceptor error:', error);
        return Promise.reject(error);
    }
);

// Response interceptor
api.interceptors.response.use(
    (response) => {
        console.log(`✅ Response received: ${response.status} from ${response.config.url}`);
        return response;
    },
    (error) => {
        if (error.response) {
            // Server responded with error status
            console.error('❌ Server error:', {
                status: error.response.status,
                data: error.response.data,
                url: error.config?.url,
                method: error.config?.method
            });
            
            // Handle 401 Unauthorized
            if (error.response.status === 401) {
                console.log('🔒 Unauthorized - clearing auth data');
                localStorage.removeItem('token');
                localStorage.removeItem('user');
                
                // Only redirect if not already on login page
                if (!window.location.pathname.includes('/login')) {
                    window.location.href = '/login';
                }
            }
            
            // Return a normalized error
            return Promise.reject({
                message: error.response.data?.message || `Error ${error.response.status}`,
                status: error.response.status,
                data: error.response.data
            });
        } else if (error.request) {
            // Request made but no response
            console.error('❌ No response from server:', {
                request: error.request,
                url: error.config?.url,
                method: error.config?.method
            });
            
            return Promise.reject({
                message: 'Cannot connect to server. Please check your internet connection.',
                code: 'NETWORK_ERROR'
            });
        } else {
            // Request setup error
            console.error('❌ Request setup error:', error.message);
            return Promise.reject({
                message: error.message || 'An error occurred',
                code: 'REQUEST_SETUP_ERROR'
            });
        }
    }
);

// Auth API endpoints
export const authAPI = {
    login: async (credentials) => {
        console.log('🔑 Attempting login for:', credentials.email);
        try {
            const response = await api.post('/auth/login', credentials);
            console.log('✅ Login successful:', response.data);
            return response;
        } catch (error) {
            console.error('❌ Login failed:', error);
            throw error;
        }
    },
    
    register: async (userData) => {
        console.log('📝 Attempting registration for:', userData.email);
        try {
            const response = await api.post('/auth/register', userData);
            console.log('✅ Registration successful:', response.data);
            return response;
        } catch (error) {
            console.error('❌ Registration failed:', error);
            throw error;
        }
    },
    
    getProfile: () => api.get('/auth/profile'),
    
    logout: () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        window.location.href = '/login';
    }
};

// Book API endpoints
export const bookAPI = {
    getAllBooks: () => api.get('/books'),
    getBookById: (id) => api.get(`/books/${id}`),
    createBook: (formData) => api.post('/books', formData),
    updateBook: (id, formData) => api.put(`/books/${id}`, formData),
    deleteBook: (id) => api.delete(`/books/${id}`),
    getPdf: (id) => api.get(`/books/pdf/${id}`, { 
        responseType: 'blob', 
        timeout: 60000,
        headers: {
            'Accept': 'application/pdf'
        }
    }),
};

export default api;




// import axios from 'axios';

// // Determine the correct API URL based on environment
// const getApiUrl = () => {
//     // For production on Render
//     if (window.location.hostname === 'frontend-libraryapp.onrender.com') {
//         return 'https://library-server-5rpq.onrender.com/api';
//     }
    
//     // For local development
//     if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
//         return import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
//     }
    
//     // Fallback
//     return import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
// };

// const API_URL = getApiUrl();
// console.log('🔧 API Base URL:', API_URL);

// // Create axios instance with proper configuration
// const api = axios.create({
//     baseURL: API_URL,
//     timeout: 30000,
//     withCredentials: true,
//     headers: {
//         'Content-Type': 'application/json',
//         'Accept': 'application/json'
//     }
// });

// // Request interceptor
// api.interceptors.request.use(
//     (config) => {
//         // Log the request
//         console.log(`🚀 ${config.method?.toUpperCase()} request to: ${config.baseURL}${config.url}`);
        
//         // Add timestamp to prevent caching in production
//         if (import.meta.env.PROD) {
//             config.params = { ...config.params, _t: Date.now() };
//         }
        
//         // Attach token if exists
//         const token = localStorage.getItem('token');
//         if (token) {
//             config.headers.Authorization = `Bearer ${token}`;
//         }
        
//         // Remove Content-Type for FormData (browser sets it)
//         if (config.data instanceof FormData) {
//             delete config.headers['Content-Type'];
//         }
        
//         return config;
//     },
//     (error) => {
//         console.error('❌ Request interceptor error:', error);
//         return Promise.reject(error);
//     }
// );

// // Response interceptor
// api.interceptors.response.use(
//     (response) => {
//         console.log(`✅ Response received: ${response.status} from ${response.config.url}`);
//         return response;
//     },
//     (error) => {
//         if (error.response) {
//             // Server responded with error status
//             console.error('❌ Server error:', {
//                 status: error.response.status,
//                 data: error.response.data,
//                 url: error.config?.url,
//                 method: error.config?.method
//             });
            
//             // Handle 401 Unauthorized
//             if (error.response.status === 401) {
//                 console.log('🔒 Unauthorized - clearing auth data');
//                 localStorage.removeItem('token');
//                 localStorage.removeItem('user');
                
//                 // Only redirect if not already on login page
//                 if (!window.location.pathname.includes('/login')) {
//                     window.location.href = '/login';
//                 }
//             }
            
//             // Return a normalized error
//             return Promise.reject({
//                 message: error.response.data?.message || `Error ${error.response.status}`,
//                 status: error.response.status,
//                 data: error.response.data
//             });
//         } else if (error.request) {
//             // Request made but no response
//             console.error('❌ No response from server:', {
//                 request: error.request,
//                 url: error.config?.url,
//                 method: error.config?.method
//             });
            
//             return Promise.reject({
//                 message: 'Cannot connect to server. Please check your internet connection.',
//                 code: 'NETWORK_ERROR'
//             });
//         } else {
//             // Request setup error
//             console.error('❌ Request setup error:', error.message);
//             return Promise.reject({
//                 message: error.message || 'An error occurred',
//                 code: 'REQUEST_SETUP_ERROR'
//             });
//         }
//     }
// );

// // Auth API endpoints
// export const authAPI = {
//     login: async (credentials) => {
//         console.log('🔑 Attempting login for:', credentials.email);
//         try {
//             const response = await api.post('/auth/login', credentials);
//             console.log('✅ Login successful:', response.data);
//             return response;
//         } catch (error) {
//             console.error('❌ Login failed:', error);
//             throw error;
//         }
//     },
    
//     register: async (userData) => {
//         console.log('📝 Attempting registration for:', userData.email);
//         try {
//             const response = await api.post('/auth/register', userData);
//             console.log('✅ Registration successful:', response.data);
//             return response;
//         } catch (error) {
//             console.error('❌ Registration failed:', error);
//             throw error;
//         }
//     },
    
//     getProfile: () => api.get('/auth/profile'),
    
//     logout: () => {
//         localStorage.removeItem('token');
//         localStorage.removeItem('user');
//         window.location.href = '/login';
//     }
// };

// // Book API endpoints
// export const bookAPI = {
//     getAllBooks: () => api.get('/books'),
//     getBookById: (id) => api.get(`/books/${id}`),
//     createBook: (formData) => api.post('/books', formData),
//     updateBook: (id, formData) => api.put(`/books/${id}`, formData),
//     deleteBook: (id) => api.delete(`/books/${id}`),
    
//     // PDF methods
//     getPdf: (id) => api.get(`/books/pdf/${id}`, { 
//         responseType: 'blob', 
//         timeout: 60000,
//         headers: {
//             'Accept': 'application/pdf',
//             'Cache-Control': 'no-cache'
//         },
//         params: {
//             _t: Date.now() // Cache busting
//         }
//     }),
    
//     // Helper to get viewable PDF URL
//     getPdfViewUrl: (book) => {
//         if (!book || !book.pdfFile) return null;
        
//         // For Cloudinary URLs, return directly with cache busting
//         if (book.pdfFile.includes('cloudinary')) {
//             try {
//                 const url = new URL(book.pdfFile);
//                 url.searchParams.set('_t', Date.now().toString());
//                 return url.toString();
//             } catch (e) {
//                 // If URL parsing fails, return original with timestamp
//                 return `${book.pdfFile}${book.pdfFile.includes('?') ? '&' : '?'}_t=${Date.now()}`;
//             }
//         }
        
//         // For local development, use the API endpoint
//         return `${API_URL}/books/pdf/${book._id}?_t=${Date.now()}`;
//     },
    
//     // Method to open PDF in new tab
//     viewPdf: (book) => {
//         const url = bookAPI.getPdfViewUrl(book);
//         if (url) {
//             console.log('📄 Opening PDF URL:', url);
//             window.open(url, '_blank', 'noopener,noreferrer');
//         } else {
//             alert("No PDF available for this book");
//         }
//     },
    
//     // Method to download PDF
//     downloadPdf: async (book) => {
//         if (!book || !book.pdfFile) {
//             alert("No PDF available to download");
//             return;
//         }

//         try {
//             // For Cloudinary URLs, download directly with cache busting
//             if (book.pdfFile.includes('cloudinary')) {
//                 const url = new URL(book.pdfFile);
//                 url.searchParams.set('_t', Date.now().toString());
                
//                 const link = document.createElement("a");
//                 link.href = url.toString();
//                 link.download = book.pdfFilename || `${book.title.replace(/\s+/g, '_')}.pdf`;
//                 document.body.appendChild(link);
//                 link.click();
//                 link.remove();
//             } else {
//                 // For local development, use API
//                 const response = await bookAPI.getPdf(book._id);
//                 const blob = new Blob([response.data], { type: 'application/pdf' });
//                 const url = window.URL.createObjectURL(blob);
//                 const link = document.createElement('a');
//                 link.href = url;
//                 link.download = book.pdfFilename || `${book.title}.pdf`;
//                 document.body.appendChild(link);
//                 link.click();
//                 link.remove();
//                 window.URL.revokeObjectURL(url);
//             }
//         } catch (error) {
//             console.error("Error downloading PDF:", error);
//             alert("Failed to download PDF. Please try again.");
//         }
//     }
// };

// export default api;