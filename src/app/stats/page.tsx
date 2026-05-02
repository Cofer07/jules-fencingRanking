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

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="bg-white dark:bg-gray-900 rounded-3xl shadow-sm border dark:border-gray-800 p-8 space-y-4">
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <Trophy className="text-yellow-500" /> Club Medal Standings
          </h2>
          <div className="overflow-x-auto mt-4">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50 dark:bg-gray-950 border-b dark:border-gray-800 text-sm text-gray-500 dark:text-gray-400">
                  <th className="p-3 font-semibold">Rank</th>
                  <th className="p-3 font-semibold">Club</th>
                  <th className="p-3 font-semibold text-center text-yellow-600">🥇</th>
                  <th className="p-3 font-semibold text-center text-slate-500">🥈</th>
                  <th className="p-3 font-semibold text-center text-orange-600">🥉</th>
                  <th className="p-3 font-semibold text-center">Total</th>
                </tr>
              </thead>
              <tbody className="divide-y dark:divide-gray-800">
                {stats.medalTable && stats.medalTable.map((row: any, idx: number) => (
                  <tr key={row.club} className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors group">
                    <td className="p-3 font-bold text-gray-400">{idx + 1}</td>
                    <td className="p-3 font-bold">
                      <Link href={`/clubs/${encodeURIComponent(row.club)}`} className="hover:text-blue-500 transition-colors">
                        {row.club}
                      </Link>
                    </td>
                    <td className="p-3 text-center font-bold text-gray-700 dark:text-gray-300">{row.gold}</td>
                    <td className="p-3 text-center font-bold text-gray-700 dark:text-gray-300">{row.silver}</td>
                    <td className="p-3 text-center font-bold text-gray-700 dark:text-gray-300">{row.bronze}</td>
                    <td className="p-3 text-center font-black text-blue-600 dark:text-blue-400">{row.total}</td>
                  </tr>
                ))}
                {(!stats.medalTable || stats.medalTable.length === 0) && (
                  <tr>
                    <td colSpan={6} className="p-6 text-center text-gray-500 dark:text-gray-400">No medals awarded yet.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-900 rounded-3xl shadow-sm border dark:border-gray-800 p-8 space-y-4 h-fit">
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <Activity className="text-blue-500" /> Most Active Fencers
          </h2>
          <div className="space-y-3 mt-4">
            {stats.mostActive && stats.mostActive.map((f: any, idx: number) => (
              <Link key={f.id} href={`/fencer/${f.id}`} className="flex justify-between items-center bg-gray-50 dark:bg-gray-800 border dark:border-gray-700 p-4 rounded-xl hover:bg-blue-50 dark:hover:bg-blue-900/20 hover:border-blue-200 dark:hover:border-blue-800 transition-all group">
                <span className="font-bold text-gray-900 dark:text-gray-100 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                  {idx + 1}. {f.name}
                </span>
                <span className="bg-blue-100 dark:bg-blue-900/50 text-blue-700 dark:text-blue-300 px-3 py-1 rounded-md text-xs font-bold">
                  {f.events} events
                </span>
              </Link>
            ))}
            {(!stats.mostActive || stats.mostActive.length === 0) && (
              <div className="text-gray-500 dark:text-gray-400">No fencer data available yet.</div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
