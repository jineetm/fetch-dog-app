import { useState } from 'react'
import fetchClient from '../api/fetchClient'
import { useNavigate } from 'react-router-dom'

const Login = () => {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [error, setError] = useState('')
  const navigate = useNavigate()

  const handleLogin = async () => {
    try {
      await fetchClient.post('/auth/login', { name, email })
      navigate('/search')
    } catch (err) {
      setError('Login failed. Please check your credentials.')
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 to-indigo-100 flex items-center justify-center px-4">
      <div className="bg-white shadow-xl rounded-xl p-8 max-w-md w-full space-y-6">
        <h1 className="text-3xl font-bold text-center text-indigo-600">🐶 Welcome to Fetch Dog Adoption App!</h1>
        <p className="text-center text-gray-500 text-sm">Find your forever friend today.</p>

        {error && (
          <p className="text-red-500 text-sm text-center border border-red-200 rounded p-2 bg-red-50">
            {error}
          </p>
        )}

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-400"
              placeholder="Enter your name"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-400"
              placeholder="Enter your email"
            />
          </div>

          <button
            onClick={handleLogin}
            disabled={!name || !email}
            className="w-full bg-indigo-600 text-white font-semibold py-2 rounded-md hover:bg-indigo-700 transition disabled:opacity-50"
          >
            Log In
          </button>
        </div>
      </div>
    </div>
  )
}

export default Login
