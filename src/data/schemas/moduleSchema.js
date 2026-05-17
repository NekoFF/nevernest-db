/**
 * @typedef {Object} CanonicalModuleShape
 * @property {string} id Stable shape id.
 * @property {'II'|'III'|'IV'|string} moduleType
 * @property {string} name
 * @property {number[][]} matrix
 * @property {number} cellCount
 * @property {Record<string, unknown>} [raw]
 *
 * @typedef {Object} CanonicalModulePiece
 * @property {string} id Generated module piece id.
 * @property {'S'|'A'|'B'} rarity
 * @property {'II'|'III'|'IV'|string} moduleType
 * @property {string} shapeId
 * @property {number} cellCount
 * @property {number} maxLevel
 * @property {Array<{statId:string,value:number|string}>} mainStats
 * @property {Array<{statId:string,value:number|string}>} possibleSubStats
 * @property {Record<string, unknown>} [raw]
 */

export const moduleShapeRequiredFields = ['id', 'moduleType', 'name', 'matrix', 'cellCount']
export const modulePieceRequiredFields = ['id', 'rarity', 'moduleType', 'shapeId', 'cellCount', 'maxLevel']

