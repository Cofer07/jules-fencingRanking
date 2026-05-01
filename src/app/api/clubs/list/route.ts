import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    const clubs = await prisma.club.findMany({
      orderBy: { name: 'asc' }
    })
    return NextResponse.json(clubs)
  } catch (error) {
    console.error(error)
    return NextResponse.json({ error: 'Failed to fetch clubs' }, { status: 500 })
  }
}
