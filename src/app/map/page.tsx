'use client'

import dynamic from 'next/dynamic'
import { MapPin } from 'lucide-react'

// Dynamically import the map component so it doesn't cause SSR issues
const ClubMap = dynamic(() => import('@/components/ClubMap'), { 
  ssr: false,
  loading: () => <div className="h-[600px] w-full rounded-2xl bg-gray-100 dark:bg-gray-800 flex items-center justify-center animate-pulse border dark:border-gray-700 shadow-sm"><span className="text-gray-400 font-bold">Loading Map...</span></div>
})

export default function MapPage() {
  // Hardcoded known clubs for demonstration
  const clubs = [
    { name: 'Damocles Fencing Club', lat: 45.9636, lng: -66.6431 }, // Fredericton area
    { name: 'Fundy Fencing Club', lat: 45.2733, lng: -66.0633 }, // Saint John area
    { name: 'UNB Fencing Club', lat: 45.9429, lng: -66.6416 }, // UNB
    { name: 'Moncton Fencing Club', lat: 46.0878, lng: -64.7782 } // Moncton
  ]

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
