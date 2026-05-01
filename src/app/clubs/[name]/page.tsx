'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import { ChevronLeft, Users, Trophy, Target, Settings, MapPin, Mail, Globe } from 'lucide-react'
import { useSession } from 'next-auth/react'

export default function ClubProfile() {
  const { name } = useParams()
  const decodedName = decodeURIComponent(name as string)
  const { data: session } = useSession()
  const [club, setClub] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  // Edit State
  const [isEditing, setIsEditing] = useState(false)
  const [editForm, setEditForm] = useState({ location: '', email: '', website: '', logoUrl: '', lat: '', lng: '' })

  const loadClub = () => {
    fetch(`/api/clubs/${encodeURIComponent(decodedName)}`)
      .then(res => res.json())
      .then(data => {
        setClub(data)
        setEditForm({
          location: data.location || '',
          email: data.email || '',
          website: data.website || '',
          logoUrl: data.logoUrl || '',
          lat: data.lat || '',
          lng: data.lng || ''
        })
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }

  useEffect(() => {
    loadClub()
  }, [decodedName])

  const handleSave = async () => {
    try {
      const res = await fetch(`/api/clubs/${encodeURIComponent(decodedName)}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editForm)
      })
      if (res.ok) {
        setIsEditing(false)
        loadClub()
      } else {
        alert('Failed to update club profile.')
      }
    } catch (e) {
      console.error(e)
    }
  }

  const canEdit = session?.user?.role === 'ADMIN' || club?.ownerId === session?.user?.id

  if (loading) return <div className="p-8 text-center text-gray-500">Loading club details...</div>
  if (!club || club.error) return <div className="p-8 text-center text-red-500">Club not found.</div>

  return (
    <div className="max-w-5xl mx-auto space-y-8 animate-in fade-in duration-500">
      <div className="flex justify-between items-center">
        <Link href="/rankings" className="inline-flex items-center text-sm font-semibold text-gray-500 hover:text-gray-900 dark:hover:text-gray-100 transition-colors">
          <ChevronLeft className="w-4 h-4 mr-1" /> Back to Rankings
        </Link>
        {canEdit && (
          <button 
            onClick={() => setIsEditing(!isEditing)}
            className="inline-flex items-center gap-2 px-4 py-2 text-sm font-semibold text-gray-700 bg-gray-100 hover:bg-gray-200 dark:text-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 rounded-xl transition-colors"
          >
            <Settings className="w-4 h-4" />
            {isEditing ? 'Cancel Edit' : 'Edit Profile'}
          </button>
        )}
      </div>

      {isEditing && (
        <div className="bg-gray-50 dark:bg-gray-900 border dark:border-gray-800 rounded-3xl p-8 space-y-4 animate-in slide-in-from-top-4">
          <h2 className="text-xl font-bold mb-4">Edit Club Details</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <input className="bg-white dark:bg-gray-950 border dark:border-gray-800 rounded-lg p-3 outline-none" placeholder="Location (e.g., Fredericton, NB)" value={editForm.location} onChange={e => setEditForm({...editForm, location: e.target.value})} />
            <input className="bg-white dark:bg-gray-950 border dark:border-gray-800 rounded-lg p-3 outline-none" placeholder="Email Contact" value={editForm.email} onChange={e => setEditForm({...editForm, email: e.target.value})} />
            <input className="bg-white dark:bg-gray-950 border dark:border-gray-800 rounded-lg p-3 outline-none" placeholder="Website URL" value={editForm.website} onChange={e => setEditForm({...editForm, website: e.target.value})} />
            <input className="bg-white dark:bg-gray-950 border dark:border-gray-800 rounded-lg p-3 outline-none" placeholder="Logo Image URL" value={editForm.logoUrl} onChange={e => setEditForm({...editForm, logoUrl: e.target.value})} />
            <input className="bg-white dark:bg-gray-950 border dark:border-gray-800 rounded-lg p-3 outline-none" placeholder="Latitude (for Map)" type="number" step="0.0001" value={editForm.lat} onChange={e => setEditForm({...editForm, lat: e.target.value})} />
            <input className="bg-white dark:bg-gray-950 border dark:border-gray-800 rounded-lg p-3 outline-none" placeholder="Longitude (for Map)" type="number" step="0.0001" value={editForm.lng} onChange={e => setEditForm({...editForm, lng: e.target.value})} />
          </div>
          <button onClick={handleSave} className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg transition-colors mt-4">Save Changes</button>
        </div>
      )}

      <div className="bg-white dark:bg-gray-900 rounded-3xl shadow-sm border dark:border-gray-800 p-8 flex flex-col md:flex-row justify-between items-center gap-8">
        <div className="flex items-center gap-6">
          {club.logoUrl ? (
            <img src={club.logoUrl} alt={`${club.name} logo`} className="w-24 h-24 rounded-full object-cover border-2 border-gray-100 dark:border-gray-800 shadow-sm" />
          ) : (
            <div className="w-24 h-24 rounded-full bg-blue-100 dark:bg-blue-900/50 flex items-center justify-center text-blue-600 dark:text-blue-400 font-bold text-3xl">
              {club.shortName || club.name.substring(0, 2).toUpperCase()}
            </div>
          )}
          <div>
            <h1 className="text-4xl font-black tracking-tight text-gray-900 dark:text-white">{club.name}</h1>
            
            <div className="flex flex-wrap gap-4 text-sm text-gray-500 dark:text-gray-400 mt-2">
              {club.location && (
                <div className="flex items-center gap-1"><MapPin className="w-4 h-4" /> {club.location}</div>
              )}
              {club.email && (
                <div className="flex items-center gap-1"><Mail className="w-4 h-4" /> <a href={`mailto:${club.email}`} className="hover:text-blue-500">{club.email}</a></div>
              )}
              {club.website && (
                <div className="flex items-center gap-1"><Globe className="w-4 h-4" /> <a href={club.website} target="_blank" rel="noreferrer" className="hover:text-blue-500">Website</a></div>
              )}
            </div>

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
