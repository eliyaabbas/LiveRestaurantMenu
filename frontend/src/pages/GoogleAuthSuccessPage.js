import React, { useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import * as api from '../api';

const GoogleAuthSuccessPage = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  useEffect(() => {
    const handleAuth = async () => {
        const token = searchParams.get('token');

        if (token) {
            localStorage.setItem('authToken', token);
            
            try {
                // After setting the token, fetch the user's profile
                const { data: profile } = await api.getProfile();

                // Check if the profile is incomplete (e.g., phone or dob is missing)
                if (!profile.phone || !profile.dob) {
                    navigate('/complete-profile');
                } else {
                    navigate('/dashboard');
                }
            } catch (error) {
                // If profile fetch fails, just go to the dashboard
                navigate('/dashboard');
            }
        } else {
            navigate('/login?error=google-auth-failed');
        }
    };

    handleAuth();
  }, [navigate, searchParams]);

  return (
    <div style={{ textAlign: 'center', padding: '4rem' }}>
      <h2>Authenticating with Google...</h2>
      <p>Please wait while we log you in.</p>
    </div>
  );
};

export default GoogleAuthSuccessPage;
