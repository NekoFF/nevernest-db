import fs from 'node:fs'
import path from 'node:path'
import zlib from 'node:zlib'

const files = [
  ['nanally', 'H:/Cursor/NevernestDB/characters/Nanally/date.pdf'],
  ['sakiri', 'H:/Cursor/NevernestDB/characters/Sakiri/date.pdf'],
  ['sakiri-import-packet-v1', 'C:/Users/melln/Downloads/sakiri_import_packet_v1.pdf'],
]

function decodePdfString(raw) {
  let value = ''
  for (let i = 0; i < raw.length; i += 1) {
    const char = raw[i]
    if (char !== '\\') {
      value += char
      continue
    }
    const next = raw[++i]
    if (next == null) break
    if (next === 'n') value += '\n'
    else if (next === 'r') value += '\r'
    else if (next === 't') value += '\t'
    else if (next === 'b') value += '\b'
    else if (next === 'f') value += '\f'
    else if (next === '(' || next === ')' || next === '\\') value += next
    else if (/[0-7]/.test(next)) {
      let oct = next
      for (let count = 0; count < 2 && /[0-7]/.test(raw[i + 1] || ''); count += 1) {
        oct += raw[++i]
      }
      value += String.fromCharCode(Number.parseInt(oct, 8))
    } else {
      value += next
    }
  }
  return value
    .replaceAll('\x00', '')
    .replaceAll('\xA0', ' ')
    .replaceAll('\xD7', '×')
    .replaceAll('\uFFFD', '×')
}

function extractStrings(operatorText) {
  const values = []
  const stringPattern = /\((?:\\.|[^\\)])*\)/gs
  for (const match of operatorText.matchAll(stringPattern)) {
    values.push(decodePdfString(match[0].slice(1, -1)))
  }
  return values.join('')
}

function normalizeLine(line) {
  return line
    .replace(/\s+/g, ' ')
    .replace(/\s+([,.:;!?%])/g, '$1')
    .replace(/([(+])\s+/g, '$1')
    .replace(/\s+([)])/g, '$1')
    .replace(/\*\s*/g, ' × ')
    .replace(/\s*×\s*/g, ' × ')
    .replace(/\s*\+\s*/g, ' + ')
    .trim()
}

function parseTextObjects(content, pageNumber) {
  const text = content.toString('latin1')
  const objects = []
  const btPattern = /BT([\s\S]*?)ET/g
  for (const bt of text.matchAll(btPattern)) {
    const block = bt[1]
    const tmMatches = [...block.matchAll(/(-?\d+(?:\.\d+)?)\s+(-?\d+(?:\.\d+)?)\s+(-?\d+(?:\.\d+)?)\s+(-?\d+(?:\.\d+)?)\s+(-?\d+(?:\.\d+)?)\s+(-?\d+(?:\.\d+)?)\s+Tm/g)]
    const tm = tmMatches[tmMatches.length - 1]
    if (!tm) continue
    const x = Number(tm[5])
    const y = Number(tm[6])
    const textOperators = [...block.matchAll(/(\[(?:\\.|[^\]])*\]\s*TJ|\((?:\\.|[^\\)])*\)\s*Tj)/gs)]
    const value = normalizeLine(textOperators.map((item) => extractStrings(item[1])).join(''))
    if (!value) continue
    objects.push({ page: pageNumber, x, y, text: value })
  }
  return objects
}

function extractPdf(filePath) {
  const buffer = fs.readFileSync(filePath)
  const latin = buffer.toString('latin1')
  const objects = []
  let streamIndex = 0
  for (const match of latin.matchAll(/<<(?:.|\n|\r)*?>>\s*stream\r?\n/g)) {
    const dict = match[0]
    const start = match.index + match[0].length
    const end = buffer.indexOf(Buffer.from('endstream'), start)
    if (end < 0) continue
    let stream = buffer.slice(start, end)
    if (stream[0] === 13 && stream[1] === 10) stream = stream.slice(2)
    else if (stream[0] === 10) stream = stream.slice(1)
    if (/FlateDecode/.test(dict)) {
      try {
        stream = zlib.inflateSync(stream)
      } catch {
        continue
      }
    }
    const pageObjects = parseTextObjects(stream, streamIndex + 1)
    if (pageObjects.length) {
      streamIndex += 1
      objects.push(...pageObjects)
    }
  }
  return objects
}

function groupLines(objects) {
  const pages = new Map()
  for (const object of objects) {
    if (!pages.has(object.page)) pages.set(object.page, [])
    pages.get(object.page).push(object)
  }
  const lines = []
  for (const [page, pageObjects] of pages) {
    const sorted = [...pageObjects].sort((a, b) => b.y - a.y || a.x - b.x)
    const groups = []
    for (const item of sorted) {
      const existing = groups.find((group) => Math.abs(group.y - item.y) < 3)
      if (existing) existing.items.push(item)
      else groups.push({ y: item.y, items: [item] })
    }
    lines.push(`\n=== Page ${page} ===`)
    for (const group of groups) {
      const line = normalizeLine(group.items.sort((a, b) => a.x - b.x).map((item) => item.text).join(' '))
      if (line) lines.push(line)
    }
  }
  return lines.join('\n')
}

const outDir = path.join(process.cwd(), '.generated', 'pdf-extract')
fs.mkdirSync(outDir, { recursive: true })

for (const [name, filePath] of files) {
  const objects = extractPdf(filePath)
  const text = groupLines(objects)
  fs.writeFileSync(path.join(outDir, `${name}.objects.json`), JSON.stringify(objects, null, 2))
  fs.writeFileSync(path.join(outDir, `${name}.txt`), text)
  console.log(`${name}: ${objects.length} text objects -> ${path.join(outDir, `${name}.txt`)}`)
}
