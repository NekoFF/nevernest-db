import { slug, toArray } from './loadSnapshot.mjs'

function matrixCellCount(matrix) {
  return toArray(matrix).flat().filter(Boolean).length
}

export function mapCartridgesModules(snapshot) {
  const elementIds = new Set((snapshot.taxonomy?.elements || []).map((item) => item.id))
  const cartridgeSets = []
  const cartridgeSetBonuses = []
  const moduleShapes = []
  const modulePieces = []
  const cartridgeCompatibleShapes = []
  const moduleStatTemplates = []

  for (const item of snapshot.data.cartridges || []) {
    const sourceStatus = String(item.dataStatus || '').includes('missing') ? 'needs_verification' : 'unknown'
    cartridgeSets.push({
      external_id: item.id,
      slug: item.slug || slug(item.name || item.id),
      name: item.name,
      element_external_id: elementIds.has(slug(item.element || item.theme)) ? slug(item.element || item.theme) : null,
      bonus_category: item.bonusCategory || '',
      description: item.description || '',
      data_status: item.dataStatus || '',
      source_status: sourceStatus,
      raw: item,
    })
    for (const bonus of toArray(item.bonuses)) {
      cartridgeSetBonuses.push({
        cartridge_set_external_id: item.id,
        pieces: bonus.pieces,
        effect_text: bonus.text || '',
        effect_json: bonus.effect || {},
        is_conditional: Boolean(bonus.isConditional),
        source_status: sourceStatus,
      })
    }
    for (const shape of toArray(item.compatibleModules)) {
      cartridgeCompatibleShapes.push({
        cartridge_set_external_id: item.id,
        module_shape_external_id: shape.moduleShapeId,
        slot: shape.slot || null,
        notes: shape.notes || shape.shapeSignature || '',
        source_status: 'needs_verification',
      })
    }
  }

  for (const item of snapshot.data.moduleShapes || []) {
    const matrix = item.matrix || []
    moduleShapes.push({
      external_id: item.id,
      slug: slug(item.id),
      module_type: item.type,
      name: item.name,
      width: Math.max(...toArray(matrix).map((row) => toArray(row).length), 0),
      height: toArray(matrix).length,
      cell_count: matrixCellCount(matrix),
      matrix_json: matrix,
      source_status: 'unknown',
      sort_order: moduleShapes.length,
    })
  }

  for (const item of snapshot.data.modulePieces || []) {
    modulePieces.push({
      external_id: item.id,
      slug: item.slug || slug(item.id || item.name),
      rarity_external_id: item.rarity,
      module_shape_external_id: item.shapeId || item.moduleShapeId,
      module_type: item.type || item.moduleType,
      display_name: item.name || item.displayName || item.id,
      max_level: item.maxLevel || 20,
      source_status: 'unknown',
      generated_from_template: true,
    })
  }

  return { cartridgeSets, cartridgeSetBonuses, moduleShapes, modulePieces, cartridgeCompatibleShapes, moduleStatTemplates }
}
