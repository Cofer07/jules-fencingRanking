import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

const TIER_FORCE: Record<string, number> = {
  'Diamond': 15,
  'Platinum': 10,
  'Gold': 5,
  'Silver': 3,
  'Bronze': 1 // Adding bronze as minimal baseline
}

const MINIMUM_FORCE: Record<string, number> = {
  'Senior': 30,
  'Junior': 20,
  'Veteran': 20,
  'Cadet': 10,
  'U15': 10,
}

// Map common CSV input variations to their unified names
const CLUB_ALIASES: Record<string, string> = {
  'dfc': 'Damocles Fencing Club',
  'damocles': 'Damocles Fencing Club',
  'damocles fencing club': 'Damocles Fencing Club',
  'fundy': 'Fundy Fencing Club',
  'fundy fencing': 'Fundy Fencing Club',
  'fundy fencing club': 'Fundy Fencing Club',
  'ffc': 'Fundy Fencing Club',
  'unb': 'UNB Fencing Club',
  'unb fencing': 'UNB Fencing Club',
  'unb fencing club': 'UNB Fencing Club',
  'moncton': 'Moncton Fencing Club',
  'moncton fencing': 'Moncton Fencing Club',
  'mfc': 'Moncton Fencing Club'
}

function normalizeClubName(rawName: string | null | undefined): string | null {
  if (!rawName) return null;
  const lower = rawName.trim().toLowerCase();
  return CLUB_ALIASES[lower] || rawName.trim();
}

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions)
    if (!session || (session.user.role !== 'ADMIN' && session.user.role !== 'ORGANIZER')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { eventId, results } = await req.json()

    if (!eventId || !results || !Array.isArray(results) || results.length === 0) {
      return NextResponse.json({ error: 'Invalid payload' }, { status: 400 })
    }

    const event = await prisma.event.findUnique({
      where: { id: eventId },
      include: { tournament: true }
    })

    if (!event) {
      return NextResponse.json({ error: 'Event not found' }, { status: 404 })
    }

    const N = results.length

    // Sync Fencers and get their tiers
    const fencersInEvent = []
    let totalForce = 0

    for (const r of results) {
      const fencerId = r.id || r['Fencer ID'] || `TMP-${Math.random().toString(36).substr(2, 6)}`
      
      // Normalize Gender to "M" or "F"
      const rawGender = (r.gender || r['Gender'] || '').toUpperCase()
      let normalizedGender = 'M' // default fallback
      if (rawGender.startsWith('F') || rawGender.startsWith('W')) {
        normalizedGender = 'F'
      } else if (rawGender.startsWith('M')) {
        normalizedGender = 'M'
      }

      const rawClub = r.club || r['Club'] || null
      const normalizedClub = normalizeClubName(rawClub)

      const fencer = await prisma.fencer.upsert({
        where: { id: fencerId },
        update: {
          firstName: r.firstName || r['First Name'],
          lastName: r.lastName || r['Last Name'],
          gender: normalizedGender,
          club: normalizedClub,
        },
        create: {
          id: fencerId,
          firstName: r.firstName || r['First Name'],
          lastName: r.lastName || r['Last Name'],
          gender: normalizedGender,
          club: normalizedClub,
          tier: 'Bronze', // default
        }
      })
      
      fencersInEvent.push({ fencer, placement: parseInt(r.placement || r['Final Placement'], 10) })
      totalForce += TIER_FORCE[fencer.tier] || 0
    }

    // Determine F (Force)
    const categoryPrefix = Object.keys(MINIMUM_FORCE).find(k => event.category.toLowerCase().includes(k.toLowerCase())) || 'Senior'
    const minForce = MINIMUM_FORCE[categoryPrefix] || 30
    
    const F = Math.max(totalForce, minForce)

    // Calculate Points and Save Results
    // R = F * (1.006 - (log P/log N))
    const logN = Math.log10(N)

    const savedResults = []
    for (const data of fencersInEvent) {
      const P = data.placement
      let points = 0
      
      // Edge cases: if N=1, give them points equivalent to finishing first in a tiny event
      if (N <= 1) {
        points = F
      } else {
        const logP = Math.log10(P)
        points = F * (1.006 - (logP / logN))
      }
      
      // Points to 1 decimal place
      points = Math.round(points * 10) / 10

      // Only allow 1 result per fencer per event
      const result = await prisma.result.create({
        data: {
          eventId,
          fencerId: data.fencer.id,
          placement: P,
          pointsEarned: points,
        }
      })
      savedResults.push(result)
    }

    return NextResponse.json({ success: true, count: savedResults.length })

  } catch (error) {
    console.error('Error uploading results:', error)
    return NextResponse.json({ error: 'Failed to upload results' }, { status: 500 })
  }
}
