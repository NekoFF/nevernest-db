import { characters as staticCharacters } from '../../../data/characters.js'
import { displayValue, findStaticEntity, idOf, resolveArcType, resolveElement, resolveRarity } from './taxonomyLookups.js'

export function mapApiCharacterToViewModel(row) {
  const raw = row?.raw && typeof row.raw === 'object' ? row.raw : {}
  const staticMatch = findStaticEntity(staticCharacters, row) || {}

  return {
    ...staticMatch,
    ...raw,
    id: idOf(row),
    externalId: row.externalId,
    slug: row.slug || row.externalId || row.id,
    name: row.name || raw.name || staticMatch.name,
    rarity: resolveRarity(displayValue(row.rarity) || raw.rarity || staticMatch.rarity),
    element: resolveElement(displayValue(row.element) || raw.element || staticMatch.element),
    arcType: resolveArcType(displayValue(row.arcType) || raw.arcType || staticMatch.arcType),
    roles: row.roleLabels?.length ? row.roleLabels.map(displayValue).filter(Boolean) : raw.roles?.length ? raw.roles : staticMatch.roles || row.roles || [],
    tags: row.tagLabels?.length ? row.tagLabels.map(displayValue).filter(Boolean) : raw.tags?.length ? raw.tags : staticMatch.tags || row.tags || [],
    faction: row.faction || raw.faction || staticMatch.faction || '',
    birthday: row.birthday || raw.birthday || staticMatch.birthday || '',
    shortDescription: raw.shortDescription || staticMatch.shortDescription || row.profileText || row.description || '',
    description: row.description || raw.description || staticMatch.description || raw.shortDescription || '',
    sourceStatus: row.sourceStatus,
    publicationStatus: row.publicationStatus,
    avatar: row.media?.path || raw.avatar || staticMatch.avatar,
    image: row.media?.path || raw.image || staticMatch.image,
    stats: row.stats?.length ? row.stats : raw.stats || staticMatch.stats,
    skills: raw.skills || staticMatch.skills || row.skills,
  }
}
