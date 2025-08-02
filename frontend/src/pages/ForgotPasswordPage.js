import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import * as api from '../api';
import styles from './LoginPage.module.css'; // We can reuse the login page styles

const ForgotPasswordPage = () => {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    setError('');
    setLoading(true);
    try {
      const { data } = await api.forgotPassword({ email });
      setMessage(data.msg);
    } catch (err) {
      setError(err.response?.data?.msg || 'An error occurred.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <form className={styles.form} onSubmit={handleSubmit}>
        <h2 className={styles.title}>Forgot Password</h2>
        {message && <p className={styles.success}>{message}</p>}
        {error && <p className={styles.error}>{error}</p>}
        <p className={styles.instructions}>
          Enter your email address and we will send you a link to reset your password.
        </p>
        <div className={styles.inputGroup}>
          <label htmlFor="email">Email Address</label>
          <input
            type="email"
            id="email"
            name="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <button type="submit" className={styles.submitButton} disabled={loading}>
          {loading ? 'Sending...' : 'Send Reset Link'}
        </button>
        <p className={styles.redirect}>
          Remember your password? <Link to="/login">Login here</Link>
        </p>
      </form>
    </div>
  );
};

export default ForgotPasswordPage;
