import { slug, toArray } from './loadSnapshot.mjs'
import { normalizeRoleId } from '../../src/data/taxonomy/roles.js'
import { normalizeTagId } from '../../src/data/taxonomy/tags.js'

function flattenDescription(description) {
  if (Array.isArray(description)) {
    return description.map((entry) => [entry.title, entry.text].filter(Boolean).join(': ')).filter(Boolean).join('\n')
  }
  return description || ''
}

function materialRowsFromBucket(item, bucket, category, skillId = null) {
  return toArray(bucket).map((material, index) => ({
    character_external_id: item.id,
    skill_external_id: skillId,
    material_name: material.name || material.id || '',
    amount: material.amount ?? null,
    category,
    sources: toArray(material.sources),
    source_status: 'needs_verification',
    sort_order: index,
    raw: material,
  })).filter((material) => material.material_name)
}

export function mapCharacters(snapshot) {
  const characters = []
  const characterRoles = []
  const characterTags = []
  const characterStats = []
  const characterSkills = []
  const characterSkillScaling = []
  const characterMaterials = []
  const characterVoiceActors = []
  const characterBannerHistory = []
  const characterQuotes = []
  const characterPersonalItems = []
  const characterBuildRecommendations = []
  const characterTeamRecommendations = []

  for (const item of snapshot.data.characters || []) {
    characters.push({
      external_id: item.id,
      slug: item.slug || slug(item.name || item.id),
      name: item.name,
      rarity_external_id: item.rarity || null,
      element_external_id: item.element || null,
      arc_type_external_id: item.arcType || null,
      faction: item.faction || '',
      birthday: item.birthday || '',
      description: item.shortDescription || item.description || '',
      source_status: 'unknown',
      publication_status: 'draft',
      raw: { sourceFile: item.sourceFile, ...item },
    })
    for (const role of toArray(item.roles)) {
      characterRoles.push({
        character_external_id: item.id,
        role_external_id: normalizeRoleId(role),
        source_status: 'unknown',
        metadata: { sourceLabel: role },
      })
    }
    for (const tag of toArray(item.tags)) {
      characterTags.push({
        character_external_id: item.id,
        tag_external_id: normalizeTagId(tag),
        source_status: 'unknown',
        metadata: { sourceLabel: tag },
      })
    }
    const stats = item.levelStats?.keyframes || []
    for (const row of stats) {
      for (const [key, value] of Object.entries(row)) {
        if (key === 'level' || key === 'sourceStatus' || value === null || value === undefined) continue
        characterStats.push({
          character_external_id: item.id,
          stat_external_id: slug(key).replace(/-/g, '_'),
          level: row.level,
          value,
          source_status: row.sourceStatus || 'estimated',
        })
      }
    }
    for (const [skillIndex, skill] of toArray(item.skills).entries()) {
      const skillId = skill.id || `${item.id}-${slug(skill.name || skill.type || 'skill')}`
      characterSkills.push({
        external_id: skillId,
        character_external_id: item.id,
        name: skill.name || skill.title || 'Unnamed skill',
        skill_type: skill.type || 'unknown',
        description: flattenDescription(skill.description || skill.text),
        max_level: skill.maxLevel || null,
        effect_json: {
          flavorText: skill.flavorText || '',
          description: skill.description || skill.text || '',
          effect: skill.effect || null,
        },
        source_status: 'unknown',
        sort_order: skillIndex,
      })
      for (const [attributeIndex, attributeRow] of toArray(skill.attributes).entries()) {
        for (const [valueIndex, valueRow] of toArray(attributeRow.values).entries()) {
          characterSkillScaling.push({
            skill_external_id: skillId,
            character_external_id: item.id,
            level: attributeRow.level ?? null,
            label: valueRow.label || '',
            value: valueRow.value ?? '',
            source_status: 'unknown',
            sort_order: attributeIndex * 100 + valueIndex,
          })
        }
      }
      characterMaterials.push(...materialRowsFromBucket(item, skill.materials?.items, 'skill', skillId))
    }
    if (item.materials?.skill && !characterMaterials.some((material) => material.character_external_id === item.id && material.category === 'skill')) {
      characterMaterials.push(...materialRowsFromBucket(item, item.materials.skill, 'skill'))
    }
    for (const [actorIndex, actor] of toArray(item.voiceActors).entries()) {
      characterVoiceActors.push({
        character_external_id: item.id,
        language: actor.lang || actor.language || '',
        actor_name: actor.name || '',
        source_status: 'unknown',
        sort_order: actorIndex,
        raw: actor,
      })
    }
  }

  return {
    characters,
    characterRoles,
    characterTags,
    characterStats,
    characterSkills,
    characterSkillScaling,
    characterMaterials,
    characterVoiceActors,
    characterBannerHistory,
    characterQuotes,
    characterPersonalItems,
    characterBuildRecommendations,
    characterTeamRecommendations,
  }
}
