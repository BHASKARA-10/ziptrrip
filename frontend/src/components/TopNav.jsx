import { Link } from 'react-router-dom';
import { MagnifyingGlassIcon, BellIcon } from '@heroicons/react/24/outline';
import { useNavigate } from 'react-router-dom';
import { auth } from '../firebase';
import { signOut } from 'firebase/auth';

export default function TopNav({ user }) {
  const navigate = useNavigate();

  const handleLogout = async () => {
    if (user?.type === 'google') {
      await signOut(auth);
    }
    localStorage.removeItem('user');
    navigate('/login');
  };

  return (
    <header style={{
      height: '70px',
      borderBottom: '1px solid var(--border-color)',
      backgroundColor: 'var(--bg-surface)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '0 2rem'
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
        <span style={{ fontSize: '1.25rem', fontWeight: 'bold', color: 'var(--primary-color)' }}>ziptrrip</span>
      </div>

      <nav style={{ display: 'flex', gap: '2rem' }}>
        <Link to="/" style={{ textDecoration: 'none', color: 'var(--primary-color)', fontWeight: '600', borderBottom: '2px solid var(--primary-color)', paddingBottom: '23px' }}>Dashboard</Link>
        <Link to="/calendar" style={{ textDecoration: 'none', color: 'var(--text-secondary)', fontWeight: '500' }}>Calendar</Link>
        <Link to="/team" style={{ textDecoration: 'none', color: 'var(--text-secondary)', fontWeight: '500' }}>Team</Link>
        <Link to="/settings" style={{ textDecoration: 'none', color: 'var(--text-secondary)', fontWeight: '500' }}>Settings</Link>
      </nav>

      <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
        <div style={{ position: 'relative' }}>
          <MagnifyingGlassIcon width={18} style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
          <input 
            type="text" 
            placeholder="Search a task..." 
            style={{ 
              padding: '0.5rem 1rem 0.5rem 2.5rem', 
              borderRadius: '20px', 
              border: '1px solid var(--border-color)',
              backgroundColor: 'var(--bg-main)',
              width: '200px'
            }} 
          />
        </div>
        
        <button style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-secondary)' }}>
          <BellIcon width={24} />
        </button>
        
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }} onClick={handleLogout} title="Click to logout">
          {user?.photoURL ? (
            <img src={user.photoURL} alt="Profile" style={{ width: '32px', height: '32px', borderRadius: '50%' }} />
          ) : (
            <div style={{ width: '32px', height: '32px', borderRadius: '50%', backgroundColor: 'var(--primary-light)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 'bold' }}>
              {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
