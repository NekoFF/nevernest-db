/**
 * @typedef {import('./commonSchema.js').CanonicalRarityId} CanonicalRarityId
 * @typedef {import('./commonSchema.js').CanonicalElementId} CanonicalElementId
 * @typedef {import('./commonSchema.js').CanonicalArcTypeId} CanonicalArcTypeId
 * @typedef {import('./commonSchema.js').SourceStatus} SourceStatus
 *
 * @typedef {Object} CanonicalCharacter
 * @property {string} id Existing stable character id. Do not rename during SQL migration.
 * @property {string} slug Route slug, usually equal to id.
 * @property {string} name Display name.
 * @property {CanonicalRarityId} rarity
 * @property {CanonicalElementId} elementId
 * @property {CanonicalArcTypeId} arcTypeId
 * @property {string[]} roleIds Normalized role ids; display labels can be derived from role taxonomy.
 * @property {string[]} [tagIds]
 * @property {string} [faction]
 * @property {string} [birthday]
 * @property {string} [shortDescription]
 * @property {string} [profileText]
 * @property {CanonicalCharacterStatRow[]} [statsByLevel]
 * @property {CanonicalSkill[]} [skills]
 * @property {CanonicalMaterialRequirement[]} [materials]
 * @property {CanonicalVoiceActor[]} [voiceActors]
 * @property {CanonicalBannerHistoryEntry[]} [bannerHistory]
 * @property {CanonicalTranslation[]} [translations]
 * @property {Record<string, unknown>} [build]
 * @property {Record<string, unknown>} [consoleSetup]
 * @property {Record<string, unknown>} [raw] Full legacy/current object for migration traceability.
 *
 * @typedef {Object} CanonicalCharacterStatRow
 * @property {string} characterId
 * @property {number} level
 * @property {Record<string, number>} stats
 * @property {SourceStatus} [sourceStatus]
 *
 * @typedef {Object} CanonicalSkill
 * @property {string} id
 * @property {string} characterId
 * @property {string} name
 * @property {'Basic Attack'|'Skill'|'Ultimate'|'Passive'|'Life Skill'|'Awakening'|'Breakthrough'|'Other'|string} type
 * @property {string} [description]
 * @property {Record<string, Array<{label:string,value:string,notes?:string}>>} [attributesByLevel]
 * @property {number[]} [knownLevels]
 * @property {number} [maxLevel]
 * @property {SourceStatus} [sourceStatus]
 *
 * @typedef {Object} CanonicalMaterialRequirement
 * @property {string} materialId
 * @property {string} context
 * @property {number} amount
 * @property {string[]} [sources]
 *
 * @typedef {Object} CanonicalVoiceActor
 * @property {string} characterId
 * @property {string} locale EN, JP, KO, CN, etc.
 * @property {string} name
 * @property {SourceStatus} [sourceStatus]
 *
 * @typedef {Object} CanonicalBannerHistoryEntry
 * @property {string} id
 * @property {string} characterId
 * @property {string} bannerName
 * @property {string} [startDate]
 * @property {string} [endDate]
 * @property {string} [version]
 *
 * @typedef {Object} CanonicalTranslation
 * @property {string} entityId
 * @property {string} entityType
 * @property {string} locale
 * @property {string} field
 * @property {string} value
 */

export const characterRequiredFields = ['id', 'slug', 'name', 'rarity', 'elementId', 'arcTypeId', 'roleIds']

