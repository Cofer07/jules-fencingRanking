import Link from 'next/link'

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-6 text-center">
      <h1 className="text-5xl font-extrabold text-gray-900 mb-6">Maritime Fencing Rankings</h1>
      <p className="text-xl text-gray-600 mb-10 max-w-2xl">
        The official central repository for tournament results and fencer rankings in the Maritimes.
      </p>
      
      <div className="flex gap-4">
        <Link 
          href="/rankings" 
          className="bg-blue-600 text-white px-8 py-4 rounded-xl font-bold text-lg hover:bg-blue-700 shadow-lg transition"
        >
          View Rankings
        </Link>
        <Link 
          href="/admin" 
          className="bg-white text-blue-600 border border-blue-200 px-8 py-4 rounded-xl font-bold text-lg hover:bg-blue-50 shadow-lg transition"
        >
          Organizer Login
        </Link>
      </div>
    </div>
  )
}
