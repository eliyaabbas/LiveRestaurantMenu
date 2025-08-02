import React, { useState, useEffect, useRef } from 'react';
import * as api from '../api';
import { QRCodeCanvas } from 'qrcode.react';
import styles from './PublishPage.module.css';

// Social Media Icons
const WhatsappIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path></svg>;
const FacebookIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path></svg>;
const TwitterIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M23 3a10.9 10.9 0 0 1-3.14 1.53 4.48 4.48 0 0 0-7.86 3v1A10.66 10.66 0 0 1 3 4s-4 9 5 13a11.64 11.64 0 0 1-7 2c9 5 20 0 20-11.5a4.5 4.5 0 0 0-.08-.83A7.72 7.72 0 0 0 23 3z"></path></svg>;


const PublishPage = () => {
    const [menus, setMenus] = useState([]);
    const [selectedMenu, setSelectedMenu] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [showShareOptions, setShowShareOptions] = useState(false);
    const qrCodeRef = useRef(null);

    useEffect(() => {
        const fetchMenus = async () => {
            try {
                const { data } = await api.getAllMenus();
                setMenus(data);
                if (data.length > 0) {
                    setSelectedMenu(data[0]);
                }
            } catch (error) {
                console.error("Failed to load menus", error);
            } finally {
                setLoading(false);
            }
        };
        fetchMenus();
    }, []);

    const handleMenuSelect = (e) => {
        const menu = menus.find(m => m._id === e.target.value);
        setSelectedMenu(menu);
    };

    const handlePublishToggle = async () => {
        if (!selectedMenu) return;
        setIsSaving(true);
        try {
            const updatedMenuData = { ...selectedMenu, isPublished: !selectedMenu.isPublished };
            const { data } = await api.updateMenuById(selectedMenu._id, updatedMenuData);
            setSelectedMenu(data);
            setMenus(menus.map(m => m._id === data._id ? data : m));
        } catch (error) {
            alert('Failed to update publish status.');
        } finally {
            setIsSaving(false);
        }
    };

    const downloadQRCode = () => {
        const canvas = qrCodeRef.current;
        if (!canvas) return;
        const pngUrl = canvas.toDataURL("image/png").replace("image/png", "image/octet-stream");
        let downloadLink = document.createElement("a");
        downloadLink.href = pngUrl;
        downloadLink.download = `${selectedMenu.restaurantName}-QR.png`;
        document.body.appendChild(downloadLink);
        downloadLink.click();
        document.body.removeChild(downloadLink);
    };

    const copyLink = () => {
        const link = getShareLink();
        navigator.clipboard.writeText(link).then(() => {
            alert('Link copied to clipboard!');
        }, () => {
            alert('Failed to copy link.');
        });
    };

    const getShareLink = () => `${window.location.origin}/menu/${selectedMenu._id}`;
    const shareText = `Check out the menu for ${selectedMenu?.restaurantName}!`;

    if (loading) return <div className={styles.container}><p>Loading...</p></div>;

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <h1>Publish & Get QR Code</h1>
            </div>
            
            {menus.length === 0 ? (
                <div className={styles.emptyState}>
                    <h2>No menus found.</h2>
                    <p>You need to create a menu in the "My Menus" section first.</p>
                </div>
            ) : (
                <div className={styles.content}>
                    <div className={styles.controlPanel}>
                        <h2>Select a Menu to Manage</h2>
                        <select onChange={handleMenuSelect} value={selectedMenu?._id || ''} className={styles.menuSelect}>
                            {menus.map(menu => (
                                <option key={menu._id} value={menu._id}>{menu.restaurantName}</option>
                            ))}
                        </select>

                        {selectedMenu && (
                            <div className={styles.publishControl}>
                                <h3>Publish Status: <span className={selectedMenu.isPublished ? styles.published : styles.draft}>{selectedMenu.isPublished ? 'Live' : 'Draft'}</span></h3>
                                <p>Publishing your menu makes it visible to anyone with the QR code or link.</p>
                                <label className={styles.switch}>
                                    <input type="checkbox" onChange={handlePublishToggle} checked={selectedMenu.isPublished} disabled={isSaving} />
                                    <span className={styles.slider}></span>
                                </label>
                            </div>
                        )}
                    </div>

                    <div className={styles.qrPanel}>
                        {selectedMenu && selectedMenu.isPublished ? (
                            <>
                                <h2>Your QR Code is Ready!</h2>
                                <p>Customers can scan this code to view your menu.</p>
                                <div className={styles.qrCodeWrapper}>
                                    <QRCodeCanvas ref={qrCodeRef} value={getShareLink()} size={256} level={"H"} includeMargin={true} />
                                </div>
                                <div className={styles.buttonGroup}>
                                    <button onClick={downloadQRCode} className={styles.actionButton}>Download PNG</button>
                                    <button onClick={copyLink} className={styles.actionButton}>Copy Link</button>
                                    
                                    <div className={styles.shareWrapper}>
                                        <button onClick={() => setShowShareOptions(!showShareOptions)} className={styles.shareButton}>Share</button>
                                        {showShareOptions && (
                                            <div className={styles.shareDropdown}>
                                                <a href={`https://api.whatsapp.com/send?text=${encodeURIComponent(shareText + ' ' + getShareLink())}`} target="_blank" rel="noopener noreferrer"><WhatsappIcon /></a>
                                                <a href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(getShareLink())}`} target="_blank" rel="noopener noreferrer"><FacebookIcon /></a>
                                                <a href={`https://twitter.com/intent/tweet?url=${encodeURIComponent(getShareLink())}&text=${encodeURIComponent(shareText)}`} target="_blank" rel="noopener noreferrer"><TwitterIcon /></a>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </>
                        ) : (
                            <div className={styles.notPublished}>
                                <h2>Publish Your Menu</h2>
                                <p>Once you publish this menu, its QR code will appear here.</p>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default PublishPage;
