import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

const clubsData = [
  {
    name: 'Beaches Sabre Club East',
    shortName: 'BSE',
    location: 'Fredericton, NB',
    email: 'beaches.east@gmail.com',
    website: 'https://sabrebrain.com/',
    lat: 45.9636,
    lng: -66.6431,
  },
  {
    name: 'Chaleur Fencing Club',
    shortName: 'CHA',
    location: 'Bathurst, NB',
    email: 'chaleur.sabre@gmail.com',
    website: 'http://facebook.com/chaleurfencing/',
    lat: 47.6186,
    lng: -65.6514,
  },
  {
    name: 'Damocles Fencing Club of Fredericton',
    shortName: 'DAM',
    location: 'Fredericton, NB',
    email: 'damoclesfencing@gmail.com',
    website: 'http://www.damoclesfencing.ca/',
    lat: 45.9636,
    lng: -66.6431,
  },
  {
    name: 'École Antonine-Maillet',
    shortName: 'EAM',
    location: 'Dieppe, NB',
    email: 'guy.l.gautreau@nbed.nb.ca',
    website: null,
    lat: 46.0969,
    lng: -64.7171,
  },
  {
    name: 'Escrime KV Fencing',
    shortName: 'KV',
    location: 'Quispamsis, NB',
    email: 'diraiche@outlook.com',
    website: 'https://www.facebook.com/FundyFencingFilmFun/',
    lat: 45.4326,
    lng: -65.9525,
  },
  {
    name: 'Escrime La Résistance Fencing',
    shortName: 'RST',
    location: 'Moncton, NB',
    email: 'monctonfencing@gmail.com',
    website: 'https://sites.google.com/view/escrimelaresistancefencing',
    lat: 46.0878,
    lng: -64.7782,
  },
  {
    name: 'Fundy Fencing Club',
    shortName: 'FFC',
    location: 'Saint-John, NB',
    email: 'fundyfencingclubsj@gmail.com',
    website: 'http://www.fundyfencingclubsj.com',
    lat: 45.2733,
    lng: -66.0633,
  },
  {
    name: 'UNB Fencing Club',
    shortName: 'UNB',
    location: 'Fredericton, NB',
    email: 'fencing.unb@gmail.com',
    website: 'http://unbfencing.com/',
    lat: 45.9429,
    lng: -66.6416,
  },
  {
    name: 'UPEI Fencing Club',
    shortName: 'UPEI',
    location: 'Charlottetown, PEI',
    email: 'pstewart@pei.sympatico.ca',
    website: 'https://fencingpei.ca/main.htm',
    lat: 46.2382,
    lng: -63.1311,
  },
  {
    name: 'EnGuardians Fencing Club',
    shortName: 'ENG',
    location: 'Halifax, NS',
    email: 'enguardians@gmail.com',
    website: 'https://www.enguardians.ca/',
    lat: 44.6488,
    lng: -63.5752,
  },
  {
    name: 'South Shore Duelists',
    shortName: 'SSD',
    location: 'Bridgewater, NS',
    email: 'southshoreduelists@hotmail.com',
    website: 'https://www.facebook.com/SSDuelists/',
    lat: 44.3768,
    lng: -64.5161,
  }
]

async function main() {
  console.log('Seeding Clubs Directory...')
  for (const club of clubsData) {
    await prisma.club.upsert({
      where: { name: club.name },
      update: club,
      create: club,
    })
  }
  console.log('Done.')
}

main()
  .catch(e => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
