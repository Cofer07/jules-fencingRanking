'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import { format } from 'date-fns'
import { CalendarDays, MapPin, ChevronLeft } from 'lucide-react'

export default function TournamentDetails() {
  const { id } = useParams()
  const [tournament, setTournament] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch(`/api/tournaments/${id}`)
      .then(res => res.json())
      .then(data => {
        setTournament(data)
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [id])

  if (loading) return <div className="p-8 text-center text-gray-500">Loading tournament details...</div>
  if (!tournament || tournament.error) return <div className="p-8 text-center text-red-500">Tournament not found.</div>

  return (
    <div className="max-w-5xl mx-auto space-y-8 animate-in fade-in duration-500">
      <Link href="/tournaments" className="inline-flex items-center text-sm font-semibold text-gray-500 hover:text-gray-900 dark:hover:text-gray-100 transition-colors">
        <ChevronLeft className="w-4 h-4 mr-1" /> Back to Directory
      </Link>

      <div className="bg-white dark:bg-gray-900 rounded-3xl shadow-sm border dark:border-gray-800 p-8 space-y-4">
        <h1 className="text-4xl font-black tracking-tight text-gray-900 dark:text-white">{tournament.name}</h1>
        <div className="flex flex-wrap gap-6 text-gray-600 dark:text-gray-400">
          <div className="flex items-center gap-2">
            <CalendarDays className="w-5 h-5 text-blue-500" />
            <span className="font-medium">{format(new Date(tournament.date), 'MMMM dd, yyyy')}</span>
          </div>
          <div className="flex items-center gap-2">
            <MapPin className="w-5 h-5 text-emerald-500" />
            <span className="font-medium">{tournament.location || 'Location TBA'}</span>
          </div>
        </div>
      </div>

      <div className="space-y-8">
        <h2 className="text-2xl font-bold px-2">Events & Results</h2>
        {tournament.events.length === 0 ? (
          <div className="bg-gray-50 dark:bg-gray-800/50 rounded-2xl p-8 text-center text-gray-500 dark:text-gray-400 border dark:border-gray-800">
            No events have been uploaded for this tournament yet.
          </div>
        ) : (
          tournament.events.map((event: any) => (
            <div key={event.id} className="bg-white dark:bg-gray-900 rounded-2xl shadow-sm border dark:border-gray-800 overflow-hidden">
              <div className="bg-gray-50 dark:bg-gray-950 p-4 border-b dark:border-gray-800 flex justify-between items-center">
                <h3 className="font-bold text-lg text-gray-900 dark:text-white">
                  {event.weapon} • {event.category} {event.gender !== 'Mixed' && `• ${event.gender === 'M' ? "Men's" : "Women's"}`}
                </h3>
                <span className="text-sm font-semibold text-gray-500 bg-white dark:bg-gray-900 px-3 py-1 rounded-full border dark:border-gray-800">
                  {event.results.length} participants
                </span>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b dark:border-gray-800 text-xs uppercase tracking-wider text-gray-500 dark:text-gray-400 bg-white dark:bg-gray-900">
                      <th className="p-4 font-semibold w-24 text-center">Place</th>
                      <th className="p-4 font-semibold">Fencer</th>
                      <th className="p-4 font-semibold">Club</th>
                      <th className="p-4 font-semibold text-right">Points</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y dark:divide-gray-800">
                    {event.results.map((result: any, idx: number) => (
                      <tr key={result.id} className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                        <td className="p-4 text-center font-bold text-gray-900 dark:text-gray-100">
                          {result.placement === 1 ? <span className="text-yellow-500 text-lg">🥇 1</span> :
                           result.placement === 2 ? <span className="text-gray-400 text-lg">🥈 2</span> :
                           result.placement === 3 ? <span className="text-amber-600 text-lg">🥉 3</span> :
                           result.placement}
                        </td>
                        <td className="p-4">
                          <Link href={`/fencer/${result.fencer.id}`} className="font-bold text-gray-900 dark:text-gray-100 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                            {result.fencer.firstName} {result.fencer.lastName}
                          </Link>
                        </td>
                        <td className="p-4 text-gray-600 dark:text-gray-400 text-sm">
                          {result.fencer.club || '-'}
                        </td>
                        <td className="p-4 text-right font-black text-blue-600 dark:text-blue-400">
                          +{result.pointsEarned}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}
