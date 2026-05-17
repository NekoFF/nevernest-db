import type { CharacterDetail, CharacterSummary } from '../../contracts/characters.js'
import type { CharacterRepository } from '../CharacterRepository.js'
import { MockReadOnlyRepository } from './MockReadOnlyRepository.js'

export class MockCharacterRepository extends MockReadOnlyRepository<CharacterSummary, CharacterDetail & CharacterSummary> implements CharacterRepository {}
