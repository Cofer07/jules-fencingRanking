'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Trophy, Users } from 'lucide-react'

export default function RankingsPage() {
  const [weapon, setWeapon] = useState('Epee')
  const [gender, setGender] = useState('M')
  const [category, setCategory] = useState('Senior')
  const [rankings, setRankings] = useState<any[]>([])
  const [clubs, setClubs] = useState<any[]>([])
  
  const [view, setView] = useState<'individual' | 'clubs'>('individual')

  useEffect(() => {
    if (view === 'individual') {
      fetch(`/api/rankings?weapon=${weapon}&gender=${gender}&category=${category}`)
        .then(res => res.json())
        .then(data => setRankings(Array.isArray(data) ? data : []))
    } else {
      fetch(`/api/clubs`)
        .then(res => res.json())
        .then(data => setClubs(Array.isArray(data) ? data : []))
    }
  }, [weapon, gender, category, view])

  return (
    <div className="max-w-5xl mx-auto space-y-8 animate-in fade-in duration-500">
      
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-black tracking-tight">Leaderboards</h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">Official rolling 365-day Maritime standings.</p>
        </div>
        
        <div className="bg-gray-100 dark:bg-gray-900 p-1 rounded-xl flex gap-1 shadow-inner border dark:border-gray-800">
          <button 
            className={`flex items-center gap-2 px-6 py-2.5 rounded-lg text-sm font-bold transition-all ${view === 'individual' ? 'bg-white dark:bg-gray-800 text-blue-600 dark:text-blue-400 shadow-sm' : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100'}`}
            onClick={() => setView('individual')}
          >
            <Trophy className="w-4 h-4" /> Individual
          </button>
          <button 
            className={`flex items-center gap-2 px-6 py-2.5 rounded-lg text-sm font-bold transition-all ${view === 'clubs' ? 'bg-white dark:bg-gray-800 text-blue-600 dark:text-blue-400 shadow-sm' : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100'}`}
            onClick={() => setView('clubs')}
          >
            <Users className="w-4 h-4" /> Top Clubs
          </button>
        </div>
      </div>

      {view === 'individual' && (
        <div className="space-y-6">
          <div className="bg-white dark:bg-gray-900 p-4 rounded-2xl shadow-sm border dark:border-gray-800 flex flex-wrap gap-4">
            <select className="bg-gray-50 dark:bg-gray-950 border dark:border-gray-800 rounded-lg p-3 flex-1 outline-none focus:ring-2 focus:ring-blue-500 min-w-[150px]" value={weapon} onChange={e => setWeapon(e.target.value)}>
              <option>Epee</option>
              <option>Foil</option>
              <option>Sabre</option>
            </select>
            <select className="bg-gray-50 dark:bg-gray-950 border dark:border-gray-800 rounded-lg p-3 flex-1 outline-none focus:ring-2 focus:ring-blue-500 min-w-[150px]" value={gender} onChange={e => setGender(e.target.value)}>
              <option value="M">Men's</option>
              <option value="F">Women's</option>
            </select>
            <select className="bg-gray-50 dark:bg-gray-950 border dark:border-gray-800 rounded-lg p-3 flex-1 outline-none focus:ring-2 focus:ring-blue-500 min-w-[150px]" value={category} onChange={e => setCategory(e.target.value)}>
              <option>Senior</option>
              <option>Cadet</option>
              <option>Junior</option>
              <option>Veteran</option>
              <option>U15</option>
            </select>
          </div>

          <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-sm border dark:border-gray-800 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-gray-50 dark:bg-gray-950 border-b dark:border-gray-800 text-sm text-gray-500 dark:text-gray-400">
                    <th className="p-4 font-semibold">Rank</th>
                    <th className="p-4 font-semibold">Fencer</th>
                    <th className="p-4 font-semibold hidden sm:table-cell">Club</th>
                    <th className="p-4 font-semibold text-center">Tier</th>
                    <th className="p-4 font-semibold text-right">Points</th>
                  </tr>
                </thead>
                <tbody className="divide-y dark:divide-gray-800">
                  {rankings.map((r, idx) => (
                    <tr key={r.fencer.id} className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors group">
                      <td className="p-4 font-bold text-gray-400 dark:text-gray-600">
                        {idx === 0 ? <span className="text-yellow-500">1</span> : 
                         idx === 1 ? <span className="text-gray-400">2</span> : 
                         idx === 2 ? <span className="text-amber-600">3</span> : idx + 1}
                      </td>
                      <td className="p-4">
                        <Link href={`/fencer/${r.fencer.id}`} className="font-bold text-gray-900 dark:text-gray-100 hover:text-blue-600 dark:hover:text-blue-400 transition-colors block">
                          {r.fencer.firstName} {r.fencer.lastName}
                        </Link>
                        <span className="text-xs text-gray-500 font-mono mt-1 sm:hidden block">{r.fencer.club || '-'}</span>
                      </td>
                      <td className="p-4 text-gray-600 dark:text-gray-400 hidden sm:table-cell">{r.fencer.club || '-'}</td>
                      <td className="p-4 text-center">
                        <span className={`px-3 py-1 text-xs rounded-full font-bold
                          ${r.tier === 'Diamond' ? 'bg-cyan-100 text-cyan-800 dark:bg-cyan-900/30 dark:text-cyan-300' : ''}
                          ${r.tier === 'Platinum' ? 'bg-slate-200 text-slate-800 dark:bg-slate-800 dark:text-slate-300' : ''}
                          ${r.tier === 'Gold' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400' : ''}
                          ${r.tier === 'Silver' ? 'bg-gray-200 text-gray-800 dark:bg-gray-800 dark:text-gray-300' : ''}
                          ${r.tier === 'Bronze' ? 'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400' : ''}
                        `}>
                          {r.tier}
                        </span>
                      </td>
                      <td className="p-4 text-right font-black text-blue-600 dark:text-blue-400">{r.totalPoints}</td>
                    </tr>
                  ))}
                  {rankings.length === 0 && (
                    <tr>
                      <td colSpan={5} className="p-12 text-center text-gray-500 dark:text-gray-400">
                        <div className="flex flex-col items-center justify-center">
                          <span className="text-4xl mb-4 opacity-50">🤺</span>
                          <p>No results found for this category.</p>
                        </div>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {view === 'clubs' && (
        <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-sm border dark:border-gray-800 overflow-hidden animate-in fade-in slide-in-from-bottom-4">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 dark:bg-gray-950 border-b dark:border-gray-800 text-sm text-gray-500 dark:text-gray-400">
                <th className="p-4 font-semibold">Rank</th>
                <th className="p-4 font-semibold">Club Name</th>
                <th className="p-4 font-semibold text-right">Total Points</th>
              </tr>
            </thead>
            <tbody className="divide-y dark:divide-gray-800">
              {clubs.map((c, idx) => (
                <tr key={c.name} className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors group">
                  <td className="p-4 font-bold text-gray-400 dark:text-gray-600">
                    {idx === 0 ? <span className="text-yellow-500">1</span> : 
                     idx === 1 ? <span className="text-gray-400">2</span> : 
                     idx === 2 ? <span className="text-amber-600">3</span> : idx + 1}
                  </td>
                  <td className="p-4">
                    <Link href={`/clubs/${encodeURIComponent(c.name)}`} className="font-bold text-gray-900 dark:text-gray-100 text-lg hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                      {c.name}
                    </Link>
                  </td>
                  <td className="p-4 text-right font-black text-blue-600 dark:text-blue-400 text-lg">{c.points}</td>
                </tr>
              ))}
              {clubs.length === 0 && (
                <tr>
                  <td colSpan={3} className="p-12 text-center text-gray-500 dark:text-gray-400">No club data available.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
