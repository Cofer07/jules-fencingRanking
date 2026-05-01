import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

import { NextRequest } from 'next/server'

export async function GET(
  req: NextRequest,
  context: { params: Promise<{ name: string }> }
) {
  try {
    const params = await context.params
    const decodedName = decodeURIComponent(params.name)
    const fencers = await prisma.fencer.findMany({
      where: { club: decodedName },
      include: {
        results: {
          include: {
            event: {
              include: {
                tournament: true
              }
            }
          }
        }
      }
    })

    if (!fencers.length) {
      return NextResponse.json({ error: 'Club not found or has no active fencers' }, { status: 404 })
    }

    let totalPoints = 0
    let totalGold = 0
    let totalSilver = 0
    let totalBronze = 0
    let totalTop8 = 0
    const oneYearAgo = new Date()
    oneYearAgo.setFullYear(oneYearAgo.getFullYear() - 1)

    // Calculate aggregated stats across all fencers in the club for the past 365 days
    fencers.forEach(f => {
      f.results.forEach(r => {
        if (new Date(r.createdAt) >= oneYearAgo) {
          totalPoints += r.pointsEarned
          if (r.placement === 1) totalGold++
          if (r.placement === 2) totalSilver++
          if (r.placement === 3) totalBronze++
          if (r.placement <= 8) totalTop8++
        }
      })
    })

    // Sort fencers by their current points contribution
    const topFencers = fencers.map(f => {
      const fencerPoints = f.results
        .filter(r => new Date(r.createdAt) >= oneYearAgo)
        .reduce((sum, r) => sum + r.pointsEarned, 0)
      return { ...f, currentPoints: fencerPoints }
    }).sort((a, b) => b.currentPoints - a.currentPoints).slice(0, 10) // top 10

    return NextResponse.json({
      name: decodedName,
      totalPoints,
      fencerCount: fencers.length,
      medals: {
        gold: totalGold,
        silver: totalSilver,
        bronze: totalBronze,
        top8: totalTop8
      },
      topFencers
    })
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch club data' }, { status: 500 })
  }
}
