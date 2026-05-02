'use client'

import { useEffect } from 'react'
import Link from 'next/link'
import { AlertTriangle, Home, RefreshCw } from 'lucide-react'

export default function ErrorBoundary({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error('Global Error Caught:', error)
  }, [error])

  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center text-center px-4 animate-in fade-in zoom-in duration-500">
      <div className="bg-red-50 dark:bg-red-950/30 p-6 rounded-full mb-8">
        <AlertTriangle className="w-16 h-16 text-red-500 dark:text-red-400" />
      </div>
      
      <h1 className="text-4xl font-black tracking-tight text-gray-900 dark:text-white mb-4">
        Oops! Something went wrong.
      </h1>
      
      <p className="text-lg text-gray-600 dark:text-gray-400 max-w-lg mb-8">
        We hit an unexpected error while trying to load this page. Our team has been notified.
      </p>

      <div className="flex flex-col sm:flex-row gap-4 w-full max-w-sm">
        <button
          onClick={() => reset()}
          className="flex-1 flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-xl transition-all shadow-sm"
        >
          <RefreshCw className="w-5 h-5" />
          Try Again
        </button>
        <Link 
          href="/"
          className="flex-1 flex items-center justify-center gap-2 bg-white dark:bg-gray-800 text-gray-900 dark:text-white border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 font-bold py-3 px-6 rounded-xl transition-all shadow-sm"
        >
          <Home className="w-5 h-5" />
          Go Home
        </Link>
      </div>
    </div>
  )
}
