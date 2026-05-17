const LS_ADMIN = 'nte.admin.mode'
const LS_VERSION = 'nte.admin.version'
const LS_META = 'nte.admin.meta'
const LS_OVERRIDES = 'nte.admin.characters'
const LS_CARTRIDGE_OVERRIDES = 'nte.admin.cartridges'
const LS_MODULE_SHAPE_OVERRIDES = 'nte.admin.moduleShapes'
const LS_WEAPON_OVERRIDES = 'nte.admin.weapons'
const LS_VEHICLE_OVERRIDES = 'nte.admin.vehicles'
const LS_CODE_OVERRIDES = 'nte.admin.codes'
const LS_TIER_LIST_OVERRIDE = 'nte.admin.tierList'
const LS_NEWS_OVERRIDES = 'nte.admin.news'
const ADMIN_DATA_VERSION = 2

const LEGACY_KEYS = {
  [LS_ADMIN]: 'nte-admin-mode',
  [LS_OVERRIDES]: 'nte-character-overrides',
  [LS_CARTRIDGE_OVERRIDES]: ['nte.admin.modules', 'nte-cartridge-overrides'],
  [LS_MODULE_SHAPE_OVERRIDES]: 'nte-module-shape-overrides',
  [LS_WEAPON_OVERRIDES]: 'nte-weapon-overrides',
  [LS_VEHICLE_OVERRIDES]: 'nte-vehicle-overrides',
  [LS_CODE_OVERRIDES]: 'nte-code-overrides',
  [LS_TIER_LIST_OVERRIDE]: 'nte-official-tier-list-override',
  [LS_NEWS_OVERRIDES]: 'nte-news-overrides',
}

function readStorage(key) {
  try {
    const current = localStorage.getItem(key)
    if (current != null) return current
    const legacyKeys = [LEGACY_KEYS[key]].flat().filter(Boolean)
    for (const legacyKey of legacyKeys) {
      const legacy = localStorage.getItem(legacyKey)
      if (legacy != null) {
        localStorage.setItem(key, legacy)
        return legacy
      }
    }
    return null
  } catch {
    return null
  }
}

function writeStorage(key, value) {
  try {
    localStorage.setItem(key, value)
  } catch {
    /* ignore */
  }
}

function removeStorage(key) {
  try {
    localStorage.removeItem(key)
    ;[LEGACY_KEYS[key]].flat().filter(Boolean).forEach((legacyKey) => localStorage.removeItem(legacyKey))
  } catch {
    /* ignore */
  }
}

function touchAdminStorage(entityType = 'admin') {
  try {
    const lastSavedAt = new Date().toISOString()
    writeStorage(LS_VERSION, String(ADMIN_DATA_VERSION))
    writeStorage(LS_META, JSON.stringify({ version: ADMIN_DATA_VERSION, lastSavedAt, lastSavedEntityType: entityType }))
  } catch {
    /* ignore */
  }
}

export function readAdminMode() {
  try {
    return readStorage(LS_ADMIN) === '1'
  } catch {
    return false
  }
}

export function writeAdminMode(enabled) {
  try {
    if (enabled) writeStorage(LS_ADMIN, '1')
    else removeStorage(LS_ADMIN)
  } catch {
    /* ignore */
  }
}

export function getCharacterOverrides() {
  try {
    const raw = readStorage(LS_OVERRIDES)
    if (!raw) return {}
    const parsed = JSON.parse(raw)
    return parsed && typeof parsed === 'object' ? parsed : {}
  } catch {
    return {}
  }
}

function normalizeCollectionOverrides(parsed) {
  if (!parsed || typeof parsed !== 'object') return { entries: {}, created: [], deleted: [] }
  if (parsed.entries || parsed.created || parsed.deleted) {
    return { entries: parsed.entries || {}, created: parsed.created || [], deleted: parsed.deleted || [] }
  }
  return { entries: parsed, created: [], deleted: [] }
}

function getCollectionOverrides(storageKey) {
  try {
    const raw = readStorage(storageKey)
    if (!raw) return { entries: {}, created: [], deleted: [] }
    return normalizeCollectionOverrides(JSON.parse(raw))
  } catch {
    return { entries: {}, created: [], deleted: [] }
  }
}

function writeCollectionOverrides(storageKey, data) {
  const next = normalizeCollectionOverrides(data)
  try {
    writeStorage(storageKey, JSON.stringify(next))
  } catch {
    /* ignore */
  }
  return next
}

export function slugifyAdminId(value, fallback = 'item') {
  return String(value || fallback)
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '') || fallback
}

export function uniqueAdminId(name, existingIds = [], fallback = 'item') {
  const base = slugifyAdminId(name, fallback)
  const used = new Set(existingIds.filter(Boolean).map(String))
  if (!used.has(base)) return base
  let index = 2
  while (used.has(`${base}-${index}`)) index += 1
  return `${base}-${index}`
}

export function getWeaponOverrides() {
  return getCollectionOverrides(LS_WEAPON_OVERRIDES)
}

export function getModuleShapeOverrides() {
  return getCollectionOverrides(LS_MODULE_SHAPE_OVERRIDES)
}

export function getVehicleOverrides() {
  return getCollectionOverrides(LS_VEHICLE_OVERRIDES)
}

export function getCartridgeOverrides() {
  try {
    const raw = readStorage(LS_CARTRIDGE_OVERRIDES)
    if (!raw) return {}
    const parsed = JSON.parse(raw)
    return parsed && typeof parsed === 'object' ? parsed : {}
  } catch {
    return {}
  }
}

export function getCodeOverrides() {
  try {
    const raw = readStorage(LS_CODE_OVERRIDES)
    if (!raw) return { entries: {}, created: [], deleted: [] }
    const parsed = JSON.parse(raw)
    return parsed && typeof parsed === 'object'
      ? { entries: parsed.entries || {}, created: parsed.created || [], deleted: parsed.deleted || [] }
      : { entries: {}, created: [], deleted: [] }
  } catch {
    return { entries: {}, created: [], deleted: [] }
  }
}

export function getOfficialTierListOverride() {
  try {
    const raw = readStorage(LS_TIER_LIST_OVERRIDE)
    if (!raw) return null
    const parsed = JSON.parse(raw)
    return parsed && typeof parsed === 'object' ? parsed : null
  } catch {
    return null
  }
}

export function getNewsOverrides() {
  try {
    const raw = readStorage(LS_NEWS_OVERRIDES)
    if (!raw) return { entries: {}, created: [], deleted: [] }
    const parsed = JSON.parse(raw)
    return parsed && typeof parsed === 'object'
      ? { entries: parsed.entries || {}, created: parsed.created || [], deleted: parsed.deleted || [] }
      : { entries: {}, created: [], deleted: [] }
  } catch {
    return { entries: {}, created: [], deleted: [] }
  }
}

function writeAllOverrides(map) {
  try {
    writeStorage(LS_OVERRIDES, JSON.stringify(map))
    touchAdminStorage('characters')
  } catch {
    /* ignore */
  }
}

function writeAllCartridgeOverrides(map) {
  try {
    writeStorage(LS_CARTRIDGE_OVERRIDES, JSON.stringify(map))
    touchAdminStorage('cartridges')
  } catch {
    /* ignore */
  }
}

function writeAllWeaponOverrides(map) {
  const next = writeCollectionOverrides(LS_WEAPON_OVERRIDES, map)
  touchAdminStorage('weapons')
  return next
}

function writeAllVehicleOverrides(map) {
  const next = writeCollectionOverrides(LS_VEHICLE_OVERRIDES, map)
  touchAdminStorage('vehicles')
  return next
}

function writeAllCodeOverrides(map) {
  try {
    writeStorage(LS_CODE_OVERRIDES, JSON.stringify(map))
    touchAdminStorage('codes')
  } catch {
    /* ignore */
  }
}

function writeAllNewsOverrides(map) {
  try {
    writeStorage(LS_NEWS_OVERRIDES, JSON.stringify(map))
    touchAdminStorage('news')
  } catch {
    /* ignore */
  }
}

function writeAllModuleShapeOverrides(map) {
  const next = writeCollectionOverrides(LS_MODULE_SHAPE_OVERRIDES, map)
  touchAdminStorage('moduleShapes')
  return next
}

export function saveOfficialTierListOverride(data) {
  try {
    writeStorage(LS_TIER_LIST_OVERRIDE, JSON.stringify(data))
    touchAdminStorage('tierList')
  } catch {
    /* ignore */
  }
  return data
}

export function clearOfficialTierListOverride() {
  try {
    removeStorage(LS_TIER_LIST_OVERRIDE)
    touchAdminStorage('tierList')
  } catch {
    /* ignore */
  }
  return null
}

/**
 * @param {string} id
 * @param {Record<string, unknown>} data — local character override fields
 * @returns {Record<string, Record<string, unknown>>} full overrides map after save
 */
export function saveCharacterOverride(id, data) {
  const all = normalizeCollectionOverrides(getCharacterOverrides())
  const createdIndex = all.created.findIndex((entry) => entry.id === id)
  if (createdIndex >= 0) {
    all.created = all.created.map((entry, index) => (index === createdIndex ? { ...entry, ...data, id } : entry))
    writeAllOverrides(all)
    return all
  }
  all.entries = { ...(all.entries || {}), [id]: { ...(all.entries?.[id] || {}), ...data } }
  all.deleted = (all.deleted || []).filter((item) => item !== id)
  writeAllOverrides(all)
  return all
}

/** @returns {Record<string, Record<string, unknown>>} */
export function clearCharacterOverride(id) {
  const all = normalizeCollectionOverrides(getCharacterOverrides())
  delete all.entries[id]
  writeAllOverrides(all)
  return all
}

export function createCharacterOverride(data, baseCharacters = []) {
  const all = normalizeCollectionOverrides(getCharacterOverrides())
  const id = data.id || uniqueAdminId(data.name, [...baseCharacters.map((item) => item.id), ...all.created.map((item) => item.id)], 'character')
  all.created = [...(all.created || []), { ...data, id, slug: data.slug || id }]
  all.deleted = (all.deleted || []).filter((item) => item !== id)
  writeAllOverrides(all)
  return all
}

export function deleteCharacterOverride(id) {
  const all = normalizeCollectionOverrides(getCharacterOverrides())
  const isCreated = (all.created || []).some((entry) => entry.id === id)
  all.created = (all.created || []).filter((entry) => entry.id !== id)
  if (!isCreated) {
    all.deleted = [...new Set([...(all.deleted || []), id])]
    delete all.entries[id]
  }
  writeAllOverrides(all)
  return all
}

export function saveCartridgeOverride(id, data) {
  const all = { ...getCartridgeOverrides() }
  const shapeEdited =
    Object.prototype.hasOwnProperty.call(data || {}, 'compatibleModules') ||
    Object.prototype.hasOwnProperty.call(data || {}, 'compatibleModuleShapeIds') ||
    Object.prototype.hasOwnProperty.call(data || {}, 'requiredSetPieces') ||
    Object.prototype.hasOwnProperty.call(data || {}, 'requiredSetPieceShapeIds')
  const patch = {
    ...(data || {}),
    adminUpdatedAt: new Date().toISOString(),
    ...(shapeEdited
      ? {
          compatibleModulesVerified: true,
          compatibleModulesSource: 'admin-local-override',
          dataStatus: 'admin-verified-compatible-shapes',
        }
      : {}),
  }
  all[id] = { ...(all[id] || {}), ...patch }
  writeAllCartridgeOverrides(all)
  return all
}

export function createCartridgeOverride(data, baseCartridges = []) {
  const all = { ...getCartridgeOverrides() }
  const id = data.id || uniqueAdminId(data.name, [...baseCartridges.map((item) => item.id)], 'cartridge')
  all[id] = {
    ...data,
    id,
    slug: data.slug || id,
    __created: true,
    adminUpdatedAt: new Date().toISOString(),
    compatibleModulesVerified: Boolean(data.compatibleModules?.length || data.compatibleModuleShapeIds?.length),
    compatibleModulesSource: 'admin-local-override',
    dataStatus: data.compatibleModules?.length || data.compatibleModuleShapeIds?.length ? 'admin-verified-compatible-shapes' : data.dataStatus,
  }
  writeAllCartridgeOverrides(all)
  return all
}

export function deleteCartridgeOverride(id) {
  const all = { ...getCartridgeOverrides() }
  all[id] = { ...(all[id] || {}), __deleted: true }
  writeAllCartridgeOverrides(all)
  return all
}

function saveCollectionItemOverride(getter, writer, id, data) {
  const all = getter()
  const createdIndex = all.created.findIndex((entry) => entry.id === id)
  if (createdIndex >= 0) {
    all.created = all.created.map((entry, index) => (index === createdIndex ? { ...entry, ...data, id, slug: data.slug || entry.slug || id } : entry))
  } else {
    all.entries = { ...all.entries, [id]: { ...(all.entries[id] || {}), ...data } }
  }
  all.deleted = (all.deleted || []).filter((item) => item !== id)
  return writer(all)
}

function createCollectionItemOverride(getter, writer, data, baseItems, fallback) {
  const all = getter()
  const id = data.id || uniqueAdminId(data.name, [...baseItems.map((item) => item.id), ...all.created.map((item) => item.id)], fallback)
  all.created = [...(all.created || []), { ...data, id, slug: data.slug || id }]
  all.deleted = (all.deleted || []).filter((item) => item !== id)
  return writer(all)
}

function deleteCollectionItemOverride(getter, writer, id) {
  const all = getter()
  const isCreated = (all.created || []).some((entry) => entry.id === id)
  all.created = (all.created || []).filter((entry) => entry.id !== id)
  if (!isCreated) {
    all.deleted = [...new Set([...(all.deleted || []), id])]
    const { [id]: _removed, ...entries } = all.entries || {}
    all.entries = entries
  }
  return writer(all)
}

export const saveWeaponOverride = (id, data) => saveCollectionItemOverride(getWeaponOverrides, writeAllWeaponOverrides, id, data)
export const createWeaponOverride = (data, baseItems = []) => createCollectionItemOverride(getWeaponOverrides, writeAllWeaponOverrides, data, baseItems, 'weapon')
export const deleteWeaponOverride = (id) => deleteCollectionItemOverride(getWeaponOverrides, writeAllWeaponOverrides, id)

export const saveModuleShapeOverride = (id, data) => saveCollectionItemOverride(getModuleShapeOverrides, writeAllModuleShapeOverrides, id, data)
export const createModuleShapeOverride = (data, baseItems = []) => createCollectionItemOverride(getModuleShapeOverrides, writeAllModuleShapeOverrides, data, baseItems, 'module-shape')
export const deleteModuleShapeOverride = (id) => deleteCollectionItemOverride(getModuleShapeOverrides, writeAllModuleShapeOverrides, id)

export const saveVehicleOverride = (id, data) => saveCollectionItemOverride(getVehicleOverrides, writeAllVehicleOverrides, id, data)
export const createVehicleOverride = (data, baseItems = []) => createCollectionItemOverride(getVehicleOverrides, writeAllVehicleOverrides, data, baseItems, 'vehicle')
export const deleteVehicleOverride = (id) => deleteCollectionItemOverride(getVehicleOverrides, writeAllVehicleOverrides, id)

export function clearCartridgeOverride(id) {
  const all = { ...getCartridgeOverrides() }
  delete all[id]
  writeAllCartridgeOverrides(all)
  return all
}

export function saveCodeOverride(id, data) {
  const all = getCodeOverrides()
  const createdIndex = all.created.findIndex((entry) => entry.id === id)
  if (createdIndex >= 0) {
    all.created = all.created.map((entry, index) => (index === createdIndex ? { ...entry, ...data, id } : entry))
  } else {
    all.entries = { ...all.entries, [id]: { ...(all.entries[id] || {}), ...data } }
  }
  all.deleted = (all.deleted || []).filter((item) => item !== id)
  writeAllCodeOverrides(all)
  return all
}

export function createCodeOverride(data) {
  const all = getCodeOverrides()
  all.created = [...(all.created || []), data]
  writeAllCodeOverrides(all)
  return all
}

export function deleteCodeOverride(id) {
  const all = getCodeOverrides()
  const isCreated = (all.created || []).some((entry) => entry.id === id)
  all.created = (all.created || []).filter((entry) => entry.id !== id)
  if (!isCreated) {
    all.deleted = [...new Set([...(all.deleted || []), id])]
    const { [id]: _removed, ...entries } = all.entries || {}
    all.entries = entries
  }
  writeAllCodeOverrides(all)
  return all
}

export function saveNewsOverride(id, data) {
  const all = getNewsOverrides()
  const createdIndex = all.created.findIndex((entry) => entry.id === id)
  if (createdIndex >= 0) {
    all.created = all.created.map((entry, index) => (index === createdIndex ? { ...entry, ...data, id } : entry))
  } else {
    all.entries = { ...all.entries, [id]: { ...(all.entries[id] || {}), ...data } }
  }
  all.deleted = (all.deleted || []).filter((item) => item !== id)
  writeAllNewsOverrides(all)
  return all
}

export function createNewsOverride(data) {
  const all = getNewsOverrides()
  all.created = [...(all.created || []), data]
  writeAllNewsOverrides(all)
  return all
}

export function deleteNewsOverride(id) {
  const all = getNewsOverrides()
  const isCreated = (all.created || []).some((entry) => entry.id === id)
  all.created = (all.created || []).filter((entry) => entry.id !== id)
  if (!isCreated) {
    all.deleted = [...new Set([...(all.deleted || []), id])]
    const { [id]: _removed, ...entries } = all.entries || {}
    all.entries = entries
  }
  writeAllNewsOverrides(all)
  return all
}

const NANALLY_CANONICAL_SECTION_FIELDS = new Set(['overview', 'skills', 'materials', 'stats', 'levelStats'])

function shouldProtectNanallyCanonicalField(character, patch, key) {
  if (character?.id !== 'nanally') return false
  if (!NANALLY_CANONICAL_SECTION_FIELDS.has(key)) return false
  if (patch?.__allowCanonicalSectionOverride === true) return false
  return Boolean(character?.canonical || character?.sourceStatus || character?.source)
}

function applyCorePatch(character, patch) {
  if (!patch || typeof patch !== 'object') return character
  const next = { ...character }
  const keys = ['name', 'rarity', 'element', 'arcType', 'weaponType', 'faction', 'birthday', 'roles', 'tags', 'shortDescription', 'profileText', 'stats', 'levelStats', 'consoleTrait', 'buildTraits', 'showNewBadge', 'statusBadge', 'versionLabel', 'overview', 'skills', 'materials', 'teams', 'console', 'build']
  keys.forEach((k) => {
    if (Object.prototype.hasOwnProperty.call(patch, k)) {
      if (patch[k] === undefined) return
      if (shouldProtectNanallyCanonicalField(character, patch, k)) return
      if (k === 'roles' && Array.isArray(patch[k])) next.roles = [...patch[k]]
      else if (k === 'overview' && patch[k] && typeof patch[k] === 'object') next.overview = { ...patch[k] }
      else if (k === 'skills' && Array.isArray(patch[k])) next.skills = patch[k].map((skill) => ({ ...skill }))
      else if (k === 'materials' && patch[k] && typeof patch[k] === 'object') next.materials = { ...patch[k] }
      else if (k === 'teams' && patch[k] && typeof patch[k] === 'object') next.teams = { ...patch[k] }
      else if (k === 'console' && patch[k] && typeof patch[k] === 'object') next.console = { ...patch[k] }
      else if (k === 'build' && patch[k] && typeof patch[k] === 'object') next.build = { ...patch[k] }
      else next[k] = patch[k]
    }
  })
  if (Object.prototype.hasOwnProperty.call(patch, 'portraitImageUrl')) {
    const url = patch.portraitImageUrl == null ? '' : String(patch.portraitImageUrl).trim()
    if (url) next.portraitImageUrl = url
    else delete next.portraitImageUrl
  }
  return next
}

export function mergeCharactersWithOverrides(baseCharacters, overrides) {
  const normalized = normalizeCollectionOverrides(overrides)
  const deleted = new Set(normalized.deleted || [])
  const merged = baseCharacters
    .filter((character) => !deleted.has(character.id))
    .map((c) => applyCorePatch(c, normalized.entries[c.id]))
  const created = (normalized.created || [])
    .filter((entry) => entry && typeof entry === 'object')
    .map((entry, index) => ({ ...entry, id: entry.id || uniqueAdminId(entry.name || `character-${index + 1}`, merged.map((item) => item.id), 'character') }))
  return [...merged, ...created]
}

export function mergeItemsWithOverrides(baseItems, overrides) {
  const normalized = normalizeCollectionOverrides(overrides)
  const deleted = new Set(normalized.deleted || [])
  const merged = baseItems
    .filter((item) => !deleted.has(item.id))
    .map((item) => ({ ...item, ...(normalized.entries[item.id] || {}) }))
  const created = (normalized.created || [])
    .filter((entry) => entry && typeof entry === 'object')
    .map((entry, index) => ({ ...entry, id: entry.id || uniqueAdminId(entry.name || `item-${index + 1}`, merged.map((item) => item.id), 'item') }))
  return [
    ...merged,
    ...created,
  ]
}

export function exportAdminData() {
  const meta = getAdminStorageStatus()
  return {
    version: ADMIN_DATA_VERSION,
    exportedAt: new Date().toISOString(),
    storage: {
      mode: 'localStorage',
      backendConnected: false,
      lastSavedAt: meta.lastSavedAt,
      keys: meta.keys,
    },
    characters: normalizeCollectionOverrides(getCharacterOverrides()),
    weapons: getWeaponOverrides(),
    cartridges: getCartridgeOverrides(),
    moduleShapes: getModuleShapeOverrides(),
    vehicles: getVehicleOverrides(),
    codes: getCodeOverrides(),
    news: getNewsOverrides(),
    tierList: getOfficialTierListOverride(),
  }
}

const CARTRIDGE_BACKUP_FIELDS = [
  'name',
  'theme',
  'element',
  'bonusCategory',
  'bonuses',
  'compatibleModuleShapeIds',
  'compatibleModules',
  'requiredSetPieceShapeIds',
  'requiredSetPieces',
  'compatibleModulesVerified',
  'compatibleModulesSource',
  'dataStatus',
  'adminUpdatedAt',
  'id',
  'slug',
  'sourceId',
  '__created',
  '__deleted',
]

function pickCartridgeBackupFields(cartridge = {}) {
  return CARTRIDGE_BACKUP_FIELDS.reduce((acc, key) => {
    if (Object.prototype.hasOwnProperty.call(cartridge, key)) acc[key] = cartridge[key]
    return acc
  }, {})
}

function validateCartridgeOverridesForExport(cartridges = {}) {
  const rows = Object.entries(cartridges || {}).map(([id, cartridge]) => {
    const compatibleModuleShapeIds = Array.isArray(cartridge?.compatibleModuleShapeIds)
      ? cartridge.compatibleModuleShapeIds
      : Array.isArray(cartridge?.compatibleModules)
        ? cartridge.compatibleModules.map((module) => module?.moduleShapeId || module?.shapeId || module).filter(Boolean)
        : []
    const duplicateShapeIds = [...new Set(compatibleModuleShapeIds.filter((shapeId, index) => compatibleModuleShapeIds.indexOf(shapeId) !== index))]
    return {
      id,
      name: cartridge?.name || id,
      compatibleModulesVerified: cartridge?.compatibleModulesVerified === true,
      dataStatus: cartridge?.dataStatus || '',
      compatibleModuleShapeIds,
      shapeCount: compatibleModuleShapeIds.length,
      duplicateShapeIds,
      warnings: [
        cartridge?.compatibleModulesVerified === true ? null : 'compatibleModulesVerified is not true',
        cartridge?.dataStatus === 'admin-verified-compatible-shapes' ? null : 'dataStatus is not admin-verified-compatible-shapes',
        compatibleModuleShapeIds.length === 4 ? null : `expected 4 compatibleModuleShapeIds, found ${compatibleModuleShapeIds.length}`,
        duplicateShapeIds.length ? `duplicate shape IDs: ${duplicateShapeIds.join(', ')}` : null,
      ].filter(Boolean),
    }
  })
  return {
    cartridgeCount: rows.length,
    verifiedCount: rows.filter((row) => row.compatibleModulesVerified || row.dataStatus === 'admin-verified-compatible-shapes').length,
    allTwelveVerified: rows.length === 12 && rows.every((row) => row.compatibleModulesVerified || row.dataStatus === 'admin-verified-compatible-shapes'),
    allHaveFourShapes: rows.every((row) => row.shapeCount === 4),
    duplicateWarnings: rows.filter((row) => row.duplicateShapeIds.length).map((row) => ({ id: row.id, name: row.name, duplicateShapeIds: row.duplicateShapeIds })),
    rows,
  }
}

export function exportCartridgeAdminData() {
  const meta = getAdminStorageStatus()
  const cartridges = Object.entries(getCartridgeOverrides() || {}).reduce((acc, [id, cartridge]) => {
    acc[id] = pickCartridgeBackupFields(cartridge)
    return acc
  }, {})
  return {
    version: ADMIN_DATA_VERSION,
    exportType: 'cartridges-only',
    exportedAt: new Date().toISOString(),
    storage: {
      mode: 'localStorage',
      backendConnected: false,
      lastSavedAt: meta.lastSavedAt,
      keys: {
        version: meta.keys.version,
        meta: meta.keys.meta,
        cartridges: meta.keys.cartridges,
      },
    },
    validation: validateCartridgeOverridesForExport(cartridges),
    cartridges,
  }
}

function mergeCollectionOverrideData(current, incoming) {
  const base = normalizeCollectionOverrides(current)
  const next = normalizeCollectionOverrides(incoming)
  return {
    entries: { ...(base.entries || {}), ...(next.entries || {}) },
    created: [...(base.created || []), ...(next.created || [])],
    deleted: [...new Set([...(base.deleted || []), ...(next.deleted || [])])],
  }
}

export function importAdminData(payload, { merge = true } = {}) {
  if (!payload || typeof payload !== 'object') throw new Error('Invalid admin data')
  if (payload.characters) writeAllOverrides(merge ? mergeCollectionOverrideData(getCharacterOverrides(), payload.characters) : normalizeCollectionOverrides(payload.characters))
  if (payload.weapons) writeAllWeaponOverrides(merge ? mergeCollectionOverrideData(getWeaponOverrides(), payload.weapons) : normalizeCollectionOverrides(payload.weapons))
  if (payload.cartridges) writeAllCartridgeOverrides(merge ? { ...getCartridgeOverrides(), ...payload.cartridges } : payload.cartridges)
  if (payload.moduleShapes) writeAllModuleShapeOverrides(merge ? mergeCollectionOverrideData(getModuleShapeOverrides(), payload.moduleShapes) : normalizeCollectionOverrides(payload.moduleShapes))
  if (payload.vehicles) writeAllVehicleOverrides(merge ? mergeCollectionOverrideData(getVehicleOverrides(), payload.vehicles) : normalizeCollectionOverrides(payload.vehicles))
  if (payload.codes) writeAllCodeOverrides(merge ? mergeCollectionOverrideData(getCodeOverrides(), payload.codes) : normalizeCollectionOverrides(payload.codes))
  if (payload.news) writeAllNewsOverrides(merge ? mergeCollectionOverrideData(getNewsOverrides(), payload.news) : normalizeCollectionOverrides(payload.news))
  if (payload.tierList) saveOfficialTierListOverride(payload.tierList)
  touchAdminStorage('import')
  return exportAdminData()
}

export function resetAdminData() {
  try {
    ;[LS_OVERRIDES, LS_CARTRIDGE_OVERRIDES, LS_MODULE_SHAPE_OVERRIDES, LS_WEAPON_OVERRIDES, LS_VEHICLE_OVERRIDES, LS_CODE_OVERRIDES, LS_NEWS_OVERRIDES, LS_TIER_LIST_OVERRIDE].forEach(removeStorage)
    touchAdminStorage('reset')
  } catch {
    /* ignore */
  }
}

function countCollectionOverrides(value) {
  const normalized = normalizeCollectionOverrides(value)
  return Object.keys(normalized.entries || {}).length + (normalized.created || []).length + (normalized.deleted || []).length
}

function countCartridgeOverrides(value) {
  if (!value || typeof value !== 'object') return 0
  return Object.keys(value).length
}

export function getAdminStorageStatus() {
  let meta = {}
  try {
    meta = JSON.parse(readStorage(LS_META) || '{}')
  } catch {
    meta = {}
  }
  const counts = {
    characters: countCollectionOverrides(getCharacterOverrides()),
    weapons: countCollectionOverrides(getWeaponOverrides()),
    cartridges: countCartridgeOverrides(getCartridgeOverrides()),
    moduleShapes: countCollectionOverrides(getModuleShapeOverrides()),
    vehicles: countCollectionOverrides(getVehicleOverrides()),
    news: countCollectionOverrides(getNewsOverrides()),
    codes: countCollectionOverrides(getCodeOverrides()),
    tierList: getOfficialTierListOverride() ? 1 : 0,
  }
  const totalOverrides = Object.values(counts).reduce((sum, count) => sum + count, 0)
  return {
    storageMode: 'Local browser storage',
    backend: 'Not connected',
    version: Number(readStorage(LS_VERSION)) || ADMIN_DATA_VERSION,
    lastSavedAt: meta.lastSavedAt || null,
    lastSavedEntityType: meta.lastSavedEntityType || null,
    counts,
    totalOverrides,
    keys: {
      version: LS_VERSION,
      meta: LS_META,
      characters: LS_OVERRIDES,
      weapons: LS_WEAPON_OVERRIDES,
      cartridges: LS_CARTRIDGE_OVERRIDES,
      moduleShapes: LS_MODULE_SHAPE_OVERRIDES,
      vehicles: LS_VEHICLE_OVERRIDES,
      news: LS_NEWS_OVERRIDES,
      codes: LS_CODE_OVERRIDES,
      tierList: LS_TIER_LIST_OVERRIDE,
    },
  }
}
