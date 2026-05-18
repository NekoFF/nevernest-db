import assert from 'node:assert/strict'
import fs from 'node:fs'
import os from 'node:os'
import path from 'node:path'
import test from 'node:test'
import {
  buildAliasLookup,
  buildCanonicalRecords,
  detectSlugFromPath,
  findNamesInText,
  readSafeText,
  scanFiles,
  slugify,
  snippetFingerprint,
} from './character-corpus-utils.mjs'

const fixtureCharacters = [
  { id: 'nanally', name: 'Nanally', rarity: 'S', element: 'anima', arcType: 'plasma', roles: ['Damage'], overview: [{ id: 'x' }], skills: [{ id: 's' }], build: { weapons: [{}], cartridges: [{}] }, teams: [{}] },
  { id: 'adler', name: 'Adler', rarity: 'A', element: 'incantation', arcType: 'bose', roles: ['Attack'] },
]

test('slugify normalizes candidate aliases safely', () => {
  assert.equal(slugify("Good-Boy's Grand Adventure"), 'good-boy-s-grand-adventure')
  assert.equal(slugify('Esper Zero'), 'esper-zero')
})

test('canonical map preserves existing site fields', () => {
  const records = buildCanonicalRecords(fixtureCharacters)
  const nanally = records.find((record) => record.slug === 'nanally')
  assert.equal(nanally.rarity, 'S')
  assert.equal(nanally.element, 'anima')
  assert.equal(nanally.arcType, 'plasma')
  assert.equal(nanally.isReferenceQuality, true)
  assert.equal(nanally.hasRichDetailData, true)
})

test('path mapping uses canonical aliases without creating new characters', () => {
  const records = buildCanonicalRecords(fixtureCharacters)
  const lookup = buildAliasLookup(records)
  const root = path.join(os.tmpdir(), 'nte-corpus-test')
  const file = path.join(root, 'data', 'corpus', 'characters', 'adler', 'index.md')
  assert.equal(detectSlugFromPath(root, file, lookup), 'adler')
  assert.equal(detectSlugFromPath(root, path.join(root, 'characters', 'unknown-name', 'index.md'), lookup), null)
})

test('text mapping detects canonical names but leaves ambiguous files visible', () => {
  const records = buildCanonicalRecords(fixtureCharacters)
  assert.deepEqual(findNamesInText('Nanally best build guide', records), ['nanally'])
  assert.deepEqual(new Set(findNamesInText('Nanally and Adler team notes', records)), new Set(['nanally', 'adler']))
})

test('snippet fingerprints dedupe repeated scrape lines', () => {
  assert.equal(snippetFingerprint('Nanally   Best Build!'), snippetFingerprint('nanally best build'))
})

test('scanFiles skips dependency folders and readSafeText skips binary/large files', () => {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'nte-corpus-safe-'))
  fs.mkdirSync(path.join(root, 'node_modules'), { recursive: true })
  fs.mkdirSync(path.join(root, 'characters', 'nanally'), { recursive: true })
  fs.writeFileSync(path.join(root, 'node_modules', 'skip.md'), 'skip', 'utf8')
  fs.writeFileSync(path.join(root, 'characters', 'nanally', 'index.md'), 'Nanally build notes', 'utf8')
  fs.writeFileSync(path.join(root, 'characters', 'nanally', 'image.png'), Buffer.from([0, 1, 2, 3]))

  const scanned = scanFiles(root)
  assert.equal(scanned.files.some((file) => file.includes('node_modules')), false)
  assert.equal(scanned.files.some((file) => file.endsWith('index.md')), true)
  assert.equal(readSafeText(path.join(root, 'characters', 'nanally', 'image.png')).skipped, true)
})
