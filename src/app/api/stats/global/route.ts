import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    const fencers = await prisma.fencer.findMany({
      include: {
        results: true
      }
    })

    const clubs = Array.from(new Set(fencers.map(f => f.club).filter(Boolean)))
    
    // Sort fencers by number of events
    const mostActive = [...fencers].sort((a, b) => b.results.length - a.results.length).slice(0, 5)

    // Overall metrics
    const totalEvents = await prisma.event.count()
    const totalTournaments = await prisma.tournament.count()

    return NextResponse.json({
      totalFencers: fencers.length,
      totalClubs: clubs.length,
      totalTournaments,
      totalEvents,
      mostActive: mostActive.map(f => ({ id: f.id, name: `${f.firstName} ${f.lastName}`, events: f.results.length }))
    })

  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch global stats' }, { status: 500 })
  }
}
