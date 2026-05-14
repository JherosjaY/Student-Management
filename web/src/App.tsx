import { Routes, Route, Link, Outlet, useLocation } from 'react-router-dom';
import { VerifyEmailPage } from './routes/VerifyEmailPage';
import { SubjectsListPage } from './features/subjects/pages/SubjectsListPage';
import { SubjectFormPage } from './features/subjects/pages/SubjectFormPage';
import { LoginPage } from './features/auth/pages/LoginPage';
import { AttendancePage } from './features/attendance/pages/AttendancePage';
import { UserAuditPage } from './features/users/pages/UserAuditPage';
import { ForgotPasswordPage } from './features/auth/pages/ForgotPasswordPage';
import { ResetPasswordPage } from './features/auth/pages/ResetPasswordPage';
import { useAuth } from './hooks/useAuth';
import { 
  BookOpen, 
  Calendar, 
  ShieldCheck, 
  UserPlus, 
  LogIn, 
  LogOut, 
  User as UserIcon,
  ChevronRight,
  School
} from 'lucide-react';

function Layout() {
  const { user, hasRole, logout, isAuthenticated, isLoading } = useAuth();
  const location = useLocation();

  const guestRoutes = ['/', '/login', '/forgot-password', '/reset-password', '/verify-email'];
  const isGuestRoute = guestRoutes.includes(location.pathname);
  const showSidebar = isAuthenticated && !isGuestRoute;

  if (isLoading) return null;

  const navItems = [
    { label: 'Subjects', path: '/subjects', icon: BookOpen, roles: ['ADMIN', 'TEACHER', 'STUDENT'] },
    { label: 'Attendance', path: '/attendance', icon: Calendar, roles: ['TEACHER'] },
    { label: 'Audit Trail', path: '/audit', icon: ShieldCheck, roles: ['ADMIN'] },
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: '#f1f5f9' }}>
      {/* Sidebar - Only show if authenticated AND not on a guest route */}
      {showSidebar && (
        <aside style={{ 
          width: '280px', 
          backgroundColor: 'white', 
          color: '#1e293b', 
          display: 'flex', 
          flexDirection: 'column', 
          position: 'sticky', 
          top: 0, 
          height: '100vh', 
          borderRight: '1px solid #e2e8f0',
          boxShadow: '2px 0 10px rgba(0, 0, 0, 0.05)'
        }}>
          <div style={{ 
            padding: '2rem', 
            display: 'flex', 
            alignItems: 'center', 
            gap: '0.75rem', 
            borderBottom: '1px solid #f1f5f9' 
          }}>
            <div style={{ 
              backgroundColor: '#2563eb', 
              padding: '0.5rem', 
              borderRadius: '0.5rem', 
              color: 'white',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <School size={24} />
            </div>
            <span style={{ 
              fontSize: '1.25rem', 
              fontWeight: 800, 
              letterSpacing: '-0.025em', 
              color: '#1e293b' 
            }}>
              STUDENT MGMT
            </span>
          </div>

          <nav style={{ flex: 1, padding: '1.5rem 1rem' }}>
            <div style={{ 
              fontSize: '0.75rem', 
              fontWeight: 600, 
              color: '#94a3b8', 
              textTransform: 'uppercase', 
              letterSpacing: '0.05em', 
              marginBottom: '1rem', 
              paddingLeft: '0.75rem' 
            }}>
              Main Menu
            </div>
            
            {navItems.filter(item => item.roles.some(r => hasRole(r))).map(item => (
              <Link 
                key={item.path} 
                to={item.path} 
                style={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'space-between',
                  gap: '0.75rem', 
                  padding: '0.875rem 1rem', 
                  borderRadius: '0.5rem', 
                  textDecoration: 'none', 
                  color: isActive(item.path) ? '#2563eb' : '#64748b', 
                  backgroundColor: isActive(item.path) ? '#eff6ff' : 'transparent',
                  marginBottom: '0.5rem',
                  transition: 'all 0.2s',
                  fontWeight: isActive(item.path) ? 600 : 500,
                  border: isActive(item.path) ? '1px solid #2563eb' : '1px solid transparent'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <item.icon size={20} style={{ color: isActive(item.path) ? '#2563eb' : '#64748b' }} />
                  <span>{item.label}</span>
                </div>
                {isActive(item.path) && <ChevronRight size={16} style={{ color: '#2563eb' }} />}
              </Link>
            ))}
          </nav>

          <div style={{ 
            padding: '1.5rem', 
            borderTop: '1px solid #f1f5f9', 
            backgroundColor: '#f8fafc' 
          }}>
            <div style={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: '0.75rem', 
              marginBottom: '1rem' 
            }}>
              <div style={{ 
                width: '40px', 
                height: '40px', 
                borderRadius: '20px', 
                backgroundColor: '#e2e8f0', 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center', 
                color: '#64748b' 
              }}>
                <UserIcon size={20} />
              </div>
              <div style={{ overflow: 'hidden' }}>
                <div style={{ 
                  fontWeight: 600, 
                  fontSize: '0.875rem', 
                  whiteSpace: 'nowrap', 
                  overflow: 'hidden', 
                  textOverflow: 'ellipsis', 
                  color: '#1e293b' 
                }}>
                  {user.firstName} {user.lastName}
                </div>
                <div style={{ fontSize: '0.75rem', color: '#64748b' }}>
                  {user.roles[0]}
                </div>
              </div>
            </div>
            <button 
              onClick={logout}
              style={{ 
                width: '100%', 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center', 
                gap: '0.5rem', 
                padding: '0.625rem', 
                borderRadius: '0.375rem', 
                border: '1px solid #e2e8f0', 
                backgroundColor: 'white', 
                color: '#ef4444', 
                fontWeight: 600, 
                cursor: 'pointer',
                transition: 'all 0.2s ease'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = '#fef2f2';
                e.currentTarget.style.borderColor = '#fecaca';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'white';
                e.currentTarget.style.borderColor = '#e2e8f0';
              }}
            >
              <LogOut size={16} />
              Logout
            </button>
          </div>
        </aside>
      )}

      {/* Main Content */}
      <main style={{ 
        flex: 1, 
        overflowY: 'auto', 
        display: 'flex', 
        flexDirection: 'column', 
        alignItems: !isAuthenticated ? 'center' : 'stretch', 
        justifyContent: !isAuthenticated ? 'center' : 'flex-start',
        marginLeft: showSidebar ? '280px' : '0',
        transition: 'margin-left 0.3s ease'
      }}>
        <div style={{ 
          width: '100%', 
          maxWidth: !isAuthenticated ? 'none' : '1200px', 
          margin: !isAuthenticated ? '0' : '0 auto' 
        }}>
          <Outlet />
        </div>
      </main>
    </div>
  );
}

function RegisterPlaceholder() {
  return (
    <div style={{ 
      padding: '3rem 2rem', 
      maxWidth: '480px', 
      margin: '0 auto',
      textAlign: 'center'
    }}>
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ 
          color: '#1e293b', 
          fontSize: '2rem', 
          fontWeight: 800, 
          marginBottom: '0.5rem' 
        }}>
          Create Account
        </h1>
        <p style={{ color: '#64748b' }}>
          Lab 1: Email Verification System
        </p>
      </div>
      
      <form onSubmit={async (e) => {
        e.preventDefault();
        const data = new FormData(e.currentTarget);
        const body = Object.fromEntries(data.entries());
        
        try {
          const res = await fetch('http://localhost:3000/api/v1/auth/register', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(body)
          });
          const json = await res.json();
          alert(json.message || 'Success! Look at your terminal for link.');
        } catch (err: any) {
          alert('Error: ' + err.message);
        }
      }} style={{ 
        backgroundColor: 'white', 
        padding: '2rem', 
        borderRadius: '1rem', 
        border: '1px solid #e2e8f0', 
        boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' 
      }}>
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: '1fr 1fr', 
          gap: '1rem', 
          marginBottom: '1rem' 
        }}>
          <div>
            <label style={{ 
              display: 'block', 
              fontSize: '0.875rem', 
              fontWeight: 600, 
              color: '#374151', 
              marginBottom: '0.375rem' 
            }}>
              First Name
            </label>
            <input 
              name="firstName" 
              required 
              style={{ 
                width: '100%', 
                padding: '0.75rem', 
                borderRadius: '0.5rem', 
                border: '1px solid #d1d5db',
                fontSize: '1rem'
              }} 
            />
          </div>
          <div>
            <label style={{ 
              display: 'block', 
              fontSize: '0.875rem', 
              fontWeight: 600, 
              color: '#374151', 
              marginBottom: '0.375rem' 
            }}>
              Last Name
            </label>
            <input 
              name="lastName" 
              required 
              style={{ 
                width: '100%', 
                padding: '0.75rem', 
                borderRadius: '0.5rem', 
                border: '1px solid #d1d5db',
                fontSize: '1rem'
              }} 
            />
          </div>
        </div>
        <div style={{ marginBottom: '1rem' }}>
          <label style={{ 
            display: 'block', 
            fontSize: '0.875rem', 
            fontWeight: 600, 
            color: '#374151', 
            marginBottom: '0.375rem' 
          }}>
            Email
          </label>
          <input 
            name="email" 
            type="email" 
            required 
            style={{ 
              width: '100%', 
              padding: '0.75rem', 
              borderRadius: '0.5rem', 
              border: '1px solid #d1d5db',
              fontSize: '1rem'
            }} 
          />
        </div>
        <div style={{ marginBottom: '1.5rem' }}>
          <label style={{ 
            display: 'block', 
            fontSize: '0.875rem', 
            fontWeight: 600, 
            color: '#374151', 
            marginBottom: '0.375rem' 
          }}>
            Password
          </label>
          <input 
            name="password" 
            type="password" 
            required 
            style={{ 
              width: '100%', 
              padding: '0.75rem', 
              borderRadius: '0.5rem', 
              border: '1px solid #d1d5db',
              fontSize: '1rem'
            }} 
          />
        </div>
        <button 
          type="submit" 
          style={{ 
            width: '100%', 
            padding: '0.75rem', 
            backgroundColor: '#2563eb', 
            color: 'white', 
            border: 'none', 
            borderRadius: '0.5rem', 
            fontWeight: 600, 
            cursor: 'pointer',
            fontSize: '1rem'
          }}
        >
          Register User
        </button>
        <div style={{ 
          marginTop: '1.5rem', 
          textAlign: 'center', 
          fontSize: '0.875rem', 
          color: '#64748b' 
        }}>
          Already have an account? <Link to="/login" style={{ color: '#2563eb', textDecoration: 'none' }}>Login here</Link>
        </div>
      </form>
    </div>
  );
}

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<RegisterPlaceholder />} />
        <Route path="login" element={<LoginPage />} />
        <Route path="verify-email" element={<VerifyEmailPage />} />
        <Route path="forgot-password" element={<ForgotPasswordPage />} />
        <Route path="reset-password" element={<ResetPasswordPage />} />
        <Route path="subjects" element={<SubjectsListPage />} />
        <Route path="subjects/new" element={<SubjectFormPage />} />
        <Route path="attendance" element={<AttendancePage />} />
        <Route path="audit" element={<UserAuditPage />} />
      </Route>
    </Routes>
  );
}