import { T } from './helpers.js'

export const baicangDetail = {
  weaponType: null,
  faction: 'Veilwalker-aligned operative',
  birthday: null,
  profile: {
    text: 'Baicang dossier (partial): displacement-focused Incantation kit. Full skills, teams, and materials will be synced when the editorial pipeline is connected.',
  },
  overview: {
    introduction: 'Placeholder overview copy for partial-data testing. Baicang rewards coordinated dive timing.',
    quickNotes: ['Anchor windows matter more than raw damage numbers.', 'This entry intentionally omits build, console, and team blocks.'],
    strengths: ['Strong displacement control in coordinated content.'],
    tradeoffs: ['Partial record — several tabs should show coming soon fallbacks.'],
  },
  skills: [
    {
      id: 'baicang-anchor-preview',
      name: 'Veil Anchor (preview)',
      type: 'Skill',
      icon: 'S',
      description: [{ title: 'Stub row', text: 'Single skill object so the Skills accordion is non-empty while other ability sub-tabs stay empty.' }],
      attributes: [],
      materials: [],
    },
  ],
  passives: null,
  awakenings: null,
  lifeSkills: null,
  breakthroughs: null,
  build: null,
  teams: null,
  synergies: [],
  consoleSetup: null,
  materials: null,
  detailReady: false,
}

export const baicangCard = T('Baicang', {
    id: 'baicang',
    rarity: 'S',
    element: 'incantation',
    arcType: 'bose',
    roles: ['Special'],
    tags: ['Control', 'Break Boost', 'Follow-up Attack'],
    shortDescription: 'Displacement-focused specialist for coordinated dives.',
    releaseDate: '2025-07-19',
    isNew: true,
    portrait: { from: '#ffe4e6', to: '#fff7ed' },
  })
