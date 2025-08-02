import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import * as api from '../api';
import styles from './DashboardPage.module.css';
import Modal from '../components/Modal';

const DashboardPage = () => {
  const [menus, setMenus] = useState([]);
  const [profile, setProfile] = useState(null); // State to hold user profile for the public link
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [menuToDelete, setMenuToDelete] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch menus and profile data in parallel for efficiency
        const [menusRes, profileRes] = await Promise.all([
          api.getAllMenus(),
          api.getProfile()
        ]);
        setMenus(menusRes.data);
        setProfile(profileRes.data);
      } catch (err) {
        setError('Failed to load your dashboard data. Please try again later.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleCreateNew = () => {
    navigate('/dashboard/templates');
  };

  const handleDeleteConfirm = async () => {
    if (!menuToDelete) return;
    try {
        await api.deleteMenuById(menuToDelete._id);
        setMenus(menus.filter(menu => menu._id !== menuToDelete._id));
        setMenuToDelete(null); // Close the modal
    } catch (err) {
        setError('Failed to delete the menu.');
    }
  };

  const handlePublishToggle = async (menuToUpdate) => {
    try {
        const updatedStatus = !menuToUpdate.isPublished;
        const updatedMenuData = { ...menuToUpdate, isPublished: updatedStatus };
        const { data } = await api.updateMenuById(menuToUpdate._id, updatedMenuData);
        // Update the state locally for an instant UI change
        setMenus(menus.map(m => m._id === data._id ? data : m));
    } catch (err) {
        setError('Failed to update menu status.');
    }
  };

  if (loading) {
    return <div className={styles.container}><p>Loading your menus...</p></div>;
  }

  return (
    <>
        <Modal
            isOpen={!!menuToDelete}
            onClose={() => setMenuToDelete(null)}
            onConfirm={handleDeleteConfirm}
            title="Delete Menu"
        >
            <p>Are you sure you want to delete the menu titled "<strong>{menuToDelete?.restaurantName}</strong>"? This action cannot be undone.</p>
        </Modal>

        <div className={styles.container}>
            <div className={styles.header}>
                <div>
                    <h1 className={styles.title}>Your Menu Cards</h1>
                    {profile && <a href={`/restaurant/${profile._id}`} target="_blank" rel="noopener noreferrer" className={styles.publicLink}>View Public Page</a>}
                </div>
                <button onClick={handleCreateNew} className={styles.createButton}>
                    + Create New Menu
                </button>
            </div>

            {error && <p className={styles.error}>{error}</p>}

            {menus.length > 0 ? (
                <div className={styles.grid}>
                    {menus.map(menu => (
                        <div key={menu._id} className={styles.card}>
                            <div className={styles.cardHeader}>
                                <h2>{menu.restaurantName}</h2>
                                <div className={styles.statusControls}>
                                    {menu.isPublished && (
                                        <a href={`/menu/${menu._id}`} target="_blank" rel="noopener noreferrer" className={styles.viewButton}>View</a>
                                    )}
                                    <div className={styles.publishToggle}>
                                        <span>{menu.isPublished ? 'Live' : 'Draft'}</span>
                                        <label className={styles.switch}>
                                            <input type="checkbox" checked={menu.isPublished} onChange={() => handlePublishToggle(menu)} />
                                            <span className={styles.slider}></span>
                                        </label>
                                    </div>
                                </div>
                            </div>
                            <div className={styles.cardBody}>
                                <p>Template: <span className={styles.templateName}>{menu.template}</span></p>
                                <p>Last updated: {new Date(menu.updatedAt).toLocaleDateString()}</p>
                            </div>
                            <div className={styles.cardFooter}>
                                <Link to={`/dashboard/menu/${menu._id}`} className={styles.editButton}>Edit</Link>
                                <button onClick={() => setMenuToDelete(menu)} className={styles.deleteButton}>Delete</button>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div className={styles.emptyState}>
                    <h2>No menus found.</h2>
                    <p>Get started by creating your first menu card.</p>
                </div>
            )}
        </div>
    </>
  );
};

export default DashboardPage;
