import { validateTableBasics, refCheck, issue, SEVERITY, setOf } from './shared.mjs'

export function validateCartridgeModulePayloads(payloads) {
  const issues = []
  const cartridgeIds = setOf(payloads.cartridgesModules.cartridgeSets)
  const shapeIds = setOf(payloads.cartridgesModules.moduleShapes)
  const rarityIds = setOf(payloads.taxonomy.rarities)
  validateTableBasics(issues, 'cartridge_sets', payloads.cartridgesModules.cartridgeSets, ['external_id', 'slug', 'name'])
  validateTableBasics(issues, 'module_shapes', payloads.cartridgesModules.moduleShapes, ['external_id', 'slug', 'name'])
  validateTableBasics(issues, 'module_pieces', payloads.cartridgesModules.modulePieces, ['external_id', 'slug', 'display_name'])
  refCheck(issues, 'module_pieces', payloads.cartridgesModules.modulePieces, 'module_shape_external_id', shapeIds, 'module_shapes')
  refCheck(issues, 'module_pieces', payloads.cartridgesModules.modulePieces, 'rarity_external_id', rarityIds, 'rarities')
  refCheck(issues, 'cartridge_compatible_shapes', payloads.cartridgesModules.cartridgeCompatibleShapes, 'cartridge_set_external_id', cartridgeIds, 'cartridge_sets')
  refCheck(issues, 'cartridge_compatible_shapes', payloads.cartridgesModules.cartridgeCompatibleShapes, 'module_shape_external_id', shapeIds, 'module_shapes')
  for (const row of payloads.cartridgesModules.cartridgeCompatibleShapes) {
    if (row.source_status === 'needs_verification') {
      issues.push(issue(SEVERITY.NEEDS_VERIFICATION, 'cartridge_compatible_shapes', `${row.cartridge_set_external_id} slot ${row.slot} needs source verification`, { row }))
    }
  }
  if (!payloads.cartridgesModules.moduleStatTemplates.length) issues.push(issue(SEVERITY.INFO, 'module_stat_templates', 'Module stat templates are not mapped yet.'))
  return issues
}

