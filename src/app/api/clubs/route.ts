import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(req: Request) {
  try {
    const oneYearAgo = new Date()
    oneYearAgo.setFullYear(oneYearAgo.getFullYear() - 1)

    // Find all results within 365 days
    const results = await prisma.result.findMany({
      where: {
        createdAt: {
          gte: oneYearAgo
        }
      },
      include: {
        fencer: true,
      }
    })

    // Aggregate points per club
    const clubScores: Record<string, number> = {}

    results.forEach(r => {
      const club = r.fencer.club || 'Unaffiliated'
      if (!clubScores[club]) clubScores[club] = 0
      clubScores[club] += r.pointsEarned
    })

    const leaderboard = Object.entries(clubScores)
      .map(([name, points]) => ({ name, points: Math.round(points * 10) / 10 }))
      .sort((a, b) => b.points - a.points)

    return NextResponse.json(leaderboard)
  } catch (error) {
    console.error(error)
    return NextResponse.json({ error: 'Failed to fetch clubs leaderboard' }, { status: 500 })
  }
}
