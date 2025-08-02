import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate, Outlet } from 'react-router-dom';
import { ThemeProvider } from './contexts/ThemeContext';
import { AuthProvider, useAuth } from './contexts/AuthContext';

// Import Components & Pages...
import Navbar from './components/Navbar';
import DashboardLayout from './components/DashboardLayout';
import Footer from './components/Footer';
import styles from './App.module.css';
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
import RestaurantPublicPage from './pages/RestaurantPublicPage';
import VerifyOtpPage from './pages/VerifyOtpPage';
import CompleteProfilePage from './pages/CompleteProfilePage';

// --- Protected Route (for logged-in users) ---
const ProtectedRoute = () => {
  const { isAuthenticated, loading } = useAuth();
  if (loading) return <div style={{ textAlign: 'center', marginTop: '5rem' }}>Loading session...</div>;
  return isAuthenticated ? <Outlet /> : <Navigate to="/login" replace />;
};

// --- NEW: Public Only Route (for logged-out users) ---
// This prevents logged-in users from seeing the login/register pages
const PublicRoute = () => {
    const { isAuthenticated, loading } = useAuth();
    if (loading) return <div style={{ textAlign: 'center', marginTop: '5rem' }}>Loading session...</div>;
    return isAuthenticated ? <Navigate to="/dashboard" replace /> : <Outlet />;
};


// --- Main Layout for the authenticated app ---
const MainAppLayout = () => (
  <div className={styles.appWrapper}>
    <Navbar />
    <main className={styles.mainContent}>
      <Outlet />
    </main>
    <Footer />
  </div>
);


function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <Router>
          <Routes>
            {/* --- Public Routes (visible to everyone) --- */}
            <Route path="/menu/:menuId" element={<PublicMenuPage />} />
            <Route path="/restaurant/:userId" element={<RestaurantPublicPage />} />
            
            {/* --- Public Only Routes (visible only to logged-out users) --- */}
            <Route element={<PublicRoute />}>
                <Route path="/login" element={<LoginPage />} />
                <Route path="/register" element={<RegisterPage />} />
                <Route path="/verify-otp" element={<VerifyOtpPage />} />
                <Route path="/forgot-password" element={<ForgotPasswordPage />} />
                <Route path="/reset-password/:token" element={<ResetPasswordPage />} />
                <Route path="/auth/success" element={<GoogleAuthSuccessPage />} />
            </Route>

            {/* --- Protected Routes (visible only to logged-in users) --- */}
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
                <Route path="/complete-profile" element={<CompleteProfilePage />} />
              </Route>
            </Route>

            {/* --- Fallback Route --- */}
            <Route path="*" element={<Navigate to="/dashboard" />} />
          </Routes>
        </Router>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
