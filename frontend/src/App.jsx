import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { useEffect, useState } from 'react';
import Dashboard from './pages/Dashboard';
import TaskDetail from './pages/TaskDetail';
import Login from './pages/Login';
import Calendar from './pages/Calendar';
import Settings from './pages/Settings';
import Sidebar from './components/Sidebar';
import TopNav from './components/TopNav';

function App() {
  const [user, setUser] = useState(null);
  const location = useLocation();

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    } else {
      setUser(null);
    }
  }, [location.pathname]);

  const isLoginPage = location.pathname === '/login';

  if (!user && !isLoginPage) {
    return <Navigate to="/login" replace />;
  }

  if (isLoginPage) {
    return <Routes><Route path="/login" element={<Login />} /></Routes>;
  }

  return (
    <div className="app-container">
      <Sidebar />
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', backgroundColor: 'var(--bg-main)', overflow: 'hidden' }}>
        <TopNav user={user} />
        <main style={{ flex: 1, overflowY: 'auto', padding: '2rem' }}>
          <Routes>
            <Route path="/" element={<Dashboard user={user} />} />
            <Route path="/task/:id" element={<TaskDetail user={user} />} />
            <Route path="/calendar" element={<Calendar user={user} />} />
            <Route path="/settings" element={<Settings />} />
            {/* Catch-all */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>
      </div>
    </div>
  );
}

export default App;
