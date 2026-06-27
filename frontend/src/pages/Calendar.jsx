import { CalendarIcon } from '@heroicons/react/24/outline';

export default function Calendar({ user }) {
  return (
    <div style={{ padding: '2rem' }}>
      <h1 style={{ fontSize: '2rem', fontWeight: 'bold', marginBottom: '1rem' }}>Calendar</h1>
      <p style={{ color: 'var(--text-secondary)', marginBottom: '2rem' }}>
        This calendar view shows all your scheduled tasks across ziptrrip. 
        {user?.type === 'google' 
          ? " (Tasks created here are also synced with your Google Calendar.)" 
          : " (Log in with Google to sync these tasks with your Google Calendar.)"}
      </p>

      <div style={{ backgroundColor: 'white', padding: '2rem', borderRadius: 'var(--radius-xl)', border: '1px solid var(--border-color)', minHeight: '400px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '1rem' }}>
        <CalendarIcon width={64} style={{ color: 'var(--primary-light)', opacity: 0.5 }} />
        <h2 style={{ fontSize: '1.25rem', color: 'var(--text-primary)' }}>General Calendar View</h2>
        <p style={{ color: 'var(--text-secondary)', textAlign: 'center', maxWidth: '400px' }}>
          Your scheduled tasks would appear here in a month/week grid view.
        </p>
      </div>
    </div>
  );
}
