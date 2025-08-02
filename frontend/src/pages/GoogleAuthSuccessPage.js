    import React, { useEffect } from 'react';
    import { useSearchParams, useNavigate } from 'react-router-dom';

    const GoogleAuthSuccessPage = () => {
      const [searchParams] = useSearchParams();
      const navigate = useNavigate();

      useEffect(() => {
        // Get the token from the URL query parameter
        const token = searchParams.get('token');

        if (token) {
          // Store the token in localStorage
          localStorage.setItem('authToken', token);
          // Redirect to the dashboard
          navigate('/dashboard');
        } else {
          // If no token, redirect to login with an error
          navigate('/login?error=google-auth-failed');
        }
      }, [navigate, searchParams]);

      return (
        <div style={{ textAlign: 'center', padding: '4rem' }}>
          <h2>Authenticating with Google...</h2>
          <p>Please wait while we log you in.</p>
        </div>
      );
    };

    export default GoogleAuthSuccessPage;
    