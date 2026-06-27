import { useState, useEffect } from 'react';
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/outline';
import { fetchTodos } from '../api';

export default function Calendar({ user }) {
  const [todos, setTodos] = useState([]);
  const [currentDate, setCurrentDate] = useState(new Date());

  useEffect(() => {
    fetchTodos().then(setTodos).catch(console.error);
  }, []);

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  const monthName = currentDate.toLocaleString('default', { month: 'long', year: 'numeric' });

  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const today = new Date();

  const prevMonth = () => setCurrentDate(new Date(year, month - 1, 1));
  const nextMonth = () => setCurrentDate(new Date(year, month + 1, 1));

  const getTasksForDay = (day) => {
    const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    return todos.filter(t => t.date === dateStr);
  };

  const cells = [];
  // Empty cells before the first day
  for (let i = 0; i < firstDay; i++) {
    cells.push(<div key={'empty-' + i} style={{ minHeight: '100px', backgroundColor: '#fafbfc', borderRadius: '8px' }}></div>);
  }
  // Day cells
  for (let day = 1; day <= daysInMonth; day++) {
    const dayTasks = getTasksForDay(day);
    const isToday = today.getDate() === day && today.getMonth() === month && today.getFullYear() === year;

    cells.push(
      <div key={day} style={{
        minHeight: '100px',
        backgroundColor: isToday ? '#eff6ff' : 'white',
        border: isToday ? '2px solid #3b82f6' : '1px solid var(--border-color)',
        borderRadius: '8px',
        padding: '0.5rem',
        display: 'flex',
        flexDirection: 'column',
        gap: '0.25rem'
      }}>
        <div style={{
          fontSize: '0.85rem',
          fontWeight: isToday ? '700' : '500',
          color: isToday ? '#2563eb' : 'var(--text-primary)',
          marginBottom: '0.25rem'
        }}>{day}</div>
        {dayTasks.map(task => (
          <div key={task.id} style={{
            fontSize: '0.7rem',
            fontWeight: '600',
            padding: '0.2rem 0.4rem',
            borderRadius: '4px',
            backgroundColor: task.status === 'DONE' ? '#dcfce7' : task.status === 'IN PROGRESS' ? '#dbeafe' : '#fee2e2',
            color: task.status === 'DONE' ? '#16a34a' : task.status === 'IN PROGRESS' ? '#2563eb' : '#ef4444',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap'
          }}>
            {task.title}
          </div>
        ))}
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h1 style={{ fontSize: '2rem', fontWeight: 'bold' }}>Calendar</h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
          {user?.type === 'google'
            ? '✅ Tasks synced with your Google Calendar.'
            : 'Log in with Google to sync tasks with Google Calendar.'}
        </p>
      </div>

      <div style={{ backgroundColor: 'white', padding: '1.5rem', borderRadius: 'var(--radius-xl)', border: '1px solid var(--border-color)' }}>
        {/* Month Navigation */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
          <button onClick={prevMonth} style={{ background: 'none', border: '1px solid var(--border-color)', borderRadius: '8px', padding: '0.5rem', cursor: 'pointer', display: 'flex', alignItems: 'center' }}>
            <ChevronLeftIcon width={18} />
          </button>
          <h2 style={{ fontSize: '1.25rem', fontWeight: '600' }}>{monthName}</h2>
          <button onClick={nextMonth} style={{ background: 'none', border: '1px solid var(--border-color)', borderRadius: '8px', padding: '0.5rem', cursor: 'pointer', display: 'flex', alignItems: 'center' }}>
            <ChevronRightIcon width={18} />
          </button>
        </div>

        {/* Day Headers */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '0.5rem', marginBottom: '0.5rem' }}>
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(d => (
            <div key={d} style={{ textAlign: 'center', fontSize: '0.8rem', fontWeight: '600', color: 'var(--text-muted)', padding: '0.5rem 0' }}>{d}</div>
          ))}
        </div>

        {/* Calendar Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '0.5rem' }}>
          {cells}
        </div>
      </div>

      {/* Task list below calendar */}
      <div style={{ backgroundColor: 'white', padding: '1.5rem', borderRadius: 'var(--radius-xl)', border: '1px solid var(--border-color)' }}>
        <h2 style={{ fontSize: '1.1rem', fontWeight: '600', marginBottom: '1rem' }}>All Scheduled Tasks</h2>
        {todos.length === 0 ? (
          <p style={{ color: 'var(--text-secondary)' }}>No tasks yet. Create one from the Dashboard.</p>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {todos.map(task => (
              <div key={task.id} style={{
                display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                padding: '0.75rem 1rem', borderRadius: '8px', border: '1px solid var(--border-color)',
                backgroundColor: task.status === 'DONE' ? '#f8fafc' : 'white'
              }}>
                <div>
                  <span style={{ fontWeight: '600', textDecoration: task.status === 'DONE' ? 'line-through' : 'none', opacity: task.status === 'DONE' ? 0.6 : 1 }}>{task.title}</span>
                  <span style={{ marginLeft: '1rem', fontSize: '0.8rem', color: 'var(--text-muted)' }}>{task.date || '—'}</span>
                </div>
                <span style={{
                  fontSize: '0.7rem', fontWeight: '700', padding: '0.2rem 0.5rem', borderRadius: '4px',
                  backgroundColor: task.status === 'DONE' ? '#dcfce7' : task.status === 'IN PROGRESS' ? '#dbeafe' : '#fee2e2',
                  color: task.status === 'DONE' ? '#16a34a' : task.status === 'IN PROGRESS' ? '#2563eb' : '#ef4444'
                }}>{task.status}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
