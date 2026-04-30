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

    const { name, date, location } = await req.json()

    if (!name || !date) {
      return NextResponse.json({ error: 'Name and date are required' }, { status: 400 })
    }

    const tournament = await prisma.tournament.create({
      data: {
        name,
        date: new Date(date),
        location,
      },
    })

    return NextResponse.json(tournament)
  } catch (error) {
    console.error('Error creating tournament:', error)
    return NextResponse.json({ error: 'Failed to create tournament' }, { status: 500 })
  }
}

export async function GET(req: Request) {
  try {
    const tournaments = await prisma.tournament.findMany({
      orderBy: { date: 'desc' }
    })
    return NextResponse.json(tournaments)
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch tournaments' }, { status: 500 })
  }
}
