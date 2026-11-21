import axios from 'axios';

// All communication with the Express REST API lives here.
const API_URL = import.meta.env.VITE_API_URL || '';
const tokenKey = 'alzikrayat_token';

export const imageUrl = (fileName) => `${API_URL}/uploads/${fileName}`;

// The JWT is kept in localStorage so a page refresh keeps the user logged in
export const getToken = () => {
  try {
    return localStorage.getItem(tokenKey);
  } catch {
    return null;
  }
};

export const setToken = (token) => {
  try {
    localStorage.setItem(tokenKey, token);
  } catch {
    /* storage unavailable: the session just lasts until refresh */
  }
};

export const clearToken = () => {
  try {
    localStorage.removeItem(tokenKey);
  } catch {
    /* ignore */
  }
};

// AuthContext registers a function here that logs the user out
let onUnauthorized = () => {};
export const setUnauthorizedHandler = (handler) => {
  onUnauthorized = handler;
};

const api = axios.create({ baseURL: API_URL });

// Request interceptor: adds "Authorization: Bearer <token>" to every request when logged in
api.interceptors.request.use((config) => {
  const token = getToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Response interceptor: turns API errors into simple Error objects,
// and logs the user out when the server rejects the token (expired or invalid)
api.interceptors.response.use(
  (response) => response,
  (err) => {
    if (!err.response) {
      return Promise.reject(new Error('Cannot reach the server. Check that the API is running.'));
    }
    const { status, data } = err.response;
    if (status === 401 && err.config?.headers?.Authorization) {
      onUnauthorized();
    }
    const error = new Error(data?.message || 'Something went wrong');
    error.details = data?.details || [];
    return Promise.reject(error);
  }
);

const getData = (request) => request.then((response) => response.data);

export const registerUser = (body) => getData(api.post('/api/auth/register', body));
export const loginUser = (body) => getData(api.post('/api/auth/login', body));
export const getMe = () => getData(api.get('/api/auth/me'));

export const getPhotos = () => getData(api.get('/api/photos'));
export const getPhoto = (id) => getData(api.get(`/api/photos/${id}`));
export const createPhoto = (formData) => getData(api.post('/api/photos', formData));
export const deletePhoto = (id) => getData(api.delete(`/api/photos/${id}`));

export const getComments = (photoId) => getData(api.get(`/api/photos/${photoId}/comments`));
export const createComment = (photoId, comment) =>
  getData(api.post(`/api/photos/${photoId}/comments`, { comment }));
