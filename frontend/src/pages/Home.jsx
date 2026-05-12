import { Link } from 'react-router-dom'
import { useEffect, useState } from 'react'

export default function Home() {
  const [count, setCount] = useState(0)

  useEffect(() => {
    const target = 500
    const step = Math.ceil(target / 60)
    const timer = setInterval(() => {
      setCount(prev => {
        if (prev + step >= target) { clearInterval(timer); return target }
        return prev + step
      })
    }, 30)
    return () => clearInterval(timer)
  }, [])

  return (
    <div style={{background: 'linear-gradient(135deg, #0f0c29 0%, #302b63 50%, #24243e 100%)'}}
      className="min-h-screen">

      {/* Hero Section */}
      <div className="max-w-7xl mx-auto px-6 pt-24 pb-20 text-center">

        <div className="inline-block bg-purple-500 bg-opacity-20 border border-purple-500 border-opacity-40 text-purple-300 text-xs font-bold px-4 py-2 rounded-full mb-8 tracking-widest uppercase">
          ✦ SIH 2019 · DIPP Recognised Platform
        </div>

        <h1 className="text-6xl md:text-7xl font-black text-white mb-6 leading-tight">
          Where Startups Meet<br />
          <span style={{
  background: 'linear-gradient(90deg, #a855f7, #ec4899, #f97316)',
  WebkitBackgroundClip: 'text',
  WebkitTextFillColor: 'transparent',
  backgroundClip: 'text'
}}>
  Their Perfect Match
</span>
        </h1>

        <p className="text-xl text-gray-400 max-w-2xl mx-auto mb-12 leading-relaxed">
          LaunchPad connects DIPP-recognised startups with investors, collaborators,
          and early adopters — powered by AI matchmaking.
        </p>

        <div className="flex gap-4 justify-center flex-wrap mb-20">
          <Link to="/discover"
            style={{background: 'linear-gradient(135deg, #a855f7, #ec4899)'}}
            className="text-white px-8 py-4 rounded-full font-bold text-lg hover:opacity-90 transition-all duration-200 hover:shadow-2xl hover:shadow-purple-500/40 hover:-translate-y-1 transform">
            Explore Startups →
          </Link>
          <Link to="/register"
            className="border border-purple-500 border-opacity-50 text-purple-300 px-8 py-4 rounded-full font-bold text-lg hover:bg-purple-500 hover:bg-opacity-10 transition-all duration-200">
            Join as Investor
          </Link>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-8 max-w-2xl mx-auto mb-24">
          {[
            { value: count + '+', label: 'Startups Listed' },
            { value: '₹2Cr+',     label: 'Funding Connected' },
            { value: '3',         label: 'Roles Supported' },
          ].map(stat => (
            <div key={stat.label}
              className="bg-white bg-opacity-5 border border-white border-opacity-10 rounded-2xl p-6 backdrop-blur-sm">
              <div className="text-3xl font-black text-white mb-1">{stat.value}</div>
              <div className="text-gray-400 text-sm">{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Features */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {[
            {
              icon: '🎯',
              title: 'Smart Discovery',
              desc: 'Filter startups by domain, stage, and funding range. Find exactly what you\'re looking for.'
            },
            {
              icon: '🤖',
              title: 'AI Matchmaking',
              desc: 'Claude AI analyzes investor profiles and recommends the best startup matches with reasoning.'
            },
            {
              icon: '🏛',
              title: 'DPIIT Recognised',
              desc: 'Verified DIPP/DPIIT badges for government-recognised startups. Trust and credibility built-in.'
            },
          ].map(feature => (
            <div key={feature.title}
              className="bg-white bg-opacity-5 border border-white border-opacity-10 rounded-2xl p-8 text-left hover:bg-opacity-10 transition-all duration-300 hover:-translate-y-1 transform backdrop-blur-sm">
              <div className="text-4xl mb-4">{feature.icon}</div>
              <h3 className="text-white font-bold text-lg mb-2">{feature.title}</h3>
              <p className="text-gray-400 text-sm leading-relaxed">{feature.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* CTA */}
      <div className="border-t border-white border-opacity-10 py-16 text-center">
        <h2 className="text-3xl font-black text-white mb-4">Ready to Launch?</h2>
        <p className="text-gray-400 mb-8">Join hundreds of founders and investors on LaunchPad</p>
        <Link to="/register"
          style={{background: 'linear-gradient(135deg, #a855f7, #ec4899)'}}
          className="text-white px-10 py-4 rounded-full font-bold text-lg hover:opacity-90 transition-all hover:shadow-2xl hover:shadow-purple-500/40">
          Create Free Account
        </Link>
      </div>
    </div>
  )
}