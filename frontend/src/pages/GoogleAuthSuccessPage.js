import React, { useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext'; // Import the useAuth hook

const GoogleAuthSuccessPage = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { login } = useAuth(); // Get the login function from our context

  useEffect(() => {
    const handleAuth = () => {
        const token = searchParams.get('token');
        // --- NEW: Check if the user is new ---
        const isNewUser = searchParams.get('isNew') === 'true';

        if (token) {
            // Log the user in globally
            login(token);
            
            // --- UPDATED: Redirect based on user status ---
            if (isNewUser) {
                // If the user is new, send them to complete their profile and verify
                navigate('/complete-profile');
            } else {
                // If they are an existing user, send them straight to the dashboard
                navigate('/dashboard');
            }
        } else {
            navigate('/login?error=google-auth-failed');
        }
    };

    handleAuth();
  }, [navigate, searchParams, login]);

  return (
    <div style={{ textAlign: 'center', padding: '4rem' }}>
      <h2>Authenticating with Google...</h2>
      <p>Please wait while we log you in.</p>
    </div>
  );
};

export default GoogleAuthSuccessPage;
