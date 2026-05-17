/**
 * @typedef {Object} CanonicalWeapon
 * @property {string} id Stable arc/weapon id.
 * @property {string} slug Route slug.
 * @property {string} name Display name.
 * @property {'S'|'A'|'B'} rarity
 * @property {string} arcTypeId Lowercase arc type id.
 * @property {{statId:string,value:number|string}} mainStat
 * @property {{statId:string,value:number|string}} subStat
 * @property {CanonicalWeaponRefinement[]} refinements
 * @property {CanonicalWeaponGrowthRow[]} growthStats
 * @property {string[]} [recommendedCharacterIds]
 * @property {string} [quote]
 * @property {string} [shortDescription]
 * @property {Record<string, unknown>} [raw]
 *
 * @typedef {Object} CanonicalWeaponRefinement
 * @property {string} weaponId
 * @property {number} rank
 * @property {string} effectText
 * @property {Record<string, unknown>} [effect]
 *
 * @typedef {Object} CanonicalWeaponGrowthRow
 * @property {string} weaponId
 * @property {number} level
 * @property {number} atk
 * @property {string} subStatId
 * @property {number|string} subStatValue
 */

export const weaponRequiredFields = ['id', 'slug', 'name', 'rarity', 'arcTypeId', 'mainStat', 'subStat']

