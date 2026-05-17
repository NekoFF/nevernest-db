import { validateTableBasics, issue, refCheck, SEVERITY, setOf } from './shared.mjs'

export function validateMediaPayloads(payloads, context) {
  const issues = []
  const resolvedMediaAliases = []
  validateTableBasics(issues, 'media_assets', payloads.media.mediaAssets, ['external_id', 'entity_type', 'entity_external_id', 'resolved_entity_external_id', 'kind', 'path'], { slug: false })
  const entitySets = {
    character: setOf(payloads.characters.characters),
    weapon: setOf(payloads.weapons.weapons),
    cartridge: setOf(payloads.cartridgesModules.cartridgeSets),
    vehicle: setOf(payloads.vehicles.vehicles),
  }
  for (const media of payloads.media.mediaAssets) {
    if (media.entity_external_id !== media.resolved_entity_external_id) resolvedMediaAliases.push(media)
    const target = entitySets[media.entity_type]
    if (target) refCheck(issues, 'media_assets', [media], 'resolved_entity_external_id', target, media.entity_type, SEVERITY.BLOCKER)
  }
  context.resolvedMediaAliases = resolvedMediaAliases
  return issues
}

