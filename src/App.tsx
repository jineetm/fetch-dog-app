import { Routes, Route, Navigate } from 'react-router-dom'
import Login from './pages/Login'
import Search from './pages/Search'

function App() {
  return (
    <div className="min-h-screen bg-gray-50 text-gray-900">
      <Routes>
        {/* Default route to login */}
        <Route path="/" element={<Login />} />
        {/* Search page after successful login */}
        <Route path="/search" element={<Search />} />
        {/* Catch-all to redirect to login */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </div>
  )
}

export default App
