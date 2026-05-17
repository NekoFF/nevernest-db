export const elementTaxonomy = [
  {
    id: 'incantation',
    label: 'Incantation',
    color: '#ff3b6f',
    bg: 'rgba(255, 59, 111, 0.12)',
    chip: 'bg-rose-50 text-rose-700 ring-rose-100',
    sourceStatus: 'unknown',
  },
  {
    id: 'cosmos',
    label: 'Cosmos',
    color: '#94a3b8',
    bg: 'rgba(148, 163, 184, 0.14)',
    chip: 'bg-slate-50 text-slate-700 ring-slate-200',
    sourceStatus: 'unknown',
  },
  {
    id: 'chaos',
    label: 'Chaos',
    color: '#a855f7',
    bg: 'rgba(168, 85, 247, 0.12)',
    chip: 'bg-violet-50 text-violet-800 ring-violet-100',
    sourceStatus: 'unknown',
  },
  {
    id: 'psyche',
    label: 'Psyche',
    color: '#38bdf8',
    bg: 'rgba(56, 189, 248, 0.13)',
    chip: 'bg-sky-50 text-sky-800 ring-sky-100',
    sourceStatus: 'unknown',
  },
  {
    id: 'anima',
    label: 'Anima',
    color: '#14b8a6',
    bg: 'rgba(20, 184, 166, 0.13)',
    chip: 'bg-teal-50 text-teal-800 ring-teal-100',
    sourceStatus: 'unknown',
  },
  {
    id: 'lakshana',
    label: 'Lakshana',
    color: '#f6c744',
    bg: 'rgba(246, 199, 68, 0.16)',
    chip: 'bg-amber-50 text-amber-900 ring-amber-100',
    sourceStatus: 'unknown',
  },
]

export const rarityTaxonomy = [
  {
    id: 'S',
    label: 'S-Rank',
    shortLabel: 'S',
    color: '#f6c744',
    chip: 'bg-amber-50 text-amber-900 ring-amber-100',
    sourceStatus: 'unknown',
  },
  {
    id: 'A',
    label: 'A-Rank',
    shortLabel: 'A',
    color: '#c65cff',
    chip: 'bg-fuchsia-50 text-fuchsia-800 ring-fuchsia-100',
    sourceStatus: 'unknown',
  },
  {
    id: 'B',
    label: 'B-Rank',
    shortLabel: 'B',
    color: '#38bdf8',
    chip: 'bg-sky-50 text-sky-800 ring-sky-100',
    sourceStatus: 'unknown',
  },
]

export const arcTypeTaxonomy = [
  { id: 'bose', label: 'Bose', sourceStatus: 'unknown' },
  { id: 'gas', label: 'Gas', sourceStatus: 'unknown' },
  { id: 'liquid', label: 'Liquid', sourceStatus: 'unknown' },
  { id: 'plasma', label: 'Plasma', sourceStatus: 'unknown' },
  { id: 'solid', label: 'Solid', sourceStatus: 'unknown' },
]

export const getElementTaxonomy = (id) => elementTaxonomy.find((item) => item.id === id)
export const getRarityTaxonomy = (id) => rarityTaxonomy.find((item) => item.id === id)
export const getArcTypeTaxonomy = (id) => arcTypeTaxonomy.find((item) => item.id === id)
