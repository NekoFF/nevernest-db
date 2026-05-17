import type { EntityDetail, EntitySummary, MediaDisplay, SourceStatus } from './common.js'

export type VehicleSummary = EntitySummary & {
  vehicleType: string
  vehicleTypeLabel?: string
  mediaAssetId?: string | null
  media?: MediaDisplay | null
}

export type VehicleDetail = EntityDetail & VehicleSummary & {
  stats?: VehicleStats | null
  acquisition?: VehicleAcquisition[]
}

export type VehicleStats = {
  maxSpeed?: number | null
  acceleration?: number | null
  durability?: number | null
  handling?: unknown
}

export type VehicleAcquisition = {
  currency?: string | null
  price?: number | null
  acquisitionText?: string | null
  sourceStatus: SourceStatus
}
