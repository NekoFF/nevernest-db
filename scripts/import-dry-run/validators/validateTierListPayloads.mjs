import { validateTableBasics, refCheck, setOf } from './shared.mjs'

export function validateTierListPayloads(payloads) {
  const issues = []
  const characterIds = setOf(payloads.characters.characters)
  validateTableBasics(issues, 'tier_lists', payloads.tierLists.tierLists, ['external_id', 'slug', 'title'])
  refCheck(issues, 'tier_entries', payloads.tierLists.tierEntries, 'character_external_id', characterIds, 'characters')
  return issues
}

