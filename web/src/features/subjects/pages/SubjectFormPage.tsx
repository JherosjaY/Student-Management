import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useSubject, useCreateSubject, useUpdateSubject } from '../hooks';
import { useTeachers } from '../../users/hooks';
import { ArrowLeft, Save, Loader2 } from 'lucide-react';

export const SubjectFormPage: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = !!id;

  const { data: subject, isLoading: isLoadingSubject } = useSubject(id || '');
  const { data: teachers, isLoading: isLoadingTeachers } = useTeachers();
  const createMutation = useCreateSubject();
  const updateMutation = useUpdateSubject();

  const [formData, setFormData] = useState({
    code: '',
    name: '',
    description: '',
    credits: 3,
    teacherId: ''
  });

  useEffect(() => {
    if (subject) {
      setFormData({
        code: subject.code,
        name: subject.name,
        description: subject.description || '',
        credits: subject.credits || 3,
        teacherId: subject.teacherId || ''
      });
    }
  }, [subject]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (isEdit) {
        await updateMutation.mutateAsync({ id: id!, data: formData });
      } else {
        await createMutation.mutateAsync(formData);
      }
      navigate('/subjects');
    } catch (err: any) {
      alert(err.message);
    }
  };

  if (isEdit && isLoadingSubject) return <div style={{ padding: '2rem' }}>Loading...</div>;

  const isSubmitting = createMutation.isPending || updateMutation.isPending;

  return (
    <div style={{ padding: '2rem', maxWidth: '600px', margin: '0 auto', fontFamily: 'Inter, sans-serif' }}>
      <button 
        onClick={() => navigate('/subjects')}
        style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: 'none', border: 'none', color: '#64748b', cursor: 'pointer', marginBottom: '1.5rem', fontSize: '0.875rem' }}
      >
        <ArrowLeft size={16} />
        Back to List
      </button>

      <h1 style={{ fontSize: '1.5rem', fontWeight: 700, color: '#1e293b', marginBottom: '2rem' }}>
        {isEdit ? 'Edit Subject' : 'Add New Subject'}
      </h1>

      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', backgroundColor: 'white', padding: '2rem', borderRadius: '0.75rem', border: '1px solid #e2e8f0', boxShadow: '0 1px 3px 0 rgb(0 0 0 / 0.1)' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '1rem' }}>
          <div>
            <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, color: '#475569', marginBottom: '0.5rem' }}>Subject Code</label>
            <input 
              required
              value={formData.code}
              onChange={(e) => setFormData({ ...formData, code: e.target.value.toUpperCase() })}
              placeholder="e.g. MATH101"
              style={{ width: '100%', padding: '0.625rem', borderRadius: '0.375rem', border: '1px solid #cbd5e1' }}
            />
          </div>
          <div>
            <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, color: '#475569', marginBottom: '0.5rem' }}>Subject Name</label>
            <input 
              required
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="e.g. Advanced Algebra"
              style={{ width: '100%', padding: '0.625rem', borderRadius: '0.375rem', border: '1px solid #cbd5e1' }}
            />
          </div>
        </div>

        <div>
          <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, color: '#475569', marginBottom: '0.5rem' }}>Description</label>
          <textarea 
            rows={3}
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            placeholder="Describe the learning objectives..."
            style={{ width: '100%', padding: '0.625rem', borderRadius: '0.375rem', border: '1px solid #cbd5e1', resize: 'vertical' }}
          />
        </div>

        <div>
          <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, color: '#475569', marginBottom: '0.5rem' }}>Instructor (Teacher)</label>
          <select
            required
            value={formData.teacherId}
            onChange={(e) => setFormData({ ...formData, teacherId: e.target.value })}
            style={{ width: '100%', padding: '0.625rem', borderRadius: '0.375rem', border: '1px solid #cbd5e1', backgroundColor: 'white' }}
          >
            <option value="">Select a teacher...</option>
            {teachers?.map((t: any) => (
              <option key={t.id} value={t.id}>
                {t.firstName} {t.lastName}
              </option>
            ))}
          </select>
          {isLoadingTeachers && <div style={{ fontSize: '0.75rem', color: '#64748b', marginTop: '0.25rem' }}>Loading teachers...</div>}
        </div>

        <div>
          <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, color: '#475569', marginBottom: '0.5rem' }}>Credits</label>
          <input 
            type="number"
            min={1}
            max={10}
            value={formData.credits}
            onChange={(e) => setFormData({ ...formData, credits: parseInt(e.target.value) })}
            style={{ width: '100px', padding: '0.625rem', borderRadius: '0.375rem', border: '1px solid #cbd5e1' }}
          />
        </div>

        <div style={{ marginTop: '1rem', display: 'flex', gap: '1rem' }}>
          <button 
            type="submit" 
            disabled={isSubmitting}
            style={{ 
              flex: 1, 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center', 
              gap: '0.5rem', 
              backgroundColor: '#2563eb', 
              color: 'white', 
              padding: '0.75rem', 
              borderRadius: '0.5rem', 
              border: 'none', 
              fontWeight: 600, 
              cursor: isSubmitting ? 'not-allowed' : 'pointer' 
            }}
          >
            {isSubmitting ? <Loader2 className="animate-spin" size={18} /> : <Save size={18} />}
            {isEdit ? 'Update Subject' : 'Create Subject'}
          </button>
          <button 
            type="button" 
            onClick={() => navigate('/subjects')}
            style={{ flex: 1, padding: '0.75rem', borderRadius: '0.5rem', border: '1px solid #e2e8f0', backgroundColor: 'white', fontWeight: 600, cursor: 'pointer' }}
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};
