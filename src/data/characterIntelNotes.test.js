import test from 'node:test'
import assert from 'node:assert/strict'
import { characters } from './characters.js'
import { characterIntelNotes, characterIntelSearchText, getCharacterIntelNotes, validateCharacterIntelNotes } from './characterIntelNotes.js'

const canonicalSlugs = characters.map((character) => character.slug || character.id)

test('character intel notes only target existing canonical slugs', () => {
  assert.deepEqual(validateCharacterIntelNotes(characterIntelNotes, canonicalSlugs), [])
})

test('character intel notes remain source pending and do not include protected canonical fields', () => {
  for (const [slug, entry] of Object.entries(characterIntelNotes)) {
    assert.notEqual(slug, 'nanally')
    assert.notEqual(entry.sourceStatus, 'verified')
    assert.equal('rarity' in entry, false)
    assert.equal('element' in entry, false)
    assert.equal('arcType' in entry, false)
    for (const section of entry.sections || []) {
      for (const item of section.items || []) {
        assert.notEqual(item.sourceStatus, 'verified')
        assert.equal('rarity' in item, false)
        assert.equal('element' in item, false)
        assert.equal('arcType' in item, false)
      }
    }
  }
})

test('character intel lookup is optional', () => {
  assert.equal(getCharacterIntelNotes('nanally'), null)
  assert.equal(getCharacterIntelNotes('missing-character'), null)
  assert.equal(getCharacterIntelNotes('lacrimosa')?.sourceStatus, 'needs_verification')
})

test('character intel search text is available without exposing source paths', () => {
  const searchText = characterIntelSearchText('lacrimosa')
  assert.match(searchText, /Nightmare/i)
  assert.doesNotMatch(searchText, /\.generated|data[\\/]|\.md|\.json/i)
})
