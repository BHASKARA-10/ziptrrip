import { useState } from 'react';

export default function Settings() {
  const [settings, setSettings] = useState({
    theme: 'light',
    emailNotifications: true,
    pushNotifications: false,
    defaultView: 'dashboard',
  });

  const handleChange = (key, value) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  const handleSave = () => {
    alert('Settings saved successfully!');
  };

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      <div>
        <h1 style={{ fontSize: '2rem', fontWeight: 'bold' }}>Settings</h1>
        <p style={{ color: 'var(--text-secondary)' }}>Manage your account preferences and app settings.</p>
      </div>

      <div style={{ backgroundColor: 'var(--bg-surface)', padding: '2rem', borderRadius: 'var(--radius-xl)', border: '1px solid var(--border-color)', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
        <h2 style={{ fontSize: '1.25rem', fontWeight: '600', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.75rem' }}>Preferences</h2>
        
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <h3 style={{ fontSize: '1rem', fontWeight: '500' }}>Theme</h3>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Select your preferred app appearance.</p>
          </div>
          <select 
            value={settings.theme} 
            onChange={(e) => handleChange('theme', e.target.value)}
            style={{ padding: '0.5rem', borderRadius: '8px', border: '1px solid var(--border-color)', outline: 'none' }}
          >
            <option value="light">Light Mode</option>
            <option value="dark">Dark Mode</option>
            <option value="system">System Default</option>
          </select>
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <h3 style={{ fontSize: '1rem', fontWeight: '500' }}>Default View</h3>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Which page to show when you log in.</p>
          </div>
          <select 
            value={settings.defaultView} 
            onChange={(e) => handleChange('defaultView', e.target.value)}
            style={{ padding: '0.5rem', borderRadius: '8px', border: '1px solid var(--border-color)', outline: 'none' }}
          >
            <option value="dashboard">Dashboard</option>
            <option value="calendar">Calendar</option>
          </select>
        </div>
      </div>

      <div style={{ backgroundColor: 'var(--bg-surface)', padding: '2rem', borderRadius: 'var(--radius-xl)', border: '1px solid var(--border-color)', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
        <h2 style={{ fontSize: '1.25rem', fontWeight: '600', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.75rem' }}>Notifications</h2>
        
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <h3 style={{ fontSize: '1rem', fontWeight: '500' }}>Email Notifications</h3>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Receive daily task summaries via email.</p>
          </div>
          <input 
            type="checkbox" 
            checked={settings.emailNotifications} 
            onChange={(e) => handleChange('emailNotifications', e.target.checked)} 
            style={{ width: '20px', height: '20px', cursor: 'pointer' }}
          />
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <h3 style={{ fontSize: '1rem', fontWeight: '500' }}>Push Notifications</h3>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Get notified when a task deadline approaches.</p>
          </div>
          <input 
            type="checkbox" 
            checked={settings.pushNotifications} 
            onChange={(e) => handleChange('pushNotifications', e.target.checked)} 
            style={{ width: '20px', height: '20px', cursor: 'pointer' }}
          />
        </div>
      </div>

      <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
        <button onClick={handleSave} className="btn-primary" style={{ padding: '0.75rem 2rem', borderRadius: '8px' }}>
          Save Changes
        </button>
      </div>
    </div>
  );
}
