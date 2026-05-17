import { cloneRaw, entityBase, stringOrEmpty } from './normalizeShared.js'

export function normalizeVehicleForExport(vehicle = {}) {
  const base = entityBase(vehicle, 'vehicle')
  return {
    ...base,
    type: stringOrEmpty(vehicle.type),
    currency: stringOrEmpty(vehicle.currency || 'unknown'),
    price: vehicle.price == null ? null : Number(vehicle.price),
    maxSpeed: Number(vehicle.maxSpeed) || 0,
    acceleration: Number(vehicle.acceleration) || 0,
    durability: Number(vehicle.durability) || 0,
    handling: vehicle.handling && typeof vehicle.handling === 'object' ? { ...vehicle.handling } : {},
    description: stringOrEmpty(vehicle.description),
    raw: cloneRaw(vehicle),
  }
}

