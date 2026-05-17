import type { CartridgeSetDetail, CartridgeSetSummary } from '../../contracts/cartridges.js'
import type { CartridgeRepository } from '../CartridgeRepository.js'
import { MockReadOnlyRepository } from './MockReadOnlyRepository.js'

export class MockCartridgeRepository extends MockReadOnlyRepository<CartridgeSetSummary, CartridgeSetDetail & CartridgeSetSummary> implements CartridgeRepository {}
