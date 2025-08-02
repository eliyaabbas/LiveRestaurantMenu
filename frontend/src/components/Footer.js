import React from 'react';
import { Link } from 'react-router-dom';
import styles from './Footer.module.css';

// SVG Icons for Social Media
const InstagramIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line></svg>;
const TwitterIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M23 3a10.9 10.9 0 0 1-3.14 1.53 4.48 4.48 0 0 0-7.86 3v1A10.66 10.66 0 0 1 3 4s-4 9 5 13a11.64 11.64 0 0 1-7 2c9 5 20 0 20-11.5a4.5 4.5 0 0 0-.08-.83A7.72 7.72 0 0 0 23 3z"></path></svg>;
const LinkedinIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path><rect x="2" y="9" width="4" height="12"></rect><circle cx="4" cy="4" r="2"></circle></svg>;
const WhatsappIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path></svg>;


const Footer = () => {
  return (
    <footer className={styles.footer}>
      <div className={styles.container}>
        <div className={styles.column}>
          <h3 className={styles.columnTitle}>LiveRestaurantMenu</h3>
          <p className={styles.description}>The simplest way for restaurant owners to create and manage a beautiful digital menu.</p>
        </div>
        <div className={styles.column}>
          <h3 className={styles.columnTitle}>Company</h3>
          <Link to="/about" className={styles.link}>About Us</Link>
          <Link to="/careers" className={styles.link}>Careers</Link>
          <Link to="/contact" className={styles.link}>Contact Us</Link>
        </div>
        <div className={styles.column}>
          <h3 className={styles.columnTitle}>Legal</h3>
          <Link to="/privacy" className={styles.link}>Privacy Policy</Link>
          <Link to="/terms" className={styles.link}>Terms of Service</Link>
        </div>
        {/* New Social Media Column */}
        <div className={styles.column}>
            <h3 className={styles.columnTitle}>Follow Us</h3>
            <div className={styles.socialIcons}>
                <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className={styles.socialIconLink}><InstagramIcon /></a>
                <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className={styles.socialIconLink}><TwitterIcon /></a>
                <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className={styles.socialIconLink}><LinkedinIcon /></a>
                <a href="https://whatsapp.com" target="_blank" rel="noopener noreferrer" className={styles.socialIconLink}><WhatsappIcon /></a>
            </div>
        </div>
      </div>
      <div className={styles.copyright}>
        &copy; {new Date().getFullYear()} LiveRestaurantMenu. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;
