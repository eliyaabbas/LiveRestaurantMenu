import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import * as api from '../api';
import styles from './RegisterPage.module.css'; // Reuse the registration page styles

const CompleteProfilePage = () => {
    const [formData, setFormData] = useState({
        phone: '',
        dob: '',
        gender: '',
    });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            // Call the existing updateProfile API with the new data
            await api.updateProfile(formData);
            navigate('/dashboard'); // Redirect to the dashboard on success
        } catch (err) {
            setError('Failed to update profile. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className={styles.container}>
            <form className={styles.form} onSubmit={handleSubmit}>
                <h2 className={styles.title}>Complete Your Profile</h2>
                <p className={styles.instructions}>Just a few more details to get you started.</p>
                {error && <p className={styles.error}>{error}</p>}
                
                <div className={styles.inputGroup}>
                    <label htmlFor="phone">Phone Number</label>
                    <input type="tel" id="phone" name="phone" onChange={handleChange} />
                </div>
                <div className={styles.inputGroup}>
                    <label htmlFor="dob">Date of Birth</label>
                    <input type="date" id="dob" name="dob" onChange={handleChange} />
                </div>
                <div className={styles.inputGroup}>
                    <label htmlFor="gender">Gender</label>
                    <select id="gender" name="gender" value={formData.gender} onChange={handleChange}>
                        <option value="" disabled>Select Gender</option>
                        <option value="Male">Male</option>
                        <option value="Female">Female</option>
                        <option value="Other">Other</option>
                        <option value="Prefer not to say">Prefer not to say</option>
                    </select>
                </div>
                
                <button type="submit" className={styles.submitButton} disabled={loading}>
                    {loading ? 'Saving...' : 'Save and Continue'}
                </button>
            </form>
        </div>
    );
};

export default CompleteProfilePage;
