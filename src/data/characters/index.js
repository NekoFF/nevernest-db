import { arcTypeTaxonomy, elementTaxonomy, rarityTaxonomy } from '../gameTaxonomy.js'
import { normalizeCharacter } from '../characterSchema.js'
import { canonicalCharactersById } from '../canonicalCharacters.js'
import { adminBaselineCharacters, mergeApprovedBaseline, stripPublicDebugText } from '../adminBaseline.js'

import { nanallyCard, nanallyDetail } from './nanally.js'
import { baicangCard, baicangDetail } from './baicang.js'
import { hotoriCard, hotoriDetail } from './hotori.js'
import { skiaDetail } from './skia.js'
import { mintDetail } from './mint.js'
import { sakiriCard } from './sakiri.js'
import { nanallyPdfSourcePatch, sakiriPdfDetail } from './pdfSourceImports.js'
import { daffodilCard } from './daffodil.js'
import { fadiaCard } from './fadia.js'
import { lacrimosaCard } from './lacrimosa.js'
import { hathorCard } from './hator.js'
import { zeroFemaleCard, zeroMaleCard } from './zero.js'
import {
  chizCard,
  jiuyuanCard,
  skiaCard,
  mintCard,
  hanizelCard,
  edgarCard,
  adlerCard,
  aureliaCard,
} from './otherRoster.js'

function buildCharacter(card, detailPatch) {
  const normalized = normalizeCharacter(card, detailPatch)
  return stripPublicDebugText(mergeApprovedBaseline(normalized, adminBaselineCharacters[normalized.id]))
}

export const CHARACTER_DETAIL_PATCHES = {
  nanally: {
    ...(canonicalCharactersById.nanally || nanallyDetail),
    ...nanallyPdfSourcePatch,
  },
  baicang: baicangDetail,
  hotori: hotoriDetail,
  skia: skiaDetail,
  mint: mintDetail,
  sakiri: sakiriPdfDetail,
}

/** Same roster order as before the folder split (release / filters depend on array order). */
export const characters = [
  buildCharacter(baicangCard, baicangDetail),
  buildCharacter(chizCard),
  buildCharacter(daffodilCard),
  buildCharacter(fadiaCard),
  buildCharacter(hathorCard),
  buildCharacter(hotoriCard, hotoriDetail),
  buildCharacter(jiuyuanCard),
  buildCharacter(lacrimosaCard),
  buildCharacter(canonicalCharactersById.nanally || nanallyCard, CHARACTER_DETAIL_PATCHES.nanally),
  buildCharacter(sakiriCard, sakiriPdfDetail),
  buildCharacter(zeroFemaleCard),
  buildCharacter(zeroMaleCard),
  buildCharacter(skiaCard, skiaDetail),
  buildCharacter(mintCard, mintDetail),
  buildCharacter(hanizelCard),
  buildCharacter(edgarCard),
  buildCharacter(adlerCard),
  buildCharacter(aureliaCard),
]

export function getCharacterById(id) {
  return characters.find((x) => x.id === id) ?? null
}

export function getCharactersByElement(element) {
  return characters.filter((c) => c.element === element)
}

export const ELEMENTS = elementTaxonomy.map((item) => item.id)
export const RARITIES = rarityTaxonomy.map((item) => item.id)
export const ARC_TYPES = arcTypeTaxonomy.map((item) => item.id)
export const ROLES = ['Attack', 'Defense', 'Support', 'Special', 'Damage', 'Main DPS', 'Follow-up Attack']

export const ADVANCED_TAGS = [
  'Main DPS',
  'Burst DPS',
  'Shield',
  'Healing',
  'Buff',
  'Control',
  'Survival',
  'DoT',
  'Damage',
  'Break Boost',
  'DMG Redirection',
  'DMG Boost',
  'Follow-up Attack',
  'Instant Cycle',
]

export const SORT_OPTIONS = [
  { value: 'release', label: 'Release Date' },
  { value: 'name-asc', label: 'Name A-Z' },
  { value: 'name-desc', label: 'Name Z-A' },
  { value: 'rarity-desc', label: 'Rarity High to Low' },
  { value: 'rarity-asc', label: 'Rarity Low to High' },
]
