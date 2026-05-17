import { arrayOfStrings, cloneRaw, entityBase, stringOrEmpty } from './normalizeShared.js'
import { SOURCE_STATUS } from '../sourceStatus.js'

export function normalizeCartridgeForExport(cartridge = {}) {
  const base = entityBase(cartridge, 'cartridge')
  const dataStatus = stringOrEmpty(cartridge.dataStatus || cartridge.compatibleModulesStatus)
  const compatibilitySourceStatus = cartridge.compatibilitySourceStatus ||
    (dataStatus.includes('missing-compatible-shapes') ? SOURCE_STATUS.needsVerification : SOURCE_STATUS.unknown)
  return {
    ...base,
    elementId: stringOrEmpty(cartridge.element || cartridge.theme).toLowerCase(),
    bonusCategory: stringOrEmpty(cartridge.bonusCategory),
    availableRarities: arrayOfStrings(cartridge.availableRarities),
    dataStatus,
    sourceStatus: cartridge.sourceStatus || (dataStatus ? SOURCE_STATUS.needsVerification : SOURCE_STATUS.unknown),
    compatibilitySourceStatus,
    verified: cartridge.verified === true,
    bonuses: Array.isArray(cartridge.bonuses) ? cartridge.bonuses.map((bonus) => ({
      cartridgeSetId: base.id,
      pieces: Number(bonus.pieces),
      effectText: stringOrEmpty(bonus.text),
      isConditional: Boolean(bonus.isConditional),
      effect: bonus.effect || null,
    })) : [],
    compatibleShapes: Array.isArray(cartridge.compatibleModules) ? cartridge.compatibleModules.map((shape) => ({
      cartridgeSetId: base.id,
      moduleShapeId: stringOrEmpty(shape.moduleShapeId),
      slot: Number(shape.slot) || null,
      notes: stringOrEmpty(shape.notes || shape.shapeSignature),
      sourceStatus: shape.sourceStatus || compatibilitySourceStatus,
    })).filter((shape) => shape.moduleShapeId) : [],
    raw: cloneRaw(cartridge),
  }
}
