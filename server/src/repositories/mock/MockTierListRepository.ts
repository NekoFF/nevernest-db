import type { TierListDetail, TierListSummary } from '../../contracts/tierLists.js'
import type { TierListRepository } from '../TierListRepository.js'
import { MockReadOnlyRepository } from './MockReadOnlyRepository.js'

export class MockTierListRepository extends MockReadOnlyRepository<TierListSummary, TierListDetail & TierListSummary> implements TierListRepository {}
