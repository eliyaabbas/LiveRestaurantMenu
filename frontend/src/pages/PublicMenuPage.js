import React, { useState, useEffect, useMemo } from 'react';
import { useParams } from 'react-router-dom';
import * as api from '../api';
import styles from './PublicMenuPage.module.css';

const PublicMenuPage = () => {
    const { menuId } = useParams();
    const [menu, setMenu] = useState(null);
    const [settings, setSettings] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    
    // --- State for Interactive Features ---
    const [searchTerm, setSearchTerm] = useState('');
    const [filterType, setFilterType] = useState('all'); // 'all', 'veg', 'non-veg'
    const [suggestions, setSuggestions] = useState([]);

    useEffect(() => {
        const fetchMenuData = async () => {
            if (!menuId) {
                setError('No menu ID provided.');
                setLoading(false);
                return;
            }
            try {
                const menuRes = await api.getPublicMenu(menuId);
                const settingsRes = await api.getSettings();
                
                setMenu(menuRes.data);
                setSettings(settingsRes.data);

                api.trackMenuView(menuId);

            } catch (err) {
                setError('Sorry, we couldn\'t find that menu. It may be unpublished or the link is incorrect.');
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        fetchMenuData();
    }, [menuId]);

    // --- Filtering and Search Logic ---
    const handleSearchChange = (e) => {
        const value = e.target.value;
        setSearchTerm(value);

        if (value.length > 1 && menu) {
            const allItems = menu.categories.flatMap(cat => cat.items);
            const filteredSuggestions = allItems
                .filter(item => item.name.toLowerCase().includes(value.toLowerCase()))
                .map(item => item.name)
                .filter((name, index, self) => self.indexOf(name) === index);
            setSuggestions(filteredSuggestions.slice(0, 5));
        } else {
            setSuggestions([]);
        }
    };

    const handleSuggestionClick = (suggestion) => {
        setSearchTerm(suggestion);
        setSuggestions([]);
    };

    const filteredMenu = useMemo(() => {
        // FIX: Add a guard clause to prevent running on null data
        if (!menu) return null;

        return {
            ...menu,
            categories: menu.categories.map(category => {
                const filteredItems = category.items.filter(item => {
                    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase()) || item.description.toLowerCase().includes(searchTerm.toLowerCase());
                    const matchesType = filterType === 'all' || item.type === filterType;
                    return matchesSearch && matchesType;
                });
                return { ...category, items: filteredItems };
            }).filter(category => category.items.length > 0)
        };
    }, [menu, searchTerm, filterType]);


    if (loading) return <div className={styles.loadingContainer}><p>Loading Menu...</p></div>;
    if (error) return <div className={styles.loadingContainer}><p className={styles.error}>{error}</p></div>;
    // FIX: Add a final check to prevent rendering before filteredMenu is ready
    if (!filteredMenu) return <div className={styles.loadingContainer}><p>Preparing menu...</p></div>;
    
    const templateClass = styles[menu.template] || styles.classic;

    return (
        <div className={`${styles.publicMenuContainer} ${templateClass}`}>
            <div className={styles.contentWrapper}>
                <header className={styles.header}>
                    <h1>{menu.restaurantName}</h1>
                </header>

                <div className={styles.controlsContainer}>
                    <div className={styles.searchWrapper}>
                        <input
                            type="text"
                            placeholder="Search for a dish..."
                            className={styles.searchInput}
                            value={searchTerm}
                            onChange={handleSearchChange}
                            onBlur={() => setTimeout(() => setSuggestions([]), 100)}
                        />
                        {suggestions.length > 0 && (
                            <div className={styles.suggestionsList}>
                                {suggestions.map((suggestion, index) => (
                                    <div 
                                        key={index} 
                                        className={styles.suggestionItem}
                                        onClick={() => handleSuggestionClick(suggestion)}
                                    >
                                        {suggestion}
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                    <div className={styles.toggleGroup}>
                        <button className={filterType === 'all' ? styles.active : ''} onClick={() => setFilterType('all')}>All</button>
                        <button className={filterType === 'veg' ? styles.active : ''} onClick={() => setFilterType('veg')}>Veg</button>
                        <button className={filterType === 'non-veg' ? styles.active : ''} onClick={() => setFilterType('non-veg')}>Non-Veg</button>
                    </div>
                </div>

                {filteredMenu.categories.length > 0 ? (
                    filteredMenu.categories.map((category, catIndex) => (
                        <section key={catIndex} className={styles.categorySection}>
                            <h2 className={styles.categoryTitle}>{category.name}</h2>
                            <div className={styles.itemsGrid}>
                                {category.items.map((item, itemIndex) => (
                                    <div key={itemIndex} className={styles.itemCard}>
                                        <div className={styles.itemHeader}>
                                            <h3 className={styles.itemName}>
                                                {settings?.showVegNonVeg && <span className={`${styles.typeIndicator} ${styles[item.type]}`}></span>}
                                                {item.name}
                                            </h3>
                                            {settings?.showPrices && <p className={styles.itemPrice}>{settings?.currency}{item.price.toFixed(2)}</p>}
                                        </div>
                                        <p className={styles.itemDescription}>{item.description}</p>
                                    </div>
                                ))}
                            </div>
                        </section>
                    ))
                ) : (
                    <div className={styles.noResults}>
                        <h3>No dishes found</h3>
                        <p>Try adjusting your search or filter settings.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default PublicMenuPage;
