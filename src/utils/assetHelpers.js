import { getMediaForEntity } from '../data/mediaRegistry.js'

const BASE_PATH = '/assets/nte'

const ASSET_FILES = {
  characters: [
    'Adler.png',
    'Aurelia.png',
    'Baicang.png',
    'Chiz.png',
    'Daffodill.png',
    'Edgar.png',
    'Fadia.png',
    'Haniel.png',
    'Hathor.png',
    'Hotori.png',
    'Jiuyuan.png',
    'Lacrimosa.png',
    'Mint.png',
    'Nanally.png',
    'Sakiri.png',
    'Skia.png',
    'Zero (2).png',
    'Zero.png',
  ],
  weapons: [
    'A Time Will Come.png',
    'Be Happy.png',
    'Blow up the Crowd.png',
    'Call of the Twisted City.png',
    'Camellia Society.png',
    'Clear Skies.png',
    'Contemplative Cat.png',
    'Cosmos Daze, Wild Reverie.png',
    'Dangerous Game.png',
    'Day Off.png',
    'Drawn Blade.png',
    'Eternal Waltz.png',
    'Failing You, Heavy in My Heart.png',
    'First Step to Success.png',
    'Fluff of Fearlessness.png',
    'Fluff of Ferocity.png',
    'Fluff of Finesse.png',
    'Fluff of Fleetness.png',
    'Fluff of Fortitude.png',
    "Good Boy's Grand Adventure.png",
    "Hethereau's Keeper.png",
    'Marching Beyond Time.png',
    'Mind Royale.png',
    'Oraora!.png',
    'Raging Flames.png',
    'Ready-Ready.png',
    'Real Music.png',
    'Reality Refuge.png',
    'Shiny Days.png',
    'Song of the Whale.png',
    'Tears Beneath the Mask.png',
    "The Fools' Spring.png",
    'The Forgotten.png',
    'The Good, The Bad, The Bitter.png',
    'The Great Thief.png',
    'The Last Rose.png',
    'Time Bandit.png',
    'Umbrella.png',
    'Us..png',
    'Watch Your Heads!.png',
    'Your Happiness is Priceless.png',
    'Youthful Fantasy.png',
  ],
  modules: [
    'Crimson Twin Butterflies (A).png',
    'Crimson Twin Butterflies (B).png',
    'Crimson Twin Butterflies (S).png',
    "Devil's Blood Curse (A).png",
    "Devil's Blood Curse (B).png",
    "Devil's Blood Curse (S).png",
    'Diabolos (A).png',
    'Diabolos (B).png',
    'Diabolos (S).png',
    'Fireflies and the Forest(A).png',
    'Fireflies and the Forest (B).png',
    'Fireflies and the Forest (S).png',
    "Kingdom's Guard (A).png",
    "Kingdom's Guard (B).png",
    "Kingdom's Guard (S).png",
    'Lost Radiance (A).png',
    'Lost Radiance (B).png',
    'Lost Radiance (S).png',
    'Quiet Manor (A).png',
    'Quiet Manor (B).png',
    'Quiet Manor (S).png',
    'Shadow Creed (A).png',
    'Shadow Creed (B).png',
    'Shadow Creed (S).png',
    'Speedy Hedgehog (A).png',
    'Speedy Hedgehog (B).png',
    'Speedy Hedgehog (S).png',
    'Street Boxer (A).png',
    'Street Boxer (B).png',
    'Street Boxer (S).png',
    "Thea's Night Tavern (A).png",
    "Thea's Night Tavern (B).png",
    "Thea's Night Tavern (S).png",
    'Tiny Big Adventure (A).png',
    'Tiny Big Adventure (B).png',
    'Tiny Big Adventure (S).png',
  ],
  cars: [
    'A1.png',
    'B100.png',
    'Blizzard-V4.png',
    'C2000.png',
    'Enforcer.png',
    'G3.png',
    'Griffin Volante.png',
    'Griffin.png',
    'k01.png',
    'LaVelox.png',
    'M1000.png',
    'Novis ST-X 950.png',
    'Pendragon.png',
    'Pursuit V8.png',
    'Rivok.png',
    'ST79.png',
  ],
  misc: [
    'anima.png',
    'chaos.png',
    'cosmos.png',
    'gas.webp',
    'incantation.png',
    'lakshana.png',
    'liquid.webp',
    'plasma.webp',
    'psyche.png',
    'solid.webp',
    'synthesis.webp',
  ],
}

const CATEGORY_ALIASES = {
  characters: 'characters',
  character: 'characters',
  weapons: 'weapons',
  weapon: 'weapons',
  arcs: 'weapons',
  arc: 'weapons',
  modules: 'modules',
  module: 'modules',
  cartridges: 'modules',
  cartridge: 'modules',
  cars: 'cars',
  car: 'cars',
  vehicles: 'cars',
  vehicle: 'cars',
  misc: 'misc',
  icon: 'misc',
  icons: 'misc',
}

const CHARACTER_ALIASES = {
  daffodil: 'Daffodill',
  hanizel: 'Haniel',
  hator: 'Hathor',
  zero: 'Zero',
  'zero female': 'Zero',
  'zero male': 'Zero (2)',
  'zero 2': 'Zero (2)',
}

const WEAPON_ALIASES = {
  'Real Music': 'Real Music',
  'Us.': 'Us.',
  Us: 'Us.',
}

const MODULE_ALIASES = {
  'Crimson: Twin Butterflies': 'Crimson Twin Butterflies',
  "Devil's Blood: Curse": "Devil's Blood Curse",
  'Fireflies and the Forest': 'Fireflies and the Forest',
}

const VEHICLE_ASSET_MAP = {
  M1000: 'M1000.png',
  B100: 'B100.png',
  C2000: 'C2000.png',
  ST79: 'ST79.png',
  Enforcer: 'Enforcer.png',
  Griffin: 'Griffin.png',
  'Griffin Volante': 'Griffin Volante.png',
  'La Velox': 'LaVelox.png',
  'Pursuit V8': 'Pursuit V8.png',
  Pendragon: 'Pendragon.png',
  'Novis ST-X 950': 'Novis ST-X 950.png',
  'Blizzard V4': 'Blizzard-V4.png',
  G3: 'G3.png',
  'Rover A1': 'A1.png',
  K01: 'k01.png',
  'Future Surge': 'Rivok.png',
}

const TYPE_ALIASES = {
  bose: 'synthesis',
  cognitive: 'psyche',
  cognition: 'psyche',
}

const RESERVED_MISC_ICONS = new Set(['rank-a', 'rank-b', 'rank-s'])

function cleanName(value) {
  return String(value || '').trim().replace(/^["']+|["']+$/g, '')
}

function normalize(value) {
  return cleanName(value)
    .toLowerCase()
    .replace(/&/g, 'and')
    .replace(/['’]/g, '')
    .replace(/[^a-z0-9]+/g, ' ')
    .trim()
}

function makeLookup(category) {
  const map = new Map()
  for (const fileName of ASSET_FILES[category] || []) {
    map.set(normalize(fileName.replace(/\.[^.]+$/, '')), getAssetPath(category, fileName))
  }
  return map
}

const lookups = {
  characters: makeLookup('characters'),
  weapons: makeLookup('weapons'),
  modules: makeLookup('modules'),
  cars: makeLookup('cars'),
  misc: makeLookup('misc'),
}

export function getAssetPath(category, fileName) {
  const folder = CATEGORY_ALIASES[String(category || '').toLowerCase()] || category
  const file = cleanName(fileName)
  if (!folder || !file) return null
  return `${BASE_PATH}/${folder}/${file}`
}

export function getCharacterAsset(name) {
  if (!name) return null
  const cleaned = cleanName(name)
  const registered = getMediaForEntity('character', cleaned, 'avatar')
  if (registered?.path) return registered.path
  const alias = CHARACTER_ALIASES[normalize(cleaned)]
  return lookups.characters.get(normalize(alias || cleaned)) || null
}

export function getWeaponAsset(name) {
  if (!name) return null
  const cleaned = cleanName(name)
  const registered = getMediaForEntity('weapon', cleaned, 'image')
  if (registered?.path) return registered.path
  const alias = WEAPON_ALIASES[cleaned] || cleaned
  return lookups.weapons.get(normalize(alias)) || null
}

export function getModuleAsset(name, rarity = 'S') {
  if (!name) return null
  const cleaned = cleanName(name)
  const baseName = MODULE_ALIASES[cleaned] || cleaned.replace(/:/g, '').replace(/\s+/g, ' ').trim()
  const rank = cleanName(rarity || 'S').toUpperCase()
  const registered = getMediaForEntity('cartridge', `${baseName} (${rank})`, 'image')
  if (registered?.path) return registered.path
  return lookups.modules.get(normalize(`${baseName} (${rank})`)) || null
}

export function getVehicleAsset(assetKey) {
  const registered = getMediaForEntity('vehicle', assetKey, 'image')
  if (registered?.path) return registered.path
  const fileName = VEHICLE_ASSET_MAP[cleanName(assetKey)]
  return fileName ? getAssetPath('cars', fileName) : null
}

export function getMiscIcon(name) {
  if (!name) return null
  const cleaned = cleanName(name)
  if (RESERVED_MISC_ICONS.has(normalize(cleaned))) return null
  const registered = getMediaForEntity('misc', cleaned, 'icon')
  if (registered?.path) return registered.path
  return lookups.misc.get(normalize(cleaned)) || null
}

export function getElementIcon(elementName) {
  return getMiscIcon(elementName)
}

export function getTypeIcon(typeName) {
  const normalized = normalize(typeName)
  return getMiscIcon(TYPE_ALIASES[normalized] || typeName)
}

if (import.meta.env?.DEV) {
  console.debug('[nte assets] resolution examples', {
    hotori: getCharacterAsset('Hotori'),
    realMusic: getWeaponAsset('"Real Music"'),
    goodBoy: getWeaponAsset("Good Boy's Grand Adventure"),
    crimsonTwinButterflies: {
      B: getModuleAsset('Crimson: Twin Butterflies', 'B'),
      A: getModuleAsset('Crimson: Twin Butterflies', 'A'),
      S: getModuleAsset('Crimson: Twin Butterflies', 'S'),
    },
    lostRadiance: {
      B: getModuleAsset('Lost Radiance', 'B'),
      A: getModuleAsset('Lost Radiance', 'A'),
      S: getModuleAsset('Lost Radiance', 'S'),
    },
  })
}
