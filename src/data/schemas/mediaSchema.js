/**
 * @typedef {Object} CanonicalMediaAsset
 * @property {string} id Stable media asset id.
 * @property {'character'|'weapon'|'cartridge'|'module'|'vehicle'|'misc'|'news'|'guide'|string} entityType
 * @property {string} entityId
 * @property {'avatar'|'card'|'icon'|'image'|'thumbnail'|'fullArt'|string} kind
 * @property {string} path
 * @property {string} alt
 * @property {'local-seed'|'missing'|'external'|'needs_verification'|string} status
 * @property {string} [sourceUrl]
 * @property {string} [licenseNote]
 * @property {number} [width]
 * @property {number} [height]
 * @property {Record<string, unknown>} [raw]
 */

export const mediaRequiredFields = ['id', 'entityType', 'entityId', 'kind', 'path', 'alt', 'status']

