import type { MediaAssetSummary } from '../contracts/media.js'
import type { ReadOnlyRepository } from './types.js'

export type MediaRepository = ReadOnlyRepository<MediaAssetSummary>
