import React, { createContext, useState } from 'react';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  const users = {
    admin: { username: 'admin', password: 'admin', role: 'admin' },
    manufacturer: { username: 'manufacturer', password: 'manufacturer', role: 'manufacturer' },
    buyer: { username: 'buyer', password: 'buyer', role: 'buyer' },
  };

  const login = async (username, password) => {
    const user = users[username];
    if (user && user.password === password) {
      setUser({ username, role: user.role });
      return { username, role: user.role };
    }
    throw new Error('Invalid credentials');
  };

  const logout = () => {
    setUser(null);
    window.location.reload();
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
