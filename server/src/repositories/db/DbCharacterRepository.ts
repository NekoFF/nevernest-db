import { eq } from 'drizzle-orm'
import type { CharacterDetail, CharacterSummary } from '../../contracts/characters.js'
import type { DbClient } from '../../db/client.js'
import { characterRoles, characters, characterSkills, characterStats, characterTags, roles, stats, tags } from '../../db/schema/index.js'
import type { CharacterRepository } from '../CharacterRepository.js'
import type { FindManyOptions } from '../types.js'
import { firstMediaForEntity, loadDisplayMaps, type DisplayMaps } from './dtoDisplayHelpers.js'
import { asIsoString, asNumber, asSourceStatus, entityBase, findByIdExternalIdOrSlug } from './helpers.js'

function toSummary(row: typeof characters.$inferSelect, maps: DisplayMaps): CharacterSummary {
  return {
    ...entityBase(row),
    rarityId: row.rarityId,
    rarity: row.rarityId ? maps.rarities.get(row.rarityId) ?? null : null,
    elementId: row.elementId,
    element: row.elementId ? maps.elements.get(row.elementId) ?? null : null,
    arcTypeId: row.arcTypeId,
    arcType: row.arcTypeId ? maps.arcTypes.get(row.arcTypeId) ?? null : null,
    faction: row.faction,
    roles: [],
    roleLabels: [],
    tags: [],
    tagLabels: [],
    media: firstMediaForEntity(maps, 'character', row.externalId),
  }
}

function toDetail(row: typeof characters.$inferSelect, maps: DisplayMaps): CharacterDetail {
  return {
    ...toSummary(row, maps),
    birthday: row.birthday,
    profileText: row.profileText,
    description: row.description,
    raw: row.raw,
    createdAt: asIsoString(row.createdAt),
    updatedAt: asIsoString(row.updatedAt),
    stats: [],
    skills: [],
  }
}

export class DbCharacterRepository implements CharacterRepository {
  constructor(private readonly db: DbClient) {}

  async findMany(filters: FindManyOptions = {}): Promise<CharacterSummary[]> {
    const maps = await loadDisplayMaps(this.db)
    const rows = await this.db.select().from(characters).limit(filters.limit ?? 50)
    const summaries = rows.map((row) => toSummary(row, maps))
    await this.attachRoleAndTagLabels(summaries)
    return summaries
  }

  async findByIdOrSlug(idOrSlug: string): Promise<CharacterDetail | null> {
    const maps = await loadDisplayMaps(this.db)
    const row = await findByIdExternalIdOrSlug(this.db, characters, idOrSlug)
    if (!row) return null

    const detail = toDetail(row, maps)
    await this.attachRoleAndTagLabels([detail])
    const [statRows, skillRows] = await Promise.all([
      this.db
        .select({ stat: characterStats, statDisplay: stats })
        .from(characterStats)
        .leftJoin(stats, eq(characterStats.statId, stats.id))
        .where(eq(characterStats.characterId, row.id)),
      this.db.select().from(characterSkills).where(eq(characterSkills.characterId, row.id)),
    ])

    detail.stats = statRows.map(({ stat, statDisplay }) => ({
      statId: stat.statId,
      stat: statDisplay ? maps.stats.get(statDisplay.id) ?? null : null,
      level: stat.level,
      value: stat.valueText ?? asNumber(stat.value),
      valueText: stat.valueText ?? (stat.value == null ? null : String(stat.value)),
      sourceStatus: asSourceStatus(stat.sourceStatus),
    }))
    detail.skills = skillRows.map((skill) => ({
      externalId: skill.externalId || skill.id,
      name: skill.name,
      skillType: skill.skillType,
      description: skill.description,
      sortOrder: skill.sortOrder,
    }))
    return detail
  }

  private async attachRoleAndTagLabels(rows: CharacterSummary[]) {
    for (const row of rows) {
      const [roleRows, tagRows] = await Promise.all([
        this.db
          .select({ role: roles })
          .from(characterRoles)
          .innerJoin(roles, eq(characterRoles.roleId, roles.id))
          .where(eq(characterRoles.characterId, row.id)),
        this.db
          .select({ tag: tags })
          .from(characterTags)
          .innerJoin(tags, eq(characterTags.tagId, tags.id))
          .where(eq(characterTags.characterId, row.id)),
      ])
      row.roles = roleRows.map(({ role }) => role.externalId)
      row.roleLabels = roleRows.map(({ role }) => ({
        id: role.id,
        externalId: role.externalId,
        slug: role.slug,
        label: role.name,
        displayName: role.name,
        sourceStatus: asSourceStatus(role.sourceStatus),
      }))
      row.tags = tagRows.map(({ tag }) => tag.externalId)
      row.tagLabels = tagRows.map(({ tag }) => ({
        id: tag.id,
        externalId: tag.externalId,
        slug: tag.slug,
        label: tag.name,
        displayName: tag.name,
        sourceStatus: asSourceStatus(tag.sourceStatus),
      }))
    }
  }
}
