import { useState, useRef, useEffect } from 'react';
import { ClockIcon } from '@heroicons/react/24/outline';

export default function CircularTimePicker({ value, onChange }) {
  const [isOpen, setIsOpen] = useState(false);
  const [mode, setMode] = useState('hours'); // 'hours' or 'minutes'
  const [isAm, setIsAm] = useState(true);
  
  // Parse initial value
  const [hour, setHour] = useState(12);
  const [minute, setMinute] = useState(0);

  const containerRef = useRef(null);

  useEffect(() => {
    if (value) {
      const [h, m] = value.split(':').map(Number);
      if (!isNaN(h) && !isNaN(m)) {
        setIsAm(h < 12);
        setHour(h % 12 || 12);
        setMinute(m);
      }
    }
  }, [value]);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleApply = () => {
    let finalHour = hour;
    if (isAm && finalHour === 12) finalHour = 0;
    if (!isAm && finalHour < 12) finalHour += 12;
    
    const formattedHour = String(finalHour).padStart(2, '0');
    const formattedMinute = String(minute).padStart(2, '0');
    onChange(`${formattedHour}:${formattedMinute}`);
    setIsOpen(false);
  };

  const renderDial = () => {
    const numbers = mode === 'hours' ? [12, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11] : [0, 5, 10, 15, 20, 25, 30, 35, 40, 45, 50, 55];
    const radius = 90;
    const center = 110;

    return (
      <div style={{ position: 'relative', width: '220px', height: '220px', borderRadius: '50%', backgroundColor: '#f1f5f9', margin: '0 auto' }}>
        {/* Center dot */}
        <div style={{ position: 'absolute', width: '8px', height: '8px', backgroundColor: 'var(--primary-color)', borderRadius: '50%', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', zIndex: 10 }}></div>
        
        {/* Hand */}
        {(() => {
          const val = mode === 'hours' ? hour : minute;
          const max = mode === 'hours' ? 12 : 60;
          const angle = (val / max) * 360 - 90;
          return (
            <div style={{
              position: 'absolute', top: '50%', left: '50%', width: '35%', height: '2px',
              backgroundColor: 'var(--primary-color)', transformOrigin: '0 50%',
              transform: `translateY(-50%) rotate(${angle}deg)`, zIndex: 5
            }}>
              <div style={{ position: 'absolute', right: '-12px', top: '-12px', width: '24px', height: '24px', backgroundColor: 'var(--primary-color)', borderRadius: '50%', opacity: 0.5 }}></div>
            </div>
          );
        })()}

        {numbers.map((num, i) => {
          const angle = (i * 30 - 90) * (Math.PI / 180);
          const x = center + radius * Math.cos(angle);
          const y = center + radius * Math.sin(angle);
          const isSelected = mode === 'hours' ? (hour % 12 === num % 12) : (minute === num);

          return (
            <div key={num}
              onClick={() => {
                if (mode === 'hours') {
                  setHour(num);
                  setTimeout(() => setMode('minutes'), 300);
                } else {
                  setMinute(num);
                }
              }}
              style={{
                position: 'absolute', left: `${x}px`, top: `${y}px`, transform: 'translate(-50%, -50%)',
                width: '32px', height: '32px', display: 'flex', alignItems: 'center', justifyContent: 'center',
                borderRadius: '50%', cursor: 'pointer', zIndex: 10, fontSize: '0.9rem',
                backgroundColor: isSelected ? 'var(--primary-color)' : 'transparent',
                color: isSelected ? 'white' : 'var(--text-primary)',
                transition: 'all 0.2s'
              }}
            >
              {mode === 'minutes' ? String(num).padStart(2, '0') : num}
            </div>
          );
        })}
      </div>
    );
  };

  const displayValue = () => {
    if (!value) return '';
    let [h, m] = value.split(':').map(Number);
    const ampm = h >= 12 ? 'PM' : 'AM';
    h = h % 12 || 12;
    return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')} ${ampm}`;
  };

  return (
    <div style={{ position: 'relative' }} ref={containerRef}>
      <div 
        onClick={() => setIsOpen(!isOpen)}
        style={{
          width: '100%', padding: '0.75rem 1rem', borderRadius: '8px', border: '1px solid #e2e8f0', 
          fontFamily: 'Inter, sans-serif', fontSize: '0.9rem', outline: 'none', backgroundColor: 'white',
          display: 'flex', justifyContent: 'space-between', alignItems: 'center', cursor: 'pointer'
        }}
      >
        <span style={{ color: value ? 'var(--text-primary)' : '#94a3b8' }}>
          {displayValue() || '--:--'}
        </span>
        <ClockIcon width={18} style={{ color: 'var(--text-secondary)' }} />
      </div>

      {isOpen && (
        <div style={{
          position: 'absolute', top: '100%', left: 0, marginTop: '0.5rem', zIndex: 100,
          backgroundColor: 'white', padding: '1.5rem', borderRadius: 'var(--radius-xl)',
          boxShadow: 'var(--shadow-lg)', border: '1px solid var(--border-color)', width: '280px'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
            <div style={{ display: 'flex', gap: '0.5rem', fontSize: '1.5rem', fontWeight: 'bold' }}>
              <span onClick={() => setMode('hours')} style={{ cursor: 'pointer', color: mode === 'hours' ? 'var(--primary-color)' : 'var(--text-secondary)' }}>
                {String(hour).padStart(2, '0')}
              </span>
              <span>:</span>
              <span onClick={() => setMode('minutes')} style={{ cursor: 'pointer', color: mode === 'minutes' ? 'var(--primary-color)' : 'var(--text-secondary)' }}>
                {String(minute).padStart(2, '0')}
              </span>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
              <button type="button" onClick={() => setIsAm(true)} style={{ background: isAm ? 'var(--primary-light)' : 'transparent', color: isAm ? 'white' : 'var(--text-secondary)', border: 'none', borderRadius: '4px', padding: '0.2rem 0.5rem', fontSize: '0.75rem', fontWeight: 'bold', cursor: 'pointer' }}>AM</button>
              <button type="button" onClick={() => setIsAm(false)} style={{ background: !isAm ? 'var(--primary-light)' : 'transparent', color: !isAm ? 'white' : 'var(--text-secondary)', border: 'none', borderRadius: '4px', padding: '0.2rem 0.5rem', fontSize: '0.75rem', fontWeight: 'bold', cursor: 'pointer' }}>PM</button>
            </div>
          </div>

          {renderDial()}

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem', marginTop: '1.5rem' }}>
            <button type="button" onClick={() => setIsOpen(false)} style={{ background: 'none', border: 'none', color: 'var(--text-secondary)', fontWeight: '600', cursor: 'pointer' }}>Cancel</button>
            <button type="button" onClick={handleApply} style={{ background: 'none', border: 'none', color: 'var(--primary-color)', fontWeight: '600', cursor: 'pointer' }}>OK</button>
          </div>
        </div>
      )}
    </div>
  );
}
