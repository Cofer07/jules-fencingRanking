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
    <div className="space-y-8 max-w-2xl">
      <section className="bg-white p-6 rounded shadow">
        <h2 className="text-lg font-semibold mb-4">1. Create Tournament</h2>
        <div className="space-y-4">
          <input className="border p-2 w-full" placeholder="Tournament Name" value={tournamentName} onChange={e => setTournamentName(e.target.value)} />
          <input className="border p-2 w-full" type="date" value={tournamentDate} onChange={e => setTournamentDate(e.target.value)} />
          <input className="border p-2 w-full" placeholder="Location" value={tournamentLocation} onChange={e => setTournamentLocation(e.target.value)} />
          <button className="bg-blue-600 text-white px-4 py-2 rounded" onClick={createTournament}>Create Tournament</button>
          {createdTournamentId && <p className="text-green-600">Tournament created! ID: {createdTournamentId}</p>}
        </div>
      </section>

      {createdTournamentId && (
        <section className="bg-white p-6 rounded shadow">
          <h2 className="text-lg font-semibold mb-4">2. Create Event in Tournament</h2>
          <div className="space-y-4">
            <select className="border p-2 w-full" value={weapon} onChange={e => setWeapon(e.target.value)}>
              <option>Epee</option>
              <option>Foil</option>
              <option>Sabre</option>
            </select>
            <input className="border p-2 w-full" placeholder="Category (e.g., Senior, Cadet)" value={category} onChange={e => setCategory(e.target.value)} />
            <select className="border p-2 w-full" value={gender} onChange={e => setGender(e.target.value)}>
              <option>Mixed</option>
              <option>M</option>
              <option>F</option>
            </select>
            <button className="bg-blue-600 text-white px-4 py-2 rounded" onClick={createEvent}>Create Event</button>
            {createdEventId && <p className="text-green-600">Event created! ID: {createdEventId}</p>}
          </div>
        </section>
      )}

      {createdEventId && (
        <section className="bg-white p-6 rounded shadow">
          <h2 className="text-lg font-semibold mb-4">3. Upload CSV Results</h2>
          <p className="text-sm text-gray-500 mb-4">CSV Headers expected: `Fencer ID`, `First Name`, `Last Name`, `Gender`, `Club`, `Final Placement`</p>
          <div className="space-y-4">
            <input type="file" accept=".csv" onChange={e => setCsvFile(e.target.files?.[0] || null)} />
            <button className="bg-green-600 text-white px-4 py-2 rounded" onClick={handleFileUpload}>Upload Results</button>
            {uploadStatus && <p>{uploadStatus}</p>}
          </div>
        </section>
      )}
    </div>
  )
}
