import { modulePieces } from '../data/modulePieces.js'
import { newsSearchText } from '../data/news.js'
import { vehicleSearchText } from '../data/vehicles.js'
import { discoverySourceStatus } from './sourceStatusFilters.js'
import { searchItems } from './searchScoring.js'

const guideItems = [
  ['beginner-guide', 'Beginner Guide', 'combat basics starter walkthrough'],
  ['esper-cycles', 'Esper Cycles', 'rotation timing cycles combat'],
  ['modules-cartridges', 'Modules & Cartridges', 'cartridge sets console modules shape stats'],
  ['character-builds', 'Character Builds', 'builds weapons teams stats'],
  ['team-building', 'Team Building', 'roles synergy teams'],
  ['vehicles', 'Vehicles Guide', 'driving transport showroom'],
  ['events', 'Events', 'event schedule rewards'],
  ['codes', 'Codes Guide', 'redeem codes rewards expiry'],
]

function compactMeta(parts = []) {
  return parts.filter(Boolean).join(' - ')
}

function text(parts = []) {
  return parts.flat().filter(Boolean).join(' ')
}

function sourceStatusOf(entity = {}) {
  return entity.sourceStatus || entity.dataStatus || entity.statSourceStatus || entity.status || ''
}

export function buildGlobalSearchIndex({
  characters = [],
  weapons = [],
  cartridges = [],
  vehicles = [],
  codes = [],
  news = [],
  imageResolvers = {},
} = {}) {
  const items = []

  characters.forEach((character) => {
    items.push({
      id: character.id,
      category: 'character',
      categoryLabel: 'Character',
      name: character.name,
      route: `/characters/${encodeURIComponent(character.slug || character.id)}`,
      meta: compactMeta([character.rarity, character.element, character.arcType]),
      sourceStatus: discoverySourceStatus(sourceStatusOf(character)),
      image: imageResolvers.character?.(character) || character.portraitImageUrl || '',
      priority: 12,
      searchText: text([character.name, character.id, character.slug, character.rarity, character.element, character.arcType, character.shortDescription, character.roles, character.tags, sourceStatusOf(character)]),
    })
  })

  weapons.forEach((weapon) => {
    items.push({
      id: weapon.slug || weapon.id,
      category: 'weapon',
      categoryLabel: 'Weapon',
      name: weapon.name,
      route: `/weapons/${encodeURIComponent(weapon.slug || weapon.id)}`,
      meta: compactMeta([weapon.rarity, weapon.type, weapon.subStat?.type]),
      sourceStatus: discoverySourceStatus(sourceStatusOf(weapon)),
      image: imageResolvers.weapon?.(weapon) || weapon.image || weapon.icon || '',
      priority: 10,
      searchText: text([weapon.name, weapon.id, weapon.slug, weapon.rarity, weapon.type, weapon.shortDescription, weapon.quote, weapon.mainStat?.type, weapon.mainStat?.value, weapon.subStat?.type, weapon.subStat?.value, (weapon.refinements || []).map((rank) => rank.effect), sourceStatusOf(weapon)]),
    })
  })

  cartridges.forEach((cartridge) => {
    items.push({
      id: cartridge.slug || cartridge.id,
      category: 'cartridge',
      categoryLabel: 'Cartridge',
      name: cartridge.name,
      route: `/modules/${encodeURIComponent(cartridge.slug || cartridge.id)}`,
      meta: compactMeta([cartridge.theme, cartridge.bonusCategory, cartridge.element]),
      sourceStatus: discoverySourceStatus(sourceStatusOf(cartridge)),
      image: imageResolvers.cartridge?.(cartridge) || cartridge.image || cartridge.icon || '',
      priority: 9,
      searchText: text([cartridge.name, cartridge.id, cartridge.slug, cartridge.theme, cartridge.element, cartridge.bonusCategory, cartridge.description, cartridge.availableRarities, (cartridge.bonuses || []).map((bonus) => [bonus.text, bonus.sourceStatus]), sourceStatusOf(cartridge)]),
    })
  })

  modulePieces.forEach((piece) => {
    items.push({
      id: piece.id,
      category: 'modulePiece',
      categoryLabel: 'Module Piece',
      name: piece.shapeName || piece.name,
      route: `/modules/pieces/${encodeURIComponent(piece.shapeId)}/${encodeURIComponent(piece.rarity)}`,
      meta: compactMeta([piece.rarity, `Type ${piece.moduleType}`, `${piece.cellCount} blocks`]),
      sourceStatus: 'needs_review',
      shapeId: piece.shapeId,
      rarity: piece.rarity,
      image: '',
      priority: 4,
      searchText: text([piece.name, piece.id, piece.shapeId, piece.shapeName, piece.rarity, piece.moduleType, piece.cellCount, (piece.mainStats || []).map((row) => [row.statId, row.stat?.name, row.formattedValue])]),
    })
  })

  vehicles.forEach((vehicle) => {
    items.push({
      id: vehicle.id,
      category: 'vehicle',
      categoryLabel: 'Vehicle',
      name: vehicle.name,
      route: '/vehicles',
      meta: compactMeta([vehicle.type, vehicle.maxSpeed ? `${vehicle.maxSpeed} km/h` : null]),
      sourceStatus: discoverySourceStatus(sourceStatusOf(vehicle)),
      image: imageResolvers.vehicle?.(vehicle) || vehicle.image || '',
      priority: 8,
      searchText: text([vehicleSearchText(vehicle), sourceStatusOf(vehicle)]),
    })
  })

  codes.forEach((code) => {
    items.push({
      id: code.id,
      category: 'code',
      categoryLabel: 'Code',
      name: code.code,
      route: '/codes',
      meta: compactMeta([code.status, code.rewardSummary]),
      sourceStatus: discoverySourceStatus(sourceStatusOf(code)),
      image: '',
      priority: 7,
      searchText: text([code.code, code.id, code.rewardSummary, code.status, code.startDate, code.endDate, sourceStatusOf(code)]),
    })
  })

  news.forEach((entry) => {
    items.push({
      id: entry.id,
      category: 'news',
      categoryLabel: 'News',
      name: entry.title,
      route: '/news',
      meta: compactMeta([entry.category, entry.date, entry.sourceLabel]),
      sourceStatus: discoverySourceStatus(sourceStatusOf(entry)),
      image: entry.imageUrl || '',
      priority: entry.pinned ? 9 : entry.featured ? 7 : 5,
      searchText: text([newsSearchText(entry), sourceStatusOf(entry)]),
    })
  })

  guideItems.forEach(([id, name, extra]) => {
    items.push({
      id,
      category: 'guide',
      categoryLabel: 'Guide',
      name,
      route: '/guides',
      meta: 'Planned guide library',
      sourceStatus: 'unknown',
      image: '',
      priority: 2,
      searchText: text([id, name, extra, 'guide planned source pending']),
    })
  })

  return items
}

export function searchGlobalIndex(index, query, limit = 24) {
  return searchItems(index, query, limit)
}
