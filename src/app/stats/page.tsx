'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Activity, Swords, Users, Trophy } from 'lucide-react'

export default function StatsPage() {
  const [stats, setStats] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/stats/global')
      .then(res => res.json())
      .then(data => {
        setStats(data)
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [])

  if (loading) return <div className="p-8 text-center text-gray-500">Loading global statistics...</div>
  if (!stats) return <div className="p-8 text-center text-red-500">Failed to load stats.</div>

  return (
    <div className="max-w-5xl mx-auto space-y-8 animate-in fade-in duration-500">
      <div>
        <h1 className="text-3xl font-black tracking-tight">Global Insights</h1>
        <p className="text-gray-500 dark:text-gray-400 mt-1">High-level statistics across all Maritime fencing events.</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-gray-900 border dark:border-gray-800 p-6 rounded-2xl shadow-sm text-center">
          <Users className="w-8 h-8 text-blue-500 mx-auto mb-2" />
          <div className="text-3xl font-black text-gray-900 dark:text-white">{stats.totalFencers}</div>
          <div className="text-sm font-bold text-gray-500 uppercase tracking-wider">Fencers</div>
        </div>
        <div className="bg-white dark:bg-gray-900 border dark:border-gray-800 p-6 rounded-2xl shadow-sm text-center">
          <Trophy className="w-8 h-8 text-yellow-500 mx-auto mb-2" />
          <div className="text-3xl font-black text-gray-900 dark:text-white">{stats.totalClubs}</div>
          <div className="text-sm font-bold text-gray-500 uppercase tracking-wider">Clubs</div>
        </div>
        <div className="bg-white dark:bg-gray-900 border dark:border-gray-800 p-6 rounded-2xl shadow-sm text-center">
          <Activity className="w-8 h-8 text-emerald-500 mx-auto mb-2" />
          <div className="text-3xl font-black text-gray-900 dark:text-white">{stats.totalTournaments}</div>
          <div className="text-sm font-bold text-gray-500 uppercase tracking-wider">Tournaments</div>
        </div>
        <div className="bg-white dark:bg-gray-900 border dark:border-gray-800 p-6 rounded-2xl shadow-sm text-center">
          <Swords className="w-8 h-8 text-purple-500 mx-auto mb-2" />
          <div className="text-3xl font-black text-gray-900 dark:text-white">{stats.totalEvents}</div>
          <div className="text-sm font-bold text-gray-500 uppercase tracking-wider">Events Fenced</div>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-900 rounded-3xl shadow-sm border dark:border-gray-800 p-8 space-y-4">
        <h2 className="text-2xl font-bold flex items-center gap-2">
          <Activity className="text-blue-500" /> Most Active Fencers
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
          {stats.mostActive && stats.mostActive.map((f: any, idx: number) => (
            <Link key={f.id} href={`/fencer/${f.id}`} className="block bg-gray-50 dark:bg-gray-800 border dark:border-gray-700 p-4 rounded-xl hover:bg-blue-50 dark:hover:bg-blue-900/20 hover:border-blue-200 dark:hover:border-blue-800 transition-all group">
              <div className="flex justify-between items-center">
                <span className="font-bold text-gray-900 dark:text-gray-100 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                  {idx + 1}. {f.name}
                </span>
                <span className="bg-blue-100 dark:bg-blue-900/50 text-blue-700 dark:text-blue-300 px-2 py-1 rounded-md text-xs font-bold">
                  {f.events} events
                </span>
              </div>
            </Link>
          ))}
          {(!stats.mostActive || stats.mostActive.length === 0) && (
            <div className="text-gray-500 dark:text-gray-400">No fencer data available yet.</div>
          )}
        </div>
      </div>
    </div>
  )
}
