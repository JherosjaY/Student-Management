import React, { useState, useEffect } from 'react';
import { History, ShieldCheck, Loader2, RefreshCw, FileText } from 'lucide-react';
import { useAuth } from '../../../hooks/useAuth';

export const UserAuditPage: React.FC = () => {
  const { user } = useAuth();
  const [logs, setLogs] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const isAdmin = user?.roles?.includes('ADMIN');

  const token = localStorage.getItem('token');

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const url = isAdmin 
        ? 'http://localhost:3000/api/v1/users/audit-all'
        : `http://localhost:3000/api/v1/users/${user.id}/audit`;

      const res = await fetch(url, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await res.json();
      setLogs(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (user?.id) {
      fetchData();
    }
  }, [user, token]);

  const renderChanges = (log: any) => {
    if (log.action === 'VERIFY_EMAIL') {
      return <span style={{ color: '#059669' }}>User email verified successfully.</span>;
    }
    if (log.action === 'MARK_ATTENDANCE') {
      return (
        <span>
          Marked attendance for {log.diff?.count} students on {log.diff?.date}.
          {log.diff?.subjectId && <div style={{ fontSize: '0.75rem', color: '#64748b' }}>Subject ID: {log.diff.subjectId}</div>}
        </span>
      );
    }
    if (log.action === 'UPDATE') {
        return (
            <div style={{ color: '#475569' }}>
                <span style={{ textDecoration: 'line-through', color: '#94a3b8', marginRight: '0.5rem' }}>{log.diff?.before?.lastName}</span>
                <span style={{ color: '#2563eb', fontWeight: 500 }}>{log.diff?.after?.lastName}</span>
            </div>
        );
    }
    return <span style={{ color: '#94a3b8 italic' }}>{JSON.stringify(log.diff)}</span>;
  };

  if (isLoading) return (
    <div style={{ display: 'flex', height: '80vh', alignItems: 'center', justifyContent: 'center' }}>
      <Loader2 size={32} className="animate-spin" style={{ color: '#2563eb' }} />
    </div>
  );

  return (
    <div style={{ padding: '2rem', maxWidth: '1000px', margin: '0 auto', fontFamily: 'Inter, sans-serif' }}>
      <header style={{ marginBottom: '2.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', borderBottom: '2px solid #f1f5f9', paddingBottom: '1.5rem' }}>
        <div>
          <h1 style={{ fontSize: '2.25rem', fontWeight: 800, color: '#0f172a', display: 'flex', alignItems: 'center', gap: '0.75rem', letterSpacing: '-0.025em' }}>
            {isAdmin ? <ShieldCheck size={40} color="#2563eb" /> : <History size={40} color="#2563eb" />}
            {isAdmin ? 'System Audit Trail' : 'My Activity Log'}
          </h1>
          <p style={{ color: '#64748b', fontSize: '1.1rem', marginTop: '0.5rem' }}>
            {isAdmin ? 'Monitoring all administrative and security actions across the system.' : 'Track your personal profile updates and verification status.'}
          </p>
        </div>
        <button 
          onClick={fetchData}
          style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.75rem 1.25rem', backgroundColor: '#f8fafc', color: '#475569', border: '1px solid #e2e8f0', borderRadius: '0.75rem', fontWeight: 600, cursor: 'pointer', transition: 'all 0.2s' }}
        >
          <RefreshCw size={18} />
          Refresh Logs
        </button>
      </header>

      <div style={{ backgroundColor: 'white', borderRadius: '1rem', border: '1px solid #e2e8f0', overflow: 'hidden', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.05)' }}>
        <div style={{ padding: '1.25rem', backgroundColor: '#f8fafc', borderBottom: '1px solid #e2e8f0', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <FileText size={20} style={{ color: '#2563eb' }} />
          <span style={{ fontWeight: 700, color: '#1e293b', fontSize: '1rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Recent Events</span>
        </div>
        
        {logs.length === 0 ? (
          <div style={{ padding: '5rem 2rem', textAlign: 'center' }}>
            <div style={{ backgroundColor: '#f1f5f9', width: '64px', height: '64px', borderRadius: '32px', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1.5rem' }}>
                <History size={32} color="#94a3b8" />
            </div>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 600, color: '#334155' }}>No logs found</h3>
            <p style={{ color: '#64748b', marginTop: '0.5rem' }}>Try performing some actions like marking attendance or updating profile.</p>
          </div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
              <thead style={{ backgroundColor: '#f8fafc' }}>
                <tr>
                  <th style={{ padding: '1rem 1.5rem', fontSize: '0.75rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Target / Entity</th>
                  <th style={{ padding: '1rem 1.5rem', fontSize: '0.75rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Action</th>
                  <th style={{ padding: '1rem 1.5rem', fontSize: '0.75rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Details</th>
                  <th style={{ padding: '1rem 1.5rem', fontSize: '0.75rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Timestamp</th>
                </tr>
              </thead>
              <tbody style={{ borderTop: '1px solid #e2e8f0' }}>
                {logs.map((log: any) => (
                  <tr key={log.id} style={{ borderBottom: '1px solid #f1f5f9', transition: 'background-color 0.2s' }}>
                    <td style={{ padding: '1.25rem 1.5rem', fontSize: '0.875rem', fontWeight: 600, color: '#0f172a' }}>
                      <div style={{ display: 'flex', flexDirection: 'column' }}>
                        <span>{log.entityType}</span>
                        <span style={{ fontSize: '0.7rem', color: '#94a3b8', fontWeight: 400 }}>{log.entityId}</span>
                      </div>
                    </td>
                    <td style={{ padding: '1.25rem 1.5rem' }}>
                      <span style={{ 
                        backgroundColor: log.action === 'VERIFY_EMAIL' ? '#ecfdf5' : log.action === 'MARK_ATTENDANCE' ? '#eff6ff' : '#fef2f2', 
                        color: log.action === 'VERIFY_EMAIL' ? '#059669' : log.action === 'MARK_ATTENDANCE' ? '#2563eb' : '#dc2626', 
                        padding: '0.375rem 0.75rem', 
                        borderRadius: '9999px', 
                        fontSize: '0.75rem', 
                        fontWeight: 700 
                      }}>
                        {log.action}
                      </span>
                    </td>
                    <td style={{ padding: '1.25rem 1.5rem', fontSize: '0.875rem', color: '#475569', maxWidth: '300px' }}>
                      {renderChanges(log)}
                    </td>
                    <td style={{ padding: '1.25rem 1.5rem', fontSize: '0.875rem', color: '#64748b', fontVariantNumeric: 'tabular-nums' }}>
                      {new Date(log.createdAt).toLocaleString(undefined, { dateStyle: 'medium', timeStyle: 'short' })}
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
