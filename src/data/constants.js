/**
 * Shared option lists for admin UI and forms (ids match game data / filters).
 */
import { arcTypeTaxonomy, elementTaxonomy } from './gameTaxonomy.js'

export const ADMIN_RARITY_OPTIONS = [
  { id: 'S', label: 'S-Rank' },
  { id: 'A', label: 'A-Rank' },
  { id: 'B', label: 'B-Rank' },
]

export const ADMIN_ELEMENT_OPTIONS = elementTaxonomy.map((item) => ({
  id: item.id,
  label: item.label,
}))

export const ADMIN_ARC_TYPE_OPTIONS = arcTypeTaxonomy.map((item) => ({
  id: item.id,
  label: item.label,
}))

/** Role + tag strings used on roster and in filters (deduped, stable order). */
const ROLE_TAG_SOURCE = [
  'Attack',
  'Defense',
  'Support',
  'Special',
  'Damage',
  'Main DPS',
  'Burst DPS',
  'DoT',
  'Shield',
  'Healing',
  'Buff',
  'DMG Boost',
  'DMG Redirection',
  'Control',
  'Follow-up Attack',
  'Instant Cycle',
  'Survival',
  'Break Boost',
]

export const ADMIN_ROLE_OPTIONS = [...new Set(ROLE_TAG_SOURCE)]
