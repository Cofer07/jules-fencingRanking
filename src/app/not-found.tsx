import Link from 'next/link'
import { Map, Home, Search } from 'lucide-react'

export default function NotFound() {
  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center text-center px-4 animate-in fade-in zoom-in duration-500">
      <div className="bg-gray-100 dark:bg-gray-800 p-6 rounded-full mb-8 relative">
        <Map className="w-16 h-16 text-gray-400 dark:text-gray-500" />
        <div className="absolute -bottom-2 -right-2 bg-blue-100 dark:bg-blue-900/50 p-2 rounded-full border-4 border-white dark:border-gray-950">
          <Search className="w-6 h-6 text-blue-600 dark:text-blue-400" />
        </div>
      </div>
      
      <h1 className="text-6xl font-black tracking-tight text-gray-900 dark:text-white mb-2">
        404
      </h1>
      <h2 className="text-2xl font-bold text-gray-700 dark:text-gray-300 mb-4">
        Page Not Found
      </h2>
      
      <p className="text-lg text-gray-600 dark:text-gray-400 max-w-lg mb-8">
        We searched the entire venue, but we couldn&apos;t find the page you&apos;re looking for. It might have been moved or deleted.
      </p>

      <div className="flex flex-col sm:flex-row gap-4 w-full max-w-sm justify-center">
        <Link 
          href="/"
          className="flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-8 rounded-xl transition-all shadow-sm"
        >
          <Home className="w-5 h-5" />
          Return to Rankings
        </Link>
      </div>
    </div>
  )
}
