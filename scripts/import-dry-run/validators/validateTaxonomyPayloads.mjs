import { validateTableBasics, issue, SEVERITY } from './shared.mjs'

export function validateTaxonomyPayloads(payloads) {
  const issues = []
  validateTableBasics(issues, 'elements', payloads.taxonomy.elements, ['external_id', 'slug', 'name'])
  validateTableBasics(issues, 'arc_types', payloads.taxonomy.arcTypes, ['external_id', 'slug', 'name'])
  validateTableBasics(issues, 'rarities', payloads.taxonomy.rarities, ['external_id', 'name'], { slug: false })
  validateTableBasics(issues, 'roles', payloads.taxonomy.roles, ['external_id', 'slug', 'name'])
  validateTableBasics(issues, 'tags', payloads.taxonomy.tags, ['external_id', 'slug', 'name'])
  validateTableBasics(issues, 'stats', payloads.taxonomy.stats, ['external_id', 'name', 'category', 'value_type'], { slug: false })
  if (payloads.taxonomy.stats.some((row) => String(row.external_id).startsWith('mental_'))) {
    issues.push(issue(SEVERITY.BLOCKER, 'stats', 'mental_* duplicate stat ids are not allowed; use cognitive_* canonical ids.'))
  }
  return issues
}

