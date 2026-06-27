import { Link, useLocation } from 'react-router-dom';
import { 
  InboxIcon, 
  CalendarIcon, 
  ClockIcon, 
  UserIcon, 
  BriefcaseIcon,
  PlusIcon,
  QuestionMarkCircleIcon,
  ArchiveBoxIcon
} from '@heroicons/react/24/outline';

export default function Sidebar() {
  const location = useLocation();

  const navItems = [
    { name: 'Inbox', filter: 'inbox', icon: InboxIcon },
    { name: 'Today', filter: 'today', icon: CalendarIcon },
    { name: 'Upcoming', filter: 'upcoming', icon: ClockIcon },
  ];

  const labels = [
    { name: 'Personal', category: 'Personal', icon: UserIcon },
    { name: 'Work', category: 'Work', icon: BriefcaseIcon },
  ];

  const searchParams = new URLSearchParams(location.search);
  const currentFilter = searchParams.get('filter') || 'inbox';
  const currentCategory = searchParams.get('category');

  return (
    <div style={{
      width: '240px',
      backgroundColor: 'var(--bg-sidebar)',
      borderRight: '1px solid var(--border-color)',
      display: 'flex',
      flexDirection: 'column',
      height: '100%',
      padding: '1.5rem 0'
    }}>
      <div style={{ padding: '0 1.5rem', marginBottom: '2rem' }}>
        <h2 style={{ color: 'var(--primary-color)', fontSize: '1.25rem', fontWeight: '700' }}>Task Lists</h2>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.8rem', marginTop: '0.25rem' }}>Manage your focus</p>
      </div>

      <nav style={{ flex: 1 }}>
        <ul style={{ listStyle: 'none', padding: 0 }}>
          {navItems.map(item => {
            const isActive = location.pathname === '/' && currentFilter === item.filter && !currentCategory;
            const Icon = item.icon;
            return (
              <li key={item.name} style={{ marginBottom: '0.5rem', padding: '0 1rem' }}>
                <Link to={`/?filter=${item.filter}`} style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '1rem',
                  padding: '0.75rem 1rem',
                  borderRadius: 'var(--radius-md)',
                  backgroundColor: isActive ? 'var(--accent-teal)' : 'transparent',
                  color: isActive ? 'white' : 'var(--text-secondary)',
                  textDecoration: 'none',
                  fontWeight: isActive ? '600' : '500',
                  transition: 'background-color 0.2s'
                }}>
                  <Icon width={20} />
                  {item.name}
                </Link>
              </li>
            )
          })}

          <div style={{ margin: '2rem 1.5rem 0.5rem', fontSize: '0.75rem', fontWeight: '600', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            LABELS
          </div>

          {labels.map(label => {
            const isActive = location.pathname === '/' && currentCategory === label.category;
            const Icon = label.icon;
            return (
              <li key={label.name} style={{ marginBottom: '0.5rem', padding: '0 1rem' }}>
                <Link to={`/?category=${label.category}`} style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '1rem',
                  padding: '0.75rem 1rem',
                  borderRadius: 'var(--radius-md)',
                  backgroundColor: isActive ? 'var(--accent-teal)' : 'transparent',
                  color: isActive ? 'white' : 'var(--text-secondary)',
                  textDecoration: 'none',
                  fontWeight: isActive ? '600' : '500',
                  transition: 'background-color 0.2s'
                }}>
                  <Icon width={20} />
                  {label.name}
                </Link>
              </li>
            )
          })}
        </ul>

        <div style={{ padding: '1rem 1.5rem' }}>
          <button className="btn-primary" style={{ width: '100%', justifyContent: 'center' }}>
            <PlusIcon width={20} />
            Create New List
          </button>
        </div>
      </nav>

      <div style={{ padding: '1.5rem', borderTop: '1px solid var(--border-color)' }}>
        <ul style={{ listStyle: 'none', padding: 0 }}>
          <li style={{ marginBottom: '1rem' }}>
            <a href="#" style={{ display: 'flex', alignItems: 'center', gap: '1rem', color: 'var(--text-secondary)', textDecoration: 'none', fontWeight: '500' }}>
              <QuestionMarkCircleIcon width={20} /> Help
            </a>
          </li>
          <li>
            <a href="#" style={{ display: 'flex', alignItems: 'center', gap: '1rem', color: 'var(--text-secondary)', textDecoration: 'none', fontWeight: '500' }}>
              <ArchiveBoxIcon width={20} /> Archive
            </a>
          </li>
        </ul>
      </div>
    </div>
  );
}
