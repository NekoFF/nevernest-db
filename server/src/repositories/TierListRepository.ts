import type { TierListDetail, TierListSummary } from '../contracts/tierLists.js'
import type { ReadOnlyRepository } from './types.js'

export type TierListRepository = ReadOnlyRepository<TierListSummary, TierListDetail>
