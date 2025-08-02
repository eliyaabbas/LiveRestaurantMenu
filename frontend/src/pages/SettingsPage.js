import React, { useState, useEffect } from 'react';
import { useTheme } from '../contexts/ThemeContext';
import * as api from '../api';
import styles from './SettingsPage.module.css';

const SettingsPage = () => {
  const { theme, toggleTheme } = useTheme();
  const [settings, setSettings] = useState({
    currency: '$',
    showPrices: true,
    showVegNonVeg: true,
  });
  const [loading, setLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const { data } = await api.getSettings();
        setSettings({
            currency: data.currency || '$',
            showPrices: data.showPrices !== false, // default to true if undefined
            showVegNonVeg: data.showVegNonVeg !== false, // default to true if undefined
        });
      } catch (error) {
        console.error("Failed to load settings", error);
      } finally {
        setLoading(false);
      }
    };
    fetchSettings();
  }, []);

  const handleSettingChange = (e) => {
    const { name, value, type, checked } = e.target;
    setSettings(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleSaveChanges = async () => {
    setIsSaving(true);
    try {
        // We only need to save the menu display settings here
        const settingsToUpdate = {
            currency: settings.currency,
            showPrices: settings.showPrices,
            showVegNonVeg: settings.showVegNonVeg,
        };
        await api.updateSettings(settingsToUpdate);
        alert('Settings saved successfully!');
    } catch (error) {
        alert('Failed to save settings.');
    } finally {
        setIsSaving(false);
    }
  };

  if (loading) {
      return <div className={styles.container}><p>Loading settings...</p></div>
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.title}>Settings</h1>
        <button onClick={handleSaveChanges} className={styles.saveButton} disabled={isSaving}>
            {isSaving ? 'Saving...' : 'Save Changes'}
        </button>
      </div>

      <div className={styles.settingsBox}>
        <h2 className={styles.subTitle}>Appearance</h2>
        <div className={styles.settingItem}>
          <div className={styles.settingText}>
            <h3>Dark Mode</h3>
            <p>Toggle the application's color theme.</p>
          </div>
          <div className={styles.settingControl}>
            <label className={styles.switch}>
              <input type="checkbox" onChange={toggleTheme} checked={theme === 'dark'} />
              <span className={styles.slider}></span>
            </label>
          </div>
        </div>
      </div>

      <div className={styles.settingsBox}>
        <h2 className={styles.subTitle}>Menu Display</h2>
        <div className={styles.settingItem}>
            <div className={styles.settingText}>
                <h3>Currency Symbol</h3>
                <p>Set the currency for your menu prices.</p>
            </div>
            <div className={styles.settingControl}>
                <select name="currency" value={settings.currency} onChange={handleSettingChange} className={styles.select}>
                    <option value="$">USD ($)</option>
                    <option value="€">EUR (€)</option>
                    <option value="£">GBP (£)</option>
                    <option value="₹">INR (₹)</option>
                    <option value="¥">JPY (¥)</option>
                </select>
            </div>
        </div>
        <div className={styles.settingItem}>
            <div className={styles.settingText}>
                <h3>Show Prices</h3>
                <p>Display item prices on the public menu.</p>
            </div>
            <div className={styles.settingControl}>
                <label className={styles.switch}>
                    <input type="checkbox" name="showPrices" checked={settings.showPrices} onChange={handleSettingChange} />
                    <span className={styles.slider}></span>
                </label>
            </div>
        </div>
        <div className={styles.settingItem}>
            <div className={styles.settingText}>
                <h3>Show Veg/Non-Veg Icons</h3>
                <p>Display food type indicators on the menu.</p>
            </div>
            <div className={styles.settingControl}>
                <label className={styles.switch}>
                    <input type="checkbox" name="showVegNonVeg" checked={settings.showVegNonVeg} onChange={handleSettingChange} />
                    <span className={styles.slider}></span>
                </label>
            </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;
