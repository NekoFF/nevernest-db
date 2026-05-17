/**
 * @typedef {Object} CanonicalCartridgeSet
 * @property {string} id Stable cartridge set id.
 * @property {string} slug Route slug.
 * @property {string} name Display name.
 * @property {string} [elementId]
 * @property {string} bonusCategory
 * @property {string[]} availableRarities
 * @property {CanonicalCartridgeBonus[]} bonuses
 * @property {CanonicalCartridgeCompatibleShape[]} compatibleShapes
 * @property {'verified'|'missing-compatible-shapes'|'placeholder'|'needs_verification'|string} [dataStatus]
 * @property {Record<string, unknown>} [raw]
 *
 * @typedef {Object} CanonicalCartridgeBonus
 * @property {string} cartridgeSetId
 * @property {2|4|number} pieces
 * @property {string} effectText
 * @property {boolean} [isConditional]
 * @property {Record<string, unknown>} [effect]
 *
 * @typedef {Object} CanonicalCartridgeCompatibleShape
 * @property {string} cartridgeSetId
 * @property {string} moduleShapeId
 * @property {number} [slot]
 * @property {string} [notes]
 */

export const cartridgeRequiredFields = ['id', 'slug', 'name', 'bonusCategory', 'availableRarities']

