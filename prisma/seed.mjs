import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

async function main() {
  const tournament = await prisma.tournament.create({
    data: {
      name: 'NB Provincial Championships',
      date: new Date('2024-05-15'),
      location: 'Fredericton, NB'
    }
  })

  const event = await prisma.event.create({
    data: {
      tournamentId: tournament.id,
      weapon: 'Epee',
      category: 'Senior',
      gender: 'Mixed'
    }
  })

  const fencer1 = await prisma.fencer.upsert({
    where: { id: 'C10-1234' },
    update: {},
    create: {
      id: 'C10-1234',
      firstName: 'Alice',
      lastName: 'Smith',
      gender: 'F',
      club: 'Damocles'
    }
  })

  const fencer2 = await prisma.fencer.upsert({
    where: { id: 'C10-5678' },
    update: {},
    create: {
      id: 'C10-5678',
      firstName: 'Bob',
      lastName: 'Jones',
      gender: 'M',
      club: 'Fundy Fencing'
    }
  })

  await prisma.result.create({
    data: {
      eventId: event.id,
      fencerId: fencer1.id,
      placement: 1,
      pointsEarned: 100
    }
  })

  await prisma.result.create({
    data: {
      eventId: event.id,
      fencerId: fencer2.id,
      placement: 2,
      pointsEarned: 80
    }
  })

  // Re-calculate tiers
  const fencers = await prisma.fencer.findMany({ include: { results: true } })
  for (const f of fencers) {
    const totalPoints = f.results.reduce((acc, r) => acc + r.pointsEarned, 0)
    let tier = 'Unranked'
    if (totalPoints >= 300) tier = 'Diamond'
    else if (totalPoints >= 200) tier = 'Platinum'
    else if (totalPoints >= 100) tier = 'Gold'
    else if (totalPoints >= 50) tier = 'Silver'
    else if (totalPoints > 0) tier = 'Bronze'

    await prisma.fencer.update({
      where: { id: f.id },
      data: { tier }
    })
  }
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
