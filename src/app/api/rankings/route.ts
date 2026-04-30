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
      if (r.event.gender === 'Mixed' && r.fencer.gender !== gender) {
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

    return NextResponse.json(ranking)
  } catch (error) {
    console.error(error)
    return NextResponse.json({ error: 'Failed to fetch rankings' }, { status: 500 })
  }
}
