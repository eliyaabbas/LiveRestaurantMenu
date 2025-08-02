import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useTheme } from '../contexts/ThemeContext';
import { useAuth } from '../contexts/AuthContext'; // Import the useAuth hook
import styles from './Navbar.module.css';

const Navbar = () => {
    const location = useLocation();
    const { theme, toggleTheme } = useTheme();
    const { isAuthenticated, logout } = useAuth(); // Get isAuthenticated and logout from context
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const menuRef = useRef(null);

    useEffect(() => {
        setIsMenuOpen(false);
    }, [location]);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (menuRef.current && !menuRef.current.contains(event.target)) {
                setIsMenuOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [menuRef]);

    const handleLogout = () => {
        logout(); // Use the logout function from the context
    };

    // Don't show the navbar if the user is not authenticated
    if (!isAuthenticated) {
        return null;
    }

    return (
        <nav className={styles.navbar}>
            <div className={styles.container}>
                <Link to="/dashboard" className={styles.brand}>
                    LiveRestaurantMenu
                </Link>

                <div className={styles.desktopNav}>
                    <Link to="/dashboard" className={styles.navLink}>Dashboard</Link>
                    <Link to="/settings" className={styles.navLink}>Settings</Link>
                    <Link to="/profile" className={styles.navLink}>Profile</Link>
                    <button onClick={handleLogout} className={styles.logoutButton}>Logout</button>
                </div>

                <div className={styles.mobileNav} ref={menuRef}>
                    <button onClick={() => setIsMenuOpen(!isMenuOpen)} className={styles.hamburger}>
                        ☰
                    </button>
                    {isMenuOpen && (
                        <div className={styles.dropdownMenu}>
                            <Link to="/dashboard" className={styles.dropdownLink}>Dashboard</Link>
                            <Link to="/settings" className={styles.dropdownLink}>Settings</Link>
                            <Link to="/profile" className={styles.dropdownLink}>Profile</Link>
                            <div className={styles.dropdownDivider}></div>
                            <div className={styles.dropdownItem}>
                                <span>Theme</span>
                                <label className={styles.switch}>
                                    <input type="checkbox" onChange={toggleTheme} checked={theme === 'dark'} />
                                    <span className={styles.slider}></span>
                                </label>
                            </div>
                            <div className={styles.dropdownDivider}></div>
                            <button onClick={handleLogout} className={styles.dropdownButton}>
                                Logout
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
