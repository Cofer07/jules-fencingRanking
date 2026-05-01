'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { format } from 'date-fns'
import { CalendarDays, MapPin } from 'lucide-react'

export default function TournamentsDirectory() {
  const [tournaments, setTournaments] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/tournaments')
      .then(res => res.json())
      .then(data => {
        setTournaments(Array.isArray(data) ? data : [])
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [])

  if (loading) return <div className="p-8 text-center text-gray-500">Loading tournaments...</div>

  return (
    <div className="max-w-5xl mx-auto space-y-8 animate-in fade-in duration-500">
      <div>
        <h1 className="text-3xl font-black tracking-tight">Tournament Directory</h1>
        <p className="text-gray-500 dark:text-gray-400 mt-1">Browse all uploaded events and their official results.</p>
      </div>

      <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-sm border dark:border-gray-800 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 dark:bg-gray-950 border-b dark:border-gray-800 text-sm text-gray-500 dark:text-gray-400">
                <th className="p-4 font-semibold">Date</th>
                <th className="p-4 font-semibold">Tournament Name</th>
                <th className="p-4 font-semibold">Location</th>
                <th className="p-4 font-semibold text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y dark:divide-gray-800">
              {tournaments.map((t) => (
                <tr key={t.id} className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors group">
                  <td className="p-4 text-gray-600 dark:text-gray-400 whitespace-nowrap">
                    <div className="flex items-center gap-2">
                      <CalendarDays className="w-4 h-4" />
                      {format(new Date(t.date), 'MMM dd, yyyy')}
                    </div>
                  </td>
                  <td className="p-4">
                    <Link href={`/tournaments/${t.id}`} className="font-bold text-gray-900 dark:text-gray-100 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                      {t.name}
                    </Link>
                  </td>
                  <td className="p-4 text-gray-600 dark:text-gray-400">
                    <div className="flex items-center gap-2">
                      <MapPin className="w-4 h-4 opacity-50" />
                      {t.location || 'Unknown'}
                    </div>
                  </td>
                  <td className="p-4 text-right">
                    <Link href={`/tournaments/${t.id}`} className="text-sm font-bold text-blue-600 dark:text-blue-400 hover:underline">
                      View Results &rarr;
                    </Link>
                  </td>
                </tr>
              ))}
              {tournaments.length === 0 && (
                <tr>
                  <td colSpan={4} className="p-12 text-center text-gray-500 dark:text-gray-400">
                    No tournaments have been uploaded yet.
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
