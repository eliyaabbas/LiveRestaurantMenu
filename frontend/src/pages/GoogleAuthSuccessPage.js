import React, { useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import * as api from '../api';
import { useAuth } from '../contexts/AuthContext'; // Import the useAuth hook

const GoogleAuthSuccessPage = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { login } = useAuth(); // Get the login function from our context

  useEffect(() => {
    const handleAuth = async () => {
        const token = searchParams.get('token');

        if (token) {
            // --- FIX: Use the login function to update the global state ---
            login(token);
            
            try {
                // After setting the token, fetch the user's profile to check if it's complete
                const { data: profile } = await api.getProfile();

                if (!profile.phone || !profile.dob) {
                    navigate('/complete-profile');
                } else {
                    navigate('/dashboard');
                }
            } catch (error) {
                // If profile fetch fails for any reason, just go to the dashboard
                console.error("Failed to fetch profile after Google login:", error);
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
