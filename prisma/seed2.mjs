import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

async function main() {
  const tournament = await prisma.tournament.create({
    data: {
      name: 'Halifax Open',
      date: new Date('2024-06-20'),
      location: 'Halifax, NS'
    }
  })

  const event = await prisma.event.create({
    data: {
      tournamentId: tournament.id,
      weapon: 'Foil',
      category: 'Senior',
      gender: 'M'
    }
  })

  const fencer1 = await prisma.fencer.upsert({
    where: { id: 'C11-8888' },
    update: {},
    create: {
      id: 'C11-8888',
      firstName: 'Charlie',
      lastName: 'Brown',
      gender: 'M',
      club: 'Damocles Fencing Club',
      tier: 'Bronze'
    }
  })

  await prisma.result.create({
    data: {
      eventId: event.id,
      fencerId: fencer1.id,
      placement: 1,
      pointsEarned: 15
    }
  })
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
