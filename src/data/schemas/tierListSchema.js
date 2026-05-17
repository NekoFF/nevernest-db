/**
 * @typedef {Object} CanonicalTierList
 * @property {string} id
 * @property {string} title
 * @property {string} [description]
 * @property {string} [updatedAt]
 * @property {'official'|'personal'|'community'|string} listType
 * @property {CanonicalTierRow[]} tiers
 * @property {Record<string, unknown>} [settings]
 * @property {Record<string, unknown>} [raw]
 *
 * @typedef {Object} CanonicalTierRow
 * @property {string} id
 * @property {string} tierListId
 * @property {string} label
 * @property {string} [subtitle]
 * @property {string} [color]
 * @property {CanonicalTierEntry[]} entries
 *
 * @typedef {Object} CanonicalTierEntry
 * @property {string} tierListId
 * @property {string} tierId
 * @property {string} characterId
 * @property {number} position
 */

export const tierListRequiredFields = ['id', 'title', 'listType', 'tiers']

