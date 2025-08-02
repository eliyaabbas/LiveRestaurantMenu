import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import * as api from '../api';
import styles from './TemplatesPage.module.css';

const TemplatesPage = () => {
    const [loadingTemplate, setLoadingTemplate] = useState(null);
    const navigate = useNavigate();

    const handleSelectTemplate = async (templateName) => {
        setLoadingTemplate(templateName); // Show loading state on the selected card
        try {
            // Call the API to create a new menu with the selected template
            const { data: newMenu } = await api.createNewMenu({ template: templateName });
            // Navigate to the builder page for the newly created menu
            navigate(`/dashboard/menu/${newMenu._id}`);
        } catch (error) {
            alert('Failed to create a new menu. Please try again.');
            setLoadingTemplate(null);
        }
    };

    const templates = [
        { name: 'classic', displayName: 'Classic Modern' },
        { name: 'dark-elegance', displayName: 'Dark Elegance' },
        { name: 'garden-fresh', displayName: 'Garden Fresh' },
        { name: 'minimalist', displayName: 'Minimalist' },
        { name: 'rustic-wood', displayName: 'Rustic Wood' },
        { name: 'seafood-breeze', displayName: 'Seafood Breeze' },
        { name: 'gourmet-gold', displayName: 'Gourmet Gold' },
        { name: 'cafe-chalkboard', displayName: 'Cafe Chalkboard' },
    ];

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <h1>First, Choose a Template</h1>
            </div>
            <p className={styles.subtitle}>Select a design for your new menu card. You can always change this later.</p>
            
            <div className={styles.grid}>
                {templates.map((template) => (
                    <div
                        key={template.name}
                        className={styles.card}
                        onClick={() => handleSelectTemplate(template.name)}
                    >
                        <div className={`${styles.preview} ${styles[template.name]}`}>
                           {loadingTemplate === template.name && <div className={styles.loadingOverlay}>Creating...</div>}
                        </div>
                        <h3 className={styles.cardTitle}>{template.displayName}</h3>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default TemplatesPage;
