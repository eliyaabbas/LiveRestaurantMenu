import axios from 'axios';

// Create an Axios instance with the base URL of your backend
const API = axios.create({ baseURL: 'https://live-restaurant-menu-api.onrender.com' });

// Add a request interceptor to include the token on all requests
// This is a best practice so we don't have to add the header manually every time
API.interceptors.request.use((req) => {
  if (localStorage.getItem('authToken')) {
    req.headers['x-auth-token'] = localStorage.getItem('authToken');
  }
  return req;
});

// --- Auth Routes ---
export const register = (formData) => API.post('/auth/register', formData);
export const login = (formData) => API.post('/auth/login', formData);
export const forgotPassword = (formData) => API.post('/auth/forgot-password', formData);
export const resetPassword = (token, formData) => API.post(`/auth/reset-password/${token}`, formData);

// --- Profile Routes ---
export const getProfile = () => API.get('/profile');
export const updateProfile = (profileData) => API.put('/profile', profileData);
export const deleteAccount = () => API.delete('/profile');

// --- Settings Routes ---
export const getSettings = () => API.get('/settings');
export const updateSettings = (settingsData) => API.put('/settings', settingsData);

// --- Dish Suggestion Route ---
export const getDishSuggestions = (query, type) => API.get(`/dishes/suggest?q=${query}&type=${type}`);

// --- Menu Routes for Multiple Menus ---
export const getAllMenus = () => API.get('/menu');
export const createNewMenu = (menuData) => API.post('/menu', menuData);
export const getMenuById = (id) => API.get(`/menu/${id}`);
export const updateMenuById = (id, menuData) => API.put(`/menu/${id}`, menuData);
export const deleteMenuById = (id) => API.delete(`/menu/${id}`);
export const getPublicMenu = (id) => axios.get(`http://localhost:5000/api/menu/public/${id}`);
export const trackMenuView = (id) => axios.post(`http://localhost:5000/api/menu/public/${id}/view`);
