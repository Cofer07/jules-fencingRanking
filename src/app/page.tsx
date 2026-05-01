import Link from 'next/link'
import Image from 'next/image'

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh] text-center space-y-12 animate-in fade-in zoom-in duration-500">
      
      <div className="bg-white dark:bg-gray-800 p-6 rounded-3xl shadow-xl dark:shadow-none">
        <Image 
          src="/FencingNB-Logo-FullColour.jpg" 
          alt="Fencing Escrime NB" 
          width={400} 
          height={200} 
          className="object-contain"
          priority
        />
      </div>

      <div className="max-w-2xl space-y-6">
        <h1 className="text-5xl md:text-6xl font-black tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-cyan-500 dark:from-blue-400 dark:to-cyan-300">
          Maritime Fencing Rankings
        </h1>
        <p className="text-xl text-gray-600 dark:text-gray-300">
          The official central repository for tournament results, club leaderboards, and individual fencer progression across the Maritimes.
        </p>
      </div>
      
      <div className="flex flex-col sm:flex-row gap-6 w-full max-w-md justify-center">
        <Link 
          href="/rankings" 
          className="w-full sm:w-auto bg-blue-600 text-white px-8 py-4 rounded-xl font-bold text-lg hover:bg-blue-700 hover:scale-105 transition-all shadow-lg hover:shadow-blue-500/25"
        >
          View Rankings
        </Link>
        <Link 
          href="/admin" 
          className="w-full sm:w-auto bg-white dark:bg-gray-800 text-gray-900 dark:text-white border-2 border-gray-200 dark:border-gray-700 px-8 py-4 rounded-xl font-bold text-lg hover:bg-gray-50 dark:hover:bg-gray-700 hover:scale-105 transition-all shadow-lg"
        >
          Organizer Login
        </Link>
      </div>

      <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8 text-left w-full max-w-4xl opacity-80">
        <div className="bg-white dark:bg-gray-900 p-6 rounded-2xl border dark:border-gray-800 shadow-sm">
          <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/50 rounded-lg flex items-center justify-center mb-4">
            <span className="text-2xl">🏆</span>
          </div>
          <h3 className="text-xl font-bold mb-2">Rolling Standings</h3>
          <p className="text-gray-600 dark:text-gray-400 text-sm">Dynamic 365-day tracking utilizing the official CFF force formula adapted for regional play.</p>
        </div>
        <div className="bg-white dark:bg-gray-900 p-6 rounded-2xl border dark:border-gray-800 shadow-sm">
          <div className="w-12 h-12 bg-emerald-100 dark:bg-emerald-900/50 rounded-lg flex items-center justify-center mb-4">
            <span className="text-2xl">📈</span>
          </div>
          <h3 className="text-xl font-bold mb-2">Detailed Analytics</h3>
          <p className="text-gray-600 dark:text-gray-400 text-sm">Every fencer gets a beautiful profile visualizing their cumulative points trajectory over time.</p>
        </div>
        <div className="bg-white dark:bg-gray-900 p-6 rounded-2xl border dark:border-gray-800 shadow-sm">
          <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/50 rounded-lg flex items-center justify-center mb-4">
            <span className="text-2xl">🏅</span>
          </div>
          <h3 className="text-xl font-bold mb-2">Shareable Badges</h3>
          <p className="text-gray-600 dark:text-gray-400 text-sm">Fencers can easily download and share their rank tier and standing directly to social media.</p>
        </div>
      </div>
    </div>
  )
}
