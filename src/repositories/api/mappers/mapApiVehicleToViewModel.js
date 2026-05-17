import { vehicles as staticVehicles } from '../../../data/vehicles.js'
import { findStaticEntity, idOf } from './taxonomyLookups.js'

export function mapApiVehicleToViewModel(row) {
  const raw = row?.raw && typeof row.raw === 'object' ? row.raw : {}
  const staticMatch = findStaticEntity(staticVehicles, row) || {}
  const stats = row.stats || {}
  const type = row.vehicleTypeLabel || raw.type || staticMatch.type || row.vehicleType || 'Unknown'

  return {
    ...staticMatch,
    ...raw,
    id: idOf(row),
    externalId: row.externalId,
    slug: row.slug || row.externalId || row.id,
    name: row.name || raw.name || staticMatch.name,
    type,
    vehicleType: type,
    description: row.description || raw.description || staticMatch.description || '',
    maxSpeed: stats.maxSpeed ?? raw.maxSpeed ?? staticMatch.maxSpeed ?? null,
    acceleration: stats.acceleration ?? raw.acceleration ?? staticMatch.acceleration ?? null,
    durability: stats.durability ?? raw.durability ?? staticMatch.durability ?? null,
    handling: stats.handling || raw.handling || staticMatch.handling,
    image: row.media?.path || raw.image || staticMatch.image,
    currency: row.acquisition?.[0]?.currency || row.currency || raw.currency || staticMatch.currency,
    price: row.acquisition?.[0]?.price ?? row.price ?? raw.price ?? staticMatch.price,
    acquisitionText: row.acquisition?.[0]?.acquisitionText || raw.acquisitionText || staticMatch.acquisitionText,
    sourceStatus: row.sourceStatus,
    publicationStatus: row.publicationStatus,
  }
}
