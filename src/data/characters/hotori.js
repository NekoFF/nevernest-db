import { T } from './helpers.js'

export const hotoriDetail = {
  weaponType: null,
  faction: 'Bureau of Anomaly Control',
  profile: {
    text: 'Hotori dossier (partial): cosmos-field support with cleanse-focused timing. Most sections await structured import.',
  },
  overview: {
    introduction: 'Placeholder overview for partial-data testing on Hotori.',
    quickNotes: ['Field cleanses and safety windows are the design pillar.', 'Build, console, and skill blocks are intentionally omitted.'],
  },
  skills: null,
  passives: null,
  awakenings: null,
  lifeSkills: null,
  breakthroughs: null,
  build: null,
  teams: [
    {
      id: 'hotori-minimal-link-test',
      name: 'Minimal roster link test',
      members: [{ characterId: 'nanally', slot: 'Linked test', note: 'Avatar stays clickable only if Nanally exists in the roster.' }],
      description: 'One team row to verify recommended teams render with a resolvable characterId.',
    },
  ],
  synergies: [],
  consoleSetup: null,
  materials: null,
  detailReady: false,
}

export const hotoriCard = T('Hotori', {
    id: 'hotori',
    rarity: 'S',
    element: 'cosmos',
    arcType: 'solid',
    roles: ['Support'],
    tags: ['Healing', 'Control', 'Survival'],
    shortDescription: 'Cosmos-field support with strong cleanse timing.',
    releaseDate: '2025-11-08',
    isNew: true,
    portrait: { from: '#e2e8f0', to: '#f8fafc' },
  })
