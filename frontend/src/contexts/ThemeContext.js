import React, { createContext, useState, useEffect, useContext } from 'react';
import axios from 'axios';

const ThemeContext = createContext();

// Custom hook to use the theme context easily
export const useTheme = () => useContext(ThemeContext);

export const ThemeProvider = ({ children }) => {
  // Default to 'light' or get from localStorage
  const [theme, setTheme] = useState(localStorage.getItem('theme') || 'light');

  // Apply the theme to the document body whenever it changes
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
  }, [theme]);
  
  // Function to toggle the theme
  const toggleTheme = async () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);

    // If user is logged in, save preference to backend
    const token = localStorage.getItem('authToken');
    if (token) {
      try {
        await axios.put(
          'http://localhost:5000/api/settings',
          { theme: newTheme },
          { headers: { 'x-auth-token': token } }
        );
      } catch (error) {
        console.error('Failed to save theme preference:', error);
      }
    }
  };

  const value = {
    theme,
    toggleTheme,
    setTheme, // Expose setTheme to sync with DB on login
  };

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
};
