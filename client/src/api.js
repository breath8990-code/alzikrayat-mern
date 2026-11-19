// All communication with the Express REST API lives here.
const API_URL = import.meta.env.VITE_API_URL || '';

export const imageUrl = (fileName) => `${API_URL}/uploads/${fileName}`;

async function request(path, { method = 'GET', body, userId } = {}) {
  const headers = {};
  if (userId) headers['x-user-id'] = userId; // basic auth (see server/middleware/auth.js)

  let payload = body;
  if (body && !(body instanceof FormData)) {
    headers['Content-Type'] = 'application/json';
    payload = JSON.stringify(body);
  }

  let res;
  try {
    res = await fetch(`${API_URL}${path}`, { method, headers, body: payload });
  } catch {
    throw new Error('Cannot reach the server. Check that the API is running.');
  }

  if (res.status === 204) return null;

  const data = await res.json().catch(() => null);
  if (!res.ok) {
    const error = new Error(data?.message || 'Something went wrong');
    error.details = data?.details || [];
    throw error;
  }
  return data;
}

export const registerUser = (body) => request('/api/auth/register', { method: 'POST', body });
export const loginUser = (body) => request('/api/auth/login', { method: 'POST', body });

export const getPhotos = () => request('/api/photos');
export const getPhoto = (id) => request(`/api/photos/${id}`);
export const createPhoto = (formData, userId) =>
  request('/api/photos', { method: 'POST', body: formData, userId });
export const deletePhoto = (id, userId) => request(`/api/photos/${id}`, { method: 'DELETE', userId });

export const getComments = (photoId) => request(`/api/photos/${photoId}/comments`);
export const createComment = (photoId, comment, userId) =>
  request(`/api/photos/${photoId}/comments`, { method: 'POST', body: { comment }, userId });
