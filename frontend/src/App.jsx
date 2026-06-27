import { Routes, Route } from 'react-router-dom'
import Dashboard from './pages/Dashboard'
import TaskDetail from './pages/TaskDetail'
import Login from './pages/Login'

function App() {
  return (
    <div className="app-container">
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/" element={<Dashboard />} />
        <Route path="/task/:id" element={<TaskDetail />} />
      </Routes>
    </div>
  )
}

export default App
