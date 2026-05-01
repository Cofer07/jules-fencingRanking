import { NextResponse, NextRequest } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const params = await context.params
    const fencer = await prisma.fencer.findUnique({
      where: { id: params.id },
      include: {
        results: {
          include: {
            event: {
              include: {
                tournament: true
              }
            }
          },
          orderBy: {
            createdAt: 'asc'
          }
        }
      }
    })

    if (!fencer) {
      return NextResponse.json({ error: 'Fencer not found' }, { status: 404 })
    }

    // Calculate medal counts and consistency metrics
    let gold = 0, silver = 0, bronze = 0, top8 = 0
    let totalPoints = 0

    fencer.results.forEach(r => {
      totalPoints += r.pointsEarned
      if (r.placement === 1) gold++
      else if (r.placement === 2) silver++
      else if (r.placement === 3) bronze++
      else if (r.placement <= 8) top8++
    })

    const activeEvents = fencer.results.length
    const winRate = activeEvents > 0 ? ((gold + silver + bronze) / activeEvents * 100).toFixed(1) : "0.0"

    const enrichedFencer = {
      ...fencer,
      stats: {
        gold,
        silver,
        bronze,
        top8,
        totalPoints,
        activeEvents,
        winRate
      }
    }

    return NextResponse.json(enrichedFencer)
  } catch (error) {
    console.error(error)
    return NextResponse.json({ error: 'Failed to fetch fencer profile' }, { status: 500 })
  }
}
