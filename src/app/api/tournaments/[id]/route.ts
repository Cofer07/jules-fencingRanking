import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { recalculateAllTiers } from '@/lib/rank-calculator'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

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

export async function PUT(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions)
    if (!session || (session.user.role !== 'ADMIN' && session.user.role !== 'ORGANIZER')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const params = await context.params
    const data = await req.json()

    const updated = await prisma.tournament.update({
      where: { id: params.id },
      data: {
        name: data.name,
        date: new Date(data.date),
        location: data.location
      }
    })

    return NextResponse.json(updated)
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update tournament' }, { status: 500 })
  }
}

export async function DELETE(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions)
    if (!session || (session.user.role !== 'ADMIN' && session.user.role !== 'ORGANIZER')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const params = await context.params
    await prisma.tournament.delete({
      where: { id: params.id }
    })

    // Recalculate percentiles dynamically now that points were removed
    await recalculateAllTiers()

    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete tournament' }, { status: 500 })
  }
}
