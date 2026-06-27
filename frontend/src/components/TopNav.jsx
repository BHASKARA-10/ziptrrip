import { Link, useLocation } from 'react-router-dom';
import { MagnifyingGlassIcon, BellIcon } from '@heroicons/react/24/outline';
import { useNavigate } from 'react-router-dom';
import { auth } from '../firebase';
import { signOut } from 'firebase/auth';

export default function TopNav({ user }) {
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = async () => {
    if (user?.type === 'google') {
      try { await signOut(auth); } catch(e) { /* ignore */ }
    }
    localStorage.removeItem('user');
    navigate('/login');
  };

  const navLinks = [
    { name: 'Dashboard', path: '/' },
    { name: 'Calendar', path: '/calendar' },
    { name: 'Team', path: '#' },
    { name: 'Settings', path: '#' },
  ];

  const isActive = (path) => {
    if (path === '/') return location.pathname === '/';
    if (path === '#') return false;
    return location.pathname.startsWith(path);
  };

  return (
    <header style={{
      height: '70px',
      borderBottom: '1px solid var(--border-color)',
      backgroundColor: 'var(--bg-surface)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '0 2rem',
      flexShrink: 0
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
        <span style={{ fontSize: '1.25rem', fontWeight: 'bold', color: 'var(--primary-color)', userSelect: 'none' }}>ziptrrip</span>
      </div>

      <nav style={{ display: 'flex', gap: '2rem', height: '100%', alignItems: 'center' }}>
        {navLinks.map(link => (
          <Link
            key={link.name}
            to={link.path}
            style={{
              textDecoration: 'none',
              color: isActive(link.path) ? 'var(--primary-color)' : 'var(--text-secondary)',
              fontWeight: isActive(link.path) ? '600' : '500',
              borderBottom: isActive(link.path) ? '2px solid var(--primary-color)' : '2px solid transparent',
              height: '100%',
              display: 'flex',
              alignItems: 'center',
              paddingBottom: '2px',
              cursor: 'pointer',
              userSelect: 'none'
            }}
          >{link.name}</Link>
        ))}
      </nav>

      <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
        <div style={{ position: 'relative' }}>
          <MagnifyingGlassIcon width={18} style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)', pointerEvents: 'none' }} />
          <input
            type="text"
            placeholder="Search a task..."
            style={{
              padding: '0.5rem 1rem 0.5rem 2.5rem',
              borderRadius: '20px',
              border: '1px solid var(--border-color)',
              backgroundColor: 'var(--bg-main)',
              width: '200px',
              fontFamily: 'Inter, sans-serif',
              fontSize: '0.85rem',
              outline: 'none'
            }}
          />
        </div>

        <button style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-secondary)', display: 'flex', alignItems: 'center' }}>
          <BellIcon width={24} />
        </button>

        <div
          onClick={handleLogout}
          title="Click to logout"
          style={{ cursor: 'pointer', display: 'flex', alignItems: 'center' }}
        >
          {user?.photoURL ? (
            <img src={user.photoURL} alt="Profile" style={{ width: '32px', height: '32px', borderRadius: '50%' }} />
          ) : (
            <div style={{ width: '32px', height: '32px', borderRadius: '50%', backgroundColor: 'var(--primary-light)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 'bold', fontSize: '0.9rem', userSelect: 'none' }}>
              {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
