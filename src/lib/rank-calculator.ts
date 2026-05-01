import { prisma } from '@/lib/prisma'

/**
 * Recalculates the tiers for all fencers based on their total points
 * over the past 365 days across all weapons.
 * 
 * Percentiles:
 * Top 5%   -> Diamond
 * Next 10% -> Platinum
 * Next 20% -> Gold
 * Next 30% -> Silver
 * Bottom 35% -> Bronze
 * 0 points -> Unranked
 */
export async function recalculateAllTiers() {
  const oneYearAgo = new Date()
  oneYearAgo.setFullYear(oneYearAgo.getFullYear() - 1)

  // Get all fencers with their recent results
  const fencers = await prisma.fencer.findMany({
    include: {
      results: {
        where: {
          createdAt: {
            gte: oneYearAgo
          }
        }
      }
    }
  })

  // Calculate total points for each fencer
  const fencerPoints = fencers.map(f => {
    const totalPoints = f.results.reduce((sum, r) => sum + r.pointsEarned, 0)
    return { id: f.id, totalPoints }
  })

  // Filter out inactive fencers (0 points) and sort descending
  const activeFencers = fencerPoints
    .filter(f => f.totalPoints > 0)
    .sort((a, b) => b.totalPoints - a.totalPoints)

  const totalActive = activeFencers.length

  if (totalActive === 0) return

  // Calculate index thresholds
  const diamondLimit = Math.max(1, Math.floor(totalActive * 0.05))
  const platinumLimit = Math.max(diamondLimit + 1, Math.floor(totalActive * 0.15))
  const goldLimit = Math.max(platinumLimit + 1, Math.floor(totalActive * 0.35))
  const silverLimit = Math.max(goldLimit + 1, Math.floor(totalActive * 0.65))

  // Prepare bulk updates
  const updates = []

  for (let i = 0; i < totalActive; i++) {
    const fencer = activeFencers[i]
    let newTier = 'Bronze'

    if (i < diamondLimit) {
      newTier = 'Diamond'
    } else if (i < platinumLimit) {
      newTier = 'Platinum'
    } else if (i < goldLimit) {
      newTier = 'Gold'
    } else if (i < silverLimit) {
      newTier = 'Silver'
    }

    updates.push(
      prisma.fencer.update({
        where: { id: fencer.id },
        data: { tier: newTier }
      })
    )
  }

  // Update inactive fencers to Unranked
  const inactiveFencers = fencerPoints.filter(f => f.totalPoints === 0)
  for (const fencer of inactiveFencers) {
    updates.push(
      prisma.fencer.update({
        where: { id: fencer.id },
        data: { tier: 'Unranked' }
      })
    )
  }

  // Execute all updates in a transaction
  await prisma.$transaction(updates)
}
