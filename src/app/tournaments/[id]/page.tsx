'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { format } from 'date-fns'
import { CalendarDays, MapPin, ChevronLeft, Trash2, Edit } from 'lucide-react'
import { useSession } from 'next-auth/react'

export default function TournamentDetails() {
  const { id } = useParams()
  const router = useRouter()
  const { data: session } = useSession()
  const [tournament, setTournament] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [isDeleting, setIsDeleting] = useState(false)

  // Edit state
  const [isEditing, setIsEditing] = useState(false)
  const [editForm, setEditForm] = useState({ name: '', date: '', location: '' })

  const loadTournament = () => {
    fetch(`/api/tournaments/${id}`)
      .then(res => res.json())
      .then(data => {
        setTournament(data)
        setEditForm({
          name: data.name,
          date: new Date(data.date).toISOString().split('T')[0],
          location: data.location || ''
        })
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }

  useEffect(() => {
    loadTournament()
  }, [id])

  const handleEditSubmit = async () => {
    try {
      const res = await fetch(`/api/tournaments/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editForm)
      })
      if (res.ok) {
        setIsEditing(false)
        loadTournament()
      } else {
        alert('Failed to update tournament.')
      }
    } catch (e) {
      console.error(e)
      alert('Failed to update tournament.')
    }
  }

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this tournament? This will permanently remove all associated events and results and recalculate rankings.')) return

    setIsDeleting(true)
    try {
      const res = await fetch(`/api/tournaments/${id}`, { method: 'DELETE' })
      if (res.ok) {
        router.push('/tournaments')
      } else {
        alert('Failed to delete tournament')
        setIsDeleting(false)
      }
    } catch (error) {
      console.error(error)
      alert('Error deleting tournament')
      setIsDeleting(false)
    }
  }

  if (loading) return <div className="p-8 text-center text-gray-500">Loading tournament details...</div>
  if (!tournament || tournament.error) return <div className="p-8 text-center text-red-500">Tournament not found.</div>

  return (
    <div className="max-w-5xl mx-auto space-y-8 animate-in fade-in duration-500">
      <div className="flex items-center justify-between">
        <Link href="/tournaments" className="inline-flex items-center text-sm font-semibold text-gray-500 hover:text-gray-900 dark:hover:text-gray-100 transition-colors">
          <ChevronLeft className="w-4 h-4 mr-1" /> Back to Directory
        </Link>
        
        {session?.user && (
          <div className="flex gap-2">
            <button
              onClick={() => setIsEditing(!isEditing)}
              className="inline-flex items-center gap-2 px-4 py-2 text-sm font-semibold text-blue-600 bg-blue-50 hover:bg-blue-100 dark:text-blue-400 dark:bg-blue-900/30 dark:hover:bg-blue-900/50 rounded-xl transition-colors"
            >
              <Edit className="w-4 h-4" />
              {isEditing ? 'Cancel Edit' : 'Edit Tournament'}
            </button>
            <button
              onClick={handleDelete}
              disabled={isDeleting}
              className="inline-flex items-center gap-2 px-4 py-2 text-sm font-semibold text-red-600 bg-red-50 hover:bg-red-100 dark:text-red-400 dark:bg-red-950/50 dark:hover:bg-red-900/50 rounded-xl transition-colors disabled:opacity-50"
            >
              <Trash2 className="w-4 h-4" />
              {isDeleting ? 'Deleting...' : 'Delete Tournament'}
            </button>
          </div>
        )}
      </div>

      {isEditing ? (
        <div className="bg-gray-50 dark:bg-gray-900 rounded-3xl border dark:border-gray-800 p-8 space-y-4">
          <h2 className="text-xl font-bold">Edit Tournament</h2>
          <div className="flex flex-col gap-4 max-w-lg">
            <input className="bg-white dark:bg-gray-950 border dark:border-gray-800 rounded-lg p-3 w-full" value={editForm.name} onChange={e => setEditForm({...editForm, name: e.target.value})} placeholder="Tournament Name" />
            <input className="bg-white dark:bg-gray-950 border dark:border-gray-800 rounded-lg p-3 w-full" type="date" value={editForm.date} onChange={e => setEditForm({...editForm, date: e.target.value})} />
            <input className="bg-white dark:bg-gray-950 border dark:border-gray-800 rounded-lg p-3 w-full" value={editForm.location} onChange={e => setEditForm({...editForm, location: e.target.value})} placeholder="Location" />
            <button onClick={handleEditSubmit} className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded-lg transition-colors">Save Changes</button>
          </div>
        </div>
      ) : (
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
      )}

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
