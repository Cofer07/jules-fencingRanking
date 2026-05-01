'use client'

import { useState } from 'react'
import Papa from 'papaparse'

export default function AdminDashboard() {
  const [tournamentName, setTournamentName] = useState('')
  const [tournamentDate, setTournamentDate] = useState('')
  const [tournamentLocation, setTournamentLocation] = useState('')

  const [createdTournamentId, setCreatedTournamentId] = useState('')

  const [weapon, setWeapon] = useState('Epee')
  const [category, setCategory] = useState('Senior')
  const [gender, setGender] = useState('Mixed')

  const [createdEventId, setCreatedEventId] = useState('')
  
  const [csvFile, setCsvFile] = useState<File | null>(null)
  const [uploadStatus, setUploadStatus] = useState('')

  const createTournament = async () => {
    const res = await fetch('/api/tournaments', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: tournamentName, date: tournamentDate, location: tournamentLocation })
    })
    const data = await res.json()
    if (data.id) setCreatedTournamentId(data.id)
  }

  const createEvent = async () => {
    const res = await fetch('/api/events', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ tournamentId: createdTournamentId, weapon, category, gender })
    })
    const data = await res.json()
    if (data.id) setCreatedEventId(data.id)
  }

  const handleFileUpload = async () => {
    if (!csvFile || !createdEventId) return
    setUploadStatus('Parsing...')

    Papa.parse(csvFile, {
      header: true,
      skipEmptyLines: true,
      complete: async (results) => {
        setUploadStatus('Uploading...')
        const res = await fetch('/api/results/upload', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ eventId: createdEventId, results: results.data })
        })
        const data = await res.json()
        if (data.success) {
          setUploadStatus(`Success! Uploaded ${data.count} results.`)
        } else {
          setUploadStatus(`Error: ${data.error}`)
        }
      }
    })
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <section className="bg-white dark:bg-gray-900 p-6 sm:p-8 rounded-2xl shadow-sm border dark:border-gray-800">
        <div className="flex items-center gap-3 mb-6">
          <div className="bg-blue-100 dark:bg-blue-900/50 text-blue-600 dark:text-blue-400 font-bold w-8 h-8 rounded-full flex items-center justify-center">1</div>
          <h2 className="text-xl font-bold">Create Tournament</h2>
        </div>
        <div className="space-y-4">
          <input className="bg-gray-50 dark:bg-gray-950 border dark:border-gray-800 rounded-lg p-3 w-full outline-none focus:ring-2 focus:ring-blue-500 transition-shadow" placeholder="Tournament Name" value={tournamentName} onChange={e => setTournamentName(e.target.value)} />
          <input className="bg-gray-50 dark:bg-gray-950 border dark:border-gray-800 rounded-lg p-3 w-full outline-none focus:ring-2 focus:ring-blue-500 transition-shadow" type="date" value={tournamentDate} onChange={e => setTournamentDate(e.target.value)} />
          <input className="bg-gray-50 dark:bg-gray-950 border dark:border-gray-800 rounded-lg p-3 w-full outline-none focus:ring-2 focus:ring-blue-500 transition-shadow" placeholder="Location" value={tournamentLocation} onChange={e => setTournamentLocation(e.target.value)} />
          <button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded-lg transition-colors shadow-sm" onClick={createTournament}>Create Tournament</button>
          {createdTournamentId && <div className="p-3 bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400 rounded-lg text-sm font-medium">✓ Tournament created! ID: {createdTournamentId}</div>}
        </div>
      </section>

      {createdTournamentId && (
        <section className="bg-white dark:bg-gray-900 p-6 sm:p-8 rounded-2xl shadow-sm border dark:border-gray-800 animate-in slide-in-from-top-4 duration-300">
          <div className="flex items-center gap-3 mb-6">
            <div className="bg-blue-100 dark:bg-blue-900/50 text-blue-600 dark:text-blue-400 font-bold w-8 h-8 rounded-full flex items-center justify-center">2</div>
            <h2 className="text-xl font-bold">Create Event</h2>
          </div>
          <div className="space-y-4">
            <select className="bg-gray-50 dark:bg-gray-950 border dark:border-gray-800 rounded-lg p-3 w-full outline-none focus:ring-2 focus:ring-blue-500 transition-shadow" value={weapon} onChange={e => setWeapon(e.target.value)}>
              <option>Epee</option>
              <option>Foil</option>
              <option>Sabre</option>
            </select>
            <input className="bg-gray-50 dark:bg-gray-950 border dark:border-gray-800 rounded-lg p-3 w-full outline-none focus:ring-2 focus:ring-blue-500 transition-shadow" placeholder="Category (e.g., Senior, Cadet)" value={category} onChange={e => setCategory(e.target.value)} />
            <select className="bg-gray-50 dark:bg-gray-950 border dark:border-gray-800 rounded-lg p-3 w-full outline-none focus:ring-2 focus:ring-blue-500 transition-shadow" value={gender} onChange={e => setGender(e.target.value)}>
              <option>Mixed</option>
              <option>M</option>
              <option>F</option>
            </select>
            <button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded-lg transition-colors shadow-sm" onClick={createEvent}>Create Event</button>
            {createdEventId && <div className="p-3 bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400 rounded-lg text-sm font-medium">✓ Event created! ID: {createdEventId}</div>}
          </div>
        </section>
      )}

      {createdEventId && (
        <section className="bg-white dark:bg-gray-900 p-6 sm:p-8 rounded-2xl shadow-sm border dark:border-gray-800 animate-in slide-in-from-top-4 duration-300">
          <div className="flex items-center gap-3 mb-4">
            <div className="bg-emerald-100 dark:bg-emerald-900/50 text-emerald-600 dark:text-emerald-400 font-bold w-8 h-8 rounded-full flex items-center justify-center">3</div>
            <h2 className="text-xl font-bold">Upload CSV Results</h2>
          </div>
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-6 bg-gray-50 dark:bg-gray-950 p-4 rounded-lg border dark:border-gray-800 font-mono">
            Expected Headers:<br/>
            <span className="text-blue-600 dark:text-blue-400">`Fencer ID`, `First Name`, `Last Name`, `Gender`, `Club`, `Final Placement`</span>
          </p>
          <div className="space-y-4">
            <input 
              type="file" 
              accept=".csv" 
              onChange={e => setCsvFile(e.target.files?.[0] || null)} 
              className="block w-full text-sm text-gray-500 dark:text-gray-400 file:mr-4 file:py-3 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 dark:file:bg-blue-900/30 dark:file:text-blue-400 transition-all cursor-pointer"
            />
            <button className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3 px-4 rounded-lg transition-colors shadow-sm" onClick={handleFileUpload}>Upload Results</button>
            {uploadStatus && (
              <div className={`p-4 rounded-lg text-sm font-medium ${uploadStatus.includes('Error') ? 'bg-red-50 text-red-700 dark:bg-red-900/20 dark:text-red-400' : 'bg-green-50 text-green-700 dark:bg-green-900/20 dark:text-green-400'}`}>
                {uploadStatus}
              </div>
            )}
          </div>
        </section>
      )}
    </div>
  )
}
