import { useParams, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { ArrowLeftIcon, PencilIcon, TrashIcon, CalendarIcon, CheckIcon } from '@heroicons/react/24/outline';
import { fetchTodo, updateTodo, deleteTodo } from '../api';

export default function TaskDetail({ user }) {
  const { id } = useParams();
  const navigate = useNavigate();
  const [task, setTask] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [editTitle, setEditTitle] = useState('');
  const [editDesc, setEditDesc] = useState('');
  const [newSubtask, setNewSubtask] = useState('');

  useEffect(() => {
    loadTask();
  }, [id]);

  const loadTask = async () => {
    try {
      setLoading(true);
      const data = await fetchTodo(id);
      setTask(data);
      setEditTitle(data.title);
      setEditDesc(data.description);
    } catch (err) {
      console.error('Failed to load task:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this task?')) return;
    try {
      await deleteTodo(id);
      navigate('/');
    } catch (err) {
      console.error('Failed to delete:', err);
    }
  };

  const handleSaveEdit = async () => {
    try {
      const updated = await updateTodo(id, { title: editTitle, description: editDesc });
      setTask(updated);
      setEditing(false);
    } catch (err) {
      console.error('Failed to update:', err);
    }
  };

  const handleStatusChange = async (newStatus) => {
    try {
      const progress = newStatus === 'DONE' ? 100 : newStatus === 'IN PROGRESS' ? 50 : 0;
      const updated = await updateTodo(id, { status: newStatus, progress });
      setTask(updated);
    } catch (err) {
      console.error('Failed to update status:', err);
    }
  };

  const handleToggleSubtask = async (subtaskId) => {
    if (!task.subTasks) return;
    const updatedSubs = task.subTasks.map(st =>
      st.id === subtaskId ? { ...st, completed: !st.completed } : st
    );
    try {
      const updated = await updateTodo(id, { subTasks: updatedSubs });
      setTask(updated);
    } catch (err) {
      console.error('Failed to toggle subtask:', err);
    }
  };

  const handleAddSubtask = async () => {
    if (!newSubtask.trim()) return;
    const currentSubs = task.subTasks || [];
    const updatedSubs = [...currentSubs, { id: 'st' + Date.now(), title: newSubtask.trim(), completed: false }];
    try {
      const updated = await updateTodo(id, { subTasks: updatedSubs });
      setTask(updated);
      setNewSubtask('');
    } catch (err) {
      console.error('Failed to add subtask:', err);
    }
  };

  if (loading) {
    return <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh', color: 'var(--text-secondary)' }}>Loading task...</div>;
  }

  if (!task) {
    return <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh', color: 'var(--text-secondary)' }}>Task not found.</div>;
  }

  const completedCount = (task.subTasks || []).filter(st => st.completed).length;
  const totalSubs = (task.subTasks || []).length;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', maxWidth: '1200px', margin: '0 auto' }}>
      <button onClick={() => navigate('/')} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-secondary)', fontWeight: '500', fontSize: '0.9rem', padding: 0 }}>
        <ArrowLeftIcon width={18} /> Back
      </button>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-secondary)', fontSize: '0.85rem', fontWeight: '500', marginBottom: '0.5rem' }}>
            <span>Task Lists</span><span>&gt;</span><span>{task.category || 'General'}</span>
          </div>
          {editing ? (
            <input value={editTitle} onChange={e => setEditTitle(e.target.value)} style={{ fontSize: '2rem', fontWeight: 'bold', border: '1px solid var(--border-color)', borderRadius: '8px', padding: '0.25rem 0.5rem', fontFamily: 'Inter, sans-serif', width: '100%' }} />
          ) : (
            <h1 style={{ fontSize: '2rem', fontWeight: 'bold' }}>{task.title}</h1>
          )}
        </div>
        <div style={{ display: 'flex', gap: '1rem' }}>
          {editing ? (
            <>
              <button onClick={() => setEditing(false)} className="btn-outline" style={{ borderRadius: '30px' }}>Cancel</button>
              <button onClick={handleSaveEdit} className="btn-primary" style={{ borderRadius: '30px' }}>Save</button>
            </>
          ) : (
            <>
              <button onClick={() => setEditing(true)} className="btn-outline" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', borderRadius: '30px' }}>
                <PencilIcon width={16} /> Edit Task
              </button>
              <button onClick={handleDelete} className="btn-primary" style={{ backgroundColor: '#d32f2f', display: 'flex', alignItems: 'center', gap: '0.5rem', borderRadius: '30px' }}>
                <TrashIcon width={16} /> Delete
              </button>
            </>
          )}
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '2rem', marginTop: '1rem' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
          {/* Description */}
          <div style={{ backgroundColor: 'var(--bg-surface)', padding: '2rem', borderRadius: 'var(--radius-xl)', border: '1px solid var(--border-color)' }}>
            <h2 style={{ fontSize: '1.25rem', fontWeight: '600', marginBottom: '1.5rem' }}>Description</h2>
            {editing ? (
              <textarea value={editDesc} onChange={e => setEditDesc(e.target.value)} style={{ width: '100%', minHeight: '120px', padding: '0.75rem', borderRadius: '8px', border: '1px solid var(--border-color)', fontFamily: 'Inter, sans-serif', fontSize: '0.95rem', resize: 'vertical', outline: 'none' }} />
            ) : (
              <p style={{ color: 'var(--text-secondary)', lineHeight: '1.6', fontSize: '0.95rem', marginBottom: '2rem' }}>{task.description || 'No description.'}</p>
            )}

            <div style={{ display: 'flex', gap: '4rem', paddingTop: '1.5rem', borderTop: '1px solid var(--border-color)' }}>
              <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                <div style={{ padding: '0.75rem', backgroundColor: '#eff6ff', borderRadius: 'var(--radius-md)', color: '#3b82f6' }}><CalendarIcon width={20} /></div>
                <div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', fontWeight: '500' }}>Created Date</div>
                  <div style={{ fontSize: '0.95rem', fontWeight: '600' }}>{task.createdAt ? new Date(task.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }) : '—'}</div>
                </div>
              </div>
              <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                <div style={{ padding: '0.75rem', backgroundColor: '#fef2f2', borderRadius: 'var(--radius-md)', color: '#ef4444' }}><CalendarIcon width={20} /></div>
                <div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', fontWeight: '500' }}>Deadline</div>
                  <div style={{ fontSize: '0.95rem', fontWeight: '600', color: '#ef4444' }}>{task.deadline || 'Not set'}</div>
                </div>
              </div>
            </div>
          </div>

          {/* Sub-tasks */}
          <div style={{ backgroundColor: 'var(--bg-surface)', padding: '2rem', borderRadius: 'var(--radius-xl)', border: '1px solid var(--border-color)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
              <h2 style={{ fontSize: '1.25rem', fontWeight: '600' }}>Sub-tasks</h2>
              {totalSubs > 0 && <div style={{ backgroundColor: '#f1f5f9', padding: '0.25rem 0.75rem', borderRadius: '20px', fontSize: '0.8rem', fontWeight: '600', color: 'var(--text-secondary)' }}>{completedCount}/{totalSubs} Completed</div>}
            </div>

            <div style={{ display: 'flex', flexDirection: 'column' }}>
              {(task.subTasks || []).map((subtask, index) => (
                <div key={subtask.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '1rem 0', borderBottom: index < totalSubs - 1 ? '1px solid var(--border-color)' : 'none' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', cursor: 'pointer' }} onClick={() => handleToggleSubtask(subtask.id)}>
                    <div style={{
                      width: '24px', height: '24px', borderRadius: '4px',
                      backgroundColor: subtask.completed ? '#14b8a6' : 'transparent',
                      border: subtask.completed ? 'none' : '2px solid var(--border-color)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white',
                      transition: 'all 0.2s ease'
                    }}>
                      {subtask.completed && <CheckIcon width={16} strokeWidth={3} />}
                    </div>
                    <span style={{ fontSize: '0.95rem', color: 'var(--text-primary)', fontWeight: '500', textDecoration: subtask.completed ? 'line-through' : 'none', opacity: subtask.completed ? 0.6 : 1 }}>{subtask.title}</span>
                  </div>
                </div>
              ))}

              <div style={{ display: 'flex', gap: '0.5rem', marginTop: '1rem' }}>
                <input
                  value={newSubtask}
                  onChange={e => setNewSubtask(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && handleAddSubtask()}
                  placeholder="Add a sub-task..."
                  style={{ flex: 1, padding: '0.75rem 1rem', borderRadius: '8px', border: '2px dashed var(--border-color)', fontFamily: 'Inter, sans-serif', fontSize: '0.9rem', outline: 'none' }}
                />
                <button onClick={handleAddSubtask} className="btn-primary" style={{ borderRadius: '8px' }}>Add</button>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <div style={{ backgroundColor: 'var(--bg-surface)', padding: '1.5rem', borderRadius: 'var(--radius-xl)', border: '1px solid var(--border-color)' }}>
            <h3 style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', fontWeight: '600', marginBottom: '0.75rem' }}>Current Status</h3>
            <select
              value={task.status}
              onChange={e => handleStatusChange(e.target.value)}
              style={{
                width: '100%', padding: '0.75rem 1rem', borderRadius: 'var(--radius-md)',
                border: 'none', fontFamily: 'Inter, sans-serif', fontWeight: '600', fontSize: '0.95rem', cursor: 'pointer', outline: 'none',
                backgroundColor: task.status === 'DONE' ? '#dcfce7' : task.status === 'IN PROGRESS' ? '#5eead4' : '#dbeafe',
                color: task.status === 'DONE' ? '#16a34a' : task.status === 'IN PROGRESS' ? '#0f766e' : '#2563eb'
              }}
            >
              <option value="TO-DO">To-Do</option>
              <option value="IN PROGRESS">In Progress</option>
              <option value="DONE">Done</option>
            </select>

            <h3 style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', fontWeight: '600', marginBottom: '0.75rem', marginTop: '1.5rem' }}>Priority Level</h3>
            <div style={{ backgroundColor: task.priority === 'High' ? '#fee2e2' : task.priority === 'Medium' ? '#fef3c7' : '#f1f5f9', padding: '0.75rem 1rem', borderRadius: 'var(--radius-md)', display: 'flex', alignItems: 'center', gap: '0.5rem', color: task.priority === 'High' ? '#b91c1c' : task.priority === 'Medium' ? '#92400e' : '#475569', fontWeight: '600', fontSize: '0.95rem' }}>
              <span style={{ fontWeight: 'bold', fontSize: '1.1rem' }}>!</span>
              {task.priority} Priority
            </div>
          </div>

          <div style={{ backgroundColor: 'var(--bg-surface)', borderRadius: 'var(--radius-xl)', border: '1px solid var(--border-color)', overflow: 'hidden' }}>
            <div style={{ height: '80px', background: 'linear-gradient(135deg, #2563eb 0%, #1e40af 100%)', padding: '1rem', display: 'flex', alignItems: 'flex-end' }}>
              <span style={{ backgroundColor: '#22d3ee', color: '#083344', fontSize: '0.7rem', fontWeight: '700', padding: '0.2rem 0.5rem', borderRadius: '4px' }}>
                {task.category || 'GENERAL'}
              </span>
            </div>
            <div style={{ padding: '1.5rem' }}>
              <h3 style={{ fontSize: '1.1rem', fontWeight: '600', marginBottom: '0.5rem' }}>{task.title}</h3>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: '1.5' }}>{task.description?.substring(0, 80) || 'No description'}...</p>
            </div>
          </div>

          <div style={{ backgroundColor: 'var(--bg-surface)', padding: '1.5rem', borderRadius: 'var(--radius-xl)', border: '1px solid var(--border-color)' }}>
            <h3 style={{ fontSize: '1.1rem', fontWeight: '600', marginBottom: '1rem' }}>Internal Notes</h3>
            <div style={{ backgroundColor: '#f8fafc', padding: '1.25rem', borderRadius: 'var(--radius-md)', borderLeft: '3px solid #3b82f6', marginBottom: '1rem' }}>
              <p style={{ fontStyle: 'italic', fontSize: '0.9rem', color: 'var(--text-secondary)', lineHeight: '1.6' }}>
                Notes for this task will appear here.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
