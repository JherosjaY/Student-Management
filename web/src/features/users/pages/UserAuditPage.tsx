import React, { useState, useEffect } from 'react';
import { History, User as UserIcon, Loader2, AlertCircle, RefreshCw } from 'lucide-react';

export const UserAuditPage: React.FC = () => {
  const [userId, setUserId] = useState('');
  const [user, setUser] = useState<any>(null);
  const [logs, setLogs] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);

  const token = localStorage.getItem('token');

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      const u = JSON.parse(storedUser);
      setUserId(u.id);
    }
  }, []);

  const fetchData = async () => {
    if (!userId) return;
    setIsLoading(true);
    try {
      const uRes = await fetch(`http://localhost:3000/api/v1/users/${userId}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      setUser(await uRes.json());

      const lRes = await fetch(`http://localhost:3000/api/v1/users/${userId}/audit`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const logData = await lRes.json();
      setLogs(Array.isArray(logData) ? logData : []);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [userId, token]);

  const triggerUpdate = async () => {
    if (!user) return;
    setIsUpdating(true);
    try {
      const res = await fetch(`http://localhost:3000/api/v1/users/${userId}`, {
        method: 'PATCH',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}` 
        },
        body: JSON.stringify({
          firstName: user.firstName,
          lastName: user.lastName + ' (Updated)'
        })
      });
      if (res.ok) {
        await fetchData();
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsUpdating(false);
    }
  };

  if (isLoading && !user) return (
    <div style={{ display: 'flex', height: '20rem', alignItems: 'center', justifyContent: 'center' }}>
      <Loader2 size={32} className="animate-spin" style={{ color: '#2563eb' }} />
    </div>
  );

  return (
    <div style={{ padding: '2rem', maxWidth: '800px', margin: '0 auto', fontFamily: 'Inter, sans-serif' }}>
      <header style={{ marginBottom: '2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1 style={{ fontSize: '1.875rem', fontWeight: 700, color: '#1e293b', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <UserIcon size={32} />
            User Profile & Audit
          </h1>
          <p style={{ color: '#64748b' }}>Detailed activity logs and profile management.</p>
        </div>
        <button 
          onClick={triggerUpdate}
          disabled={isUpdating}
          style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.625rem 1.25rem', backgroundColor: '#2563eb', color: 'white', border: 'none', borderRadius: '0.5rem', fontWeight: 600, cursor: 'pointer' }}
        >
          {isUpdating ? <Loader2 size={18} className="animate-spin" /> : <RefreshCw size={18} />}
          Trigger Test Update
        </button>
      </header>

      {user && (
        <div style={{ backgroundColor: 'white', padding: '1.5rem', borderRadius: '0.75rem', border: '1px solid #e2e8f0', marginBottom: '2rem', boxShadow: '0 1px 3px 0 rgb(0 0 0 / 0.1)' }}>
          <h2 style={{ fontSize: '1.125rem', fontWeight: 600, color: '#1e293b', marginBottom: '1rem' }}>Profile Information</h2>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
            <div>
              <div style={{ fontSize: '0.75rem', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.025em' }}>Full Name</div>
              <div style={{ fontSize: '1rem', color: '#0f172a', fontWeight: 500 }}>{user.firstName} {user.lastName}</div>
            </div>
            <div>
              <div style={{ fontSize: '0.75rem', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.025em' }}>Email Address</div>
              <div style={{ fontSize: '1rem', color: '#0f172a', fontWeight: 500 }}>{user.email}</div>
            </div>
          </div>
        </div>
      )}

      <div style={{ backgroundColor: 'white', borderRadius: '0.75rem', border: '1px solid #e2e8f0', overflow: 'hidden', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}>
        <div style={{ padding: '1rem', backgroundColor: '#f8fafc', borderBottom: '1px solid #e2e8f0', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <History size={18} style={{ color: '#475569' }} />
          <span style={{ fontWeight: 600, color: '#475569' }}>Audit Trail</span>
        </div>
        
        {logs.length === 0 ? (
          <div style={{ padding: '3rem', textAlign: 'center', color: '#64748b' }}>
            No activity logs found for this user.
          </div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
              <thead style={{ backgroundColor: '#f8fafc', borderBottom: '1px solid #e2e8f0' }}>
                <tr>
                  <th style={{ padding: '0.75rem 1rem', fontSize: '0.75rem', color: '#64748b', textTransform: 'uppercase' }}>Action</th>
                  <th style={{ padding: '0.75rem 1rem', fontSize: '0.75rem', color: '#64748b', textTransform: 'uppercase' }}>Changes</th>
                  <th style={{ padding: '0.75rem 1rem', fontSize: '0.75rem', color: '#64748b', textTransform: 'uppercase' }}>Date</th>
                </tr>
              </thead>
              <tbody>
                {logs.map((log: any) => (
                  <tr key={log.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                    <td style={{ padding: '1rem' }}>
                      <span style={{ backgroundColor: '#eff6ff', color: '#2563eb', padding: '0.25rem 0.5rem', borderRadius: '0.25rem', fontSize: '0.75rem', fontWeight: 600 }}>{log.action}</span>
                    </td>
                    <td style={{ padding: '1rem', fontSize: '0.875rem' }}>
                      <div style={{ color: '#475569', marginBottom: '0.25rem' }}>
                        <span style={{ textDecoration: 'line-through', color: '#94a3b8', marginRight: '0.5rem' }}>{log.diff?.before?.lastName}</span>
                        <span style={{ color: '#15803d', fontWeight: 500 }}>{log.diff?.after?.lastName}</span>
                      </div>
                    </td>
                    <td style={{ padding: '1rem', fontSize: '0.875rem', color: '#64748b' }}>
                      {new Date(log.createdAt).toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};
