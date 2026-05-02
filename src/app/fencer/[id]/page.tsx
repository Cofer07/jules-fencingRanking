'use client'

import { useEffect, useState, useRef } from 'react'
import { useParams } from 'next/navigation'
import { toPng } from 'html-to-image'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import { format } from 'date-fns'

export default function FencerProfile() {
  const { id } = useParams()
  const [fencer, setFencer] = useState<any>(null)
  const badgeRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    fetch(`/api/fencer/${id}`)
      .then(res => res.json())
      .then(data => setFencer(data))
  }, [id])

  if (!fencer) return <div className="p-8 text-center text-gray-500">Loading profile...</div>

  // Prepare chart data (cumulative points over time)
  const chartData = [...fencer.results].reverse().reduce((acc: any[], r: any) => {
    const prevCumulative = acc.length > 0 ? acc[acc.length - 1].points : 0
    const newCumulative = prevCumulative + r.pointsEarned
    
    acc.push({
      date: format(new Date(r.event.tournament.date), 'MMM dd, yyyy'),
      points: Math.round(newCumulative * 10) / 10,
      tournament: r.event.tournament.name
    })
    
    return acc
  }, [])

  const downloadBadge = async () => {
    if (badgeRef.current) {
      try {
        const dataUrl = await toPng(badgeRef.current, { cacheBust: true, pixelRatio: 2 })
        const link = document.createElement('a')
        link.download = `${fencer.firstName}-${fencer.lastName}-badge.png`
        link.href = dataUrl
        link.click()
      } catch (err) {
        console.error('Failed to generate image', err)
        alert('Failed to download badge. Please try again.')
      }
    }
  }

  return (
    <div className="max-w-4xl mx-auto py-8 space-y-8">
      {/* Profile Header & Badge Section */}
      <div className="flex flex-col md:flex-row gap-8 items-start">
        <div className="flex-1 space-y-4 w-full">
          <div className="bg-white dark:bg-gray-900 border dark:border-gray-800 p-6 rounded shadow">
            <h1 className="text-3xl font-bold">{fencer.firstName} {fencer.lastName}</h1>
            <p className="text-gray-500 dark:text-gray-400 text-lg mb-4">{fencer.id} • {fencer.gender === 'M' ? "Men's" : "Women's"}</p>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded">
                <span className="text-sm text-gray-500 dark:text-gray-400 block">Club</span>
                <span className="font-semibold text-lg">{fencer.club || 'Unaffiliated'}</span>
              </div>
              <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded">
                <span className="text-sm text-gray-500 dark:text-gray-400 block">Current Tier</span>
                <span className="font-semibold text-lg">{fencer.tier}</span>
              </div>
            </div>
          </div>
          
          {/* Advanced Stats Row */}
          {fencer.stats && (
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div className="bg-white dark:bg-gray-900 border dark:border-gray-800 p-4 rounded shadow text-center">
                <div className="text-2xl font-black text-yellow-500">{fencer.stats.gold}</div>
                <div className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Gold Medals</div>
              </div>
              <div className="bg-white dark:bg-gray-900 border dark:border-gray-800 p-4 rounded shadow text-center">
                <div className="text-2xl font-black text-slate-400">{fencer.stats.silver}</div>
                <div className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Silver Medals</div>
              </div>
              <div className="bg-white dark:bg-gray-900 border dark:border-gray-800 p-4 rounded shadow text-center">
                <div className="text-2xl font-black text-orange-500">{fencer.stats.bronze}</div>
                <div className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Bronze Medals</div>
              </div>
              <div className="bg-white dark:bg-gray-900 border dark:border-gray-800 p-4 rounded shadow text-center">
                <div className="text-2xl font-black text-blue-500">{fencer.stats.winRate}%</div>
                <div className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Medal Rate</div>
              </div>
            </div>
          )}
        </div>

        {/* Downloadable Badge */}
        <div className="flex flex-col items-center gap-4">
          <div 
            ref={badgeRef}
            className={`w-80 h-112 rounded-2xl p-6 shadow-2xl relative overflow-hidden flex flex-col justify-between text-white border-4 ${
              fencer.tier === 'Diamond' ? 'bg-gradient-to-br from-cyan-300 via-blue-500 to-purple-600 border-cyan-200' :
              fencer.tier === 'Platinum' ? 'bg-gradient-to-br from-slate-300 via-gray-400 to-slate-600 border-slate-200' :
              fencer.tier === 'Gold' ? 'bg-gradient-to-br from-yellow-300 via-amber-500 to-orange-600 border-yellow-200' :
              fencer.tier === 'Silver' ? 'bg-gradient-to-br from-gray-200 via-gray-400 to-gray-500 border-gray-100' :
              fencer.tier === 'Bronze' ? 'bg-gradient-to-br from-orange-300 via-amber-600 to-yellow-800 border-orange-200' :
              'bg-gradient-to-br from-gray-800 to-black border-gray-700'
            }`}
          >
            {/* Glossy Overlay */}
            <div className="absolute inset-0 bg-gradient-to-b from-white/20 to-transparent pointer-events-none" />

            {/* Header: Logo and Rank */}
            <div className="flex justify-between items-start z-10">
              <div className="bg-white p-1.5 rounded-lg shadow-sm">
                <img src="/FencingNB-Logo-FullColour.jpg" alt="Fencing NB Logo" className="w-16 h-auto object-contain" />
              </div>
              <div className="flex flex-col items-end">
                <span className="font-black text-2xl uppercase tracking-widest drop-shadow-md">
                  {fencer.tier || 'UNRANKED'}
                </span>
                <span className="font-mono text-xs opacity-90 drop-shadow-sm">{fencer.id}</span>
              </div>
            </div>

            {/* Center: Name & Main Stat */}
            <div className="flex flex-col items-center justify-center flex-1 z-10 py-4">
              <h3 className="font-black text-3xl text-center uppercase tracking-tight drop-shadow-lg leading-none mb-2">
                {fencer.firstName}<br/>{fencer.lastName}
              </h3>
              <p className="text-sm font-semibold opacity-90 tracking-widest uppercase mb-4 drop-shadow-sm">
                {fencer.club || 'Maritime Fencer'}
              </p>
              
              <div className="bg-black/20 backdrop-blur-sm rounded-xl p-4 w-full flex justify-between items-center border border-white/20">
                <div className="text-center">
                  <div className="text-xs uppercase tracking-widest opacity-80">Weapon</div>
                  <div className="font-bold text-lg">{fencer.results[0]?.event.weapon || 'MIXED'}</div>
                </div>
                <div className="h-8 w-px bg-white/20" />
                <div className="text-center">
                  <div className="text-xs uppercase tracking-widest opacity-80">Category</div>
                  <div className="font-bold text-lg">{fencer.gender === 'M' ? "MEN'S" : "WOMEN'S"}</div>
                </div>
              </div>
            </div>

            {/* Footer: Stats */}
            <div className="grid grid-cols-3 gap-2 z-10">
              <div className="bg-black/30 backdrop-blur-md rounded-lg p-2 text-center border border-white/10">
                <div className="text-[10px] uppercase tracking-widest opacity-70">Gold</div>
                <div className="font-black text-lg text-yellow-300">{fencer.stats?.gold || 0}</div>
              </div>
              <div className="bg-black/30 backdrop-blur-md rounded-lg p-2 text-center border border-white/10">
                <div className="text-[10px] uppercase tracking-widest opacity-70">Medals</div>
                <div className="font-black text-lg text-white">{(fencer.stats?.gold || 0) + (fencer.stats?.silver || 0) + (fencer.stats?.bronze || 0)}</div>
              </div>
              <div className="bg-black/30 backdrop-blur-md rounded-lg p-2 text-center border border-white/10">
                <div className="text-[10px] uppercase tracking-widest opacity-70">Win %</div>
                <div className="font-black text-lg text-cyan-300">{fencer.stats?.winRate || 0}%</div>
              </div>
            </div>
          </div>
          <button 
            onClick={downloadBadge}
            className="w-full bg-blue-600 text-white font-bold px-6 py-3 rounded-xl hover:bg-blue-700 transition shadow-lg flex justify-center items-center gap-2"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"></path></svg>
            Download for Socials
          </button>
        </div>
      </div>

      {/* Performance Graph */}
      {chartData.length > 0 && (
        <div className="bg-white dark:bg-gray-900 border dark:border-gray-800 p-6 rounded shadow">
          <h2 className="text-xl font-bold mb-6">Performance Timeline (Cumulative Points)</h2>
          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#eee" />
                <XAxis dataKey="date" tick={{fontSize: 12}} tickMargin={10} />
                <YAxis />
                <Tooltip 
                  contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                  labelStyle={{ fontWeight: 'bold', color: '#374151' }}
                />
                <Line type="monotone" dataKey="points" stroke="#2563eb" strokeWidth={3} dot={{ r: 4, fill: '#2563eb' }} activeDot={{ r: 6 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      {/* Tournament History */}
      <div className="bg-white dark:bg-gray-900 border dark:border-gray-800 p-6 rounded shadow">
        <h2 className="text-xl font-bold mb-4">Tournament History</h2>
        {fencer.results.length === 0 ? (
          <p className="text-gray-500 dark:text-gray-400">No results recorded yet.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-100 dark:bg-gray-800 border-b dark:border-gray-800">
                  <th className="p-3">Date</th>
                  <th className="p-3">Tournament</th>
                  <th className="p-3">Event</th>
                  <th className="p-3 text-center">Placement</th>
                  <th className="p-3 text-right">Points Earned</th>
                </tr>
              </thead>
              <tbody>
                {[...fencer.results].reverse().map((r: any) => (
                  <tr key={r.id} className="border-b dark:border-gray-800 hover:bg-gray-50 dark:bg-gray-800">
                    <td className="p-3 text-gray-500 dark:text-gray-400">{format(new Date(r.event.tournament.date), 'MMM dd, yyyy')}</td>
                    <td className="p-3 font-medium">{r.event.tournament.name}</td>
                    <td className="p-3">{r.event.weapon} • {r.event.category}</td>
                    <td className="p-3 text-center font-bold">{r.placement}</td>
                    <td className="p-3 text-right text-blue-600 font-bold">+{r.pointsEarned}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}
