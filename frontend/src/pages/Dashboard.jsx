import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { PlusIcon, PencilIcon, CheckIcon, TrashIcon } from '@heroicons/react/24/outline';

export default function Dashboard({ user }) {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(false);

  // Mock initial data based on design
  const todaysTasks = [
    { id: '1', title: 'Team Meeting', desc: 'Group discussion for the new product launch and roadmap review.', time: '10:00 AM', progress: 48, color: '#0d47a1', emoji: '🙌' },
    { id: '2', title: 'UI Design', desc: 'Create a high-fidelity homepage prototype for the Olakart App.', time: '11:00 AM', progress: 20, color: '#d32f2f', emoji: '🎨' }
  ];

  const timelineTasks = [
    { id: '3', title: 'Wireframing TaskFlow App', desc: 'Make some ideation from sketches and wireframes for the core navigation system.', time: '12:00 PM', status: 'TO-DO', color: 'red' },
    { id: '4', title: 'UI Design System', desc: 'Define tokens for typography, colors, and shadows for the enterprise library.', time: '1:30 PM', status: 'IN PROGRESS', color: 'blue' },
    { id: '5', title: 'Daily Scrums', desc: 'Updates on progress and blockers with the engineering team.', time: '9:00 AM', status: 'DONE', color: 'gray' },
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      
      {/* Header Section */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
        <div>
          <p style={{ color: 'var(--text-secondary)', marginBottom: '0.5rem' }}>Good Morning, {user?.name?.split(' ')[0] || 'User'}!</p>
          <h1 style={{ fontSize: '2rem', fontWeight: 'bold' }}>You have <span style={{ color: 'var(--primary-light)' }}>49 tasks</span> this month 👍</h1>
        </div>
        <button className="btn-primary" style={{ padding: '0.75rem 2rem', borderRadius: '30px' }}>
          <PlusIcon width={20} />
          Add Task
        </button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '2rem' }}>
        
        {/* Left Column */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
          
          {/* Today's Tasks */}
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
              <h2 style={{ fontSize: '1.25rem', fontWeight: '600' }}>Today's Tasks</h2>
              <a href="#" style={{ color: 'var(--primary-color)', textDecoration: 'none', fontWeight: '600', fontSize: '0.9rem' }}>See All</a>
            </div>
            
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              {todaysTasks.map(task => (
                <div key={task.id} style={{ 
                  backgroundColor: task.color, 
                  color: 'white', 
                  padding: '1.5rem', 
                  borderRadius: 'var(--radius-xl)',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '1rem',
                  boxShadow: 'var(--shadow-md)',
                  position: 'relative',
                  overflow: 'hidden'
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <h3 style={{ fontSize: '1.25rem', fontWeight: '600' }}>{task.title} {task.emoji}</h3>
                    <div style={{ cursor: 'pointer' }}>...</div>
                  </div>
                  <p style={{ fontSize: '0.9rem', opacity: 0.9, lineHeight: '1.4' }}>{task.desc}</p>
                  
                  <div style={{ marginTop: '1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.8rem', fontWeight: '600' }}>
                    <span>{task.time}</span>
                    <span>Progress: {task.progress}%</span>
                  </div>
                  <div style={{ width: '100%', backgroundColor: 'rgba(255,255,255,0.3)', height: '6px', borderRadius: '3px' }}>
                    <div style={{ width: \`\${task.progress}%\`, backgroundColor: 'white', height: '100%', borderRadius: '3px' }}></div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Weekly Timeline */}
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
              <h2 style={{ fontSize: '1.25rem', fontWeight: '600' }}>Weekly Timeline</h2>
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                {['Mon 11', 'Tue 12', 'Wed 13', 'Thu 14', 'Fri 15'].map(day => (
                  <div key={day} style={{ 
                    padding: '0.25rem 0.75rem', 
                    borderRadius: 'var(--radius-md)', 
                    backgroundColor: day === 'Thu 14' ? 'var(--primary-color)' : 'var(--border-color)',
                    color: day === 'Thu 14' ? 'white' : 'var(--text-secondary)',
                    fontSize: '0.8rem',
                    fontWeight: '600'
                  }}>
                    {day}
                  </div>
                ))}
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', position: 'relative' }}>
              {/* Timeline Line */}
              <div style={{ position: 'absolute', left: '6px', top: '20px', bottom: '20px', width: '2px', backgroundColor: 'var(--border-color)', zIndex: 0 }}></div>
              
              {timelineTasks.map(task => (
                <div key={task.id} style={{ display: 'flex', gap: '1rem', position: 'relative', zIndex: 1 }}>
                  <div style={{ marginTop: '1.5rem', width: '14px', height: '14px', borderRadius: '50%', backgroundColor: task.color, border: '3px solid var(--bg-main)' }}></div>
                  <div style={{ 
                    flex: 1, 
                    backgroundColor: 'var(--bg-surface)', 
                    padding: '1.25rem', 
                    borderRadius: 'var(--radius-lg)', 
                    border: '1px solid var(--border-color)',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    opacity: task.status === 'DONE' ? 0.6 : 1
                  }}>
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '0.5rem' }}>
                        <span style={{ 
                          fontSize: '0.7rem', 
                          fontWeight: '700', 
                          padding: '0.2rem 0.5rem', 
                          borderRadius: '4px',
                          backgroundColor: task.status === 'TO-DO' ? '#fee2e2' : task.status === 'IN PROGRESS' ? '#dbeafe' : '#f1f5f9',
                          color: task.status === 'TO-DO' ? '#ef4444' : task.status === 'IN PROGRESS' ? '#2563eb' : '#64748b',
                        }}>{task.status}</span>
                        <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                          <ClockIcon width={14} /> {task.time}
                        </span>
                      </div>
                      <Link to={\`/task/\${task.id}\`} style={{ textDecoration: 'none', color: 'inherit' }}>
                        <h4 style={{ fontSize: '1rem', fontWeight: '600', marginBottom: '0.25rem', textDecoration: task.status === 'DONE' ? 'line-through' : 'none' }}>{task.title}</h4>
                      </Link>
                      <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', textDecoration: task.status === 'DONE' ? 'line-through' : 'none' }}>{task.desc}</p>
                    </div>
                    
                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                      <button style={{ padding: '0.5rem', borderRadius: 'var(--radius-md)', border: 'none', backgroundColor: '#f1f5f9', cursor: 'pointer', color: 'var(--text-secondary)' }}><PencilIcon width={18} /></button>
                      <button style={{ padding: '0.5rem', borderRadius: 'var(--radius-md)', border: 'none', backgroundColor: task.status === 'DONE' ? '#22c55e' : '#f1f5f9', cursor: 'pointer', color: task.status === 'DONE' ? 'white' : 'var(--text-secondary)' }}><CheckIcon width={18} /></button>
                      <button style={{ padding: '0.5rem', borderRadius: 'var(--radius-md)', border: 'none', backgroundColor: '#f1f5f9', cursor: 'pointer', color: 'var(--text-secondary)' }}><TrashIcon width={18} /></button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* Right Column */}
        <div>
          <div style={{ backgroundColor: 'var(--bg-surface)', padding: '1.5rem', borderRadius: 'var(--radius-xl)', border: '1px solid var(--border-color)' }}>
            <h2 style={{ fontSize: '1.1rem', fontWeight: '600', marginBottom: '1.5rem' }}>Task Status</h2>
            
            <div style={{ display: 'flex', justifyContent: 'space-around', marginBottom: '2rem' }}>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem' }}>
                <div style={{ width: '48px', height: '48px', borderRadius: '50%', backgroundColor: '#f1f5f9', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--primary-color)' }}>
                  <ClockIcon width={24} />
                </div>
                <span style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', fontWeight: '500' }}>To-Do</span>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem' }}>
                <div style={{ width: '48px', height: '48px', borderRadius: '50%', backgroundColor: '#ccfbf1', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#0d9488' }}>
                  <div style={{ width: '20px', height: '4px', backgroundColor: '#0d9488', borderRadius: '2px' }}></div>
                </div>
                <span style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', fontWeight: '500' }}>Progress</span>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem' }}>
                <div style={{ width: '48px', height: '48px', borderRadius: '50%', backgroundColor: '#dcfce7', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#16a34a' }}>
                  <CheckIcon width={24} />
                </div>
                <span style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', fontWeight: '500' }}>Done</span>
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div style={{ padding: '1rem', borderRadius: 'var(--radius-lg)', border: '1px solid #e0e7ff', borderLeft: '4px solid #4f46e5', backgroundColor: '#ffffff', boxShadow: 'var(--shadow-sm)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.25rem' }}>
                  <div style={{ width: '24px', height: '24px', borderRadius: '50%', backgroundColor: '#e0e7ff', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#4f46e5' }}>
                    <ClockIcon width={14} />
                  </div>
                  <h4 style={{ fontSize: '0.95rem', fontWeight: '600' }}>Meeting with Stakeholders</h4>
                </div>
                <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginLeft: '2.25rem' }}>2:00 PM - 3:00 PM</p>
              </div>

              <div style={{ padding: '1rem', borderRadius: 'var(--radius-lg)', border: '1px solid #ccfbf1', borderLeft: '4px solid #14b8a6', backgroundColor: '#ffffff', boxShadow: 'var(--shadow-sm)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.25rem' }}>
                  <div style={{ width: '24px', height: '24px', borderRadius: '50%', backgroundColor: '#ccfbf1', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#14b8a6' }}>
                    <div style={{ width: '10px', height: '10px', borderRadius: '50%', border: '2px solid #14b8a6' }}></div>
                  </div>
                  <h4 style={{ fontSize: '0.95rem', fontWeight: '600' }}>Brainstorming Session</h4>
                </div>
                <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginLeft: '2.25rem' }}>4:30 PM - 5:30 PM</p>
              </div>
            </div>

          </div>
        </div>

      </div>

    </div>
  );
}
