import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { logout } from '../api/auth'

export default function Navbar() {
  const { user, logoutUser } = useAuth()
  const navigate = useNavigate()

  const handleLogout = async () => {
    await logout()
    logoutUser()
    navigate('/')
  }

  return (
    <nav style={{background: 'linear-gradient(135deg, #0f0c29, #302b63, #24243e)'}}
      className="px-6 py-4 flex justify-between items-center shadow-2xl sticky top-0 z-50">

      <Link to="/" className="flex items-center gap-2">
        <span className="text-2xl">🚀</span>
        <span className="text-white font-black text-xl tracking-tight">
          Launch<span className="text-purple-400">Pad</span>
        </span>
      </Link>

      <div className="flex gap-6 items-center text-sm font-medium">
        <Link to="/discover"
          className="text-gray-300 hover:text-purple-400 transition-colors duration-200">
          Discover
        </Link>

        {user ? (
          <>
            <Link to="/dashboard"
              className="text-gray-300 hover:text-purple-400 transition-colors duration-200">
              Dashboard
            </Link>
            {user.role === 'investor' && (
              <Link to="/ai-match"
                className="text-gray-300 hover:text-purple-400 transition-colors duration-200">
                🤖 AI Match
              </Link>
            )}
            <span className="bg-purple-500 bg-opacity-30 text-purple-300 border border-purple-500 px-3 py-1 rounded-full text-xs font-bold capitalize">
              {user.role}
            </span>
            <button onClick={handleLogout}
              className="text-red-400 hover:text-red-300 transition-colors duration-200">
              Logout
            </button>
          </>
        ) : (
          <>
            <Link to="/login"
              className="text-gray-300 hover:text-purple-400 transition-colors duration-200">
              Login
            </Link>
            <Link to="/register"
              className="bg-purple-600 hover:bg-purple-500 text-white px-5 py-2 rounded-full font-semibold transition-all duration-200 hover:shadow-lg hover:shadow-purple-500/30">
              Get Started
            </Link>
          </>
        )}
      </div>
    </nav>
  )
}