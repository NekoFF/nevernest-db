import type { CharacterDetail, CharacterSummary } from '../contracts/characters.js'
import type { ReadOnlyRepository } from './types.js'

export type CharacterRepository = ReadOnlyRepository<CharacterSummary, CharacterDetail> & {
  findRelated?(idOrSlug: string): Promise<CharacterSummary[]>
}
