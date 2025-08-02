import React, { createContext, useState, useEffect, useContext } from 'react';
import * as api from '../api';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [loading, setLoading] = useState(true); // Start with loading true

    useEffect(() => {
        const validateToken = async () => {
            const token = localStorage.getItem('authToken');
            if (token) {
                try {
                    // Check if the token is still valid by fetching the user's profile
                    const { data } = await api.getProfile();
                    setUser(data);
                    setIsAuthenticated(true);
                } catch (error) {
                    // If the token is invalid, clear it
                    localStorage.removeItem('authToken');
                    setIsAuthenticated(false);
                    console.error("Session expired or token is invalid.", error);
                }
            }
            setLoading(false);
        };

        validateToken();
    }, []);

    const login = (token) => {
        localStorage.setItem('authToken', token);
        setIsAuthenticated(true);
        // Optionally, you can fetch user data here as well
    };

    const logout = () => {
        localStorage.removeItem('authToken');
        setUser(null);
        setIsAuthenticated(false);
    };

    const value = {
        user,
        isAuthenticated,
        loading,
        login,
        logout,
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};
