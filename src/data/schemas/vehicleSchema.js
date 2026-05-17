/**
 * @typedef {Object} CanonicalVehicle
 * @property {string} id Stable vehicle id.
 * @property {string} slug Route/display slug.
 * @property {string} name
 * @property {string} type
 * @property {'fons'|'special'|'unknown'|string} currency
 * @property {number|null} price
 * @property {number} maxSpeed
 * @property {number} acceleration
 * @property {number} durability
 * @property {Record<string, number>} [handling]
 * @property {string} [description]
 * @property {Record<string, unknown>} [raw]
 */

export const vehicleRequiredFields = ['id', 'slug', 'name', 'type', 'currency', 'maxSpeed', 'acceleration', 'durability']

