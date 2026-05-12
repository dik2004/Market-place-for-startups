import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { register } from '../api/auth'
import { useAuth } from '../context/AuthContext'

export default function Register() {
  const [form, setForm] = useState({ name:'', email:'', password:'', role:'founder' })
  const [err,  setErr]  = useState('')
  const [loading, setLoading] = useState(false)
  const { loginUser } = useAuth()
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      const res = await register(form)
      loginUser(res.data.token, res.data.user)
      navigate('/dashboard')
    } catch (e) {
      setErr(e.response?.data?.message || 'Registration failed')
    } finally {
      setLoading(false)
    }
  }

  const roles = [
    { value: 'founder',      icon: '🚀', label: 'Founder',      desc: 'I have a startup idea' },
    { value: 'investor',     icon: '💰', label: 'Investor',     desc: 'I want to invest' },
    { value: 'collaborator', icon: '🤝', label: 'Collaborator', desc: 'I want to join a team' },
  ]

  return (
    <div style={{background: 'linear-gradient(135deg, #0f0c29, #302b63, #24243e)'}}
      className="min-h-screen flex items-center justify-center px-4 py-10">

      <div className="w-full max-w-md">

        <div className="text-center mb-8">
          <Link to="/" className="text-4xl">🚀</Link>
          <h1 className="text-3xl font-black text-white mt-4 mb-2">Join LaunchPad</h1>
          <p className="text-gray-400">Create your free account today</p>
        </div>

        <div className="bg-white bg-opacity-5 border border-white border-opacity-10 rounded-3xl p-8 backdrop-blur-sm">

          {err && (
            <div className="bg-red-500 bg-opacity-20 border border-red-500 border-opacity-40 text-red-300 px-4 py-3 rounded-xl text-sm mb-6">
              {err}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="text-gray-400 text-sm mb-2 block">Full Name</label>
              <input
                required placeholder="Your name"
                className="w-full bg-white bg-opacity-10 border border-white border-opacity-20 text-white placeholder-gray-500 rounded-xl px-4 py-3 focus:outline-none focus:border-purple-500 transition-colors"
                value={form.name}
                onChange={e => setForm({...form, name: e.target.value})}
              />
            </div>
            <div>
              <label className="text-gray-400 text-sm mb-2 block">Email</label>
              <input
                type="email" required placeholder="you@example.com"
                className="w-full bg-white bg-opacity-10 border border-white border-opacity-20 text-white placeholder-gray-500 rounded-xl px-4 py-3 focus:outline-none focus:border-purple-500 transition-colors"
                value={form.email}
                onChange={e => setForm({...form, email: e.target.value})}
              />
            </div>
            <div>
              <label className="text-gray-400 text-sm mb-2 block">Password</label>
              <input
                type="password" required placeholder="Min 6 characters"
                className="w-full bg-white bg-opacity-10 border border-white border-opacity-20 text-white placeholder-gray-500 rounded-xl px-4 py-3 focus:outline-none focus:border-purple-500 transition-colors"
                value={form.password}
                onChange={e => setForm({...form, password: e.target.value})}
              />
            </div>

            {/* Role Selection */}
            <div>
              <label className="text-gray-400 text-sm mb-3 block">I am a...</label>
              <div className="grid grid-cols-3 gap-3">
                {roles.map(role => (
                  <button
                    key={role.value} type="button"
                    onClick={() => setForm({...form, role: role.value})}
                    className={`p-3 rounded-xl border text-center transition-all duration-200 ${
                      form.role === role.value
                        ? 'border-purple-500 bg-purple-500 bg-opacity-20 text-white'
                        : 'border-white border-opacity-20 text-gray-400 hover:border-purple-500 hover:border-opacity-50'
                    }`}>
                    <div className="text-2xl mb-1">{role.icon}</div>
                    <div className="text-xs font-bold">{role.label}</div>
                    <div className="text-xs opacity-60 mt-1 leading-tight">{role.desc}</div>
                  </button>
                ))}
              </div>
            </div>

            <button
              type="submit" disabled={loading}
              style={{background: 'linear-gradient(135deg, #a855f7, #ec4899)'}}
              className="w-full text-white py-3 rounded-xl font-bold text-lg hover:opacity-90 transition-all disabled:opacity-50 mt-2">
              {loading ? 'Creating account...' : 'Create Account 🚀'}
            </button>
          </form>
        </div>

        <p className="text-center text-gray-500 text-sm mt-6">
          Already have an account?{' '}
          <Link to="/login" className="text-purple-400 hover:text-purple-300 font-semibold">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  )
}