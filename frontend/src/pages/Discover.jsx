import { useState, useEffect } from 'react'
import { getStartups } from '../api/startups'
import { Link } from 'react-router-dom'

const stageColors = {
  idea:   'bg-yellow-500 bg-opacity-20 text-yellow-300 border-yellow-500',
  mvp:    'bg-blue-500 bg-opacity-20 text-blue-300 border-blue-500',
  growth: 'bg-green-500 bg-opacity-20 text-green-300 border-green-500',
}

const domainIcons = {
  fintech: '💳', edtech: '📚', healthtech: '🏥',
  agritech: '🌾', saas: '☁️', ecommerce: '🛒', deeptech: '🤖'
}

export default function Discover() {
  const [startups, setStartups] = useState([])
  const [filters,  setFilters]  = useState({ search:'', domain:'', stage:'' })
  const [loading,  setLoading]  = useState(false)

  const fetchStartups = async () => {
    setLoading(true)
    try {
      const res = await getStartups(filters)
      setStartups(res.data.data || [])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchStartups() }, [])

  return (
    <div style={{background: 'linear-gradient(135deg, #0f0c29, #302b63, #24243e)'}}
      className="min-h-screen px-6 py-10">

      <div className="max-w-6xl mx-auto">

        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-black text-white mb-3">
            Discover <span style={{
  background: 'linear-gradient(90deg,#a855f7,#ec4899)',
  WebkitBackgroundClip: 'text',
  WebkitTextFillColor: 'transparent',
  backgroundClip: 'text'
}}>Startups</span>
          </h1>
          <p className="text-gray-400 text-lg">Find your next investment or collaboration</p>
        </div>

        {/* Filters */}
        <div className="bg-white bg-opacity-5 border border-white border-opacity-10 rounded-2xl p-5 mb-8 flex gap-3 flex-wrap items-center">
          <input
            className="bg-white bg-opacity-10 border border-white border-opacity-20 text-white placeholder-gray-500 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-purple-500 flex-1 min-w-48"
            placeholder="🔍 Search startups..."
            value={filters.search}
            onChange={e => setFilters({...filters, search: e.target.value})}
          />
          <select
            className="bg-gray-800 border border-white border-opacity-20 text-gray-300 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-purple-500"
            value={filters.domain}
            onChange={e => setFilters({...filters, domain: e.target.value})}
          >
            <option value="">All Domains</option>
            {['fintech','edtech','healthtech','agritech','saas','ecommerce','deeptech'].map(d => (
              <option key={d} value={d}>{domainIcons[d]} {d}</option>
            ))}
          </select>
          <select
            className="bg-gray-800 border border-white border-opacity-20 text-gray-300 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-purple-500"
            value={filters.stage}
            onChange={e => setFilters({...filters, stage: e.target.value})}
          >
            <option value="">All Stages</option>
            <option value="idea">💡 Idea</option>
            <option value="mvp">🛠 MVP</option>
            <option value="growth">📈 Growth</option>
          </select>
          <button
            onClick={fetchStartups}
            style={{background:'linear-gradient(135deg,#a855f7,#ec4899)'}}
            className="text-white px-6 py-2.5 rounded-xl font-semibold text-sm hover:opacity-90 transition-all">
            Search
          </button>
        </div>

        {/* Grid */}
        {loading ? (
          <div className="text-center py-20">
            <div className="text-5xl mb-4 animate-spin">⚙️</div>
            <p className="text-gray-400">Loading startups...</p>
          </div>
        ) : startups.length === 0 ? (
          <div className="text-center py-20">
            <div className="text-6xl mb-4">🔭</div>
            <p className="text-gray-400 text-lg">No startups found</p>
            <p className="text-gray-600 text-sm mt-2">Try different filters</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {startups.map(s => (
              <div key={s._id}
                className="bg-white bg-opacity-5 border border-white border-opacity-10 rounded-2xl p-6 hover:bg-opacity-10 transition-all duration-300 hover:-translate-y-1 transform group">

                <div className="flex justify-between items-start mb-3">
                  <div className="text-3xl">{domainIcons[s.domain] || '🚀'}</div>
                  {s.badge_verified && (
                    <span className="bg-orange-500 bg-opacity-20 border border-orange-500 border-opacity-40 text-orange-300 text-xs px-2 py-1 rounded-full font-bold">
                      🏛 DPIIT
                    </span>
                  )}
                </div>

                <h3 className="text-white font-bold text-lg mb-1 group-hover:text-purple-300 transition-colors">
                  {s.name}
                </h3>
                <p className="text-gray-400 text-sm mb-4 line-clamp-2">{s.tagline}</p>

                <div className="flex gap-2 flex-wrap mb-4">
                  <span className={`text-xs px-2.5 py-1 rounded-full border font-medium ${stageColors[s.stage] || 'bg-gray-500 bg-opacity-20 text-gray-300 border-gray-500'}`}>
                    {s.stage}
                  </span>
                  <span className="bg-purple-500 bg-opacity-20 border border-purple-500 border-opacity-40 text-purple-300 text-xs px-2.5 py-1 rounded-full font-medium">
                    {s.domain}
                  </span>
                  <span className="bg-pink-500 bg-opacity-20 border border-pink-500 border-opacity-40 text-pink-300 text-xs px-2.5 py-1 rounded-full font-medium">
                    ₹{s.funding_ask}L
                  </span>
                </div>

                <Link to={`/startup/${s._id}`}
                  className="text-purple-400 text-sm font-semibold hover:text-purple-300 transition-colors">
                  View Details →
                </Link>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}