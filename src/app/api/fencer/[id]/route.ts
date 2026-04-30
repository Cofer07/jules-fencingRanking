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

    return NextResponse.json(fencer)
  } catch (error) {
    console.error(error)
    return NextResponse.json({ error: 'Failed to fetch fencer profile' }, { status: 500 })
  }
}
