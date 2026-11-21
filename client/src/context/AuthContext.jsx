import { createContext, useContext, useEffect, useState } from 'react';
import { clearToken, getMe, getToken, setToken, setUnauthorizedHandler } from '../api.js';

const AuthContext = createContext(null);
const storageKey = 'alzikrayat_user';

// The stored user is only trusted if a token is stored with it
function readStoredUser() {
  if (!getToken()) return null;
  try {
    return JSON.parse(localStorage.getItem(storageKey));
  } catch {
    return null;
  }
}

function saveUser(user) {
  try {
    localStorage.setItem(storageKey, JSON.stringify(user));
  } catch {
    /* storage unavailable: the session just lasts until refresh */
  }
}

// Keeps the logged-in user in React state, and the JWT in localStorage
export function AuthProvider({ children }) {
  const [user, setUser] = useState(readStoredUser);

  // called after a successful login or register, with the data from the API
  const login = (loggedInUser, token) => {
    setToken(token);
    saveUser(loggedInUser);
    setUser(loggedInUser);
  };

  // logging out just clears the token and the user
  const logout = () => {
    clearToken();
    try {
      localStorage.removeItem(storageKey);
    } catch {
      /* ignore */
    }
    setUser(null);
  };

  useEffect(() => {
    // a 401 from the API (expired or invalid token) logs the user out
    setUnauthorizedHandler(logout);

    // when the app opens, check that the stored token still works
    if (getToken()) {
      getMe()
        .then((freshUser) => {
          saveUser(freshUser);
          setUser(freshUser);
        })
        .catch(() => {});
    }
  }, []);

  return <AuthContext.Provider value={{ user, login, logout }}>{children}</AuthContext.Provider>;
}

export const useAuth = () => useContext(AuthContext);
