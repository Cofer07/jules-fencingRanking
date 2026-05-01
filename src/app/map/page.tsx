'use client'

import { useEffect, useState } from 'react'
import dynamic from 'next/dynamic'
import { MapPin } from 'lucide-react'

// Dynamically import the map component so it doesn't cause SSR issues
const ClubMap = dynamic(() => import('@/components/ClubMap'), { 
  ssr: false,
  loading: () => <div className="h-[600px] w-full rounded-2xl bg-gray-100 dark:bg-gray-800 flex items-center justify-center animate-pulse border dark:border-gray-700 shadow-sm"><span className="text-gray-400 font-bold">Loading Map...</span></div>
})

export default function MapPage() {
  const [clubs, setClubs] = useState<any[]>([])

  useEffect(() => {
    fetch('/api/clubs/list')
      .then(res => res.json())
      .then(data => {
        // Filter out clubs without coordinates
        const validClubs = data.filter((c: any) => c.lat && c.lng)
        setClubs(validClubs)
      })
      .catch(console.error)
  }, [])

  return (
    <div className="max-w-5xl mx-auto space-y-8 animate-in fade-in duration-500">
      <div>
        <h1 className="text-3xl font-black tracking-tight flex items-center gap-2">
          <MapPin className="text-emerald-500" /> Regional Club Map
        </h1>
        <p className="text-gray-500 dark:text-gray-400 mt-1">Explore active fencing clubs across the Maritimes.</p>
      </div>

      <div className="bg-white dark:bg-gray-900 rounded-3xl shadow-sm border dark:border-gray-800 p-2 sm:p-4">
        <ClubMap clubs={clubs} />
      </div>
    </div>
  )
}
