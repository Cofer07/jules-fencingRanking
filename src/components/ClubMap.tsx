'use client'

import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet'
import 'leaflet/dist/leaflet.css'
import L from 'leaflet'

// Fix for default marker icons in Next.js + Leaflet
const icon = L.icon({
  iconUrl: '/marker-icon.png',
  iconRetinaUrl: '/marker-icon-2x.png',
  shadowUrl: '/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  tooltipAnchor: [16, -28],
  shadowSize: [41, 41]
})

export default function ClubMap({ clubs }: { clubs: any[] }) {
  // Center roughly on New Brunswick
  const center: [number, number] = [46.5653, -66.4619]

  return (
    <div className="h-[600px] w-full rounded-2xl overflow-hidden border dark:border-gray-800 shadow-sm">
      <MapContainer center={center} zoom={7} scrollWheelZoom={false} className="h-full w-full">
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {clubs.map((club, idx) => (
          club.lat && club.lng ? (
            <Marker key={idx} position={[club.lat, club.lng]} icon={icon}>
              <Popup>
                <div className="text-center font-sans">
                  <h3 className="font-bold text-lg mb-1">{club.name}</h3>
                  <a href={`/clubs/${encodeURIComponent(club.name)}`} className="text-blue-600 hover:underline text-sm font-semibold">
                    View Club Profile
                  </a>
                </div>
              </Popup>
            </Marker>
          ) : null
        ))}
      </MapContainer>
    </div>
  )
}
