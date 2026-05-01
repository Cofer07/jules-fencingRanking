'use client'

import { useEffect, useState, useRef } from 'react'
import { useParams } from 'next/navigation'
import html2canvas from 'html2canvas'
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

  if (!fencer) return <div className="p-8 text-center">Loading profile...</div>

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
      const canvas = await html2canvas(badgeRef.current, { scale: 2 })
      const link = document.createElement('a')
      link.download = `${fencer.firstName}-${fencer.lastName}-badge.png`
      link.href = canvas.toDataURL()
      link.click()
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
            className="w-72 h-40 bg-gradient-to-br from-blue-900 to-blue-700 text-white rounded-xl p-6 shadow-xl relative overflow-hidden flex flex-col justify-between"
          >
            <div className="absolute top-0 right-0 p-4 opacity-20">
              <svg width="60" height="60" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M14.5 4h-5L7 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3l-2.5-3z"></path><circle cx="12" cy="13" r="3"></circle></svg>
            </div>
            <div>
              <h3 className="font-bold text-xl">{fencer.firstName} {fencer.lastName}</h3>
              <p className="text-blue-200 text-sm">{fencer.club || 'Maritime Fencer'}</p>
            </div>
            <div className="flex justify-between items-end">
              <span className="font-mono text-sm opacity-80">{fencer.id}</span>
              <span className="bg-white dark:bg-gray-900 border dark:border-gray-800/20 px-3 py-1 rounded-full text-sm font-semibold backdrop-blur-sm">
                {fencer.tier}
              </span>
            </div>
          </div>
          <button 
            onClick={downloadBadge}
            className="bg-gray-900 text-white px-4 py-2 rounded-lg hover:bg-gray-800 transition shadow"
          >
            Download Badge Image
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
