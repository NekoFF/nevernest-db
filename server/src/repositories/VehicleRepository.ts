import type { VehicleDetail, VehicleSummary } from '../contracts/vehicles.js'
import type { ReadOnlyRepository } from './types.js'

export type VehicleRepository = ReadOnlyRepository<VehicleSummary, VehicleDetail>
