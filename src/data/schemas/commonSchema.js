/**
 * Shared canonical ids for future API/SQL migration.
 * These JSDoc typedefs are documentation contracts only; the app still runs JS.
 *
 * @typedef {'S'|'A'|'B'} CanonicalRarityId
 * @typedef {'incantation'|'cosmos'|'chaos'|'psyche'|'anima'|'lakshana'|'cognitive'|string} CanonicalElementId
 * @typedef {'bose'|'gas'|'liquid'|'plasma'|'solid'|string} CanonicalArcTypeId
 * @typedef {'draft'|'verified'|'estimated'|'placeholder'|'needs_verification'} SourceStatus
 *
 * @typedef {Object} CanonicalTaxonomyTerm
 * @property {string} id Stable external id, suitable for later SQL/API keys.
 * @property {string} slug URL/display slug.
 * @property {string} name Display label.
 * @property {number} [sortOrder]
 * @property {string} [description]
 * @property {Record<string, unknown>} [raw] Legacy/source payload preserved for migration.
 *
 * @typedef {Object} CanonicalStatValue
 * @property {string} statId Stable stat id such as `atk`, `crit_rate`, or `anima_dmg_bonus`.
 * @property {number|string} value Numeric value where known; string only when source data is textual.
 * @property {'flat'|'percent'|'integer'|'text'|string} valueType
 * @property {SourceStatus} [sourceStatus]
 */

export const SCHEMA_VERSION = 1

