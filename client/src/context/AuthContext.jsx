import { createContext, useContext, useState } from 'react';

const AuthContext = createContext(null);
const storageKey = 'alzikrayat_user';

function readStoredUser() {
  try {
    return JSON.parse(localStorage.getItem(storageKey));
  } catch {
    return null;
  }
}

// Keeps the logged-in user in React state (and in localStorage so a refresh keeps the session)
export function AuthProvider({ children }) {
  const [user, setUser] = useState(readStoredUser);

  const login = (loggedInUser) => {
    setUser(loggedInUser);
    try {
      localStorage.setItem(storageKey, JSON.stringify(loggedInUser));
    } catch {
      /* storage unavailable: the session just lasts until refresh */
    }
  };

  const logout = () => {
    setUser(null);
    try {
      localStorage.removeItem(storageKey);
    } catch {
      /* ignore */
    }
  };

  return <AuthContext.Provider value={{ user, login, logout }}>{children}</AuthContext.Provider>;
}

export const useAuth = () => useContext(AuthContext);
