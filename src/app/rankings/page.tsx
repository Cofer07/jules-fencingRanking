'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'

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
    <div className="max-w-4xl mx-auto py-8">
      <h1 className="text-3xl font-bold mb-6">Maritime Fencing Rankings</h1>
      
      <div className="flex space-x-4 mb-6">
        <button 
          className={`px-4 py-2 rounded ${view === 'individual' ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}
          onClick={() => setView('individual')}
        >
          Individual Rankings
        </button>
        <button 
          className={`px-4 py-2 rounded ${view === 'clubs' ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}
          onClick={() => setView('clubs')}
        >
          Top Clubs
        </button>
      </div>

      {view === 'individual' && (
        <>
          <div className="flex flex-wrap gap-4 mb-6 bg-white p-4 rounded shadow">
            <select className="border p-2 rounded" value={weapon} onChange={e => setWeapon(e.target.value)}>
              <option>Epee</option>
              <option>Foil</option>
              <option>Sabre</option>
            </select>
            <select className="border p-2 rounded" value={gender} onChange={e => setGender(e.target.value)}>
              <option value="M">Men's</option>
              <option value="F">Women's</option>
            </select>
            <select className="border p-2 rounded" value={category} onChange={e => setCategory(e.target.value)}>
              <option>Senior</option>
              <option>Cadet</option>
              <option>Junior</option>
              <option>Veteran</option>
              <option>U15</option>
            </select>
          </div>

          <div className="bg-white rounded shadow overflow-hidden">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-100 border-b">
                  <th className="p-3">Rank</th>
                  <th className="p-3">Name</th>
                  <th className="p-3">Club</th>
                  <th className="p-3">Tier</th>
                  <th className="p-3 text-right">Points (Rolling Year)</th>
                </tr>
              </thead>
              <tbody>
                {rankings.map((r, idx) => (
                  <tr key={r.fencer.id} className="border-b hover:bg-gray-50">
                    <td className="p-3 font-semibold">{idx + 1}</td>
                    <td className="p-3">
                      <Link href={`/fencer/${r.fencer.id}`} className="text-blue-600 hover:underline">
                        {r.fencer.firstName} {r.fencer.lastName}
                      </Link>
                    </td>
                    <td className="p-3">{r.fencer.club || '-'}</td>
                    <td className="p-3">
                      <span className={`px-2 py-1 text-xs rounded-full font-semibold
                        ${r.fencer.tier === 'Diamond' ? 'bg-cyan-100 text-cyan-800' : ''}
                        ${r.fencer.tier === 'Platinum' ? 'bg-slate-200 text-slate-800' : ''}
                        ${r.fencer.tier === 'Gold' ? 'bg-yellow-100 text-yellow-800' : ''}
                        ${r.fencer.tier === 'Silver' ? 'bg-gray-200 text-gray-800' : ''}
                        ${r.fencer.tier === 'Bronze' ? 'bg-orange-100 text-orange-800' : ''}
                      `}>
                        {r.fencer.tier}
                      </span>
                    </td>
                    <td className="p-3 text-right font-bold text-gray-700">{r.totalPoints}</td>
                  </tr>
                ))}
                {rankings.length === 0 && (
                  <tr>
                    <td colSpan={5} className="p-6 text-center text-gray-500">No results found for this category.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </>
      )}

      {view === 'clubs' && (
        <div className="bg-white rounded shadow overflow-hidden">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-100 border-b">
                <th className="p-3">Rank</th>
                <th className="p-3">Club Name</th>
                <th className="p-3 text-right">Total Points</th>
              </tr>
            </thead>
            <tbody>
              {clubs.map((c, idx) => (
                <tr key={c.name} className="border-b hover:bg-gray-50">
                  <td className="p-3 font-semibold">{idx + 1}</td>
                  <td className="p-3 text-lg">{c.name}</td>
                  <td className="p-3 text-right font-bold text-blue-600">{c.points}</td>
                </tr>
              ))}
              {clubs.length === 0 && (
                <tr>
                  <td colSpan={3} className="p-6 text-center text-gray-500">No club data available.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
