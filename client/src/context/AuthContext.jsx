import { createContext, useContext, useState, useEffect } from 'react';
import { getMe, loginUser, registerUser, logoutUser } from '../api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // On mount: restore session from stored JWT token
  useEffect(() => {
    const token = localStorage.getItem('greenroots_token') || localStorage.getItem('token');
    if (token) {
      getMe()
        .then((res) => {
          if (res.data?.user) {
            setUser(res.data.user);
          } else if (res.data) {
            setUser(res.data);
          }
        })
        .catch(() => {
          localStorage.removeItem('greenroots_token');
          localStorage.removeItem('token');
        })
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, []);

  /** Email / password login */
  const login = async (credentials) => {
    const res = await loginUser(credentials);
    const jwtToken = res.data.token || res.data.access;
    localStorage.setItem('greenroots_token', jwtToken);
    localStorage.setItem('token', jwtToken);
    setUser(res.data.user);
    return res.data;
  };

  /**
   * Called after Google OAuth redirect lands back on /login?token=...
   */
  const loginWithToken = async (token) => {
    localStorage.setItem('greenroots_token', token);
    localStorage.setItem('token', token);
    const res = await getMe();
    const userData = res.data?.user || res.data;
    setUser(userData);
    return userData;
  };

  /** Registration */
  const register = async (data) => {
    const res = await registerUser(data);
    const jwtToken = res.data.token || res.data.access;
    localStorage.setItem('greenroots_token', jwtToken);
    localStorage.setItem('token', jwtToken);
    setUser(res.data.user);
    return res.data;
  };

  /** Logout */
  const logout = async () => {
    try {
      await logoutUser();
    } catch (e) {
      // quiet fallback
    }
    localStorage.removeItem('greenroots_token');
    localStorage.removeItem('token');
    setUser(null);
  };

  /** Update cached user fields without a full re-fetch */
  const updateUser = (updates) => {
    setUser((prev) => ({ ...prev, ...updates }));
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, loginWithToken, register, logout, updateUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider');
  return ctx;
};
