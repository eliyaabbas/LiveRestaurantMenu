import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import * as api from '../api'; // Use our centralized API file
import { QRCodeCanvas } from 'qrcode.react';
import styles from './RestaurantPublicPage.module.css';

const RestaurantPublicPage = () => {
    const { userId } = useParams();
    const [restaurantData, setRestaurantData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchPublicData = async () => {
            if (!userId) {
                setError('No restaurant specified.');
                setLoading(false);
                return;
            }
            try {
                // Call the correct API function from our centralized file
                const { data } = await api.getPublicRestaurantPage(userId);
                setRestaurantData(data);
            } catch (err) {
                setError('Could not find this restaurant or they have no published menus.');
            } finally {
                setLoading(false);
            }
        };
        fetchPublicData();
    }, [userId]);

    if (loading) return <div className={styles.pageWrapper}><p className={styles.message}>Loading Restaurant Page...</p></div>;
    if (error) return <div className={styles.pageWrapper}><p className={`${styles.message} ${styles.error}`}>{error}</p></div>;

    return (
        <div className={styles.pageWrapper}>
            <header className={styles.header}>
                <h1>{restaurantData.restaurantName}</h1>
                <p>Scan a QR code or click a link to view a menu.</p>
            </header>
            <main className={styles.container}>
                <div className={styles.grid}>
                    {restaurantData.publishedMenus.map(menu => (
                        <div key={menu._id} className={styles.card}>
                            <h2>{menu.restaurantName}</h2>
                            <div className={styles.qrCodeWrapper}>
                                <QRCodeCanvas
                                    value={`${window.location.origin}/menu/${menu._id}`}
                                    size={180}
                                    bgColor={"#ffffff"}
                                    fgColor={"#000000"}
                                    level={"H"}
                                />
                            </div>
                            <Link to={`/menu/${menu._id}`} className={styles.link}>
                                View Menu
                            </Link>
                        </div>
                    ))}
                </div>
            </main>
        </div>
    );
};

export default RestaurantPublicPage;
