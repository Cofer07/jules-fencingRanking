import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

import { NextRequest } from 'next/server'

export async function GET(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const params = await context.params
    const tournament = await prisma.tournament.findUnique({
      where: { id: params.id },
      include: {
        events: {
          include: {
            results: {
              include: {
                fencer: true
              },
              orderBy: {
                placement: 'asc'
              }
            }
          }
        }
      }
    })

    if (!tournament) {
      return NextResponse.json({ error: 'Tournament not found' }, { status: 404 })
    }

    return NextResponse.json(tournament)
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch tournament' }, { status: 500 })
  }
}
