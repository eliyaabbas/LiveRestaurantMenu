import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import * as api from '../api';
import styles from './RegisterPage.module.css';

const RegisterPage = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    phone: '',
    dob: '',
    gender: '',
  });
  const [otpMethod, setOtpMethod] = useState('email'); // New state for OTP choice
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // Validation
    if (formData.password !== formData.confirmPassword) {
      return setError('Passwords do not match');
    }
    if (otpMethod === 'phone' && !formData.phone) {
        return setError('Please enter a phone number to receive an OTP via SMS.');
    }

    setLoading(true);
    try {
      // Pass the chosen OTP method to the backend
      await api.register({ ...formData, method: otpMethod });
      
      // Navigate to the OTP page, passing all necessary info
      navigate('/verify-otp', { 
          state: { 
              email: formData.email,
              phone: formData.phone,
              method: otpMethod 
            } 
        });

    } catch (err) {
      setError(err.response?.data?.msg || 'An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <form className={styles.form} onSubmit={handleSubmit}>
        <h2 className={styles.title}>Create Your Account</h2>
        {error && <p className={styles.error}>{error}</p>}
        
        {/* All existing input fields remain here... */}
        <div className={styles.inputGroup}>
          <label htmlFor="name">Restaurant Name</label>
          <input type="text" id="name" name="name" onChange={handleChange} required />
        </div>
        <div className={styles.inputGroup}>
          <label htmlFor="email">Email Address</label>
          <input type="email" id="email" name="email" onChange={handleChange} required />
        </div>
        <div className={styles.inputGroup}>
          <label htmlFor="phone">Phone Number</label>
          <input type="tel" id="phone" name="phone" onChange={handleChange} />
        </div>
        
        {/* --- NEW: OTP Method Selection --- */}
        <div className={styles.inputGroup}>
            <label>Send OTP via</label>
            <div className={styles.radioGroup}>
                <label className={styles.radioLabel}>
                    <input 
                        type="radio" 
                        name="otpMethod" 
                        value="email" 
                        checked={otpMethod === 'email'} 
                        onChange={(e) => setOtpMethod(e.target.value)}
                    />
                    Email
                </label>
                <label className={styles.radioLabel}>
                    <input 
                        type="radio" 
                        name="otpMethod" 
                        value="phone" 
                        checked={otpMethod === 'phone'} 
                        onChange={(e) => setOtpMethod(e.target.value)}
                    />
                    Phone (SMS)
                </label>
            </div>
        </div>

        {/* Password fields... */}
        <div className={styles.inputGroup}>
          <label htmlFor="password">Password</label>
          <input type="password" id="password" name="password" onChange={handleChange} required />
        </div>
        <div className={styles.inputGroup}>
          <label htmlFor="confirmPassword">Confirm Password</label>
          <input type="password" id="confirmPassword" name="confirmPassword" onChange={handleChange} required />
        </div>
        
        <button type="submit" className={styles.submitButton} disabled={loading}>
          {loading ? 'Sending OTP...' : 'Get Verification Code'}
        </button>
        <p className={styles.redirect}>
          Already have an account? <Link to="/login">Login here</Link>
        </p>
      </form>
    </div>
  );
};

export default RegisterPage;
