import React, { useState } from 'react';
import { useSearchParams, useNavigate, Link } from 'react-router-dom';
import { Lock, Loader2, CheckCircle, AlertCircle, ArrowLeft } from 'lucide-react';

export const ResetPasswordPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const token = searchParams.get('token');
  const userId = searchParams.get('userId');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      setError("Passwords don't match");
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const res = await fetch('http://localhost:3000/api/v1/auth/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, token, newPassword })
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.message || 'Failed to reset password');
      }

      setIsSuccess(true);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  if (isSuccess) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#f8fafc', padding: '1rem' }}>
        <div style={{ maxWidth: '400px', width: '100%', backgroundColor: 'white', padding: '2.5rem', borderRadius: '1rem', border: '1px solid #e2e8f0', textAlign: 'center' }}>
          <div style={{ display: 'inline-flex', padding: '1rem', backgroundColor: '#ecfdf5', color: '#10b981', borderRadius: '50%', marginBottom: '1.5rem' }}>
            <CheckCircle size={32} />
          </div>
          <h1 style={{ fontSize: '1.5rem', fontWeight: 700, color: '#1e293b', marginBottom: '0.5rem' }}>Password Reset Successful</h1>
          <p style={{ color: '#64748b', marginBottom: '2rem' }}>You can now sign in with your new password.</p>
          <button 
            onClick={() => navigate('/login')}
            style={{ width: '100%', padding: '0.75rem', backgroundColor: '#2563eb', color: 'white', border: 'none', borderRadius: '0.5rem', fontWeight: 600, cursor: 'pointer' }}
          >
            Go to Login
          </button>
        </div>
      </div>
    );
  }

  if (!token || !userId) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#f8fafc', padding: '1rem' }}>
        <div style={{ maxWidth: '400px', width: '100%', backgroundColor: 'white', padding: '2.5rem', borderRadius: '1rem', border: '1px solid #e2e8f0', textAlign: 'center' }}>
          <div style={{ display: 'inline-flex', padding: '0.75rem', backgroundColor: '#fef2f2', color: '#dc2626', borderRadius: '0.75rem', marginBottom: '1rem' }}>
            <AlertCircle size={32} />
          </div>
          <h1 style={{ fontSize: '1.5rem', fontWeight: 700, color: '#1e293b' }}>Invalid Link</h1>
          <p style={{ color: '#64748b', margin: '1rem 0 2rem' }}>This password reset link appears to be invalid or expired.</p>
          <Link to="/forgot-password" style={{ color: '#2563eb', fontWeight: 600, textDecoration: 'none' }}>Try Requesting Again</Link>
        </div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#f8fafc', padding: '1rem' }}>
      <div style={{ maxWidth: '400px', width: '100%', backgroundColor: 'white', padding: '2.5rem', borderRadius: '1rem', border: '1px solid #e2e8f0' }}>
        <header style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <div style={{ display: 'inline-flex', padding: '0.75rem', backgroundColor: '#eff6ff', color: '#2563eb', borderRadius: '0.75rem', marginBottom: '1rem' }}>
            <Lock size={28} />
          </div>
          <h1 style={{ fontSize: '1.5rem', fontWeight: 700, color: '#1e293b' }}>Reset Password</h1>
          <p style={{ color: '#64748b', marginTop: '0.5rem' }}>Create a new secure password for your account.</p>
        </header>

        {error && (
          <div style={{ padding: '0.75rem', backgroundColor: '#fef2f2', border: '1px solid #fee2e2', borderRadius: '0.5rem', color: '#991b1b', fontSize: '0.875rem', marginBottom: '1.5rem', display: 'flex', gap: '0.5rem' }}>
            <AlertCircle size={18} />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <div>
            <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, color: '#475569', marginBottom: '0.375rem' }}>New Password</label>
            <input 
              type="password" 
              required 
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="••••••••"
              style={{ width: '100%', padding: '0.625rem', borderRadius: '0.5rem', border: '1px solid #cbd5e1' }}
            />
          </div>
          <div>
            <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, color: '#475569', marginBottom: '0.375rem' }}>Confirm New Password</label>
            <input 
              type="password" 
              required 
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="••••••••"
              style={{ width: '100%', padding: '0.625rem', borderRadius: '0.5rem', border: '1px solid #cbd5e1' }}
            />
          </div>
          <button 
            type="submit" 
            disabled={isLoading}
            style={{ 
              width: '100%', padding: '0.75rem', backgroundColor: '#2563eb', color: 'white', border: 'none', borderRadius: '0.5rem', fontWeight: 600, 
              cursor: isLoading ? 'not-allowed' : 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' 
            }}
          >
            {isLoading ? <Loader2 size={20} className="animate-spin" /> : 'Reset Password'}
          </button>
        </form>
      </div>
    </div>
  );
};
