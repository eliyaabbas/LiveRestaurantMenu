import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import * as api from '../api';
import Modal from '../components/Modal'; // Import our new Modal
import styles from './ProfilePage.module.css';

const ProfilePage = () => {
  const [profile, setProfile] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({ name: '', phone: '', dob: '', gender: '' });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const navigate = useNavigate();

  const formatDateForInput = (date) => {
    if (!date) return '';
    return new Date(date).toISOString().split('T')[0];
  };

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const { data } = await api.getProfile();
        setProfile(data);
        setFormData({
          name: data.name || '',
          phone: data.phone || '',
          dob: formatDateForInput(data.dob),
          gender: data.gender || '',
        });
      } catch (err) {
        setError('Failed to load profile.');
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  const handleEditToggle = () => setIsEditing(!isEditing);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { data } = await api.updateProfile(formData);
      setProfile(data);
      setIsEditing(false);
    } catch (err) {
      setError('Failed to update profile.');
    } finally {
      setLoading(false);
    }
  };

  const handleLinkGoogle = () => {
    // The backend will handle linking this Google account to the currently logged-in user
    window.location.href = 'http://localhost:5000/api/auth/google';
  };

  const handleDeleteAccount = async () => {
    setIsModalOpen(false);
    setLoading(true);
    try {
        await api.deleteAccount();
        localStorage.removeItem('authToken');
        navigate('/register');
    } catch (err) {
        setError('Failed to delete account.');
    } finally {
        setLoading(false);
    }
  };

  if (loading && !profile) return <div className={styles.container}><p>Loading...</p></div>;
  if (error) return <div className={styles.container}><p className={styles.error}>{error}</p></div>;

  return (
    <>
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onConfirm={handleDeleteAccount}
        title="Delete Account"
      >
        <p>Are you sure you want to delete your account? This action is permanent and cannot be undone.</p>
      </Modal>

      <div className={styles.container}>
        <div className={styles.profileBox}>
          <h1 className={styles.title}>User Profile</h1>
          {isEditing ? (
            <form onSubmit={handleSubmit}>
              {/* Fields for editing */}
              <div className={styles.field}><label>Name</label><input type="text" name="name" value={formData.name} onChange={handleChange} className={styles.input} /></div>
              <div className={styles.field}><label>Email</label><p className={styles.readOnly}>{profile.email}</p></div>
              <div className={styles.field}><label>Phone</label><input type="tel" name="phone" value={formData.phone} onChange={handleChange} className={styles.input} /></div>
              <div className={styles.field}><label>Date of Birth</label><input type="date" name="dob" value={formData.dob} onChange={handleChange} className={styles.input} /></div>
              <div className={styles.field}><label>Gender</label>
                <select name="gender" value={formData.gender} onChange={handleChange} className={styles.input}>
                    <option value="" disabled>Select Gender</option><option value="Male">Male</option><option value="Female">Female</option><option value="Other">Other</option><option value="Prefer not to say">Prefer not to say</option>
                </select>
              </div>
              <div className={styles.buttonGroup}><button type="submit" className={styles.saveButton} disabled={loading}>Save</button><button type="button" className={styles.cancelButton} onClick={handleEditToggle}>Cancel</button></div>
            </form>
          ) : (
            <>
              {/* Fields for viewing */}
              <div className={styles.field}><label>Name</label><p>{profile.name || '-'}</p></div>
              <div className={styles.field}><label>Email</label><p>{profile.email}</p></div>
              <div className={styles.field}><label>Phone</label><p>{profile.phone || '-'}</p></div>
              <div className={styles.field}><label>Date of Birth</label><p>{profile.dob ? new Date(profile.dob).toLocaleDateString() : '-'}</p></div>
              <div className={styles.field}><label>Gender</label><p>{profile.gender || '-'}</p></div>
              <button className={styles.editButton} onClick={handleEditToggle}>Edit Profile</button>
            </>
          )}

          <div className={styles.divider}></div>
          
          <h2 className={styles.subTitle}>Account Actions</h2>
          {!profile.googleId && (
            <div className={styles.actionItem}>
                <div><h3>Link Google Account</h3><p>Connect your Google account for easy one-click login.</p></div>
                <button onClick={handleLinkGoogle} className={styles.googleButton}>Link with Google</button>
            </div>
          )}
          <div className={styles.actionItem}>
            <div><h3 className={styles.dangerText}>Delete Account</h3><p>Permanently delete your account and all associated data.</p></div>
            <button onClick={() => setIsModalOpen(true)} className={styles.dangerButton}>Delete Account</button>
          </div>
        </div>
      </div>
    </>
  );
};

export default ProfilePage;
