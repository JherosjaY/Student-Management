import { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

export const VerifyEmailPage = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [message, setMessage] = useState('Verifying your email...');

  useEffect(() => {
    const userId = searchParams.get('userId');
    const token = searchParams.get('token');

    if (!userId || !token) {
      setStatus('error');
      setMessage('Invalid verification link.');
      return;
    }

    axios.post('http://localhost:3000/api/v1/auth/verify-email', { userId, token })
      .then(() => {
        setStatus('success');
        setMessage('Email verified successfully! You can now log in.');
        setTimeout(() => navigate('/login'), 3000);
      })
      .catch((err) => {
        setStatus('error');
        setMessage(err.response?.data?.error?.message || 'Verification failed.');
      });
  }, [searchParams, navigate]);

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', fontFamily: 'sans-serif' }}>
      <div style={{ padding: '2rem', borderRadius: '8px', boxShadow: '0 4px 6px rgba(0,0,0,0.1)', textAlign: 'center', maxWidth: '400px' }}>
        <h2 style={{ marginBottom: '1rem', color: status === 'error' ? '#ef4444' : '#2563eb' }}>
          {status === 'loading' ? 'Verifying...' : status === 'success' ? 'Verified!' : 'Error'}
        </h2>
        <p>{message}</p>
        {status === 'success' && <p style={{ marginTop: '1rem', fontSize: '0.875rem' }}>Redirecting to login...</p>}
      </div>
    </div>
  );
};
