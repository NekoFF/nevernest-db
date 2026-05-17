import type { MediaAssetSummary } from '../../contracts/media.js'
import type { MediaRepository } from '../MediaRepository.js'
import { MockReadOnlyRepository } from './MockReadOnlyRepository.js'

export class MockMediaRepository extends MockReadOnlyRepository<MediaAssetSummary> implements MediaRepository {}
