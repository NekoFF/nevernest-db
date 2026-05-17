import { validateTableBasics, refCheck, issue, SEVERITY, setOf } from './shared.mjs'

export function validateCharacterPayloads(payloads) {
  const issues = []
  const characterIds = setOf(payloads.characters.characters)
  const rarityIds = setOf(payloads.taxonomy.rarities)
  const elementIds = setOf(payloads.taxonomy.elements)
  const arcTypeIds = setOf(payloads.taxonomy.arcTypes)
  const roleIds = setOf(payloads.taxonomy.roles)
  const tagIds = setOf(payloads.taxonomy.tags)
  validateTableBasics(issues, 'characters', payloads.characters.characters, ['external_id', 'slug', 'name'])
  refCheck(issues, 'characters', payloads.characters.characters, 'rarity_external_id', rarityIds, 'rarities', SEVERITY.WARNING)
  refCheck(issues, 'characters', payloads.characters.characters, 'element_external_id', elementIds, 'elements', SEVERITY.WARNING)
  refCheck(issues, 'characters', payloads.characters.characters, 'arc_type_external_id', arcTypeIds, 'arc_types', SEVERITY.WARNING)
  refCheck(issues, 'character_roles', payloads.characters.characterRoles, 'character_external_id', characterIds, 'characters')
  refCheck(issues, 'character_roles', payloads.characters.characterRoles, 'role_external_id', roleIds, 'roles', SEVERITY.WARNING)
  refCheck(issues, 'character_tags', payloads.characters.characterTags, 'character_external_id', characterIds, 'characters')
  refCheck(issues, 'character_tags', payloads.characters.characterTags, 'tag_external_id', tagIds, 'tags', SEVERITY.WARNING)
  if (!payloads.characters.characterStats.length) issues.push(issue(SEVERITY.INFO, 'character_stats', 'No character stats mapped from structured character data yet.'))
  if (!payloads.characters.characterSkills.length) issues.push(issue(SEVERITY.INFO, 'character_skills', 'No character skills mapped from structured character data yet.'))
  if (!payloads.characters.characterMaterials.length) issues.push(issue(SEVERITY.WARNING, 'character_materials', 'Material catalog is draft-only; character material joins are not import-ready.'))
  return issues
}
