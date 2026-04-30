import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions)
    if (!session || (session.user.role !== 'ADMIN' && session.user.role !== 'ORGANIZER')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { tournamentId, weapon, category, gender } = await req.json()

    if (!tournamentId || !weapon || !category || !gender) {
      return NextResponse.json({ error: 'All fields are required' }, { status: 400 })
    }

    const event = await prisma.event.create({
      data: {
        tournamentId,
        weapon,
        category,
        gender,
      },
    })

    return NextResponse.json(event)
  } catch (error) {
    console.error('Error creating event:', error)
    return NextResponse.json({ error: 'Failed to create event' }, { status: 500 })
  }
}

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const tournamentId = searchParams.get('tournamentId')
  
  try {
    const events = await prisma.event.findMany({
      where: tournamentId ? { tournamentId } : undefined,
      include: { tournament: true }
    })
    return NextResponse.json(events)
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch events' }, { status: 500 })
  }
}
