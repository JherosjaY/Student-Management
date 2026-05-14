import React, { useState, useEffect } from 'react';
import { Calendar, Users, Save, Loader2, CheckCircle2, AlertCircle } from 'lucide-react';

export const AttendancePage: React.FC = () => {
  const [classes, setClasses] = useState<any[]>([]);
  const [subjects, setSubjects] = useState<any[]>([]);
  const [selectedClassId, setSelectedClassId] = useState('');
  const [selectedSubjectId, setSelectedSubjectId] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [students, setStudents] = useState<any[]>([]);
  const [attendanceMap, setAttendanceMap] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const token = localStorage.getItem('token');

  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        const [cRes, sRes] = await Promise.all([
          fetch('http://localhost:3000/api/v1/attendance/classes', { headers: { 'Authorization': `Bearer ${token}` } }),
          fetch('http://localhost:3000/api/v1/attendance/subjects', { headers: { 'Authorization': `Bearer ${token}` } })
        ]);

        const [cData, sData] = await Promise.all([cRes.json(), sRes.json()]);

        if (cRes.ok && sRes.ok) {
          setClasses(cData);
          setSubjects(sData);
          if (cData.length > 0 && !selectedClassId) setSelectedClassId(cData[0].id);
          if (sData.length > 0 && !selectedSubjectId) setSelectedSubjectId(sData[0].id);
        } else {
          setError('Unauthorized or missing data');
        }
      } catch (err) {
        setError('Connection error');
      }
    };
    fetchInitialData();
  }, [token]);

  useEffect(() => {
    if (!selectedClassId) return;

    const fetchData = async () => {
      setIsLoading(true);
      try {
        const sRes = await fetch(`http://localhost:3000/api/v1/attendance/students/${selectedClassId}`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        const sData = await sRes.json();
        setStudents(sData);

        const aRes = await fetch(`http://localhost:3000/api/v1/attendance/${selectedClassId}?date=${date}&subjectId=${selectedSubjectId}`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        const aData = await aRes.json();
        
        const map: Record<string, string> = {};
        aData.forEach((rec: any) => {
          map[rec.studentId] = rec.status;
        });
        setAttendanceMap(map);
      } catch (err) {
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, [selectedClassId, selectedSubjectId, date, token]);

  const handleStatusChange = (studentId: string, status: string) => {
    setAttendanceMap({ ...attendanceMap, [studentId]: status });
  };

  const handleMarkAll = (status: string) => {
    const map: Record<string, string> = {};
    students.forEach(s => {
      map[s.id] = status;
    });
    setAttendanceMap(map);
  };

  const handleSave = async () => {
    setIsSaving(true);
    const records = Object.entries(attendanceMap).map(([studentId, status]) => ({
      studentId,
      status
    }));

    if (records.length === 0) {
      alert('Please mark at least one student');
      setIsSaving(false);
      return;
    }

    try {
      const res = await fetch('http://localhost:3000/api/v1/attendance', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}` 
        },
        body: JSON.stringify({
          classId: selectedClassId,
          subjectId: selectedSubjectId,
          date,
          records
        })
      });
      if (res.ok) alert('Attendance saved successfully!');
      else {
        const err = await res.json();
        throw new Error(err.error?.message || 'Failed to save');
      }
    } catch (err: any) {
      alert(err.message);
    } finally {
      setIsSaving(false);
    }
  };

  if (error) return (
    <div style={{ padding: '2rem', textAlign: 'center', color: '#dc2626' }}>
      <AlertCircle size={48} style={{ marginBottom: '1rem' }} />
      <p>{error}</p>
    </div>
  );

  return (
    <div style={{ padding: '2rem', maxWidth: '900px', margin: '0 auto', fontFamily: 'Inter, sans-serif' }}>
      <header style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '1.875rem', fontWeight: 700, color: '#1e293b', marginBottom: '1rem' }}>Attendance Marking</h1>
        
        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', backgroundColor: 'white', padding: '1.25rem', borderRadius: '0.75rem', border: '1px solid #e2e8f0', boxShadow: '0 1px 3px 0 rgb(0 0 0 / 0.1)' }}>
          <div style={{ flex: 1, minWidth: '200px' }}>
            <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, color: '#475569', marginBottom: '0.375rem' }}>Select Class</label>
            <select 
              value={selectedClassId}
              onChange={(e) => setSelectedClassId(e.target.value)}
              style={{ width: '100%', padding: '0.5rem', borderRadius: '0.375rem', border: '1px solid #cbd5e1' }}
            >
              {classes.map(c => <option key={c.id} value={c.id}>{c.name} ({c.academicYear})</option>)}
            </select>
          </div>
          <div style={{ flex: 1, minWidth: '200px' }}>
            <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, color: '#475569', marginBottom: '0.375rem' }}>Select Subject</label>
            <select 
              value={selectedSubjectId}
              onChange={(e) => setSelectedSubjectId(e.target.value)}
              style={{ width: '100%', padding: '0.5rem', borderRadius: '0.375rem', border: '1px solid #cbd5e1' }}
            >
              <option value="">General / Homeroom</option>
              {subjects.map(s => <option key={s.id} value={s.id}>{s.name} ({s.code})</option>)}
            </select>
          </div>
          <div style={{ width: '180px' }}>
            <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, color: '#475569', marginBottom: '0.375rem' }}>Date</label>
            <input 
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              style={{ width: '100%', padding: '0.5rem', borderRadius: '0.375rem', border: '1px solid #cbd5e1' }}
            />
          </div>
        </div>
      </header>

      {isLoading ? (
        <div style={{ display: 'flex', justifyContent: 'center', padding: '3rem' }}>
          <Loader2 size={32} className="animate-spin" style={{ color: '#2563eb' }} />
        </div>
      ) : (
        <div style={{ backgroundColor: 'white', borderRadius: '0.75rem', border: '1px solid #e2e8f0', overflow: 'hidden', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}>
          <div style={{ padding: '1rem', borderBottom: '1px solid #f1f5f9', display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#f8fafc' }}>
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <button onClick={() => handleMarkAll('PRESENT')} style={{ padding: '0.25rem 0.75rem', fontSize: '0.75rem', borderRadius: '0.25rem', border: '1px solid #22c55e', backgroundColor: '#f0fdf4', color: '#15803d', cursor: 'pointer' }}>All Present</button>
              <button onClick={() => handleMarkAll('ABSENT')} style={{ padding: '0.25rem 0.75rem', fontSize: '0.75rem', borderRadius: '0.25rem', border: '1px solid #ef4444', backgroundColor: '#fef2f2', color: '#b91c1c', cursor: 'pointer' }}>All Absent</button>
            </div>
            <span style={{ fontSize: '0.875rem', color: '#64748b' }}>{students.length} Students Enrolled</span>
          </div>
          
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid #e2e8f0', backgroundColor: '#f8fafc' }}>
                <th style={{ padding: '1rem', fontWeight: 600, color: '#475569', fontSize: '0.875rem' }}>Student Name</th>
                <th style={{ padding: '1rem', fontWeight: 600, color: '#475569', fontSize: '0.875rem', textAlign: 'center' }}>Present</th>
                <th style={{ padding: '1rem', fontWeight: 600, color: '#475569', fontSize: '0.875rem', textAlign: 'center' }}>Late</th>
                <th style={{ padding: '1rem', fontWeight: 600, color: '#475569', fontSize: '0.875rem', textAlign: 'center' }}>Absent</th>
                <th style={{ padding: '1rem', fontWeight: 600, color: '#475569', fontSize: '0.875rem', textAlign: 'center' }}>Excused</th>
              </tr>
            </thead>
            <tbody>
              {students.map(student => (
                <tr key={student.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                  <td style={{ padding: '1rem' }}>
                    <div style={{ fontWeight: 600, color: '#0f172a' }}>{student.user.firstName} {student.user.lastName}</div>
                    <div style={{ fontSize: '0.75rem', color: '#64748b' }}>{student.studentNumber}</div>
                  </td>
                  <td style={{ textAlign: 'center' }} title="Present">
                    <input type="radio" name={`s-${student.id}`} checked={attendanceMap[student.id] === 'PRESENT'} onChange={() => handleStatusChange(student.id, 'PRESENT')} style={{ width: '1.25rem', height: '1.25rem', accentColor: '#22c55e' }} />
                  </td>
                  <td style={{ textAlign: 'center' }} title="Late">
                    <input type="radio" name={`s-${student.id}`} checked={attendanceMap[student.id] === 'LATE'} onChange={() => handleStatusChange(student.id, 'LATE')} style={{ width: '1.25rem', height: '1.25rem', accentColor: '#eab308' }} />
                  </td>
                  <td style={{ textAlign: 'center' }} title="Absent">
                    <input type="radio" name={`s-${student.id}`} checked={attendanceMap[student.id] === 'ABSENT'} onChange={() => handleStatusChange(student.id, 'ABSENT')} style={{ width: '1.25rem', height: '1.25rem', accentColor: '#ef4444' }} />
                  </td>
                  <td style={{ textAlign: 'center' }} title="Excused">
                    <input type="radio" name={`s-${student.id}`} checked={attendanceMap[student.id] === 'EXCUSED'} onChange={() => handleStatusChange(student.id, 'EXCUSED')} style={{ width: '1.25rem', height: '1.25rem', accentColor: '#6366f1' }} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <div style={{ padding: '1.5rem', backgroundColor: '#f8fafc', borderTop: '1px solid #e2e8f0', display: 'flex', justifyContent: 'flex-end' }}>
            <button 
              onClick={handleSave} 
              disabled={isSaving}
              style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', backgroundColor: '#2563eb', color: 'white', padding: '0.75rem 2rem', borderRadius: '0.5rem', border: 'none', fontWeight: 600, cursor: isSaving ? 'not-allowed' : 'pointer', transition: 'all 0.2s' }}
            >
              {isSaving ? <Loader2 size={18} className="animate-spin" /> : <Save size={18} />}
              Save Attendance
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
