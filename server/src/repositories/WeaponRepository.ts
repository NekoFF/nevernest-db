import type { WeaponDetail, WeaponSummary } from '../contracts/weapons.js'
import type { ReadOnlyRepository } from './types.js'

export type WeaponRepository = ReadOnlyRepository<WeaponSummary, WeaponDetail>
