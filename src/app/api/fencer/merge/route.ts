import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { recalculateAllTiers } from '@/lib/rank-calculator'

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions)
    if (!session || (session.user.role !== 'ADMIN' && session.user.role !== 'ORGANIZER')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { primaryId, duplicateId } = await req.json()

    if (!primaryId || !duplicateId || primaryId === duplicateId) {
      return NextResponse.json({ error: 'Invalid parameters. Please provide two distinct Fencer IDs.' }, { status: 400 })
    }

    // Verify both exist
    const primary = await prisma.fencer.findUnique({ where: { id: primaryId } })
    const duplicate = await prisma.fencer.findUnique({ where: { id: duplicateId } })

    if (!primary || !duplicate) {
      return NextResponse.json({ error: 'One or both fencers not found' }, { status: 404 })
    }

    // Move all results from duplicate to primary
    await prisma.result.updateMany({
      where: { fencerId: duplicateId },
      data: { fencerId: primaryId }
    })

    // Delete the duplicate
    await prisma.fencer.delete({
      where: { id: duplicateId }
    })

    // Recalculate percentiles dynamically
    await recalculateAllTiers()

    return NextResponse.json({ success: true, message: `Successfully merged ${duplicateId} into ${primaryId}` })
  } catch (error) {
    console.error('Error merging fencers:', error)
    return NextResponse.json({ error: 'Failed to merge fencers' }, { status: 500 })
  }
}
