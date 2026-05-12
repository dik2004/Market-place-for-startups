import { useEffect, useState } from 'react'
import { useAuth } from '../context/AuthContext'
import { myStartups, createStartup } from '../api/startups'
import { myEOIs, startupEOIs, updateStatus } from '../api/eoi'

export default function Dashboard() {
  const { user } = useAuth()
  const [startups, setStartups] = useState([])
  const [eois,     setEois]     = useState([])
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState({
    name:'', tagline:'', domain:'', stage:'idea',
    funding_ask:'', team_size:'', description:''
  })

  useEffect(() => {
    if (user.role === 'founder') {
      myStartups().then(res => setStartups(res.data))
    }
    if (user.role === 'investor') {
      myEOIs().then(res => setEois(res.data))
    }
  }, [user])

  const loadEOIs = async (startupId) => {
    const res = await startupEOIs(startupId)
    setEois(res.data)
  }

const handleCreate = async (e) => {
    e.preventDefault()
    console.log('Form submitted:', form)
    try {
      const res = await createStartup(form)
      console.log('Created:', res.data)
      setStartups([...startups, res.data])
      setShowForm(false)
      setForm({ name:'', tagline:'', domain:'', stage:'idea', funding_ask:'', team_size:'', description:'' })
    } catch(err) {
      console.error('Error:', err.response?.data)
      alert(JSON.stringify(err.response?.data))
    }
  }

  const handleStatus = async (eoiId, status) => {
    await updateStatus(eoiId, status)
    setEois(eois.map(e => e._id === eoiId ? {...e, status} : e))
  }

  return (
    <div style={{background:'linear-gradient(135deg,#0f0c29,#302b63,#24243e)'}}
      className="min-h-screen px-6 py-10">
      <div className="max-w-5xl mx-auto">

        {/* Header */}
        <div className="mb-10">
          <h1 className="text-4xl font-black text-white mb-1">Dashboard</h1>
          <p className="text-gray-400">
            Welcome back, <span className="text-purple-400 font-semibold">{user.name}</span>
            <span className="ml-2 bg-purple-500 bg-opacity-20 border border-purple-500 border-opacity-40 text-purple-300 text-xs px-2 py-1 rounded-full capitalize">{user.role}</span>
          </p>
        </div>

        {/* FOUNDER VIEW */}
        {user.role === 'founder' && (
          <div>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-white">My Startups</h2>
              <button onClick={() => setShowForm(!showForm)}
                style={{background:'linear-gradient(135deg,#a855f7,#ec4899)'}}
                className="text-white px-5 py-2.5 rounded-xl font-semibold text-sm hover:opacity-90 transition-all">
                + New Startup
              </button>
            </div>

            {/* Create Form */}
            {showForm && (
              <form onSubmit={handleCreate}
                className="bg-white bg-opacity-5 border border-white border-opacity-10 rounded-2xl p-6 mb-6">
                <h3 className="text-white font-bold text-lg mb-4">Create New Startup</h3>
                <div className="grid grid-cols-2 gap-4">
                  {[
                    ['name','Startup Name'],
                    ['tagline','Tagline (max 120 chars)'],
                    ['domain','Domain (e.g. fintech)'],
                    ['funding_ask','Funding Ask (₹ lakhs)'],
                    ['team_size','Team Size'],
                  ].map(([key, label]) => (
                    <input key={key} required placeholder={label}
                      className="bg-white bg-opacity-10 border border-white border-opacity-20 text-white placeholder-gray-500 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-purple-500"
                      value={form[key]}
                      onChange={e => setForm({...form, [key]: e.target.value})}
                    />
                  ))}
                  <select
                    className="bg-gray-800 border border-white border-opacity-20 text-gray-300 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-purple-500"
                    value={form.stage}
                    onChange={e => setForm({...form, stage: e.target.value})}
                  >
                    <option value="idea">💡 Idea</option>
                    <option value="mvp">🛠 MVP</option>
                    <option value="growth">📈 Growth</option>
                  </select>
                  <textarea required placeholder="Description"
                    rows={3}
                    className="col-span-2 bg-white bg-opacity-10 border border-white border-opacity-20 text-white placeholder-gray-500 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-purple-500 resize-none"
                    value={form.description}
                    onChange={e => setForm({...form, description: e.target.value})}
                  />
                  <button type="submit"
                    style={{background:'linear-gradient(135deg,#a855f7,#ec4899)'}}
                    className="col-span-2 text-white py-3 rounded-xl font-bold hover:opacity-90 transition-all">
                    Create Startup 🚀
                  </button>
                </div>
              </form>
            )}

            {/* Startups List */}
            {startups.length === 0 ? (
              <div className="text-center py-20 bg-white bg-opacity-5 border border-white border-opacity-10 rounded-2xl">
                <div className="text-5xl mb-4">🚀</div>
                <p className="text-gray-400">No startups yet. Create your first one!</p>
              </div>
            ) : (
              <div className="space-y-4">
                {startups.map(s => (
                  <div key={s._id}
                    className="bg-white bg-opacity-5 border border-white border-opacity-10 rounded-2xl p-6">
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <h3 className="text-white font-bold text-lg">{s.name}</h3>
                        <p className="text-gray-400 text-sm">{s.tagline}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-gray-500 text-xs">{s.views || 0} views</p>
                        <span className="bg-purple-500 bg-opacity-20 text-purple-300 text-xs px-2 py-1 rounded-full capitalize">{s.stage}</span>
                      </div>
                    </div>
                    <button onClick={() => loadEOIs(s._id)}
                      className="text-purple-400 text-sm hover:text-purple-300 transition-colors font-semibold">
                      View EOIs →
                    </button>

                    {eois.length > 0 && (
                      <div className="mt-4 space-y-2">
                        {eois.map(eoi => (
                          <div key={eoi._id}
                            className="bg-white bg-opacity-5 rounded-xl p-4 flex justify-between items-center">
                            <p className="text-gray-300 text-sm flex-1 mr-4">{eoi.message}</p>
                            {eoi.status === 'pending' ? (
                              <div className="flex gap-2">
                                <button onClick={() => handleStatus(eoi._id, 'accepted')}
                                  className="bg-green-500 bg-opacity-20 text-green-300 border border-green-500 border-opacity-40 px-3 py-1 rounded-lg text-xs font-bold hover:bg-opacity-30 transition-all">
                                  Accept
                                </button>
                                <button onClick={() => handleStatus(eoi._id, 'rejected')}
                                  className="bg-red-500 bg-opacity-20 text-red-300 border border-red-500 border-opacity-40 px-3 py-1 rounded-lg text-xs font-bold hover:bg-opacity-30 transition-all">
                                  Reject
                                </button>
                              </div>
                            ) : (
                              <span className={`text-xs font-bold px-3 py-1 rounded-full capitalize ${
                                eoi.status === 'accepted'
                                  ? 'bg-green-500 bg-opacity-20 text-green-300'
                                  : 'bg-red-500 bg-opacity-20 text-red-300'
                              }`}>{eoi.status}</span>
                            )}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* INVESTOR VIEW */}
        {user.role === 'investor' && (
          <div>
            <h2 className="text-xl font-bold text-white mb-6">My Expressions of Interest</h2>
            {eois.length === 0 ? (
              <div className="text-center py-20 bg-white bg-opacity-5 border border-white border-opacity-10 rounded-2xl">
                <div className="text-5xl mb-4">💰</div>
                <p className="text-gray-400">No EOIs sent yet.</p>
                <p className="text-gray-600 text-sm mt-2">Discover startups and send your first EOI!</p>
              </div>
            ) : (
              <div className="space-y-4">
                {eois.map(eoi => (
                  <div key={eoi._id}
                    className="bg-white bg-opacity-5 border border-white border-opacity-10 rounded-2xl p-6 flex justify-between items-center">
                    <div>
                      <p className="text-gray-300 text-sm mb-1">{eoi.message}</p>
                      <p className="text-gray-600 text-xs">Startup ID: {eoi.startup_id}</p>
                    </div>
                    <span className={`text-xs font-bold px-3 py-1.5 rounded-full capitalize ${
                      eoi.status === 'pending'  ? 'bg-yellow-500 bg-opacity-20 text-yellow-300' :
                      eoi.status === 'accepted' ? 'bg-green-500 bg-opacity-20 text-green-300' :
                                                  'bg-red-500 bg-opacity-20 text-red-300'
                    }`}>{eoi.status}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}