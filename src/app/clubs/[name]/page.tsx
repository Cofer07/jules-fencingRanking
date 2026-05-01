'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import { ChevronLeft, Users, Trophy, Target } from 'lucide-react'

export default function ClubProfile() {
  const { name } = useParams()
  const decodedName = decodeURIComponent(name as string)
  const [club, setClub] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch(`/api/clubs/${encodeURIComponent(decodedName)}`)
      .then(res => res.json())
      .then(data => {
        setClub(data)
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [decodedName])

  if (loading) return <div className="p-8 text-center text-gray-500">Loading club details...</div>
  if (!club || club.error) return <div className="p-8 text-center text-red-500">Club not found.</div>

  return (
    <div className="max-w-5xl mx-auto space-y-8 animate-in fade-in duration-500">
      <Link href="/rankings" className="inline-flex items-center text-sm font-semibold text-gray-500 hover:text-gray-900 dark:hover:text-gray-100 transition-colors">
        <ChevronLeft className="w-4 h-4 mr-1" /> Back to Rankings
      </Link>

      <div className="bg-white dark:bg-gray-900 rounded-3xl shadow-sm border dark:border-gray-800 p-8 flex flex-col md:flex-row justify-between items-center gap-8">
        <div>
          <h1 className="text-4xl font-black tracking-tight text-gray-900 dark:text-white">{club.name}</h1>
          <div className="flex flex-wrap gap-6 text-gray-600 dark:text-gray-400 mt-4">
            <div className="flex items-center gap-2">
              <Users className="w-5 h-5 text-blue-500" />
              <span className="font-medium">{club.fencerCount} Active Fencers</span>
            </div>
            <div className="flex items-center gap-2">
              <Trophy className="w-5 h-5 text-yellow-500" />
              <span className="font-medium">{Math.round(club.totalPoints * 10) / 10} Total Points</span>
            </div>
          </div>
        </div>
        
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 w-full md:w-auto">
          <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-900/50 p-4 rounded-xl text-center">
            <div className="text-2xl font-black text-yellow-600 dark:text-yellow-500">{club.medals.gold}</div>
            <div className="text-xs font-bold text-yellow-800/60 dark:text-yellow-600 uppercase tracking-wider">Gold</div>
          </div>
          <div className="bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 p-4 rounded-xl text-center">
            <div className="text-2xl font-black text-slate-600 dark:text-slate-400">{club.medals.silver}</div>
            <div className="text-xs font-bold text-slate-500 uppercase tracking-wider">Silver</div>
          </div>
          <div className="bg-orange-50 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-900/50 p-4 rounded-xl text-center">
            <div className="text-2xl font-black text-orange-600 dark:text-orange-500">{club.medals.bronze}</div>
            <div className="text-xs font-bold text-orange-800/60 dark:text-orange-600 uppercase tracking-wider">Bronze</div>
          </div>
          <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-900/50 p-4 rounded-xl text-center">
            <div className="text-2xl font-black text-blue-600 dark:text-blue-500">{club.medals.top8}</div>
            <div className="text-xs font-bold text-blue-800/60 dark:text-blue-600 uppercase tracking-wider">Top 8</div>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <div className="flex items-center gap-2 px-2">
          <Target className="w-6 h-6 text-blue-600 dark:text-blue-400" />
          <h2 className="text-2xl font-bold">Top Fencers</h2>
        </div>
        
        <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-sm border dark:border-gray-800 overflow-hidden">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 dark:bg-gray-950 border-b dark:border-gray-800 text-sm text-gray-500 dark:text-gray-400">
                <th className="p-4 font-semibold w-16 text-center">#</th>
                <th className="p-4 font-semibold">Fencer</th>
                <th className="p-4 font-semibold text-center">Tier</th>
                <th className="p-4 font-semibold text-right">Points Contributed</th>
              </tr>
            </thead>
            <tbody className="divide-y dark:divide-gray-800">
              {club.topFencers.map((fencer: any, idx: number) => (
                <tr key={fencer.id} className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors group">
                  <td className="p-4 text-center font-bold text-gray-400 dark:text-gray-600">
                    {idx + 1}
                  </td>
                  <td className="p-4">
                    <Link href={`/fencer/${fencer.id}`} className="font-bold text-gray-900 dark:text-gray-100 hover:text-blue-600 dark:hover:text-blue-400 transition-colors block">
                      {fencer.firstName} {fencer.lastName}
                    </Link>
                  </td>
                  <td className="p-4 text-center">
                    <span className={`px-3 py-1 text-xs rounded-full font-bold
                      ${fencer.tier === 'Diamond' ? 'bg-cyan-100 text-cyan-800 dark:bg-cyan-900/30 dark:text-cyan-300' : ''}
                      ${fencer.tier === 'Platinum' ? 'bg-slate-200 text-slate-800 dark:bg-slate-800 dark:text-slate-300' : ''}
                      ${fencer.tier === 'Gold' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400' : ''}
                      ${fencer.tier === 'Silver' ? 'bg-gray-200 text-gray-800 dark:bg-gray-800 dark:text-gray-300' : ''}
                      ${fencer.tier === 'Bronze' ? 'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400' : ''}
                      ${!fencer.tier || fencer.tier === 'Unranked' ? 'bg-gray-100 text-gray-500 dark:bg-gray-800 dark:text-gray-400' : ''}
                    `}>
                      {fencer.tier || 'Unranked'}
                    </span>
                  </td>
                  <td className="p-4 text-right font-black text-blue-600 dark:text-blue-400">
                    {Math.round(fencer.currentPoints * 10) / 10}
                  </td>
                </tr>
              ))}
              {club.topFencers.length === 0 && (
                <tr>
                  <td colSpan={4} className="p-12 text-center text-gray-500 dark:text-gray-400">
                    No points contributed in the past year.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
