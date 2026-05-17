import { slug } from './loadSnapshot.mjs'

export function mapVehicles(snapshot) {
  const vehicles = []
  const vehicleStats = []
  const vehicleAcquisition = []

  for (const item of snapshot.data.vehicles || []) {
    vehicles.push({
      external_id: item.id,
      slug: slug(item.id || item.name),
      name: item.name,
      vehicle_type: item.type,
      description: item.description || '',
      source_status: 'unknown',
      raw: item,
    })
    vehicleStats.push({
      vehicle_external_id: item.id,
      max_speed: item.maxSpeed,
      acceleration: item.acceleration,
      durability: item.durability,
      handling_json: item.handling || {},
      source_status: 'unknown',
    })
    vehicleAcquisition.push({
      vehicle_external_id: item.id,
      currency: item.currency || '',
      price: item.price ?? null,
      acquisition_text: '',
      source_status: item.price == null ? 'needs_verification' : 'unknown',
    })
  }

  return { vehicles, vehicleStats, vehicleAcquisition }
}

