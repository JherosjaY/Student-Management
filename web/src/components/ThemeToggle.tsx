import { Sun, Moon, Monitor } from 'lucide-react';
import { useTheme } from '../hooks/useTheme';

export const ThemeToggle = () => {
  const { theme, isDark, toggleTheme } = useTheme();

  const getThemeIcon = () => {
    switch (theme) {
      case 'light':
        return <Sun size={20} />;
      case 'dark':
        return <Moon size={20} />;
      case 'auto':
        return <Monitor size={20} />;
      default:
        return <Sun size={20} />;
    }
  };

  const getThemeLabel = () => {
    switch (theme) {
      case 'light':
        return 'Light';
      case 'dark':
        return 'Dark';
      case 'auto':
        return 'Auto';
      default:
        return 'Light';
    }
  };

  return (
    <button
      onClick={toggleTheme}
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '0.5rem',
        padding: '0.5rem 1rem',
        backgroundColor: isDark ? '#374151' : '#f3f4f6',
        border: `1px solid ${isDark ? '#4b5563' : '#d1d5db'}`,
        borderRadius: '0.5rem',
        color: isDark ? '#f9fafb' : '#111827',
        cursor: 'pointer',
        transition: 'all 0.2s',
        fontSize: '0.875rem',
        fontWeight: '500',
      }}
      title={`Current theme: ${getThemeLabel()}. Click to toggle.`}
    >
      {getThemeIcon()}
      <span style={{ marginLeft: '0.25rem' }}>
        {getThemeLabel()}
      </span>
    </button>
  );
};