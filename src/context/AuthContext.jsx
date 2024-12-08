import { createContext, useState, useEffect } from 'react';
import { jwtDecode } from 'jwt-decode'; 

const AuthContext = createContext();

const AuthProvider = ({ children }) => {
  const [authToken, setAuthToken] = useState(null);
  const [loading, setLoading] = useState(true);

   const isTokenExpired = (token) => {
    const decoded = jwtDecode(token); 
    const currentTime = Date.now() / 1000; 
    return decoded.exp < currentTime; 
  };

  useEffect(() => {
    const token = localStorage.getItem('token');
    
    if (token) {
      if (isTokenExpired(token)) {
        logout();
      } else {
        setAuthToken(token);
      }
    }
    setLoading(false); 
  }, []);

  const login = (token) => {
    setAuthToken(token);
    localStorage.setItem('token', token); 
  };

  const logout = () => {
    setAuthToken(null);
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  };


  return (
    <AuthContext.Provider value={{ authToken, login, logout, loading,  }}>
      {children}
    </AuthContext.Provider>
  );
};

export { AuthContext, AuthProvider };
