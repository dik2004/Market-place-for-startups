import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { getStartup } from '../api/startups'
import { sendEOI } from '../api/eoi'
import { useAuth } from '../context/AuthContext'

export default function StartupProfile() {
  const { id } = useParams()
  const { user } = useAuth()
  const [startup, setStartup] = useState(null)
  const [msg,     setMsg]     = useState('')
  const [sent,    setSent]    = useState(false)
  const [open,    setOpen]    = useState(false)
  const [err,     setErr]     = useState('')

  useEffect(() => {
    getStartup(id).then(res => setStartup(res.data))
  }, [id])

  const handleEOI = async () => {
    try {
      await sendEOI({ startup_id: id, message: msg })
      setSent(true)
      setOpen(false)
    } catch (e) {
      setErr(e.response?.data?.message || 'Error sending EOI')
    }
  }

  if (!startup) return (
    <div style={{background:'linear-gradient(135deg,#0f0c29,#302b63,#24243e)'}}
      className="min-h-screen flex items-center justify-center">
      <div className="text-5xl animate-spin">⚙️</div>
    </div>
  )

  const stageColor = {
    idea:   'bg-yellow-500 bg-opacity-20 text-yellow-300 border-yellow-500',
    mvp:    'bg-blue-500 bg-opacity-20 text-blue-300 border-blue-500',
    growth: 'bg-green-500 bg-opacity-20 text-green-300 border-green-500',
  }

  return (
    <div style={{background:'linear-gradient(135deg,#0f0c29,#302b63,#24243e)'}}
      className="min-h-screen px-6 py-10">
      <div className="max-w-3xl mx-auto">

        {/* Header Card */}
        <div className="bg-white bg-opacity-5 border border-white border-opacity-10 rounded-3xl p-8 mb-6">
          <div className="flex justify-between items-start mb-4">
            <h1 className="text-4xl font-black text-white">{startup.name}</h1>
            {startup.badge_verified && (
              <span className="bg-orange-500 bg-opacity-20 border border-orange-500 border-opacity-40 text-orange-300 text-sm px-3 py-1.5 rounded-full font-bold">
                🏛 DPIIT Recognised
              </span>
            )}
          </div>
          <p className="text-gray-300 text-lg mb-6">{startup.tagline}</p>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { label: 'Domain',       value: startup.domain },
              { label: 'Stage',        value: startup.stage },
              { label: 'Funding Ask',  value: `₹${startup.funding_ask}L` },
              { label: 'Team Size',    value: startup.team_size || 'N/A' },
            ].map(item => (
              <div key={item.label}
                className="bg-white bg-opacity-5 border border-white border-opacity-10 rounded-xl p-4 text-center">
                <p className="text-gray-500 text-xs mb-1 uppercase tracking-wider">{item.label}</p>
                <p className="text-white font-bold capitalize">{item.value}</p>
              </div>
            ))}
          </div>
        </div>

        {/* About */}
        <div className="bg-white bg-opacity-5 border border-white border-opacity-10 rounded-3xl p-8 mb-6">
          <h2 className="text-white font-bold text-xl mb-4">About</h2>
          <p className="text-gray-300 leading-relaxed">{startup.description}</p>
        </div>

        {/* Tags */}
        {startup.tags?.length > 0 && (
          <div className="flex gap-2 flex-wrap mb-6">
            {startup.tags.map(t => (
              <span key={t}
                className="bg-purple-500 bg-opacity-20 border border-purple-500 border-opacity-40 text-purple-300 text-sm px-3 py-1.5 rounded-full">
                #{t}
              </span>
            ))}
          </div>
        )}

        {/* Pitch Deck */}
        {startup.pitch_deck_url && (
          <a href={startup.pitch_deck_url} target="_blank" rel="noreferrer"
            className="inline-block bg-white bg-opacity-5 border border-white border-opacity-10 text-gray-300 px-5 py-3 rounded-xl text-sm hover:bg-opacity-10 transition-all mb-6">
            📄 View Pitch Deck
          </a>
        )}

        {/* EOI Section */}
        {user && user.role === 'investor' && (
          <div className="bg-white bg-opacity-5 border border-white border-opacity-10 rounded-3xl p-8">
            <h2 className="text-white font-bold text-xl mb-4">Express Interest</h2>
            {sent ? (
              <div className="bg-green-500 bg-opacity-20 border border-green-500 border-opacity-40 text-green-300 px-4 py-3 rounded-xl">
                ✅ Your EOI has been sent successfully!
              </div>
            ) : !open ? (
              <button onClick={() => setOpen(true)}
                style={{background:'linear-gradient(135deg,#a855f7,#ec4899)'}}
                className="text-white px-8 py-3 rounded-xl font-bold hover:opacity-90 transition-all">
                Send Expression of Interest
              </button>
            ) : (
              <div className="space-y-4">
                <textarea
                  className="w-full bg-white bg-opacity-10 border border-white border-opacity-20 text-white placeholder-gray-500 rounded-xl px-4 py-3 text-sm resize-none focus:outline-none focus:border-purple-500"
                  rows={4}
                  placeholder="Why are you interested in this startup? (max 500 chars)"
                  maxLength={500}
                  value={msg}
                  onChange={e => setMsg(e.target.value)}
                />
                {err && <p className="text-red-400 text-sm">{err}</p>}
                <div className="flex gap-3">
                  <button onClick={handleEOI}
                    style={{background:'linear-gradient(135deg,#a855f7,#ec4899)'}}
                    className="text-white px-6 py-2.5 rounded-xl font-bold hover:opacity-90 transition-all">
                    Send EOI
                  </button>
                  <button onClick={() => setOpen(false)}
                    className="text-gray-400 hover:text-white transition-colors px-4">
                    Cancel
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}