"use client"

import Link from "next/link"
import Image from "next/image"
import { ModeToggle } from "@/components/mode-toggle"
import { usePathname } from "next/navigation"

export default function Navbar() {
  const pathname = usePathname()

  const isActive = (path: string) => {
    return pathname === path ? "text-blue-600 dark:text-blue-400 font-bold" : "text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400"
  }

  return (
    <header className="border-b bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-800 transition-colors duration-300 sticky top-0 z-50 shadow-sm">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between max-w-6xl">
        <Link href="/" className="flex items-center gap-3">
          <div className="bg-white rounded p-1">
            <Image 
              src="/FencingNB-Logo-FullColour.jpg" 
              alt="Fencing NB Logo" 
              width={120} 
              height={40} 
              className="object-contain"
            />
          </div>
          <span className="font-bold text-xl hidden sm:block text-gray-900 dark:text-white">
            Rankings
          </span>
        </Link>

        <nav className="flex items-center gap-6">
          <Link href="/rankings" className={`transition-colors ${isActive('/rankings')}`}>
            Leaderboards
          </Link>
          <Link href="/stats" className={`transition-colors ${isActive('/stats')}`}>
            Insights
          </Link>
          <Link href="/tournaments" className={`transition-colors ${isActive('/tournaments')}`}>
            Tournaments
          </Link>
          <Link href="/admin" className={`transition-colors ${isActive('/admin')}`}>
            Admin
          </Link>
          <div className="pl-4 border-l border-gray-200 dark:border-gray-800">
            <ModeToggle />
          </div>
        </nav>
      </div>
    </header>
  )
}
