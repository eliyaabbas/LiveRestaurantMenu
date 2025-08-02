import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import * as api from '../api';
import styles from './LoginPage.module.css'; // We can reuse the login styles

const VerifyOtpPage = () => {
    const [otp, setOtp] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const location = useLocation();
    
    // Get the contact info and method from the state passed during navigation
    const { email, phone, method } = location.state || {};

    if (!email) {
        // Redirect if the page is accessed directly without state
        navigate('/register');
        return null;
    }

    // Determine the contact detail to display
    const contactDetail = method === 'phone' ? phone : email;

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);
        try {
            // The backend will find the user by their email
            const { data } = await api.verifyOtp({ email, otp });
            localStorage.setItem('authToken', data.token);
            navigate('/dashboard');
        } catch (err) {
            setError(err.response?.data?.msg || 'Verification failed. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className={styles.container}>
            <form className={styles.form} onSubmit={handleSubmit}>
                <h2 className={styles.title}>Verify Your Account</h2>
                <p className={styles.instructions}>
                    An OTP has been sent to <strong>{contactDetail}</strong>. Please enter it below.
                </p>
                {error && <p className={styles.error}>{error}</p>}
                <div className={styles.inputGroup}>
                    <label htmlFor="otp">Verification Code (OTP)</label>
                    <input
                        type="text"
                        id="otp"
                        name="otp"
                        value={otp}
                        onChange={(e) => setOtp(e.target.value)}
                        required
                        maxLength="6"
                        pattern="\d{6}"
                        title="Please enter a 6-digit OTP"
                    />
                </div>
                <button type="submit" className={styles.submitButton} disabled={loading}>
                    {loading ? 'Verifying...' : 'Verify & Login'}
                </button>
            </form>
        </div>
    );
};

export default VerifyOtpPage;
