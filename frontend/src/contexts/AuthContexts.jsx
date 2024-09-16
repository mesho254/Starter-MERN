import { createContext, useState, useEffect } from 'react';
import axiosInstance from '../axiosConfig';  

const AuthContext = createContext();

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const userInfo = JSON.parse(localStorage.getItem('userInfo'));
    if (userInfo) {
      setUser(userInfo);
      console.log(userInfo)
    }
  }, []);

  const login = async (email, password) => {
    const { data } = await axiosInstance.post('/api/auth/login', { email, password });
    localStorage.setItem('userInfo', JSON.stringify(data));
    setUser(data);
    console.log(setUser(data))
  };

  const register = async (username, email, password) => {
    const { data } = await axiosInstance.post('/api/auth/register', { username, email, password });
    localStorage.setItem('userInfo', JSON.stringify(data));
    setUser(data);
  };

  // Forgot Password function
  const forgotPassword = async (email) => {
    await axiosInstance.post('/api/auth/forgot-password', { email });
  };

  // Reset Password function
  const resetPassword = async ( id ,token, password ) => {
    await axiosInstance.post(`/api/auth/password-reset/${id}/${token}` , { password });
  };


  const logout = () => {
    localStorage.removeItem('userInfo');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout, forgotPassword, resetPassword }}>
      {children}
    </AuthContext.Provider>
  );
};

export { AuthProvider, AuthContext };