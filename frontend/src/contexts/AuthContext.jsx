import { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

// Axios setup
axios.defaults.withCredentials = true;

const AuthContext = createContext();

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  // Check session
  useEffect(() => {
    async function checkSession() {
      try {
        const response = await axios.get('/api/auth/me');
        if (response.data && response.data.user) {
          setUser(response.data.user);
          setIsAuthenticated(true);
        } else {
          setUser(null);
          setIsAuthenticated(false);
        }
      } catch (err) {
        console.error('Session verification failed:', err);
        setUser(null);
        setIsAuthenticated(false);
      } finally {
        setLoading(false);
      }
    }
    checkSession();
  }, []);

  const login = async (email, password) => {
    try {
      const response = await axios.post('/api/auth/login', { email, password });
      if (response.data && response.data.user) {
        setUser(response.data.user);
        setIsAuthenticated(true);
        return { success: true };
      }
      return { success: false, error: 'Login failed. Try again.' };
    } catch (err) {
      const errorMsg = err.response?.data?.error || 'Invalid credentials or connection error.';
      return { success: false, error: errorMsg };
    }
  };

  const signup = async (email, password, name, college, branch) => {
    try {
      const response = await axios.post('/api/auth/signup', {
        email,
        password,
        name,
        college,
        branch
      });
      if (response.data && response.data.user) {
        setUser(response.data.user);
        setIsAuthenticated(true);
        return { success: true };
      }
      return { success: false, error: 'Signup failed. Try again.' };
    } catch (err) {
      const errorMsg = err.response?.data?.error || 'Registration failed or email already registered.';
      return { success: false, error: errorMsg };
    }
  };

  const logout = async () => {
    try {
      await axios.post('/api/auth/logout');
    } catch (err) {
      console.error('API logout error:', err);
    } finally {
      setUser(null);
      setIsAuthenticated(false);
    }
  };

  const updateProfile = async (updates) => {
    try {
      const response = await axios.put('/api/profile', {
        name: updates.name,
        email: updates.email,
        college: updates.college,
        branch: updates.branch,
        photo: updates.photo
      });
      if (response.data && response.data.user) {
        setUser(response.data.user);
        return { success: true };
      }
      return { success: false, error: 'Update failed.' };
    } catch (err) {
      const errorMsg = err.response?.data?.error || 'Profile update failed.';
      return { success: false, error: errorMsg };
    }
  };

  const value = {
    user,
    isAuthenticated,
    loading,
    login,
    signup,
    logout,
    updateProfile,
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}
