import { getWeaponsByIds } from './weapons.js'
import { findStatByLabel, getStatById } from './stats.js'
import { cartridgeSets, findCartridgeByIdInList, getCartridgeById } from './cartridges.js'

function itemId(prefix, index) {
  return `${prefix}-${index + 1}`
}

function asArray(value) {
  return Array.isArray(value) ? value : []
}

function normalizeRankItem(item, index, prefix) {
  return {
    id: String(item?.id || itemId(prefix, index)),
    rank: Number(item?.rank) || index + 1,
    name: String(item?.name || 'Data coming soon'),
    badge: String(item?.badge || item?.tag || ''),
    description: String(item?.description || item?.note || 'Data coming soon'),
    icon: String(item?.icon || ''),
    enabled: item?.enabled !== false,
  }
}

function getCartridgeByName(name) {
  const text = String(name || '').trim().toLowerCase()
  if (!text) return null
  return cartridgeSets.find((cartridge) => cartridge.name.toLowerCase() === text || cartridge.id === slugifyWeaponName(text) || cartridge.slug === slugifyWeaponName(text)) || null
}

function normalizeWeaponReference(item, index) {
  if (typeof item === 'string') {
    return {
      id: itemId('recommended-weapon', index),
      weaponId: item,
      label: index === 0 ? 'Best in Slot' : 'Alternative',
      note: '',
      priority: index + 1,
      enabled: true,
    }
  }

  return {
    id: String(item?.id || itemId('recommended-weapon', index)),
    weaponId: String(item?.weaponId || item?.weaponSlug || item?.slug || '').trim(),
    label: String(item?.label || item?.badge || item?.tag || ''),
    note: String(item?.note || item?.description || ''),
    priority: Number(item?.priority || item?.rank) || index + 1,
    enabled: item?.enabled !== false,
  }
}

function slugifyWeaponName(value) {
  return String(value || '')
    .trim()
    .toLowerCase()
    .replace(/['"]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

function migrateLegacyWeaponItem(item, index) {
  return normalizeWeaponReference(
    {
      id: item?.id || itemId('recommended-weapon', index),
      weaponId: String(item?.weaponId || item?.slug || '').trim() || slugifyWeaponName(item?.name || item?.id),
      label: item?.badge || '',
      note: item?.description || item?.note || '',
      priority: item?.rank || index + 1,
      enabled: item?.enabled,
    },
    index,
  )
}

function normalizeCartridgeReference(item, index) {
  if (typeof item === 'string') {
    return {
      id: itemId('recommended-cartridge', index),
      cartridgeId: item,
      rarity: 'S',
      label: index === 0 ? 'Best in Slot' : 'Alternative',
      note: '',
      priority: index + 1,
      enabled: true,
    }
  }
  const matched = getCartridgeById(item?.cartridgeId || item?.slug || item?.id) || getCartridgeByName(item?.name)
  return {
    id: String(item?.id || itemId('recommended-cartridge', index)),
    cartridgeId: String(matched?.id || item?.cartridgeId || item?.slug || '').trim(),
    rarity: String(item?.rarity || 'S').toUpperCase(),
    label: String(item?.label || item?.badge || item?.tag || ''),
    note: String(item?.note || item?.description || ''),
    priority: Number(item?.priority || item?.rank) || index + 1,
    enabled: item?.enabled !== false,
  }
}

function normalizeStatList(items) {
  return asArray(items)
        .map((item, index) => normalizeBuildStat(item, index))
        .filter((item) => item.statId || item.label)
}

function normalizeStringList(items) {
  return asArray(items).map((item) => String(typeof item === 'string' ? item : item?.name || item?.label || '')).filter(Boolean)
}

function normalizeBuildStat(item, index) {
  if (typeof item === 'string') {
    const stat = findStatByLabel(item)
    return {
      id: itemId('build-stat', index),
      statId: stat?.id || '',
      label: stat ? '' : item,
      note: '',
      priority: index + 1,
      enabled: true,
    }
  }
  const raw = item?.statId || item?.id || item?.label || item?.name || ''
  const stat = getStatById(raw) || findStatByLabel(raw)
  return {
    id: String(item?.id || itemId('build-stat', index)),
    statId: String(stat?.id || item?.statId || '').trim(),
    label: stat ? '' : String(item?.label || item?.name || ''),
    note: String(item?.note || ''),
    priority: Number(item?.priority) || index + 1,
    enabled: item?.enabled !== false,
  }
}

function normalizeIdList(items) {
  return Array.isArray(items) ? items.map((item) => String(item || '').trim()).filter(Boolean) : []
}

function warnBuildReference(message, payload) {
  if (import.meta?.env?.DEV) {
    console.warn(`[BuildData] ${message}`, payload)
  }
}

function normalizeEndgameStat(item, index) {
  const raw = item?.statId || item?.label || item?.name || ''
  const stat = getStatById(raw) || findStatByLabel(raw)
  return {
    id: String(item?.id || itemId('endgame-stat', index)),
    statId: String(stat?.id || item?.statId || '').trim(),
    label: stat ? '' : String(item?.label || item?.name || 'Stat'),
    value: String(item?.targetValue || item?.value || item?.note || 'Data coming soon'),
    targetValue: String(item?.targetValue || item?.value || item?.note || 'Data coming soon'),
    note: String(item?.note || ''),
    priority: Number(item?.priority) || index + 1,
    enabled: item?.enabled !== false,
  }
}

function normalizeNote(note, index) {
  if (typeof note === 'string') {
    return { id: itemId('build-note', index), title: 'Build note', content: note, enabled: true }
  }
  return {
    id: String(note?.id || itemId('build-note', index)),
    title: String(note?.title || 'Build note'),
    content: String(note?.content || note?.text || ''),
    enabled: note?.enabled !== false,
  }
}

export function normalizeBuild(build) {
  if (!build || typeof build !== 'object') {
    return {
      weapons: [],
      cartridges: [],
      recommendedCartridges: [],
      mainStats: [],
      subStats: [],
      endgameStats: [],
      skillPriority: [],
      notes: [],
      recommendedWeaponIds: [],
      alternativeWeaponIds: [],
      recommendedWeapons: [],
    }
  }

  return {
    recommendedWeaponIds: normalizeIdList(
      build.recommendedWeaponIds ||
        (Array.isArray(build.recommendedWeapons) ? build.recommendedWeapons.map((item) => item?.weaponId || item?.weaponSlug || item?.slug) : []),
    ),
    alternativeWeaponIds: normalizeIdList(build.alternativeWeaponIds),
    recommendedWeapons: Array.isArray(build.recommendedWeapons)
      ? build.recommendedWeapons.map(normalizeWeaponReference)
      : Array.isArray(build.recommendedWeaponIds)
        ? build.recommendedWeaponIds.map(normalizeWeaponReference)
        : asArray(build.weapons).length
          ? asArray(build.weapons).map(migrateLegacyWeaponItem)
          : asArray(build.bestArcs).length
            ? asArray(build.bestArcs).map(migrateLegacyWeaponItem)
            : [],
    weapons: [],
    recommendedCartridges: Array.isArray(build.recommendedCartridges)
      ? build.recommendedCartridges.map(normalizeCartridgeReference)
      : Array.isArray(build.cartridgeIds)
        ? build.cartridgeIds.map(normalizeCartridgeReference)
        : asArray(build.cartridges).length
          ? asArray(build.cartridges).map(normalizeCartridgeReference)
          : asArray(build.bestCartridges).map(normalizeCartridgeReference),
    cartridges: asArray(build.cartridges).length
      ? asArray(build.cartridges).map((item, index) => normalizeRankItem(item, index, 'cartridge'))
      : asArray(build.bestCartridges).map((item, index) => normalizeRankItem(item, index, 'cartridge')),
    mainStats: normalizeStatList(build.mainStats || build.bestStats?.mainStats || build.recommendedStats),
    subStats: normalizeStatList(build.subStats || build.bestStats?.subStats),
    endgameStats: asArray(build.endgameStats).length ? asArray(build.endgameStats).map(normalizeEndgameStat) : asArray(build.recommendedEndgameStats).map(normalizeEndgameStat),
    skillPriority: normalizeStringList(build.skillPriority),
    notes: asArray(build.notes).map(normalizeNote),
  }
}

export function normalizeBuildData(rawBuild) {
  return normalizeBuild(rawBuild)
}

export function hasBuildData(build) {
  const normalized = normalizeBuild(build)
  return Boolean(
    normalized.weapons.some((item) => item.enabled !== false) ||
      normalized.recommendedWeapons.some((item) => item.enabled !== false && item.weaponId) ||
      normalized.cartridges.some((item) => item.enabled !== false) ||
      normalized.recommendedCartridges?.some((item) => item.enabled !== false && item.cartridgeId) ||
      normalized.mainStats.length ||
      normalized.subStats.length ||
      normalized.endgameStats.some((item) => item.enabled !== false) ||
      normalized.skillPriority.length ||
      normalized.notes.some((item) => item.enabled !== false),
  )
}

export function resolveBuildWeaponReferences(build) {
  const normalized = normalizeBuild(build)
  return resolveBuildWeaponReferencesFromList(build, null, normalized)
}

export function resolveBuildWeaponReferencesFromList(build, weaponList, normalizedBuild) {
  const normalized = normalizedBuild || normalizeBuild(build)
  const findWeaponsByIds = (ids) => {
    if (!Array.isArray(weaponList)) return getWeaponsByIds(ids)
    const wanted = new Set((ids || []).map(String))
    return weaponList.filter((weapon) => wanted.has(weapon.id) || wanted.has(weapon.slug))
  }

  return {
    recommendedWeaponRefs: normalized.recommendedWeapons
      .filter((item) => item.enabled !== false && item.weaponId)
      .map((item) => ({
        ...item,
        weapon: findWeaponsByIds([item.weaponId])[0] || null,
      }))
      .map((item) => {
        if (!item.weapon) warnBuildReference('Missing weapon id', item.weaponId)
        return item
      }),
    recommendedWeapons: findWeaponsByIds(normalized.recommendedWeaponIds),
    alternativeWeapons: findWeaponsByIds(normalized.alternativeWeaponIds),
  }
}

export function resolveBuildCartridgeReferences(build, cartridgeList) {
  const normalized = normalizeBuild(build)
  return {
    recommendedCartridgeRefs: (normalized.recommendedCartridges || [])
      .filter((item) => item.enabled !== false && item.cartridgeId)
      .map((item) => ({
        ...item,
        cartridge: cartridgeList ? findCartridgeByIdInList(cartridgeList, item.cartridgeId) : getCartridgeById(item.cartridgeId),
      }))
      .map((item) => {
        if (!item.cartridge) warnBuildReference('Missing cartridge id', item.cartridgeId)
        return item
      }),
  }
}
