import type { WeaponDetail, WeaponSummary } from '../../contracts/weapons.js'
import type { WeaponRepository } from '../WeaponRepository.js'
import { MockReadOnlyRepository } from './MockReadOnlyRepository.js'

export class MockWeaponRepository extends MockReadOnlyRepository<WeaponSummary, WeaponDetail & WeaponSummary> implements WeaponRepository {}
