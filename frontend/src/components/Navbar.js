import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useTheme } from '../contexts/ThemeContext';
import styles from './Navbar.module.css';

const Navbar = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { theme, toggleTheme } = useTheme();
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const menuRef = useRef(null); // Ref for the menu to detect outside clicks

   // const token = localStorage.getItem('authToken');

    // Close menu on route change
    useEffect(() => {
        setIsMenuOpen(false);
    }, [location]);

    // Close menu when clicking outside
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
        localStorage.removeItem('authToken');
        navigate('/login');
    };

    // Don't show the navbar on these pages
    if (['/', '/login', '/register', '/forgot-password', '/auth/success'].includes(location.pathname) || location.pathname.startsWith('/reset-password')) {
    return null;
}


    return (
        <nav className={styles.navbar}>
            <div className={styles.container}>
                <Link to="/dashboard" className={styles.brand}>
                    LiveRestaurantMenu
                </Link>

                {/* Desktop Nav */}
                <div className={styles.desktopNav}>
                    <Link to="/dashboard" className={styles.navLink}>Dashboard</Link>
                    <Link to="/settings" className={styles.navLink}>Settings</Link>
                    <Link to="/profile" className={styles.navLink}>Profile</Link>
                    <button onClick={handleLogout} className={styles.logoutButton}>Logout</button>
                </div>

                {/* Mobile Nav - Hamburger */}
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
