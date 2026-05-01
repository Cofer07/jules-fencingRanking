'use client'

import { Trophy } from 'lucide-react'

export default function ArchivesPage() {
  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in duration-500">
      <div className="text-center space-y-4">
        <div className="w-16 h-16 bg-yellow-100 dark:bg-yellow-900/50 rounded-full flex items-center justify-center mx-auto shadow-sm">
          <Trophy className="w-8 h-8 text-yellow-600 dark:text-yellow-500" />
        </div>
        <h1 className="text-4xl font-black tracking-tight">Hall of Fame</h1>
        <p className="text-gray-500 dark:text-gray-400 text-lg">Permanent archives of the top fencers at the close of past seasons.</p>
      </div>

      <div className="bg-white dark:bg-gray-900 rounded-3xl shadow-sm border dark:border-gray-800 p-8 space-y-8 text-center">
        <h2 className="text-2xl font-bold">2023-2024 Season</h2>
        <p className="text-gray-500 dark:text-gray-400">
          No data was recorded for the 2023-2024 season in the new digital system. 
        </p>
      </div>

      <div className="bg-white dark:bg-gray-900 rounded-3xl shadow-sm border border-blue-200 dark:border-blue-900/50 p-8 space-y-8 text-center relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 to-cyan-400"></div>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">2024-2025 Season</h2>
        <p className="text-gray-500 dark:text-gray-400">
          The current season is still active! Check back in July to see who is permanently enshrined in the 2024-2025 Hall of Fame based on the final standing of the rolling points system.
        </p>
      </div>
    </div>
  )
}
