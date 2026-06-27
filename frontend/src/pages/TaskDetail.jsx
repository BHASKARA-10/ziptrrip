import { useParams, Link, useNavigate } from 'react-router-dom';
import { ArrowLeftIcon, PencilIcon, TrashIcon, CalendarIcon, CheckIcon } from '@heroicons/react/24/outline';

export default function TaskDetail({ user }) {
  const { id } = useParams();
  const navigate = useNavigate();

  // Mock data for task detail matching the design exactly
  const task = {
    id: id || '1',
    title: 'UI Design System Refresh',
    category: 'Work',
    description: 'Redesign the core component library to align with the new brand guidelines. This includes updating all color tokens, refining the typography scale for better accessibility, and creating new interactive states for all button components. The goal is to reduce cognitive load and improve consistency across the entire platform.',
    createdDate: 'October 24, 2023',
    deadline: 'October 31, 2023 (In 3 Days)',
    status: 'In Progress',
    priority: 'High Priority',
    project: 'PROJECT ALPHA',
    projectDesc: 'Product Dashboard',
    projectSubDesc: 'The core task management hub for all internal workflows.',
    notes: '"Make sure to check the color contrast ratios against the WCAG 2.1 AA standards for all new brand colors before finalizing the library."',
    notesAuthor: 'Sarah K.',
    notesTime: '2 hours ago',
    subTasks: [
      { id: 1, title: 'Audit existing Figma library components', completed: true },
      { id: 2, title: 'Define new color palette using HCT color space', completed: true },
      { id: 3, title: 'Update button component interactions', completed: false },
      { id: 4, title: 'Publish updated documentation', completed: false }
    ]
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', maxWidth: '1200px', margin: '0 auto' }}>
      
      {/* Back button */}
      <button 
        onClick={() => navigate(-1)} 
        style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-secondary)', fontWeight: '500', fontSize: '0.9rem', padding: 0 }}
      >
        <ArrowLeftIcon width={18} /> Back
      </button>

      {/* Breadcrumb and Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-secondary)', fontSize: '0.85rem', fontWeight: '500', marginBottom: '0.5rem' }}>
            <span>Task Lists</span>
            <span>&gt;</span>
            <span>{task.category}</span>
          </div>
          <h1 style={{ fontSize: '2rem', fontWeight: 'bold' }}>{task.title}</h1>
        </div>
        <div style={{ display: 'flex', gap: '1rem' }}>
          <button className="btn-outline" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', borderRadius: '30px' }}>
            <PencilIcon width={16} /> Edit Task
          </button>
          <button className="btn-primary" style={{ backgroundColor: '#d32f2f', display: 'flex', alignItems: 'center', gap: '0.5rem', borderRadius: '30px' }}>
            <TrashIcon width={16} /> Delete
          </button>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '2rem', marginTop: '1rem' }}>
        
        {/* Left Column */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
          
          {/* Description Card */}
          <div style={{ backgroundColor: 'var(--bg-surface)', padding: '2rem', borderRadius: 'var(--radius-xl)', border: '1px solid var(--border-color)' }}>
            <h2 style={{ fontSize: '1.25rem', fontWeight: '600', marginBottom: '1.5rem' }}>Description</h2>
            <p style={{ color: 'var(--text-secondary)', lineHeight: '1.6', fontSize: '0.95rem', marginBottom: '2rem' }}>
              {task.description}
            </p>
            
            <div style={{ display: 'flex', gap: '4rem', paddingTop: '1.5rem', borderTop: '1px solid var(--border-color)' }}>
              <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                <div style={{ padding: '0.75rem', backgroundColor: '#eff6ff', borderRadius: 'var(--radius-md)', color: '#3b82f6' }}>
                  <CalendarIcon width={20} />
                </div>
                <div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', fontWeight: '500' }}>Created Date</div>
                  <div style={{ fontSize: '0.95rem', fontWeight: '600' }}>{task.createdDate}</div>
                </div>
              </div>
              
              <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                <div style={{ padding: '0.75rem', backgroundColor: '#fef2f2', borderRadius: 'var(--radius-md)', color: '#ef4444' }}>
                  <CalendarIcon width={20} />
                </div>
                <div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', fontWeight: '500' }}>Deadline</div>
                  <div style={{ fontSize: '0.95rem', fontWeight: '600', color: '#ef4444' }}>{task.deadline}</div>
                </div>
              </div>
            </div>
          </div>

          {/* Sub-tasks Card */}
          <div style={{ backgroundColor: 'var(--bg-surface)', padding: '2rem', borderRadius: 'var(--radius-xl)', border: '1px solid var(--border-color)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
              <h2 style={{ fontSize: '1.25rem', fontWeight: '600' }}>Sub-tasks</h2>
              <div style={{ backgroundColor: '#f1f5f9', padding: '0.25rem 0.75rem', borderRadius: '20px', fontSize: '0.8rem', fontWeight: '600', color: 'var(--text-secondary)' }}>
                {task.subTasks.filter(st => st.completed).length}/{task.subTasks.length} Completed
              </div>
            </div>
            
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              {task.subTasks.map((subtask, index) => (
                <div key={subtask.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '1rem 0', borderBottom: index < task.subTasks.length - 1 ? '1px solid var(--border-color)' : 'none' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <div style={{ 
                      width: '24px', height: '24px', borderRadius: '4px', 
                      backgroundColor: subtask.completed ? '#14b8a6' : 'transparent',
                      border: subtask.completed ? 'none' : '2px solid var(--border-color)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white',
                      cursor: 'pointer', transition: 'all 0.2s ease'
                    }}>
                      {subtask.completed && <CheckIcon width={16} strokeWidth={3} />}
                    </div>
                    <span style={{ fontSize: '0.95rem', color: 'var(--text-primary)', fontWeight: '500' }}>{subtask.title}</span>
                  </div>
                  <div style={{ color: 'var(--text-muted)', cursor: 'pointer', fontWeight: 'bold', fontSize: '1.25rem' }}>⋯</div>
                </div>
              ))}
              
              <button style={{ marginTop: '1rem', width: '100%', padding: '1rem', borderRadius: 'var(--radius-md)', border: '2px dashed var(--border-color)', backgroundColor: 'transparent', color: 'var(--text-secondary)', fontWeight: '600', cursor: 'pointer', transition: 'border-color 0.2s ease' }}>
                + Add Sub-task
              </button>
            </div>
          </div>

        </div>

        {/* Right Column */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          
          {/* Status & Priority Card */}
          <div style={{ backgroundColor: 'var(--bg-surface)', padding: '1.5rem', borderRadius: 'var(--radius-xl)', border: '1px solid var(--border-color)' }}>
            <div style={{ marginBottom: '1.5rem' }}>
              <h3 style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', fontWeight: '600', marginBottom: '0.75rem' }}>Current Status</h3>
              <div style={{ backgroundColor: '#5eead4', padding: '0.75rem 1rem', borderRadius: 'var(--radius-md)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', cursor: 'pointer' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#0f766e', fontWeight: '600', fontSize: '0.95rem' }}>
                  <div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#0f766e' }}></div>
                  {task.status}
                </div>
                <span style={{ color: '#0f766e' }}>▼</span>
              </div>
            </div>
            
            <div>
              <h3 style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', fontWeight: '600', marginBottom: '0.75rem' }}>Priority Level</h3>
              <div style={{ backgroundColor: '#fee2e2', padding: '0.75rem 1rem', borderRadius: 'var(--radius-md)', display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#b91c1c', fontWeight: '600', fontSize: '0.95rem' }}>
                <span style={{ fontWeight: 'bold', fontSize: '1.1rem' }}>!</span>
                {task.priority}
              </div>
            </div>
          </div>

          {/* Project Card */}
          <div style={{ backgroundColor: 'var(--bg-surface)', borderRadius: 'var(--radius-xl)', border: '1px solid var(--border-color)', overflow: 'hidden' }}>
            <div style={{ height: '80px', background: 'linear-gradient(135deg, #2563eb 0%, #1e40af 100%)', padding: '1rem', display: 'flex', alignItems: 'flex-end' }}>
              <span style={{ backgroundColor: '#22d3ee', color: '#083344', fontSize: '0.7rem', fontWeight: '700', padding: '0.2rem 0.5rem', borderRadius: '4px' }}>
                {task.project}
              </span>
            </div>
            <div style={{ padding: '1.5rem' }}>
              <h3 style={{ fontSize: '1.1rem', fontWeight: '600', marginBottom: '0.5rem' }}>{task.projectDesc}</h3>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: '1.5', marginBottom: '1.5rem' }}>{task.projectSubDesc}</p>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <div style={{ display: 'flex' }}>
                  {['#6366f1', '#f43f5e', '#10b981'].map((bgColor, i) => (
                    <div key={i} style={{ width: '28px', height: '28px', borderRadius: '50%', backgroundColor: bgColor, border: '2px solid white', marginLeft: i > 0 ? '-10px' : '0', zIndex: 3 - i }}></div>
                  ))}
                </div>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', fontWeight: '500', marginLeft: '0.5rem' }}>+12</span>
              </div>
            </div>
          </div>

          {/* Internal Notes Card */}
          <div style={{ backgroundColor: 'var(--bg-surface)', padding: '1.5rem', borderRadius: 'var(--radius-xl)', border: '1px solid var(--border-color)' }}>
            <h3 style={{ fontSize: '1.1rem', fontWeight: '600', marginBottom: '1rem' }}>Internal Notes</h3>
            <div style={{ backgroundColor: '#f8fafc', padding: '1.25rem', borderRadius: 'var(--radius-md)', borderLeft: '3px solid #3b82f6', marginBottom: '1rem' }}>
              <p style={{ fontStyle: 'italic', fontSize: '0.9rem', color: 'var(--text-secondary)', lineHeight: '1.6' }}>
                {task.notes}
              </p>
            </div>
            <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
              Last updated by {task.notesAuthor} {task.notesTime}
            </p>
          </div>

        </div>

      </div>
    </div>
  );
}
