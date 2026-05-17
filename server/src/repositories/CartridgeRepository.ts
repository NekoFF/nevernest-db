import type { CartridgeSetDetail, CartridgeSetSummary } from '../contracts/cartridges.js'
import type { ReadOnlyRepository } from './types.js'

export type CartridgeRepository = ReadOnlyRepository<CartridgeSetSummary, CartridgeSetDetail>
