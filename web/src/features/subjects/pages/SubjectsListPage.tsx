import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSubjects, useDeleteSubject } from '../hooks';
import { Plus, Pencil, Trash2, Loader2, AlertCircle } from 'lucide-react';
import { RoleGate } from '../../../components/RoleGate';
import { Pagination } from '../../../components/Pagination';

export const SubjectsListPage: React.FC = () => {
  const navigate = useNavigate();
  const [page, setPage] = useState(1);
  const { data, isLoading, error } = useSubjects(page);
  const deleteMutation = useDeleteSubject();

  const subjects = (data as any)?.items || [];
  const meta = (data as any)?.meta;

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this subject?')) {
      try {
        await deleteMutation.mutateAsync(id);
      } catch (err: any) {
        alert(err.message);
      }
    }
  };

  if (isLoading) return (
    <div style={{ display: 'flex', height: '16rem', alignItems: 'center', justifyContent: 'center' }}>
      <Loader2 size={32} className="animate-spin" style={{ color: '#2563eb' }} />
    </div>
  );

  return (
    <div style={{ padding: '2rem', maxWidth: '1000px', margin: '0 auto', fontFamily: 'Inter, sans-serif' }}>
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <div>
          <h1 style={{ fontSize: '1.875rem', fontWeight: 700, color: '#1e293b', margin: 0 }}>Subjects</h1>
          <p style={{ color: '#64748b', marginTop: '0.25rem' }}>Manage school curriculum and subject credits.</p>
        </div>
        <RoleGate allowedRoles={['ADMIN']}>
          <button 
            onClick={() => navigate('/subjects/new')}
            style={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: '0.5rem', 
              backgroundColor: '#2563eb', 
              color: 'white', 
              padding: '0.5rem 1rem', 
              borderRadius: '0.5rem', 
              border: 'none', 
              fontWeight: 600, 
              cursor: 'pointer',
              transition: 'background-color 0.2s'
            }}
          >
            <Plus size={18} />
            Add Subject
          </button>
        </RoleGate>
      </header>

      {error ? (
        <div style={{ padding: '1rem', backgroundColor: '#fef2f2', border: '1px solid #fee2e2', borderRadius: '0.5rem', color: '#991b1b', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <AlertCircle size={20} />
          <span>Error loading subjects. Make sure the API is running and you are authorized.</span>
        </div>
      ) : (
        <div style={{ backgroundColor: 'white', borderRadius: '0.75rem', border: '1px solid #e2e8f0', overflow: 'hidden', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
            <thead style={{ backgroundColor: '#f8fafc', borderBottom: '1px solid #e2e8f0' }}>
              <tr>
                <th style={{ padding: '1rem', fontWeight: 600, color: '#475569' }}>Code</th>
                <th style={{ padding: '1rem', fontWeight: 600, color: '#475569' }}>Name</th>
                <th style={{ padding: '1rem', fontWeight: 600, color: '#475569' }}>Credits</th>
                <th style={{ padding: '1rem', fontWeight: 600, color: '#475569' }}>Teacher</th>
                <th style={{ padding: '1rem', textAlign: 'right', fontWeight: 600, color: '#475569' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {subjects?.length === 0 ? (
                <tr>
                  <td colSpan={5} style={{ padding: '3rem', textAlign: 'center', color: '#64748b' }}>
                    No subjects found. {(data as any)?.meta?.total === 0 && (
                      <RoleGate allowedRoles={['ADMIN']}>
                        Click "Add Subject" to create one.
                      </RoleGate>
                    )}
                  </td>
                </tr>
              ) : (
                subjects?.map((subject: any) => (
                  <tr key={subject.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                    <td style={{ padding: '1rem', fontWeight: 500, color: '#0f172a' }}>
                      <span style={{ backgroundColor: '#f1f5f9', padding: '0.25rem 0.5rem', borderRadius: '0.25rem', fontSize: '0.875rem' }}>{subject.code}</span>
                    </td>
                    <td style={{ padding: '1rem', color: '#334155' }}>{subject.name}</td>
                    <td style={{ padding: '1rem', color: '#334155' }}>{subject.credits || '-'}</td>
                    <td style={{ padding: '1rem', color: '#64748b' }}>{subject.teacher?.user?.lastName || 'Not assigned'}</td>
                    <td style={{ padding: '1rem', textAlign: 'right' }}>
                      <RoleGate allowedRoles={['ADMIN']}>
                        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.5rem' }}>
                          <button 
                            onClick={() => navigate(`/subjects/edit/${subject.id}`)}
                            style={{ padding: '0.4rem', borderRadius: '0.375rem', border: '1px solid #e2e8f0', backgroundColor: 'white', cursor: 'pointer', color: '#475569' }}
                          >
                            <Pencil size={16} />
                          </button>
                          <button 
                            onClick={() => handleDelete(subject.id)}
                            style={{ padding: '0.4rem', borderRadius: '0.375rem', border: '1px solid #fecaca', backgroundColor: '#fef2f2', cursor: 'pointer', color: '#dc2626' }}
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </RoleGate>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}

      {meta && (
        <Pagination 
          currentPage={page}
          totalPages={meta.totalPages}
          onPageChange={setPage}
          totalItems={meta.total}
          limit={meta.limit}
        />
      )}
    </div>
  );
};
