import type { VehicleDetail, VehicleSummary } from '../../contracts/vehicles.js'
import type { VehicleRepository } from '../VehicleRepository.js'
import { MockReadOnlyRepository } from './MockReadOnlyRepository.js'

export class MockVehicleRepository extends MockReadOnlyRepository<VehicleSummary, VehicleDetail & VehicleSummary> implements VehicleRepository {}
