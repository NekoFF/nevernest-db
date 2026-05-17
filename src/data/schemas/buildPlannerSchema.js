/**
 * @typedef {Object} CanonicalBuildPlannerDraft
 * @property {string} id
 * @property {string} name
 * @property {number} version
 * @property {string} savedAt
 * @property {number} activeSlotIndex
 * @property {CanonicalBuildPlannerSlot[]} slots
 * @property {Record<string, unknown>} [raw]
 *
 * @typedef {Object} CanonicalBuildPlannerSlot
 * @property {number} slotIndex
 * @property {string|null} characterId
 * @property {number} level
 * @property {string|null} weaponId
 * @property {number} weaponLevel
 * @property {string|null} cartridgeId
 * @property {'S'|'A'|'B'} cartridgeRarity
 * @property {string|null} mainStatId
 * @property {string[]} subStatIds
 * @property {CanonicalBuildSlotModule[]} modules
 * @property {Record<string, unknown>} [awakening]
 * @property {Record<string, unknown>} [abilities]
 *
 * @typedef {Object} CanonicalBuildSlotModule
 * @property {string} id
 * @property {string} moduleShapeId
 * @property {'S'|'A'|'B'} rarity
 * @property {number} x
 * @property {number} y
 * @property {string|null} mainStatId
 * @property {string[]} subStatIds
 */

export const buildDraftRequiredFields = ['id', 'name', 'version', 'savedAt', 'activeSlotIndex', 'slots']

