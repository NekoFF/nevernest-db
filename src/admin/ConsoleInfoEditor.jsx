import { useEffect, useState } from 'react'
import { Plus, Search, Trash2, X } from 'lucide-react'
import ModuleShape from '../components/ModuleShape.jsx'
import { CARTRIDGES, getCartridgeById } from '../data/cartridgeCatalog.js'
import { MODULE_SHAPES } from '../data/moduleCatalog.js'
import { createRequiredPiecesFromCartridge, normalizeConsole } from '../data/consoleBlocks.js'
import { badgeClass, weaponInitials } from '../components/weapons/weaponStyle.js'
import { useAdminMode } from './AdminModeContext.jsx'
import { getWeaponAsset } from '../utils/assetHelpers.js'
import CartridgeIcon from '../components/cartridges/CartridgeIcon.jsx'

function FieldLabel({ children }) {
  return <p className="text-[11px] font-semibold uppercase tracking-wide text-[#6b7280]">{children}</p>
}

function cleanConsole(consoleData) {
  const cartridge = getCartridgeById(consoleData.mainCartridgeId)
  return {
    ...consoleData,
    arcId: String(consoleData.arcId || '').trim(),
    arcName: '',
    mainCartridgeName: cartridge?.name || '',
    cartridgeBonuses: [],
    requiredPieces: (consoleData.requiredPieces || []).map((piece, index) => ({
      id: piece.id || `piece-${index + 1}`,
      label: piece.label.trim() || `Piece ${String.fromCharCode(65 + index)}`,
      moduleShapeId: piece.moduleShapeId,
      moduleType: piece.moduleType,
      preferredRarity: piece.preferredRarity,
      colorKey: String(piece.preferredRarity || 'S').toLowerCase(),
    })),
    notes: (consoleData.notes || []).map((note) => note.trim()).filter(Boolean),
  }
}

const weaponTypeOptions = ['All', 'Bose', 'Gas', 'Liquid', 'Plasma', 'Solid']
const weaponRarityOptions = ['All', 'S', 'A', 'B']

function WeaponIcon({ weapon }) {
  const image = getWeaponAsset(weapon?.name) || weapon?.icon || weapon?.image || ''
  if (image) return <img src={image} alt={weapon.name} className="h-12 w-12 rounded-2xl bg-[#fafafa] object-contain p-1.5 ring-1 ring-black/[0.05]" loading="lazy" />
  return (
    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[radial-gradient(circle_at_20%_20%,rgba(255,47,109,0.15),transparent_38%),radial-gradient(circle_at_80%_25%,rgba(6,182,212,0.14),transparent_34%),linear-gradient(135deg,#ffffff,#f5f5f4)] text-sm font-bold text-[#111111] ring-1 ring-black/[0.05]">
      {weaponInitials(weapon?.name)}
    </div>
  )
}

function findWeaponInList(weaponOptions, id) {
  return (weaponOptions || []).find((weapon) => weapon.id === id || weapon.slug === id) || null
}

function findCartridgeInList(cartridgeOptions, id) {
  return (cartridgeOptions || []).find((cartridge) => cartridge.id === id || cartridge.slug === id || cartridge.sourceId === id) || getCartridgeById(id) || null
}

function CartridgeSelector({ value, onChange, cartridgeOptions = [] }) {
  const [expanded, setExpanded] = useState(false)
  const [query, setQuery] = useState('')
  const selected = findCartridgeInList(cartridgeOptions, value)
  const filtered = cartridgeOptions
    .filter((cartridge) => {
      const text = query.trim().toLowerCase()
      if (!text) return true
      return `${cartridge.name} ${cartridge.element || ''} ${cartridge.bonusCategory || ''}`.toLowerCase().includes(text)
    })
    .slice(0, 10)

  return (
    <section className="rounded-2xl border border-black/[0.06] bg-white p-4 shadow-sm">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <FieldLabel>Main Cartridge</FieldLabel>
          <p className="mt-1 text-xs text-[#6b7280]">Stored as a central cartridge id.</p>
        </div>
        <div className="flex gap-2">
          {value ? <button type="button" onClick={() => onChange('')} className="rounded-full border border-black/[0.08] bg-white px-3 py-1.5 text-xs font-semibold text-[#6b7280]">Clear</button> : null}
          <button type="button" onClick={() => setExpanded((next) => !next)} className="rounded-full border border-black/[0.08] bg-white px-3 py-1.5 text-xs font-semibold">{expanded ? 'Hide picker' : 'Choose Cartridge'}</button>
        </div>
      </div>

      {selected ? (
        <div className="mt-3 flex items-center gap-3 rounded-2xl bg-[#fafafa] p-3 ring-1 ring-black/[0.04]">
          <CartridgeIcon cartridge={selected} rarity="S" className="h-12 w-12 rounded-2xl" />
          <div className="min-w-0">
            <p className="font-semibold text-[#111111]">{selected.name}</p>
            <p className="mt-1 text-xs font-semibold text-[#6b7280]">{[selected.element, selected.bonusCategory].filter(Boolean).join(' / ')}</p>
          </div>
        </div>
      ) : (
        <p className="mt-3 rounded-2xl border border-dashed border-black/[0.08] bg-[#fafafa] px-4 py-3 text-sm text-[#9ca3af]">No cartridge selected.</p>
      )}

      {expanded ? (
        <div className="mt-4 space-y-3">
          <label className="relative block">
            <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-[#9ca3af]" strokeWidth={1.8} />
            <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search cartridges..." className="h-10 w-full rounded-xl border border-black/[0.08] bg-[#fafafa] pl-10 pr-3 text-sm" />
          </label>
          <div className="grid gap-2">
            {filtered.map((cartridge) => (
              <button
                key={cartridge.id}
                type="button"
                onClick={() => {
                  onChange(cartridge.id)
                  setExpanded(false)
                }}
                className="grid gap-3 rounded-2xl border border-black/[0.06] bg-[#fafafa] p-3 text-left transition hover:bg-white sm:grid-cols-[48px_minmax(0,1fr)_auto] sm:items-center"
              >
                <CartridgeIcon cartridge={cartridge} rarity="S" className="h-12 w-12 rounded-2xl" />
                <div className="min-w-0">
                  <p className="font-semibold text-[#111111]">{cartridge.name}</p>
                  <p className="mt-1 text-xs font-semibold text-[#6b7280]">{[cartridge.element, cartridge.bonusCategory].filter(Boolean).join(' / ')}</p>
                </div>
                <span className="rounded-full bg-white px-3 py-1.5 text-xs font-semibold text-[#ff2f6d] ring-1 ring-black/[0.06]">{cartridge.id === value ? 'Selected' : 'Select'}</span>
              </button>
            ))}
          </div>
        </div>
      ) : null}
    </section>
  )
}

function ArcSelector({ value, onChange, weaponOptions = [] }) {
  const [expanded, setExpanded] = useState(false)
  const [query, setQuery] = useState('')
  const [rarity, setRarity] = useState('All')
  const [type, setType] = useState('All')
  const [subStat, setSubStat] = useState('All')
  const selected = findWeaponInList(weaponOptions, value)
  const subStatOptions = ['All', ...Array.from(new Set(weaponOptions.map((weapon) => weapon.subStat?.type).filter(Boolean))).sort((a, b) => a.localeCompare(b))]
  const filteredWeapons = weaponOptions
    .filter((weapon) => {
      const text = query.trim().toLowerCase()
      if (text && !`${weapon.name} ${weapon.type} ${weapon.rarity} ${weapon.subStat?.type || ''}`.toLowerCase().includes(text)) return false
      if (rarity !== 'All' && weapon.rarity !== rarity) return false
      if (type !== 'All' && weapon.type !== type) return false
      if (subStat !== 'All' && weapon.subStat?.type !== subStat) return false
      return true
    })
    .slice(0, 10)

  return (
    <section className="rounded-2xl border border-black/[0.06] bg-white p-4 shadow-sm">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <FieldLabel>Arc</FieldLabel>
          <p className="mt-1 text-xs text-[#6b7280]">Stored as a central weapon id.</p>
        </div>
        <div className="flex gap-2">
          {value ? <button type="button" onClick={() => onChange('')} className="rounded-full border border-black/[0.08] bg-white px-3 py-1.5 text-xs font-semibold text-[#6b7280]">Clear</button> : null}
          <button type="button" onClick={() => setExpanded((next) => !next)} className="rounded-full border border-black/[0.08] bg-white px-3 py-1.5 text-xs font-semibold">{expanded ? 'Hide picker' : 'Choose Arc'}</button>
        </div>
      </div>

      {selected ? (
        <div className="mt-3 flex items-center gap-3 rounded-2xl bg-[#fafafa] p-3 ring-1 ring-black/[0.04]">
          <WeaponIcon weapon={selected} />
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <p className="font-semibold text-[#111111]">{selected.name}</p>
              <span className={badgeClass('rarity', selected.rarity)}>{selected.rarity}</span>
              <span className={badgeClass('type', selected.type)}>{selected.type}</span>
            </div>
            <p className="mt-1 text-xs font-semibold text-[#6b7280]">{selected.mainStat.type}: {selected.mainStat.value} · {selected.subStat.type}: {selected.subStat.value}</p>
          </div>
        </div>
      ) : (
        <p className="mt-3 rounded-2xl border border-dashed border-black/[0.08] bg-[#fafafa] px-4 py-3 text-sm text-[#9ca3af]">No arc selected.</p>
      )}

      {expanded ? (
        <div className="mt-4 space-y-3">
          <div className="grid gap-2 lg:grid-cols-[minmax(220px,1fr)_120px_150px_170px]">
            <label className="relative block">
              <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-[#9ca3af]" strokeWidth={1.8} />
              <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search arcs..." className="h-10 w-full rounded-xl border border-black/[0.08] bg-[#fafafa] pl-10 pr-3 text-sm" />
            </label>
            <select value={rarity} onChange={(event) => setRarity(event.target.value)} className="h-10 rounded-xl border border-black/[0.08] bg-[#fafafa] px-3 text-sm font-semibold">
              {weaponRarityOptions.map((option) => <option key={option} value={option}>{option === 'All' ? 'All rarity' : option}</option>)}
            </select>
            <select value={type} onChange={(event) => setType(event.target.value)} className="h-10 rounded-xl border border-black/[0.08] bg-[#fafafa] px-3 text-sm font-semibold">
              {weaponTypeOptions.map((option) => <option key={option} value={option}>{option === 'All' ? 'All types' : option}</option>)}
            </select>
            <select value={subStat} onChange={(event) => setSubStat(event.target.value)} className="h-10 rounded-xl border border-black/[0.08] bg-[#fafafa] px-3 text-sm font-semibold">
              {subStatOptions.map((option) => <option key={option} value={option}>{option === 'All' ? 'All sub stats' : option}</option>)}
            </select>
          </div>
          <div className="grid gap-2">
            {filteredWeapons.map((weapon) => (
              <button
                key={weapon.id}
                type="button"
                onClick={() => {
                  onChange(weapon.id)
                  setExpanded(false)
                }}
                className="grid gap-3 rounded-2xl border border-black/[0.06] bg-[#fafafa] p-3 text-left transition hover:bg-white sm:grid-cols-[48px_minmax(0,1fr)_auto] sm:items-center"
              >
                <WeaponIcon weapon={weapon} />
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <p className="font-semibold text-[#111111]">{weapon.name}</p>
                    <span className={badgeClass('rarity', weapon.rarity)}>{weapon.rarity}</span>
                    <span className={badgeClass('type', weapon.type)}>{weapon.type}</span>
                  </div>
                  <p className="mt-1 text-xs font-semibold text-[#6b7280]">{weapon.mainStat.type}: {weapon.mainStat.value} · {weapon.subStat.type}: {weapon.subStat.value}</p>
                </div>
                <span className="rounded-full bg-white px-3 py-1.5 text-xs font-semibold text-[#ff2f6d] ring-1 ring-black/[0.06]">{weapon.id === value ? 'Selected' : 'Select'}</span>
              </button>
            ))}
          </div>
        </div>
      ) : null}
    </section>
  )
}

export default function ConsoleInfoEditor({ character, open, onClose, onSave }) {
  const { mergedCartridges, mergedWeapons } = useAdminMode()
  const [consoleData, setConsoleData] = useState(null)

  useEffect(() => {
    if (!open || !character) return
    setConsoleData(normalizeConsole(character) || normalizeConsole({ console: { title: 'Console Setup', grid: { rows: 7, cols: 7 } } }))
  }, [character, open])

  if (!open || !character || !consoleData) return null

  const update = (patch) => setConsoleData((current) => ({ ...current, ...patch }))
  const updateTrait = (patch) => setConsoleData((current) => ({ ...current, trait: { ...current.trait, ...patch } }))
  const applyPieces = () => update({ requiredPieces: createRequiredPiecesFromCartridge(consoleData.mainCartridgeId, mergedCartridges) })

  const save = () => {
    onSave?.(character.id, { console: cleanConsole(consoleData) })
    onClose?.()
  }

  return (
    <div className="fixed inset-0 z-[110] flex items-center justify-center p-4" role="dialog" aria-modal="true">
      <button type="button" className="absolute inset-0 bg-black/35 backdrop-blur-sm" aria-label="Close console info editor" onClick={onClose} />
      <div className="relative z-[111] flex max-h-[min(90vh,860px)] w-full max-w-4xl flex-col overflow-hidden rounded-[28px] border border-white/70 bg-white/95 shadow-[0_30px_100px_rgba(0,0,0,0.2)] backdrop-blur-xl">
        <div className="flex items-start justify-between gap-4 border-b border-black/[0.06] px-6 py-5 sm:px-8">
          <div>
            <h2 className="text-lg font-semibold tracking-tight text-[#111111]">Edit Console Info</h2>
            <p className="mt-1 text-sm text-[#6b7280]">{character.name} console information</p>
          </div>
          <button type="button" onClick={onClose} className="flex h-10 w-10 items-center justify-center rounded-2xl border border-black/[0.06] bg-[#fafafa] text-[#6b7280]"><X className="h-4 w-4" /></button>
        </div>

        <div className="flex-1 space-y-5 overflow-y-auto px-6 py-5 sm:px-8">
          <div className="grid gap-3 sm:grid-cols-2">
            <label><FieldLabel>Title</FieldLabel><input value={consoleData.title} onChange={(e) => update({ title: e.target.value })} className="mt-1.5 h-11 w-full rounded-2xl border border-black/[0.08] bg-[#fafafa] px-4 text-sm outline-none focus:border-[#ff2f6d]/25" /></label>
            <label><FieldLabel>Rarity Priority</FieldLabel><input value={consoleData.rarityPriority} onChange={(e) => update({ rarityPriority: e.target.value })} className="mt-1.5 h-11 w-full rounded-2xl border border-black/[0.08] bg-[#fafafa] px-4 text-sm outline-none focus:border-[#ff2f6d]/25" /></label>
          </div>
          <label className="block"><FieldLabel>Description</FieldLabel><textarea value={consoleData.description} onChange={(e) => update({ description: e.target.value })} rows={3} className="mt-1.5 w-full rounded-2xl border border-black/[0.08] bg-[#fafafa] px-4 py-3 text-sm outline-none focus:border-[#ff2f6d]/25" /></label>

          <CartridgeSelector
            value={consoleData.mainCartridgeId}
            cartridgeOptions={mergedCartridges || CARTRIDGES}
            onChange={(mainCartridgeId) => {
              const cartridge = findCartridgeInList(mergedCartridges || CARTRIDGES, mainCartridgeId)
              update({
                mainCartridgeId,
                mainCartridgeName: cartridge?.name || '',
                cartridgeBonuses: [],
                requiredPieces: mainCartridgeId ? createRequiredPiecesFromCartridge(mainCartridgeId, mergedCartridges) : [],
              })
            }}
          />
          <ArcSelector value={consoleData.arcId} weaponOptions={mergedWeapons} onChange={(arcId) => update({ arcId, arcName: '' })} />
          <div className="flex flex-wrap gap-2">
            <button type="button" onClick={applyPieces} className="rounded-full border border-black/[0.08] bg-white px-4 py-2 text-sm font-semibold text-[#111111] shadow-sm">Apply cartridge required pieces</button>
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            <label><FieldLabel>Trait Title</FieldLabel><input value={consoleData.trait.title} onChange={(e) => updateTrait({ title: e.target.value })} className="mt-1.5 h-11 w-full rounded-2xl border border-black/[0.08] bg-[#fafafa] px-4 text-sm outline-none focus:border-[#ff2f6d]/25" /></label>
            <label><FieldLabel>Trait Description</FieldLabel><textarea value={consoleData.trait.description} onChange={(e) => updateTrait({ description: e.target.value })} rows={2} className="mt-1.5 w-full rounded-2xl border border-black/[0.08] bg-[#fafafa] px-4 py-3 text-sm outline-none focus:border-[#ff2f6d]/25" /></label>
          </div>

          <section className="space-y-3">
            <div className="flex items-center justify-between"><h3 className="text-sm font-semibold uppercase tracking-wide text-[#6b7280]">Required Pieces</h3><button type="button" onClick={() => update({ requiredPieces: [...consoleData.requiredPieces, { id: `piece-${Date.now()}`, label: 'Piece', moduleShapeId: 'type-ii-horizontal', moduleType: 'Type II', preferredRarity: 'S', colorKey: 's' }] })} className="rounded-full border border-black/[0.08] bg-white px-3 py-1.5 text-xs font-semibold"><Plus className="inline h-3.5 w-3.5" /> Add piece</button></div>
            {consoleData.requiredPieces.map((piece, index) => (
              <div key={piece.id} className="grid gap-2 rounded-2xl bg-[#fafafa] p-3 ring-1 ring-black/[0.04] md:grid-cols-[1fr_1fr_90px_auto]">
                <input value={piece.label} onChange={(e) => update({ requiredPieces: consoleData.requiredPieces.map((p, i) => i === index ? { ...p, label: e.target.value } : p) })} className="h-10 rounded-xl border border-black/[0.08] bg-white px-3 text-sm" />
                <select value={piece.moduleShapeId} onChange={(e) => { const shape = MODULE_SHAPES.find((item) => item.id === e.target.value); update({ requiredPieces: consoleData.requiredPieces.map((p, i) => i === index ? { ...p, moduleShapeId: e.target.value, moduleType: shape?.type || p.moduleType } : p) }) }} className="h-10 rounded-xl border border-black/[0.08] bg-white px-3 text-sm">
                  {MODULE_SHAPES.map((shape) => <option key={shape.id} value={shape.id}>{shape.name}</option>)}
                </select>
                <select value={piece.preferredRarity} onChange={(e) => update({ requiredPieces: consoleData.requiredPieces.map((p, i) => i === index ? { ...p, preferredRarity: e.target.value, colorKey: e.target.value.toLowerCase() } : p) })} className="h-10 rounded-xl border border-black/[0.08] bg-white px-3 text-sm"><option>S</option><option>A</option><option>B</option></select>
                <div className="flex items-center gap-2"><ModuleShape shapeId={piece.moduleShapeId} rarity={piece.preferredRarity} size={10} /><button type="button" onClick={() => update({ requiredPieces: consoleData.requiredPieces.filter((_, i) => i !== index) })} className="flex h-10 w-10 items-center justify-center rounded-xl border border-black/[0.06] bg-white text-[#b45309]"><Trash2 className="h-4 w-4" /></button></div>
              </div>
            ))}
          </section>

          <section className="space-y-2">
            <h3 className="text-sm font-semibold uppercase tracking-wide text-[#6b7280]">Notes</h3>
            {consoleData.notes.map((note, index) => <div key={index} className="flex gap-2"><input value={note} onChange={(e) => update({ notes: consoleData.notes.map((n, i) => i === index ? e.target.value : n) })} className="h-10 min-w-0 flex-1 rounded-xl border border-black/[0.08] bg-[#fafafa] px-3 text-sm" /><button type="button" onClick={() => update({ notes: consoleData.notes.filter((_, i) => i !== index) })} className="flex h-10 w-10 items-center justify-center rounded-xl border border-black/[0.06] bg-white"><X className="h-4 w-4" /></button></div>)}
            <button type="button" onClick={() => update({ notes: [...consoleData.notes, ''] })} className="rounded-full border border-black/[0.08] bg-white px-3 py-1.5 text-xs font-semibold"><Plus className="inline h-3.5 w-3.5" /> Add note</button>
          </section>
        </div>

        <div className="flex justify-end gap-2 border-t border-black/[0.06] px-6 py-5 sm:px-8">
          <button type="button" onClick={onClose} className="rounded-full border border-black/[0.08] bg-[#fafafa] px-5 py-2 text-sm font-semibold text-[#6b7280]">Cancel</button>
          <button type="button" onClick={save} className="rounded-full bg-[#111111] px-5 py-2 text-sm font-semibold text-white">Save</button>
        </div>
      </div>
    </div>
  )
}
