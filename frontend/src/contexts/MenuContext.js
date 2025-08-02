import React, { createContext, useState, useContext, useCallback } from 'react';
import * as api from '../api';
import axios from 'axios'; // Import axios to check for specific API errors

const MenuContext = createContext();

export const useMenu = () => useContext(MenuContext);

export const MenuProvider = ({ children }) => {
  const [menu, setMenu] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // useCallback makes this function stable so it doesn't cause re-renders
  const fetchMenu = useCallback(async () => {
    try {
      setLoading(true);
      setError(''); // Clear previous errors before a new fetch
      const { data } = await api.getMenu();
      setMenu(data);
    } catch (err) {
      // Add more detailed logging to the browser console for debugging
      console.error("Error fetching menu:", err);
      if (axios.isAxiosError(err)) {
        console.error("Axios error response:", err.response?.data);
      }
      setError('Failed to load menu. Please ensure the backend server is running and check the browser console for more details.');
    } finally {
      setLoading(false);
    }
  }, []); // The empty array [] means this function is created only once.

  const updateMenu = async (updatedData) => {
    try {
        setLoading(true);
        setError(''); // Clear previous errors
        const { data } = await api.updateMenu(updatedData);
        setMenu(data);
        return data;
    } catch (err) {
        console.error("Error updating menu:", err);
        setError('Failed to save menu.');
        throw err; // Re-throw the error so the component can catch it
    } finally {
        setLoading(false);
    }
  }

  const value = {
    menu,
    setMenu,
    loading,
    error,
    fetchMenu,
    updateMenu,
  };

  return (
    <MenuContext.Provider value={value}>
      {children}
    </MenuContext.Provider>
  );
};
