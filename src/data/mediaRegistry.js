import { slugifyEntityName } from '../utils/entityIdentity.js'
import { resolveMediaEntityId } from './mediaAliases.js'

const BASE_PATH = '/assets/nte'

const characterFiles = [
  'Adler.png', 'Aurelia.png', 'Baicang.png', 'Chiz.png', 'Daffodill.png', 'Edgar.png',
  'Fadia.png', 'Haniel.png', 'Hathor.png', 'Hotori.png', 'Jiuyuan.png', 'Lacrimosa.png',
  'Mint.png', 'Nanally.png', 'Sakiri.png', 'Skia.png', 'Zero (2).png', 'Zero.png',
]

const weaponFiles = [
  'A Time Will Come.png', 'Be Happy.png', 'Blow up the Crowd.png', 'Call of the Twisted City.png',
  'Camellia Society.png', 'Clear Skies.png', 'Contemplative Cat.png', 'Cosmos Daze, Wild Reverie.png',
  'Dangerous Game.png', 'Day Off.png', 'Drawn Blade.png', 'Eternal Waltz.png',
  'Failing You, Heavy in My Heart.png', 'First Step to Success.png', 'Fluff of Fearlessness.png',
  'Fluff of Ferocity.png', 'Fluff of Finesse.png', 'Fluff of Fleetness.png', 'Fluff of Fortitude.png',
  "Good Boy's Grand Adventure.png", "Hethereau's Keeper.png", 'Marching Beyond Time.png',
  'Mind Royale.png', 'Oraora!.png', 'Raging Flames.png', 'Ready-Ready.png', 'Real Music.png',
  'Reality Refuge.png', 'Shiny Days.png', 'Song of the Whale.png', 'Tears Beneath the Mask.png',
  "The Fools' Spring.png", 'The Forgotten.png', 'The Good, The Bad, The Bitter.png',
  'The Great Thief.png', 'The Last Rose.png', 'Time Bandit.png', 'Umbrella.png', 'Us..png',
  'Watch Your Heads!.png', 'Your Happiness is Priceless.png', 'Youthful Fantasy.png',
]

const moduleFiles = [
  'Crimson Twin Butterflies (A).png', 'Crimson Twin Butterflies (B).png', 'Crimson Twin Butterflies (S).png',
  "Devil's Blood Curse (A).png", "Devil's Blood Curse (B).png", "Devil's Blood Curse (S).png",
  'Diabolos (A).png', 'Diabolos (B).png', 'Diabolos (S).png',
  'Fireflies and the Forest(A).png', 'Fireflies and the Forest (B).png', 'Fireflies and the Forest (S).png',
  "Kingdom's Guard (A).png", "Kingdom's Guard (B).png", "Kingdom's Guard (S).png",
  'Lost Radiance (A).png', 'Lost Radiance (B).png', 'Lost Radiance (S).png',
  'Quiet Manor (A).png', 'Quiet Manor (B).png', 'Quiet Manor (S).png',
  'Shadow Creed (A).png', 'Shadow Creed (B).png', 'Shadow Creed (S).png',
  'Speedy Hedgehog (A).png', 'Speedy Hedgehog (B).png', 'Speedy Hedgehog (S).png',
  'Street Boxer (A).png', 'Street Boxer (B).png', 'Street Boxer (S).png',
  "Thea's Night Tavern (A).png", "Thea's Night Tavern (B).png", "Thea's Night Tavern (S).png",
  'Tiny Big Adventure (A).png', 'Tiny Big Adventure (B).png', 'Tiny Big Adventure (S).png',
]

const vehicleFiles = [
  'A1.png', 'B100.png', 'Blizzard-V4.png', 'C2000.png', 'Enforcer.png', 'G3.png',
  'Griffin Volante.png', 'Griffin.png', 'k01.png', 'LaVelox.png', 'M1000.png',
  'Novis ST-X 950.png', 'Pendragon.png', 'Pursuit V8.png', 'Rivok.png', 'ST79.png',
]

const miscFiles = [
  'anima.png', 'chaos.png', 'cosmos.png', 'gas.webp', 'incantation.png', 'lakshana.png',
  'liquid.webp', 'plasma.webp', 'psyche.png', 'solid.webp', 'synthesis.webp',
  'rank-a.png', 'rank-b.png', 'rank-s.png',
]

function withoutExt(fileName) {
  return String(fileName || '').replace(/\.[^.]+$/, '')
}

function path(folder, fileName) {
  return `${BASE_PATH}/${folder}/${fileName}`
}

function record(folder, fileName, entityType, kind) {
  const label = withoutExt(fileName)
  const entityId = slugifyEntityName(label.replace(/\s+\([sab]\)$/i, ''))
  const resolvedEntityId = resolveMediaEntityId(entityType, entityId)
  return {
    id: `${entityType}-${kind}-${slugifyEntityName(label)}`,
    entityType,
    entityId,
    resolvedEntityId,
    kind,
    path: path(folder, fileName),
    alt: label,
    status: 'local-seed',
  }
}

export const mediaRegistry = [
  ...characterFiles.map((file) => record('characters', file, 'character', 'avatar')),
  ...weaponFiles.map((file) => record('weapons', file, 'weapon', 'image')),
  ...moduleFiles.map((file) => record('modules', file, 'cartridge', 'image')),
  ...vehicleFiles.map((file) => record('cars', file, 'vehicle', 'image')),
  ...miscFiles.map((file) => record('misc', file, 'misc', 'icon')),
]

export function getMediaForEntity(entityType, entityId, kind) {
  const normalizedType = String(entityType || '').trim()
  const normalizedId = slugifyEntityName(entityId)
  return mediaRegistry.find((item) =>
    item.entityType === normalizedType &&
    (item.entityId === normalizedId || item.resolvedEntityId === normalizedId) &&
    (!kind || item.kind === kind)
  ) || null
}

export function getMediaByPath(pathValue) {
  return mediaRegistry.find((item) => item.path === pathValue) || null
}
