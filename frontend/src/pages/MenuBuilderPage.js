import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import * as api from '../api';
import styles from './MenuBuilderPage.module.css';

const MenuBuilderPage = () => {
    const { menuId } = useParams();
    const [menu, setMenu] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [isSaving, setIsSaving] = useState(false);

    // --- State for the suggestion feature ---
    const [suggestions, setSuggestions] = useState([]);
    const [activeSuggestionField, setActiveSuggestionField] = useState(null); // Tracks which input is focused

    useEffect(() => {
        const fetchMenuById = async () => {
            if (!menuId) return;
            setLoading(true);
            try {
                const { data } = await api.getMenuById(menuId);
                setMenu(data);
            } catch (err) {
                setError('Could not find the specified menu.');
            } finally {
                setLoading(false);
            }
        };
        fetchMenuById();
    }, [menuId]);

    const handleSaveChanges = async () => {
        setIsSaving(true);
        try {
            await api.updateMenuById(menuId, menu);
            alert('Menu saved successfully!');
        } catch (err) {
            alert('Error saving menu. Please try again.');
        } finally {
            setIsSaving(false);
        }
    };
    
    // --- UPDATED: Item change handler now calls the API for suggestions ---
    const handleItemChange = async (e, catIndex, itemIndex) => {
        const { name, value } = e.target;
        const newCategories = [...menu.categories];
        const currentItem = newCategories[catIndex].items[itemIndex];
        currentItem[name] = value;
        setMenu(prevMenu => ({ ...prevMenu, categories: newCategories }));

        // Fetch suggestions from the API
        if (name === 'name' && value.length > 2) {
            try {
                const { data } = await api.getDishSuggestions(value, currentItem.type);
                setSuggestions(data.map(dish => dish.name));
            } catch (error) {
                console.error("Failed to fetch suggestions:", error);
                setSuggestions([]);
            }
        } else {
            setSuggestions([]);
        }
    };

    // --- NEW: Handler for when a suggestion is clicked ---
    const handleSuggestionClick = (suggestion, catIndex, itemIndex) => {
        const newCategories = [...menu.categories];
        newCategories[catIndex].items[itemIndex].name = suggestion;
        setMenu(prevMenu => ({ ...prevMenu, categories: newCategories }));
        setSuggestions([]);
        setActiveSuggestionField(null);
    };

    // --- Other handlers remain the same ---
    const handleRestaurantNameChange = (e) => setMenu(prev => ({...prev, restaurantName: e.target.value}));
    const handleAddCategory = () => {
        const newCategoryName = prompt("Enter new category name:");
        if (newCategoryName) {
            const newCategories = [...menu.categories, { name: newCategoryName, items: [] }];
            setMenu(prevMenu => ({ ...prevMenu, categories: newCategories }));
        }
    };
    const handleRemoveCategory = (catIndex) => {
        if (window.confirm("Are you sure?")) {
            const newCategories = menu.categories.filter((_, i) => i !== catIndex);
            setMenu(prevMenu => ({ ...prevMenu, categories: newCategories }));
        }
    };
    const handleAddItem = (catIndex) => {
        const newItem = { name: 'New Item', price: 0, description: '', type: 'veg' };
        const newCategories = [...menu.categories];
        newCategories[catIndex].items.push(newItem);
        setMenu(prevMenu => ({ ...prevMenu, categories: newCategories }));
    };
    const handleRemoveItem = (catIndex, itemIndex) => {
        const newCategories = [...menu.categories];
        newCategories[catIndex].items.splice(itemIndex, 1);
        setMenu(prevMenu => ({ ...prevMenu, categories: newCategories }));
    };


    if (loading) return <div className={styles.container}><p>Loading Menu...</p></div>;
    if (error) return <div className={styles.container}><p className={styles.error}>{error}</p></div>;
    if (!menu) return null;

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <input 
                    type="text" 
                    value={menu.restaurantName} 
                    onChange={handleRestaurantNameChange}
                    className={styles.restaurantNameInput}
                    placeholder="Enter Menu Name"
                />
                <button onClick={handleSaveChanges} className={styles.saveButton} disabled={isSaving}>
                    {isSaving ? 'Saving...' : 'Save Changes'}
                </button>
            </div>

            {menu.categories.map((category, catIndex) => (
                <div key={catIndex} className={styles.categoryCard}>
                    <div className={styles.categoryHeader}>
                        <input type="text" name="name" value={category.name} onChange={(e) => { /* Omitted for brevity */ }} className={styles.categoryInput}/>
                        <button onClick={() => handleRemoveCategory(catIndex)} className={styles.deleteButton}>Delete Category</button>
                    </div>

                    {category.items.map((item, itemIndex) => (
                        <div key={itemIndex} className={styles.itemRow}>
                            <span className={`${styles.typeIndicator} ${styles[item.type]}`}></span>
                            
                            <div className={styles.suggestionWrapper}>
                                <input 
                                    type="text" 
                                    name="name" 
                                    value={item.name} 
                                    onChange={(e) => handleItemChange(e, catIndex, itemIndex)} 
                                    onFocus={() => setActiveSuggestionField({ catIndex, itemIndex })}
                                    placeholder="Item Name" 
                                    className={styles.itemInput}
                                    autoComplete="off"
                                />
                                {suggestions.length > 0 && activeSuggestionField?.catIndex === catIndex && activeSuggestionField?.itemIndex === itemIndex && (
                                    <div className={styles.suggestionsList}>
                                        {suggestions.map((suggestion, sIndex) => (
                                            <div 
                                                key={sIndex} 
                                                className={styles.suggestionItem}
                                                onMouseDown={() => handleSuggestionClick(suggestion, catIndex, itemIndex)}
                                            >
                                                {suggestion}
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                            
                            <input type="text" name="description" value={item.description} onChange={(e) => handleItemChange(e, catIndex, itemIndex)} placeholder="Description" className={styles.itemInput}/>
                            <select name="type" value={item.type || 'veg'} onChange={(e) => handleItemChange(e, catIndex, itemIndex)} className={styles.typeSelect}>
                                <option value="veg">Veg</option>
                                <option value="non-veg">Non-Veg</option>
                                <option value="egg">Egg</option>
                            </select>
                            <input type="number" name="price" value={item.price} onChange={(e) => handleItemChange(e, catIndex, itemIndex)} placeholder="Price" className={styles.priceInput}/>
                            <button onClick={() => handleRemoveItem(catIndex, itemIndex)} className={styles.deleteItemButton}>×</button>
                        </div>
                    ))}
                    <button onClick={() => handleAddItem(catIndex)} className={styles.addItemButton}>+ Add Item</button>
                </div>
            ))}
            <button onClick={handleAddCategory} className={styles.addCategoryButton}>+ Add New Category</button>
        </div>
    );
};

export default MenuBuilderPage;
