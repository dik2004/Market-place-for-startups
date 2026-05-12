import { useState } from 'react'
import { aiMatch } from '../api/eoi'
import { Link } from 'react-router-dom'

export default function AIMatch() {
  const [form, setForm] = useState({
    domain: '', stage: '', ticket_size: '', interests: ''
  })
  const [results, setResults] = useState(null)
  const [loading, setLoading] = useState(false)
  const [err,     setErr]     = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setErr('')
    try {
      const res = await aiMatch(form)
      setResults(res.data.matches)
    } catch {
      setErr('AI matching failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{background:'linear-gradient(135deg,#0f0c29,#302b63,#24243e)'}}
      className="min-h-screen px-6 py-10">
      <div className="max-w-3xl mx-auto">

        {/* Header */}
        <div className="text-center mb-10">
          <div className="text-6xl mb-4">🤖</div>
          <h1 className="text-4xl font-black text-white mb-2">
            AI <span style={{background:'linear-gradient(90deg,#a855f7,#ec4899)'}}
              className="bg-clip-text text-transparent">Matchmaking</span>
          </h1>
          <p className="text-gray-400">Tell Claude AI your preferences and find your perfect startup match</p>
        </div>

        {/* Form */}
        <div className="bg-white bg-opacity-5 border border-white border-opacity-10 rounded-3xl p-8 mb-8">
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-gray-400 text-sm mb-2 block">Preferred Domain</label>
                <select required
                  className="w-full bg-gray-800 border border-white border-opacity-20 text-gray-300 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-purple-500"
                  value={form.domain}
                  onChange={e => setForm({...form, domain: e.target.value})}
                >
                  <option value="">Select domain</option>
                  {['fintech','edtech','healthtech','agritech','saas','deeptech'].map(d => (
                    <option key={d} value={d}>{d}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="text-gray-400 text-sm mb-2 block">Stage Preference</label>
                <select required
                  className="w-full bg-gray-800 border border-white border-opacity-20 text-gray-300 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-purple-500"
                  value={form.stage}
                  onChange={e => setForm({...form, stage: e.target.value})}
                >
                  <option value="">Select stage</option>
                  <option value="idea">💡 Idea</option>
                  <option value="mvp">🛠 MVP</option>
                  <option value="growth">📈 Growth</option>
                  <option value="any">✨ Any</option>
                </select>
              </div>
            </div>

            <div>
              <label className="text-gray-400 text-sm mb-2 block">Ticket Size (₹ lakhs)</label>
              <input required placeholder="e.g. 10-50"
                className="w-full bg-white bg-opacity-10 border border-white border-opacity-20 text-white placeholder-gray-500 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-purple-500"
                value={form.ticket_size}
                onChange={e => setForm({...form, ticket_size: e.target.value})}
              />
            </div>

            <div>
              <label className="text-gray-400 text-sm mb-2 block">Your Interests & Notes</label>
              <textarea required rows={4}
                placeholder="e.g. Looking for B2B SaaS with strong founding team, preferably IIT/NIT graduates with traction..."
                className="w-full bg-white bg-opacity-10 border border-white border-opacity-20 text-white placeholder-gray-500 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-purple-500 resize-none"
                value={form.interests}
                onChange={e => setForm({...form, interests: e.target.value})}
              />
            </div>

            {err && (
              <div className="bg-red-500 bg-opacity-20 border border-red-500 border-opacity-40 text-red-300 px-4 py-3 rounded-xl text-sm">
                {err}
              </div>
            )}

            <button type="submit" disabled={loading}
              style={{background:'linear-gradient(135deg,#a855f7,#ec4899)'}}
              className="w-full text-white py-4 rounded-xl font-bold text-lg hover:opacity-90 transition-all disabled:opacity-50">
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="animate-spin">⚙️</span> Claude AI is thinking...
                </span>
              ) : '🤖 Find My Best Matches'}
            </button>
          </form>
        </div>

        {/* Results */}
        {results && (
          <div>
            <h2 className="text-2xl font-black text-white mb-6 text-center">
              🎯 Your Top Matches
            </h2>
            <div className="space-y-4">
              {results.map((match, i) => (
                <div key={match.id}
                  className="bg-white bg-opacity-5 border border-white border-opacity-10 rounded-2xl p-6 hover:bg-opacity-10 transition-all">
                  <div className="flex justify-between items-start mb-3">
                    <div className="flex items-center gap-3">
                      <span className="text-2xl font-black text-gray-500">#{i+1}</span>
                      <h3 className="text-white font-bold text-xl">{match.name}</h3>
                    </div>
                    <div className="text-center">
                      <div style={{background:'linear-gradient(135deg,#a855f7,#ec4899)'}}
                        className="text-white text-lg font-black w-14 h-14 rounded-full flex items-center justify-center">
                        {match.score}
                      </div>
                      <p className="text-gray-500 text-xs mt-1">/ 10</p>
                    </div>
                  </div>
                  <p className="text-gray-300 text-sm leading-relaxed mb-4">{match.reason}</p>
                  <Link to={`/startup/${match.id}`}
                    className="text-purple-400 text-sm font-semibold hover:text-purple-300 transition-colors">
                    View Startup →
                  </Link>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}