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

    // Medals per Club (Olympics Style)
    // We count all results in the DB (all-time) for the medal table
    const allResults = await prisma.result.findMany({
      where: {
        placement: { in: [1, 2, 3] }
      },
      include: {
        fencer: true
      }
    })

    const clubMedals: Record<string, { gold: number, silver: number, bronze: number, total: number }> = {}

    for (const r of allResults) {
      const clubName = r.fencer.club
      if (!clubName) continue

      if (!clubMedals[clubName]) {
        clubMedals[clubName] = { gold: 0, silver: 0, bronze: 0, total: 0 }
      }

      if (r.placement === 1) clubMedals[clubName].gold++
      if (r.placement === 2) clubMedals[clubName].silver++
      if (r.placement === 3) clubMedals[clubName].bronze++
      
      clubMedals[clubName].total++
    }

    const medalTable = Object.entries(clubMedals).map(([club, medals]) => ({
      club,
      ...medals
    }))
    // Sort by Gold, then Silver, then Bronze (Olympics Standard)
    .sort((a, b) => {
      if (b.gold !== a.gold) return b.gold - a.gold
      if (b.silver !== a.silver) return b.silver - a.silver
      return b.bronze - a.bronze
    })

    // Overall metrics
    const totalEvents = await prisma.event.count()
    const totalTournaments = await prisma.tournament.count()

    return NextResponse.json({
      totalFencers: fencers.length,
      totalClubs: clubs.length,
      totalTournaments,
      totalEvents,
      mostActive: mostActive.map(f => ({ id: f.id, name: `${f.firstName} ${f.lastName}`, events: f.results.length })),
      medalTable
    })

  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch global stats' }, { status: 500 })
  }
}
