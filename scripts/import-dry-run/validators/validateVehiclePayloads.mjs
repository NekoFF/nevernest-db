import { validateTableBasics, refCheck, setOf } from './shared.mjs'

export function validateVehiclePayloads(payloads) {
  const issues = []
  const vehicleIds = setOf(payloads.vehicles.vehicles)
  validateTableBasics(issues, 'vehicles', payloads.vehicles.vehicles, ['external_id', 'slug', 'name'])
  refCheck(issues, 'vehicle_stats', payloads.vehicles.vehicleStats, 'vehicle_external_id', vehicleIds, 'vehicles')
  refCheck(issues, 'vehicle_acquisition', payloads.vehicles.vehicleAcquisition, 'vehicle_external_id', vehicleIds, 'vehicles')
  return issues
}

