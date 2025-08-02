import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate, Outlet } from 'react-router-dom';
import { ThemeProvider } from './contexts/ThemeContext';

// Import Components
import Navbar from './components/Navbar';
import DashboardLayout from './components/DashboardLayout';
import Footer from './components/Footer';
import styles from './App.module.css';

// Import Pages
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import DashboardPage from './pages/DashboardPage';
import MenuBuilderPage from './pages/MenuBuilderPage';
import TemplatesPage from './pages/TemplatesPage';
import PublishPage from './pages/PublishPage';
import ProfilePage from './pages/ProfilePage';
import SettingsPage from './pages/SettingsPage';
import ForgotPasswordPage from './pages/ForgotPasswordPage';
import ResetPasswordPage from './pages/ResetPasswordPage';
import GoogleAuthSuccessPage from './pages/GoogleAuthSuccessPage';
import PublicMenuPage from './pages/PublicMenuPage';
import RestaurantPublicPage from './pages/RestaurantPublicPage'; // Import the new page

// --- Protected Route Component ---
const ProtectedRoute = () => {
  const token = localStorage.getItem('authToken');
  // If no token, redirect to the login page, otherwise render the child routes
  return token ? <Outlet /> : <Navigate to="/login" replace />;
};

// --- Main Layout for the entire authenticated app ---
const MainAppLayout = () => (
  <div className={styles.appWrapper}>
    <Navbar />
    <main className={styles.mainContent}>
      {/* The Outlet will render the protected routes */}
      <Outlet />
    </main>
    <Footer />
  </div>
);


function App() {
  return (
    <ThemeProvider>
      <Router>
        <Routes>
          {/* Public Routes (No Navbar/Footer) */}
          <Route path="/menu/:menuId" element={<PublicMenuPage />} />
          <Route path="/restaurant/:userId" element={<RestaurantPublicPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/forgot-password" element={<ForgotPasswordPage />} />
          <Route path="/reset-password/:token" element={<ResetPasswordPage />} />
          <Route path="/auth/success" element={<GoogleAuthSuccessPage />} />

          {/* Protected Routes (Render inside MainAppLayout) */}
          <Route element={<ProtectedRoute />}>
            <Route element={<MainAppLayout />}>
              <Route path="/dashboard" element={<DashboardLayout />}>
                <Route index element={<DashboardPage />} />
                <Route path="menu/:menuId" element={<MenuBuilderPage />} />
                <Route path="templates" element={<TemplatesPage />} />
                <Route path="publish" element={<PublishPage />} />
              </Route>
              <Route path="/profile" element={<ProfilePage />} />
              <Route path="/settings" element={<SettingsPage />} />
            </Route>
          </Route>

          {/* Fallback route for any other path */}
          <Route path="/" element={<Navigate to="/login" />} />

        </Routes>
      </Router>
    </ThemeProvider>
  );
}

export default App;
