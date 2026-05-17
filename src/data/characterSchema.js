import { hasRenderableOverviewBlocks } from './overviewBlocks.js'
import { hasRenderableSkills } from './skillBlocks.js'

/**
 * Canonical character shape for the client and future admin/API ingestion.
 * All characters are normalized through normalizeCharacter().
 */

export const SECTION_FALLBACKS = {
  overview: 'Overview data coming soon.',
  skills: 'Skill data coming soon.',
  build: 'Build data coming soon.',
  teams: 'Team data coming soon.',
  console: 'Console setup coming soon.',
  materials: 'Material data coming soon.',
}

function coalesceProfile(character) {
  const text = character.profileText ?? character.profile?.text ?? null
  const image = character.profile?.image ?? character.image ?? character.fullImage ?? null
  return {
    ...character.profile,
    text,
    image,
  }
}

function liftConsoleGridToSetup(character) {
  if (character.consoleSetup || !character.consoleGrid?.rows || !character.consoleGrid?.cols) {
    return character
  }
  const g = character.consoleGrid
  return {
    ...character,
    consoleSetup: {
      title: 'Console layout',
      description: g.recommendation || g.caption || '',
      grid: {
        rows: g.rows,
        cols: g.cols,
        blockedCells: g.blockedCells,
        caption: g.caption,
        modules: g.modules,
        placedModules: g.placedModules,
        placedPieces: g.placedPieces,
      },
      requiredPieces: [],
    },
  }
}

export function hasOverviewContent(overview) {
  return hasRenderableOverviewBlocks(overview)
}

export function hasSkillsList(skills) {
  return hasRenderableSkills(skills)
}

export function createDefaultDetailSkeleton(card) {
  const r = card.rarity === 'S' ? 5 : card.rarity === 'A' ? 4 : Number(card.rarity) || 4
  return {
    faction: 'Independent',
    birthday: null,
    weaponType: null,
    image: null,
    fullImage: null,
    profile: {
      text: `${card.shortDescription || ''} A full dossier for this agent is still being curated — expect more soon.`.trim(),
      image: null,
    },
    profileText: null,
    stats: {
      hp: `${1080 + r * 130}`,
      atk: `${198 + r * 16}`,
      def: `${102 + r * 10}`,
      critRate: `${9.5 + r * 1.1}%`,
      critDmg: `${42 + r * 3.8}%`,
    },
    levelStats: {
      minLevel: 1,
      maxLevel: 90,
      level1: {
        hp: 900 + r * 80,
        atk: 120 + r * 12,
        def: 70 + r * 8,
        critRate: 5,
        critDmg: 50,
      },
      level90: {
        hp: 1080 + r * 130,
        atk: 198 + r * 16,
        def: 102 + r * 10,
        critRate: 9.5 + r * 1.1,
        critDmg: 42 + r * 3.8,
      },
    },
    overview: null,
    skills: null,
    passives: null,
    awakenings: null,
    lifeSkills: null,
    breakthroughs: null,
    build: null,
    teams: null,
    synergies: null,
    console: null,
    consoleSetup: null,
    consoleGrid: null,
    materials: null,
    trait: null,
    gallery: null,
    voiceActors: null,
    detailReady: false,
  }
}

/**
 * Merges list + optional detail patch into one safe character record.
 * @param {object} card — minimal roster row (id, name, rarity, …)
 * @param {object} [detailPatch] — extra fields from CHARACTER_DETAIL_PATCHES[id]
 */
export function normalizeCharacter(card, detailPatch = {}) {
  const merged = {
    ...createDefaultDetailSkeleton(card),
    ...card,
    ...detailPatch,
  }

  const lifted = liftConsoleGridToSetup(merged)
  const profile = coalesceProfile(lifted)

  const next = {
    ...lifted,
    profile,
    profileText: profile.text ?? lifted.profileText ?? null,
    weaponType: lifted.weaponType ?? null,
    image: lifted.image ?? lifted.fullImage ?? null,
    overview: lifted.overview === undefined ? null : lifted.overview,
    skills: lifted.skills === undefined ? null : lifted.skills,
    passives: lifted.passives === undefined ? null : lifted.passives,
    awakenings: lifted.awakenings === undefined ? null : lifted.awakenings,
    lifeSkills: lifted.lifeSkills === undefined ? null : lifted.lifeSkills,
    breakthroughs: lifted.breakthroughs === undefined ? null : lifted.breakthroughs,
    build: lifted.build === undefined ? null : lifted.build,
    teams: lifted.teams === undefined ? null : lifted.teams,
    synergies: lifted.synergies === undefined ? null : lifted.synergies,
    console: lifted.console === undefined ? null : lifted.console,
    materials: lifted.materials === undefined ? null : lifted.materials,
    consoleSetup: lifted.consoleSetup === undefined ? null : lifted.consoleSetup,
    voiceActors: lifted.voiceActors === undefined ? null : lifted.voiceActors,
    trait: lifted.trait === undefined ? null : lifted.trait,
    gallery: lifted.gallery === undefined ? null : lifted.gallery,
  }

  delete next.consoleGrid

  return next
}
