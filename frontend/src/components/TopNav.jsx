import { Link, useLocation, useNavigate } from 'react-router-dom';
import { MagnifyingGlassIcon, BellIcon } from '@heroicons/react/24/outline';
import { useState, useRef, useEffect } from 'react';
import { auth } from '../firebase';
import { signOut } from 'firebase/auth';

export default function TopNav({ user }) {
  const navigate = useNavigate();
  const location = useLocation();
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  
  const menuRef = useRef(null);
  const notifRef = useRef(null);

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setShowProfileMenu(false);
      }
      if (notifRef.current && !notifRef.current.contains(event.target)) {
        setShowNotifications(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = async () => {
    if (user?.type === 'google') {
      try { await signOut(auth); } catch(e) { /* ignore */ }
    }
    localStorage.removeItem('user');
    navigate('/login');
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/?q=${encodeURIComponent(searchQuery.trim())}`);
    } else {
      navigate('/');
    }
  };

  const navLinks = [
    { name: 'Dashboard', path: '/' },
    { name: 'Calendar', path: '/calendar' },
    { name: 'Settings', path: '/settings' },
  ];

  const isActive = (path) => {
    if (path === '/') return location.pathname === '/';
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
      flexShrink: 0,
      position: 'relative'
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
        <img src="/logo.png" alt="ziptrrip" style={{ height: '32px', userSelect: 'none' }} />
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
        <form onSubmit={handleSearch} style={{ position: 'relative' }}>
          <MagnifyingGlassIcon width={18} style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)', pointerEvents: 'none' }} />
          <input
            type="text"
            placeholder="Search a task..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{
              padding: '0.5rem 1rem 0.5rem 2.5rem',
              borderRadius: '20px',
              border: '1px solid var(--border-color)',
              backgroundColor: 'var(--bg-main)',
              width: '200px',
              fontFamily: 'Inter, sans-serif',
              fontSize: '0.85rem',
              outline: 'none',
              transition: 'border-color 0.2s'
            }}
            onFocus={(e) => e.target.style.borderColor = 'var(--primary-light)'}
            onBlur={(e) => e.target.style.borderColor = 'var(--border-color)'}
          />
        </form>

        <div ref={notifRef} style={{ position: 'relative' }}>
          <button 
            onClick={() => setShowNotifications(!showNotifications)}
            style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-secondary)', display: 'flex', alignItems: 'center' }}
          >
            <BellIcon width={24} />
          </button>
          
          {showNotifications && (
            <div style={{
              position: 'absolute', top: '100%', right: 0, marginTop: '0.5rem',
              width: '250px', backgroundColor: 'white', borderRadius: 'var(--radius-md)',
              boxShadow: 'var(--shadow-lg)', border: '1px solid var(--border-color)',
              zIndex: 50, padding: '1rem'
            }}>
              <h4 style={{ fontSize: '0.9rem', fontWeight: '600', marginBottom: '0.5rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.5rem' }}>Notifications</h4>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', textAlign: 'center', padding: '1rem 0' }}>No new notifications</p>
            </div>
          )}
        </div>

        <div ref={menuRef} style={{ position: 'relative' }}>
          <div
            onClick={() => setShowProfileMenu(!showProfileMenu)}
            style={{ cursor: 'pointer', display: 'flex', alignItems: 'center' }}
          >
            <img src={user?.photoURL || "/logo.png"} alt="Profile" style={{ width: '32px', height: '32px', borderRadius: '50%', objectFit: 'cover' }} />
          </div>
          
          {showProfileMenu && (
            <div style={{
              position: 'absolute', top: '100%', right: 0, marginTop: '0.5rem',
              width: '180px', backgroundColor: 'white', borderRadius: 'var(--radius-md)',
              boxShadow: 'var(--shadow-lg)', border: '1px solid var(--border-color)',
              zIndex: 50, overflow: 'hidden'
            }}>
              <div style={{ padding: '0.75rem 1rem', borderBottom: '1px solid var(--border-color)' }}>
                <p style={{ fontSize: '0.85rem', fontWeight: '600', color: 'var(--text-primary)' }}>{user?.name || 'User'}</p>
                <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', overflow: 'hidden', textOverflow: 'ellipsis' }}>{user?.email || 'user@example.com'}</p>
              </div>
              <Link to="/settings" onClick={() => setShowProfileMenu(false)} style={{ display: 'block', padding: '0.75rem 1rem', fontSize: '0.85rem', color: 'var(--text-primary)', textDecoration: 'none' }} 
                    onMouseEnter={(e) => e.target.style.backgroundColor = 'var(--bg-main)'}
                    onMouseLeave={(e) => e.target.style.backgroundColor = 'transparent'}>
                Settings
              </Link>
              <button 
                onClick={handleLogout}
                style={{ width: '100%', textAlign: 'left', background: 'none', border: 'none', padding: '0.75rem 1rem', fontSize: '0.85rem', color: '#dc2626', cursor: 'pointer' }}
                onMouseEnter={(e) => e.target.style.backgroundColor = '#fef2f2'}
                onMouseLeave={(e) => e.target.style.backgroundColor = 'transparent'}
              >
                Sign out
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
