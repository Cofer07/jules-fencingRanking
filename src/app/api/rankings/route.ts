import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const weapon = searchParams.get('weapon') || 'Epee'
  const gender = searchParams.get('gender') || 'M'
  const category = searchParams.get('category') || 'Senior'

  try {
    const oneYearAgo = new Date()
    oneYearAgo.setFullYear(oneYearAgo.getFullYear() - 1)

    // Find all results matching criteria within 365 days
    const results = await prisma.result.findMany({
      where: {
        event: {
          weapon,
          category,
          OR: [
            { gender },
            { gender: 'Mixed' }
          ]
        },
        createdAt: {
          gte: oneYearAgo
        }
      },
      include: {
        fencer: true,
        event: true,
      }
    })

    // Aggregate points per fencer
    const aggregated: Record<string, any> = {}

    results.forEach(r => {
      // If event is mixed but looking for 'M' or 'F', we only sum if fencer's gender matches
      // However, if we filter by 'Mixed', we don't care about fencer's gender
      if (gender !== 'Mixed' && r.event.gender === 'Mixed' && r.fencer.gender !== gender) {
        return
      }

      // If we're looking for 'M' or 'F' specifically, make sure the fencer is that gender
      if (gender !== 'Mixed' && r.fencer.gender !== gender) {
        return
      }

      if (!aggregated[r.fencer.id]) {
        aggregated[r.fencer.id] = {
          fencer: r.fencer,
          totalPoints: 0,
          resultsCount: 0
        }
      }
      aggregated[r.fencer.id].totalPoints += r.pointsEarned
      aggregated[r.fencer.id].resultsCount += 1
    })

    const ranking = Object.values(aggregated).sort((a, b) => b.totalPoints - a.totalPoints)

    const totalActive = ranking.length
    const diamondLimit = Math.max(1, Math.floor(totalActive * 0.05))
    const platinumLimit = Math.max(diamondLimit + 1, Math.floor(totalActive * 0.15))
    const goldLimit = Math.max(platinumLimit + 1, Math.floor(totalActive * 0.35))
    const silverLimit = Math.max(goldLimit + 1, Math.floor(totalActive * 0.65))

    const computedRanking = ranking.map((r, idx) => {
      let tier = 'Bronze'
      if (idx < diamondLimit) tier = 'Diamond'
      else if (idx < platinumLimit) tier = 'Platinum'
      else if (idx < goldLimit) tier = 'Gold'
      else if (idx < silverLimit) tier = 'Silver'

      return {
        ...r,
        rank: idx + 1,
        tier
      }
    })

    return NextResponse.json(computedRanking)
  } catch (error) {
    console.error(error)
    return NextResponse.json({ error: 'Failed to fetch rankings' }, { status: 500 })
  }
}
