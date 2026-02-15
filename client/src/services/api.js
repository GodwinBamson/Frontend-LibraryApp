import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

const api = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json'
    }
});

api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

export const authAPI = {
    register: (userData) => api.post('/auth/register', userData),
    login: (credentials) => api.post('/auth/login', credentials),
    getProfile: () => api.get('/auth/profile')
};

export const bookAPI = {
    getAllBooks: (params) => api.get('/books', { params }),
    getBookById: (id) => api.get(`/books/${id}`),
    createBook: (bookData) => api.post('/books', bookData),
    updateBook: (id, bookData) => api.put(`/books/${id}`, bookData),
    deleteBook: (id) => api.delete(`/books/${id}`)
};

export const borrowAPI = {
    borrowBook: (bookId) => api.post('/borrow/borrow', { bookId }),
    returnBook: (bookId) => api.post('/borrow/return', { bookId }),
    getMyBooks: () => api.get('/borrow/my-books')
};

export default api;