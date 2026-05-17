import nanallyCanonical from '../../data-entry/characters/nanally.character-data.template.json' with { type: 'json' }
import {
  adaptCanonicalCharacter,
  validateCanonicalCharacter,
} from './characterCanonicalAdapter.js'
import { nanallyDetail as siteNanallyDetail } from './characters/nanally.js'

const canonicalSources = [nanallyCanonical]

function markSiteAuthored(value) {
  if (Array.isArray(value)) {
    return value.map((item) => markSiteAuthored(item))
  }
  if (!value || typeof value !== 'object') return value
  return Object.entries(value).reduce((acc, [key, nestedValue]) => {
    acc[key] = markSiteAuthored(nestedValue)
    return acc
  }, { sourceStatus: value.sourceStatus || 'site-authored' })
}

function mergeSiteGuideFallback(character) {
  if (character?.id !== 'nanally') return character

  return {
    ...character,
    build: {
      ...(character.build || {}),
      ...markSiteAuthored(siteNanallyDetail.build || {}),
      sourceStatus: 'site-authored',
    },
    teams: markSiteAuthored(siteNanallyDetail.teams || []),
    synergies: markSiteAuthored(siteNanallyDetail.synergies || []),
    consoleSetup: markSiteAuthored(siteNanallyDetail.consoleSetup || {}),
  }
}

function adaptSource(source) {
  const validation = validateCanonicalCharacter(source)
  if (import.meta.env?.DEV && validation.warnings.length) {
    console.warn('[NTE] Canonical character import warnings', {
      id: source?.id || source?.identity?.id,
      warnings: validation.warnings,
    })
  }
  if (!validation.ok) {
    if (import.meta.env?.DEV) {
      console.error('[NTE] Canonical character import skipped', {
        id: source?.id || source?.identity?.id,
        errors: validation.errors,
      })
    }
    return null
  }
  return {
    source,
    character: mergeSiteGuideFallback(adaptCanonicalCharacter(source)),
    validation,
  }
}

export const canonicalCharacterImports = canonicalSources.map(adaptSource).filter(Boolean)

export const canonicalCharacters = canonicalCharacterImports.map((entry) => entry.character)

export const canonicalCharactersById = canonicalCharacters.reduce((acc, character) => {
  acc[character.id] = character
  return acc
}, {})

export const canonicalCharacterImportWarnings = canonicalCharacterImports.reduce((acc, entry) => {
  acc[entry.character.id] = entry.validation.warnings
  return acc
}, {})

export function getCanonicalCharacterById(id) {
  return canonicalCharactersById[id] || null
}

export function getCanonicalCharacterImportWarnings(id) {
  return canonicalCharacterImportWarnings[id] || []
}
