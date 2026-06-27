import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { PlusIcon, PencilIcon, CheckIcon, TrashIcon, ClockIcon } from '@heroicons/react/24/outline';
import { fetchTodos, createTodo, updateTodo, deleteTodo } from '../api';
import { syncTaskToGoogleCalendar } from '../calendarSync';
import AddTaskModal from '../components/AddTaskModal';

const getLocalDateString = (d = new Date()) => {
  return d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0');
};

export default function Dashboard({ user }) {
  const [todos, setTodos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const searchQuery = searchParams.get('q') || '';
  const filterQuery = searchParams.get('filter') || 'inbox';
  const categoryQuery = searchParams.get('category') || '';
  
  const [selectedDate, setSelectedDate] = useState(getLocalDateString());
  const [showAllToday, setShowAllToday] = useState(false);

  const loadTodos = async () => {
    try {
      setLoading(true);
      const data = await fetchTodos();
      setTodos(data);
    } catch (err) {
      console.error('Failed to load todos:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadTodos(); }, []);

  const handleCreateTask = async (taskData) => {
    try {
      const newTodo = await createTodo(taskData);
      setTodos(prev => [...prev, newTodo]);

      // Sync to Google Calendar if logged in via Google
      if (user?.type === 'google' && user.googleAccessToken) {
        await syncTaskToGoogleCalendar(newTodo, user.googleAccessToken);
      }
    } catch (err) {
      console.error('Failed to create task:', err);
    }
  };

  const handleToggleStatus = async (task) => {
    const nextStatus = task.status === 'DONE' ? 'TO-DO' : task.status === 'TO-DO' ? 'IN PROGRESS' : 'DONE';
    const nextProgress = nextStatus === 'DONE' ? 100 : nextStatus === 'IN PROGRESS' ? 50 : 0;
    try {
      const updated = await updateTodo(task.id, { status: nextStatus, progress: nextProgress });
      setTodos(prev => prev.map(t => t.id === task.id ? updated : t));
    } catch (err) {
      console.error('Failed to update task:', err);
    }
  };

  const handleDelete = async (taskId) => {
    if (!confirm('Are you sure you want to delete this task?')) return;
    try {
      await deleteTodo(taskId);
      setTodos(prev => prev.filter(t => t.id !== taskId));
    } catch (err) {
      console.error('Failed to delete task:', err);
    }
  };

  const filteredTodos = todos.filter(t => {
    // text search
    if (searchQuery && !t.title.toLowerCase().includes(searchQuery.toLowerCase()) && 
        (!t.description || !t.description.toLowerCase().includes(searchQuery.toLowerCase()))) {
      return false;
    }
    // category filter
    if (categoryQuery && t.category !== categoryQuery) {
      return false;
    }
    // preset filters
    const todayStr = getLocalDateString();
    if (filterQuery === 'today' && t.date !== todayStr) return false;
    if (filterQuery === 'upcoming' && t.date <= todayStr) return false;
    
    return true;
  });

  const todaysTasks = filteredTodos
    .filter(t => t.status !== 'DONE' && (showAllToday || t.date === getLocalDateString()))
    .slice(0, showAllToday ? undefined : 2);
    
  const timelineTasks = filteredTodos.filter(t => t.date === selectedDate);
  const statusCounts = {
    todo: filteredTodos.filter(t => t.status === 'TO-DO').length,
    progress: filteredTodos.filter(t => t.status === 'IN PROGRESS').length,
    done: filteredTodos.filter(t => t.status === 'DONE').length
  };

  const statusColor = (status) => {
    if (status === 'TO-DO') return { bg: '#fee2e2', text: '#ef4444' };
    if (status === 'IN PROGRESS') return { bg: '#dbeafe', text: '#2563eb' };
    return { bg: '#f1f5f9', text: '#64748b' };
  };

  const dotColor = (status) => {
    if (status === 'TO-DO') return '#ef4444';
    if (status === 'IN PROGRESS') return '#3b82f6';
    return '#94a3b8';
  };

  const cardColors = ['#0d47a1', '#d32f2f', '#7c3aed', '#0891b2'];

  const getWeekDays = () => {
    const today = new Date();
    const currentDay = today.getDay(); // 0 is Sunday
    const sunday = new Date(today);
    sunday.setDate(today.getDate() - currentDay);
    
    const days = [];
    const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    for (let i = 0; i < 7; i++) {
      const d = new Date(sunday);
      d.setDate(sunday.getDate() + i);
      const label = `${dayNames[d.getDay()]} ${d.getDate()}`;
      const fullDate = getLocalDateString(d);
      days.push({ label, fullDate });
    }
    return days;
  };
  const weekDays = getWeekDays();

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good Morning';
    if (hour < 18) return 'Good Afternoon';
    return 'Good Evening';
  };

  if (loading) {
    return <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh', color: 'var(--text-secondary)' }}>Loading tasks...</div>;
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      <AddTaskModal isOpen={showAddModal} onClose={() => setShowAddModal(false)} onTaskCreated={handleCreateTask} />

      {/* Header Section */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
        <div>
          <p style={{ color: 'var(--text-secondary)', marginBottom: '0.5rem' }}>{getGreeting()}, ziptrrip!</p>
          <h1 style={{ fontSize: '2rem', fontWeight: 'bold' }}>
            {searchQuery ? `Search results for "${searchQuery}"` : (
              <>You have <span style={{ color: 'var(--primary-light)' }}>{filteredTodos.length} tasks</span> this month 👍</>
            )}
          </h1>
        </div>
        <button onClick={() => setShowAddModal(true)} className="btn-primary" style={{ padding: '0.75rem 2rem', borderRadius: '30px' }}>
          <PlusIcon width={20} />
          Add Task
        </button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '2rem' }}>

        {/* Left Column */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>

          {/* Today's Tasks Cards */}
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
              <h2 style={{ fontSize: '1.25rem', fontWeight: '600' }}>{showAllToday ? 'All Tasks' : "Today's Tasks"}</h2>
              <span onClick={() => setShowAllToday(!showAllToday)} style={{ color: 'var(--primary-color)', fontWeight: '600', fontSize: '0.9rem', cursor: 'pointer', textDecoration: 'none' }}>
                {showAllToday ? 'Show Less' : 'See All'}
              </span>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: showAllToday ? '1fr' : '1fr 1fr', gap: '1rem' }}>
              {todaysTasks.map((task, i) => (
                <Link to={'/task/' + task.id} key={task.id} style={{ textDecoration: 'none', color: 'white' }}>
                  <div style={{
                    backgroundColor: cardColors[i % cardColors.length],
                    color: 'white', padding: '1.5rem', borderRadius: 'var(--radius-xl)',
                    display: 'flex', flexDirection: 'column', gap: '1rem',
                    boxShadow: 'var(--shadow-md)', cursor: 'pointer',
                    transition: 'transform 0.2s ease'
                  }} onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-2px)'}
                     onMouseLeave={e => e.currentTarget.style.transform = 'translateY(0)'}>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <h3 style={{ fontSize: '1.15rem', fontWeight: '600' }}>{task.title}</h3>
                      <span style={{ cursor: 'pointer', fontSize: '1.25rem' }}>⋮</span>
                    </div>
                    <p style={{ fontSize: '0.85rem', opacity: 0.9, lineHeight: '1.4' }}>{task.description}</p>
                    <div style={{ marginTop: 'auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.8rem', fontWeight: '600' }}>
                      <span>{task.time || '—'}</span>
                      <span>Progress: {task.progress}%</span>
                    </div>
                    <div style={{ width: '100%', backgroundColor: 'rgba(255,255,255,0.3)', height: '6px', borderRadius: '3px' }}>
                      <div style={{ width: task.progress + '%', backgroundColor: 'white', height: '100%', borderRadius: '3px', transition: 'width 0.5s ease' }}></div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>

          {/* Weekly Timeline */}
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
              <h2 style={{ fontSize: '1.25rem', fontWeight: '600' }}>Weekly Timeline</h2>
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                {weekDays.map(day => (
                  <div key={day.fullDate} 
                    onClick={() => setSelectedDate(day.fullDate)}
                    style={{
                      padding: '0.25rem 0.75rem', borderRadius: 'var(--radius-md)',
                      backgroundColor: day.fullDate === selectedDate ? 'var(--primary-color)' : 'var(--border-color)',
                      color: day.fullDate === selectedDate ? 'white' : 'var(--text-secondary)',
                      fontSize: '0.8rem', fontWeight: '600', userSelect: 'none', cursor: 'pointer',
                      transition: 'background-color 0.2s'
                  }}>{day.label}</div>
                ))}
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', position: 'relative' }}>
              <div style={{ position: 'absolute', left: '6px', top: '20px', bottom: '20px', width: '2px', backgroundColor: 'var(--border-color)', zIndex: 0 }}></div>

              {timelineTasks.length === 0 ? (
                <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-secondary)', backgroundColor: 'var(--bg-surface)', borderRadius: 'var(--radius-lg)', border: '1px dashed var(--border-color)' }}>
                  No tasks for this date.
                </div>
              ) : timelineTasks.map(task => {
                const sc = statusColor(task.status);
                return (
                  <div key={task.id} style={{ display: 'flex', gap: '1rem', position: 'relative', zIndex: 1 }}>
                    <div style={{ marginTop: '1.5rem', width: '14px', height: '14px', borderRadius: '50%', backgroundColor: dotColor(task.status), border: '3px solid var(--bg-main)', flexShrink: 0 }}></div>
                    <div style={{
                      flex: 1, backgroundColor: 'var(--bg-surface)', padding: '1.25rem',
                      borderRadius: 'var(--radius-lg)', border: '1px solid var(--border-color)',
                      display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                      opacity: task.status === 'DONE' ? 0.6 : 1
                    }}>
                      <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '0.5rem' }}>
                          <span style={{ fontSize: '0.7rem', fontWeight: '700', padding: '0.2rem 0.5rem', borderRadius: '4px', backgroundColor: sc.bg, color: sc.text }}>{task.status}</span>
                          <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                            <ClockIcon width={14} /> {task.time || '—'}
                          </span>
                        </div>
                        <Link to={'/task/' + task.id} style={{ textDecoration: 'none', color: 'inherit' }}>
                          <h4 style={{ fontSize: '1rem', fontWeight: '600', marginBottom: '0.25rem', textDecoration: task.status === 'DONE' ? 'line-through' : 'none' }}>{task.title}</h4>
                        </Link>
                        <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', textDecoration: task.status === 'DONE' ? 'line-through' : 'none' }}>{task.description}</p>
                      </div>

                      <div style={{ display: 'flex', gap: '0.5rem', flexShrink: 0 }}>
                        <Link to={'/task/' + task.id} style={{ padding: '0.5rem', borderRadius: 'var(--radius-md)', border: 'none', backgroundColor: '#f1f5f9', cursor: 'pointer', color: 'var(--text-secondary)', display: 'flex', alignItems: 'center' }}>
                          <PencilIcon width={18} />
                        </Link>
                        <button onClick={() => handleToggleStatus(task)} title="Toggle status" style={{ padding: '0.5rem', borderRadius: 'var(--radius-md)', border: 'none', backgroundColor: task.status === 'DONE' ? '#22c55e' : '#f1f5f9', cursor: 'pointer', color: task.status === 'DONE' ? 'white' : 'var(--text-secondary)' }}>
                          <CheckIcon width={18} />
                        </button>
                        <button onClick={() => handleDelete(task.id)} title="Delete task" style={{ padding: '0.5rem', borderRadius: 'var(--radius-md)', border: 'none', backgroundColor: '#f1f5f9', cursor: 'pointer', color: 'var(--text-secondary)' }}>
                          <TrashIcon width={18} />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right Column - Task Status */}
        <div>
          <div style={{ backgroundColor: 'var(--bg-surface)', padding: '1.5rem', borderRadius: 'var(--radius-xl)', border: '1px solid var(--border-color)' }}>
            <h2 style={{ fontSize: '1.1rem', fontWeight: '600', marginBottom: '1.5rem' }}>Task Status</h2>

            <div style={{ display: 'flex', justifyContent: 'space-around', marginBottom: '2rem' }}>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem' }}>
                <div style={{ width: '48px', height: '48px', borderRadius: '50%', backgroundColor: '#f1f5f9', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--primary-color)', fontSize: '1.1rem', fontWeight: '700', userSelect: 'none' }}>{statusCounts.todo}</div>
                <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', fontWeight: '500', userSelect: 'none' }}>To-Do</span>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem' }}>
                <div style={{ width: '48px', height: '48px', borderRadius: '50%', backgroundColor: '#fef3c7', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#d97706', fontSize: '1.1rem', fontWeight: '700', userSelect: 'none' }}>{statusCounts.progress}</div>
                <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', fontWeight: '500', userSelect: 'none' }}>Progress</span>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem' }}>
                <div style={{ width: '48px', height: '48px', borderRadius: '50%', backgroundColor: '#dcfce7', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#16a34a', fontSize: '1.1rem', fontWeight: '700', userSelect: 'none' }}>{statusCounts.done}</div>
                <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', fontWeight: '500' }}>Done</span>
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {filteredTodos.filter(t => t.status !== 'DONE').slice(0, 3).map(task => (
                <div key={task.id} style={{ padding: '1rem', borderRadius: 'var(--radius-lg)', border: '1px solid #e0e7ff', borderLeft: '4px solid #4f46e5', backgroundColor: '#ffffff', boxShadow: 'var(--shadow-sm)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.25rem' }}>
                    <div style={{ width: '24px', height: '24px', borderRadius: '50%', backgroundColor: '#e0e7ff', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#4f46e5' }}>
                      <ClockIcon width={14} />
                    </div>
                    <h4 style={{ fontSize: '0.9rem', fontWeight: '600' }}>{task.title}</h4>
                  </div>
                  <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginLeft: '2.25rem' }}>{task.time || 'No time set'}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer style={{ borderTop: '1px solid var(--border-color)', padding: '1.5rem 0', marginTop: '2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <p style={{ fontWeight: '700', fontSize: '0.95rem' }}>ziptrrip Inc.</p>
          <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>© 2024 ziptrrip Inc. Efficiency at scale.</p>
        </div>
        <div style={{ display: 'flex', gap: '2rem' }}>
          <span style={{ fontSize: '0.85rem', color: 'var(--primary-color)', fontWeight: '500', cursor: 'pointer' }}>Privacy Policy</span>
          <span style={{ fontSize: '0.85rem', color: 'var(--primary-color)', fontWeight: '500', cursor: 'pointer' }}>Terms of Service</span>
          <span style={{ fontSize: '0.85rem', color: 'var(--primary-color)', fontWeight: '500', cursor: 'pointer' }}>Contact Support</span>
        </div>
      </footer>
    </div>
  );
}
