import { useEffect, useState } from 'react'
import { ArrowDown, ArrowUp, ChevronDown, Plus, Search, Trash2, X } from 'lucide-react'
import { normalizeBuild } from '../data/buildBlocks.js'
import { getStatById, statAvailability, stats as statDatabase } from '../data/stats.js'
import { getCartridgeById } from '../data/cartridges.js'
import { badgeClass, weaponInitials } from '../components/weapons/weaponStyle.js'
import CartridgeIcon from '../components/cartridges/CartridgeIcon.jsx'
import { categoryBadgeClass, rarityBadgeClass } from '../components/cartridges/cartridgeStyle.js'
import { useAdminMode } from './AdminModeContext.jsx'
import { getWeaponAsset } from '../utils/assetHelpers.js'

function FieldLabel({ children }) {
  return <p className="text-[11px] font-semibold uppercase tracking-wide text-[#6b7280]">{children}</p>
}

function makeId(prefix) {
  return `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`
}

function makeWeaponReference(weaponId, priority) {
  return {
    id: makeId('recommended-weapon'),
    weaponId,
    label: priority === 1 ? 'Best in Slot' : 'Alternative',
    note: '',
    priority,
    enabled: true,
  }
}

function makeCartridgeReference(cartridgeId, priority) {
  return {
    id: makeId('recommended-cartridge'),
    cartridgeId,
    rarity: 'S',
    label: priority === 1 ? 'Best in Slot' : 'Alternative',
    note: '',
    priority,
    enabled: true,
  }
}

function makeEndgameStat(priority = 1) {
  return { id: makeId('endgame-stat'), statId: statAvailability.characterStats[0] || 'atk', targetValue: 'Data coming soon', note: '', priority, enabled: true }
}

function makeBuildStat(prefix, priority, statId = 'atk') {
  return { id: makeId(prefix), statId, note: '', priority, enabled: true }
}

function makeNote() {
  return { id: makeId('build-note'), title: 'Build note', content: 'Data coming soon', enabled: false }
}

function moveItem(list, index, direction) {
  const nextIndex = index + direction
  if (nextIndex < 0 || nextIndex >= list.length) return list
  const next = [...list]
  const [item] = next.splice(index, 1)
  next.splice(nextIndex, 0, item)
  return next
}

function cleanBuild(build) {
  return {
    recommendedWeapons: build.recommendedWeapons
      .filter((item) => item.weaponId)
      .map((item, index) => ({
        id: item.id,
        weaponId: item.weaponId,
        label: item.label.trim(),
        note: item.note.trim(),
        priority: Number(item.priority) || index + 1,
        enabled: item.enabled !== false,
      })),
    recommendedWeaponIds: build.recommendedWeapons
      .filter((item) => item.weaponId && item.enabled !== false)
      .map((item) => item.weaponId),
    recommendedCartridges: build.recommendedCartridges
      .filter((item) => item.cartridgeId)
      .map((item, index) => ({
        id: item.id,
        cartridgeId: item.cartridgeId,
        rarity: item.rarity || 'S',
        label: item.label.trim(),
        note: item.note.trim(),
        priority: Number(item.priority) || index + 1,
        enabled: item.enabled !== false,
      })),
    mainStats: build.mainStats
      .filter((item) => item.statId || item.label)
      .map((item, index) => ({
        id: item.id,
        statId: item.statId,
        label: item.label || '',
        note: item.note.trim(),
        priority: Number(item.priority) || index + 1,
        enabled: item.enabled !== false,
      })),
    subStats: build.subStats
      .filter((item) => item.statId || item.label)
      .map((item, index) => ({
        id: item.id,
        statId: item.statId,
        label: item.label || '',
        note: item.note.trim(),
        priority: Number(item.priority) || index + 1,
        enabled: item.enabled !== false,
      })),
    endgameStats: build.endgameStats.map((item) => ({
      id: item.id,
      statId: item.statId,
      label: item.label || '',
      targetValue: String(item.targetValue || item.value || '').trim() || 'Data coming soon',
      note: item.note.trim(),
      priority: Number(item.priority) || 1,
      enabled: item.enabled !== false,
    })),
    skillPriority: build.skillPriority.map((item) => item.trim()).filter(Boolean),
    notes: build.notes.map((note) => ({
      id: note.id,
      title: note.title.trim() || 'Build note',
      content: note.content.trim(),
      enabled: note.enabled !== false,
    })),
  }
}

const weaponTypeOptions = ['All', 'Bose', 'Gas', 'Liquid', 'Plasma', 'Solid']
const weaponRarityOptions = ['All', 'S', 'A', 'B']

function findWeaponInList(weaponOptions, id) {
  return (weaponOptions || []).find((weapon) => weapon.id === id || weapon.slug === id) || null
}

function WeaponReferenceEditor({ items, onChange, weaponOptions = [] }) {
  const [query, setQuery] = useState('')
  const [rarity, setRarity] = useState('All')
  const [type, setType] = useState('All')
  const [subStat, setSubStat] = useState('All')
  const [expanded, setExpanded] = useState(false)

  const selectedIds = new Set(items.map((item) => item.weaponId).filter(Boolean))
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
    .slice(0, 12)

  const update = (index, patch) => onChange(items.map((item, itemIndex) => (itemIndex === index ? { ...item, ...patch } : item)))
  const addWeapon = (weaponId) => {
    if (selectedIds.has(weaponId)) return
    onChange([...items, makeWeaponReference(weaponId, items.length + 1)])
  }
  const remove = (index) => onChange(items.filter((_, itemIndex) => itemIndex !== index).map((item, itemIndex) => ({ ...item, priority: itemIndex + 1 })))
  const move = (index, direction) => onChange(moveItem(items, index, direction).map((item, itemIndex) => ({ ...item, priority: itemIndex + 1 })))

  return (
    <section className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h3 className="text-sm font-semibold uppercase tracking-wide text-[#6b7280]">Weapons / Arcs</h3>
          <p className="mt-1 text-sm text-[#6b7280]">Builds store weapon ids plus character-specific labels and notes.</p>
        </div>
        <button
          type="button"
          onClick={() => setExpanded((value) => !value)}
          className="inline-flex items-center gap-2 rounded-full border border-black/[0.08] bg-white px-4 py-2 text-xs font-semibold"
        >
          {expanded ? 'Hide weapon picker' : items.length ? 'Manage weapons' : 'Choose weapons'}
        </button>
      </div>

      <div className="space-y-2">
        {items.length ? items.map((item, index) => {
          const weapon = findWeaponInList(weaponOptions, item.weaponId)
          return (
            <div key={item.id} className="grid gap-2 rounded-2xl border border-black/[0.06] bg-white p-3 shadow-sm md:grid-cols-[minmax(0,1fr)_auto] md:items-center">
              <div className="flex min-w-0 items-center gap-3">
                {weapon ? <WeaponPickerIcon weapon={weapon} /> : <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#fafafa] text-xs font-bold text-[#9ca3af] ring-1 ring-black/[0.05]">?</div>}
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <p className="font-semibold text-[#111111]">{weapon ? weapon.name : `Unknown weapon: ${item.weaponId}`}</p>
                    {weapon ? <span className={badgeClass('rarity', weapon.rarity)}>{weapon.rarity}</span> : null}
                    {weapon ? <span className={badgeClass('type', weapon.type)}>{weapon.type}</span> : null}
                    {weapon ? <span className="rounded-full bg-[#fafafa] px-2 py-0.5 text-[11px] font-semibold text-[#6b7280] ring-1 ring-black/[0.05]">{weapon.subStat.type}</span> : null}
                    {item.label ? <span className="rounded-full bg-black/[0.04] px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-[#6b7280]">{item.label}</span> : null}
                  </div>
                  {item.note ? <p className="mt-1 line-clamp-1 text-xs text-[#6b7280]">{item.note}</p> : null}
                </div>
              </div>
              <div className="flex gap-1 md:justify-end">
                <button type="button" onClick={() => move(index, -1)} disabled={index === 0} className="flex h-9 w-9 items-center justify-center rounded-xl border border-black/[0.06] bg-[#fafafa] disabled:opacity-40"><ArrowUp className="h-4 w-4" /></button>
                <button type="button" onClick={() => move(index, 1)} disabled={index === items.length - 1} className="flex h-9 w-9 items-center justify-center rounded-xl border border-black/[0.06] bg-[#fafafa] disabled:opacity-40"><ArrowDown className="h-4 w-4" /></button>
                <button type="button" onClick={() => remove(index)} className="flex h-9 w-9 items-center justify-center rounded-xl border border-black/[0.06] bg-white text-[#b45309]"><Trash2 className="h-4 w-4" /></button>
              </div>
            </div>
          )
        }) : (
          <p className="rounded-2xl border border-dashed border-black/[0.08] bg-white px-4 py-5 text-sm text-[#9ca3af]">No weapons selected yet.</p>
        )}
      </div>

      {expanded ? <div className="rounded-[22px] border border-black/[0.06] bg-white p-4 shadow-[0_14px_42px_rgba(0,0,0,0.04)]">
        <div className="grid gap-3 lg:grid-cols-[minmax(220px,1fr)_120px_150px_170px]">
          <label className="relative block">
            <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-[#9ca3af]" strokeWidth={1.8} />
            <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search weapons..." className="h-10 w-full rounded-xl border border-black/[0.08] bg-[#fafafa] pl-10 pr-3 text-sm" />
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

        <div className="mt-4 grid gap-2">
          {filteredWeapons.map((weapon) => (
            <button
              key={weapon.id}
              type="button"
              onClick={() => addWeapon(weapon.id)}
              disabled={selectedIds.has(weapon.id)}
              className="grid gap-3 rounded-2xl border border-black/[0.06] bg-[#fafafa] p-3 text-left transition hover:bg-white disabled:cursor-not-allowed disabled:opacity-50 sm:grid-cols-[48px_minmax(0,1fr)_auto] sm:items-center"
            >
              <WeaponPickerIcon weapon={weapon} />
              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  <p className="font-semibold text-[#111111]">{weapon.name}</p>
                  <span className={badgeClass('rarity', weapon.rarity)}>{weapon.rarity}</span>
                  <span className={badgeClass('type', weapon.type)}>{weapon.type}</span>
                </div>
                <p className="mt-1 text-xs font-semibold text-[#6b7280]">
                  {weapon.mainStat.type}: {weapon.mainStat.value} · {weapon.subStat.type}: {weapon.subStat.value}
                </p>
              </div>
              <span className="rounded-full bg-white px-3 py-1.5 text-xs font-semibold text-[#ff2f6d] ring-1 ring-black/[0.06]">
                {selectedIds.has(weapon.id) ? 'Selected' : 'Add'}
              </span>
            </button>
          ))}
        </div>
      </div> : null}

      {expanded ? <div className="space-y-3">
        {items.length ? items.map((item, index) => {
          const weapon = findWeaponInList(weaponOptions, item.weaponId)
          return (
            <article key={item.id} className="rounded-[22px] border border-black/[0.06] bg-white p-4 shadow-[0_14px_42px_rgba(0,0,0,0.045)]">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <label className="inline-flex h-10 items-center gap-2 rounded-full border border-black/[0.06] bg-[#fafafa] px-3 text-xs font-semibold text-[#6b7280]">
                  <input type="checkbox" checked={item.enabled !== false} onChange={(event) => update(index, { enabled: event.target.checked })} />
                  Enabled
                </label>
                <div className="flex gap-2">
                  <button type="button" onClick={() => move(index, -1)} disabled={index === 0} className="flex h-10 w-10 items-center justify-center rounded-xl border border-black/[0.06] bg-[#fafafa] text-[#6b7280] disabled:opacity-40"><ArrowUp className="h-4 w-4" /></button>
                  <button type="button" onClick={() => move(index, 1)} disabled={index === items.length - 1} className="flex h-10 w-10 items-center justify-center rounded-xl border border-black/[0.06] bg-[#fafafa] text-[#6b7280] disabled:opacity-40"><ArrowDown className="h-4 w-4" /></button>
                  <button type="button" onClick={() => remove(index)} className="flex h-10 w-10 items-center justify-center rounded-xl border border-black/[0.06] bg-white text-[#b45309]"><Trash2 className="h-4 w-4" /></button>
                </div>
              </div>
              <div className="mt-3 grid gap-3 md:grid-cols-[48px_minmax(0,1fr)]">
                {weapon ? <WeaponPickerIcon weapon={weapon} /> : <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#fafafa] text-xs font-bold text-[#9ca3af] ring-1 ring-black/[0.05]">?</div>}
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <p className="font-semibold text-[#111111]">{weapon ? weapon.name : `Unknown weapon: ${item.weaponId}`}</p>
                    {weapon ? <span className={badgeClass('rarity', weapon.rarity)}>{weapon.rarity}</span> : null}
                    {weapon ? <span className={badgeClass('type', weapon.type)}>{weapon.type}</span> : null}
                  </div>
                  {weapon ? <p className="mt-1 text-xs font-semibold text-[#6b7280]">{weapon.mainStat.type}: {weapon.mainStat.value} · {weapon.subStat.type}: {weapon.subStat.value}</p> : null}
                </div>
              </div>
              <div className="mt-3 grid gap-3 sm:grid-cols-[100px_1fr]">
                <label><FieldLabel>Priority</FieldLabel><input type="number" value={item.priority} onChange={(event) => update(index, { priority: event.target.value })} className="mt-1.5 h-10 w-full rounded-xl border border-black/[0.08] bg-[#fafafa] px-3 text-sm" /></label>
                <label><FieldLabel>Label</FieldLabel><input value={item.label} onChange={(event) => update(index, { label: event.target.value })} placeholder="Best in Slot" className="mt-1.5 h-10 w-full rounded-xl border border-black/[0.08] bg-[#fafafa] px-3 text-sm" /></label>
              </div>
              <label className="mt-3 block"><FieldLabel>Build-specific note</FieldLabel><textarea value={item.note} onChange={(event) => update(index, { note: event.target.value })} rows={2} className="mt-1.5 w-full rounded-xl border border-black/[0.08] bg-[#fafafa] px-3 py-2 text-sm" /></label>
            </article>
          )
        }) : (
          <p className="rounded-2xl border border-dashed border-black/[0.08] bg-white px-4 py-5 text-sm text-[#9ca3af]">No weapons selected yet.</p>
        )}
      </div> : null}
    </section>
  )
}

const cartridgeRarityOptions = ['All', 'S', 'A', 'B']
const cartridgeCategoryOptions = ['All', 'damage', 'defense', 'healing', 'break', 'utility', 'support']

function CartridgeReferenceEditor({ items, onChange, cartridgeOptions = [] }) {
  const [query, setQuery] = useState('')
  const [rarity, setRarity] = useState('All')
  const [category, setCategory] = useState('All')
  const [expanded, setExpanded] = useState(false)
  const selectedIds = new Set(items.map((item) => item.cartridgeId).filter(Boolean))

  const filteredCartridges = cartridgeOptions
    .filter((cartridge) => {
      const text = query.trim().toLowerCase()
      if (text && !`${cartridge.name} ${cartridge.theme} ${cartridge.bonusCategory} ${cartridge.bonuses?.map((bonus) => bonus.text).join(' ')}`.toLowerCase().includes(text)) return false
      if (rarity !== 'All' && !cartridge.availableRarities?.includes(rarity)) return false
      if (category !== 'All' && cartridge.bonusCategory !== category) return false
      return true
    })
    .slice(0, 12)

  const update = (index, patch) => onChange(items.map((item, itemIndex) => (itemIndex === index ? { ...item, ...patch } : item)))
  const addCartridge = (cartridgeId) => {
    if (selectedIds.has(cartridgeId)) return
    onChange([...items, makeCartridgeReference(cartridgeId, items.length + 1)])
  }
  const remove = (index) => onChange(items.filter((_, itemIndex) => itemIndex !== index).map((item, itemIndex) => ({ ...item, priority: itemIndex + 1 })))
  const move = (index, direction) => onChange(moveItem(items, index, direction).map((item, itemIndex) => ({ ...item, priority: itemIndex + 1 })))

  return (
    <section className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h3 className="text-sm font-semibold uppercase tracking-wide text-[#6b7280]">Cartridges / Module Sets</h3>
          <p className="mt-1 text-sm text-[#6b7280]">Builds store cartridge ids, rarity, and build-specific notes.</p>
        </div>
        <button type="button" onClick={() => setExpanded((value) => !value)} className="inline-flex items-center gap-2 rounded-full border border-black/[0.08] bg-white px-4 py-2 text-xs font-semibold">
          {expanded ? 'Hide cartridge picker' : items.length ? 'Manage cartridges' : 'Choose Cartridge Set'}
        </button>
      </div>

      <div className="space-y-2">
        {items.length ? items.map((item, index) => {
          const cartridge = cartridgeOptions.find((entry) => entry.id === item.cartridgeId || entry.slug === item.cartridgeId) || getCartridgeById(item.cartridgeId)
          return (
            <div key={item.id} className="grid gap-2 rounded-2xl border border-black/[0.06] bg-white p-3 shadow-sm md:grid-cols-[minmax(0,1fr)_auto] md:items-center">
              <div className="flex min-w-0 items-center gap-3">
                {cartridge ? <CartridgeIcon cartridge={cartridge} rarity={item.rarity || 'S'} className="h-12 w-12" /> : <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#fafafa] text-xs font-bold text-[#9ca3af] ring-1 ring-black/[0.05]">?</div>}
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <p className="font-semibold text-[#111111]">{cartridge ? cartridge.name : `Missing cartridge data: ${item.cartridgeId}`}</p>
                    <span className={`rounded-full border px-2 py-0.5 text-[10px] font-bold ${rarityBadgeClass(item.rarity || 'S')}`}>{item.rarity || 'S'}</span>
                    {cartridge ? <span className={`rounded-full border px-2 py-0.5 text-[10px] font-bold capitalize ${categoryBadgeClass(cartridge.bonusCategory)}`}>{cartridge.bonusCategory}</span> : null}
                    {item.label ? <span className="rounded-full bg-black/[0.04] px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-[#6b7280]">{item.label}</span> : null}
                  </div>
                  {item.note ? <p className="mt-1 line-clamp-1 text-xs text-[#6b7280]">{item.note}</p> : null}
                </div>
              </div>
              <div className="flex gap-1 md:justify-end">
                <button type="button" onClick={() => move(index, -1)} disabled={index === 0} className="flex h-9 w-9 items-center justify-center rounded-xl border border-black/[0.06] bg-[#fafafa] disabled:opacity-40"><ArrowUp className="h-4 w-4" /></button>
                <button type="button" onClick={() => move(index, 1)} disabled={index === items.length - 1} className="flex h-9 w-9 items-center justify-center rounded-xl border border-black/[0.06] bg-[#fafafa] disabled:opacity-40"><ArrowDown className="h-4 w-4" /></button>
                <button type="button" onClick={() => remove(index)} className="flex h-9 w-9 items-center justify-center rounded-xl border border-black/[0.06] bg-white text-[#b45309]"><Trash2 className="h-4 w-4" /></button>
              </div>
            </div>
          )
        }) : <p className="rounded-2xl border border-dashed border-black/[0.08] bg-white px-4 py-5 text-sm text-[#9ca3af]">No cartridges selected yet.</p>}
      </div>

      {expanded ? (
        <div className="space-y-4">
          <div className="rounded-[22px] border border-black/[0.06] bg-white p-4 shadow-[0_14px_42px_rgba(0,0,0,0.04)]">
            <div className="grid gap-3 lg:grid-cols-[minmax(220px,1fr)_120px_170px]">
              <label className="relative block">
                <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-[#9ca3af]" strokeWidth={1.8} />
                <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search cartridges..." className="h-10 w-full rounded-xl border border-black/[0.08] bg-[#fafafa] pl-10 pr-3 text-sm" />
              </label>
              <select value={rarity} onChange={(event) => setRarity(event.target.value)} className="h-10 rounded-xl border border-black/[0.08] bg-[#fafafa] px-3 text-sm font-semibold">
                {cartridgeRarityOptions.map((option) => <option key={option} value={option}>{option === 'All' ? 'All rarity' : option}</option>)}
              </select>
              <select value={category} onChange={(event) => setCategory(event.target.value)} className="h-10 rounded-xl border border-black/[0.08] bg-[#fafafa] px-3 text-sm font-semibold">
                {cartridgeCategoryOptions.map((option) => <option key={option} value={option}>{option === 'All' ? 'All bonus types' : option}</option>)}
              </select>
            </div>
            <div className="mt-4 grid gap-2">
              {filteredCartridges.map((cartridge) => (
                <button key={cartridge.id} type="button" onClick={() => addCartridge(cartridge.id)} disabled={selectedIds.has(cartridge.id)} className="grid gap-3 rounded-2xl border border-black/[0.06] bg-[#fafafa] p-3 text-left transition hover:bg-white disabled:cursor-not-allowed disabled:opacity-50 sm:grid-cols-[48px_minmax(0,1fr)_auto] sm:items-center">
                  <CartridgeIcon cartridge={cartridge} rarity={rarity === 'All' ? 'S' : rarity} className="h-12 w-12" />
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <p className="font-semibold text-[#111111]">{cartridge.name}</p>
                      <span className={`rounded-full border px-2 py-0.5 text-[10px] font-bold capitalize ${categoryBadgeClass(cartridge.bonusCategory)}`}>{cartridge.bonusCategory}</span>
                    </div>
                    <p className="mt-1 line-clamp-1 text-xs font-semibold text-[#6b7280]">{cartridge.bonuses?.[0]?.text}</p>
                  </div>
                  <span className="rounded-full bg-white px-3 py-1.5 text-xs font-semibold text-[#ff2f6d] ring-1 ring-black/[0.06]">{selectedIds.has(cartridge.id) ? 'Selected' : 'Add'}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-3">
            {items.map((item, index) => (
              <article key={item.id} className="rounded-[22px] border border-black/[0.06] bg-white p-4 shadow-[0_14px_42px_rgba(0,0,0,0.045)]">
                <div className="grid gap-3 sm:grid-cols-[auto_90px_1fr]">
                  <label className="inline-flex h-10 items-center gap-2 rounded-full border border-black/[0.06] bg-[#fafafa] px-3 text-xs font-semibold text-[#6b7280]"><input type="checkbox" checked={item.enabled !== false} onChange={(event) => update(index, { enabled: event.target.checked })} />Enabled</label>
                  <label><FieldLabel>Priority</FieldLabel><input type="number" value={item.priority} onChange={(event) => update(index, { priority: event.target.value })} className="mt-1.5 h-10 w-full rounded-xl border border-black/[0.08] bg-[#fafafa] px-3 text-sm" /></label>
                  <label><FieldLabel>Label</FieldLabel><input value={item.label} onChange={(event) => update(index, { label: event.target.value })} placeholder="Best in Slot" className="mt-1.5 h-10 w-full rounded-xl border border-black/[0.08] bg-[#fafafa] px-3 text-sm" /></label>
                </div>
                <div className="mt-3 grid gap-3 sm:grid-cols-[120px_1fr]">
                  <label><FieldLabel>Rarity</FieldLabel><select value={item.rarity || 'S'} onChange={(event) => update(index, { rarity: event.target.value })} className="mt-1.5 h-10 w-full rounded-xl border border-black/[0.08] bg-[#fafafa] px-3 text-sm font-semibold"><option>S</option><option>A</option><option>B</option></select></label>
                  <label><FieldLabel>Build-specific note</FieldLabel><textarea value={item.note} onChange={(event) => update(index, { note: event.target.value })} rows={2} className="mt-1.5 w-full rounded-xl border border-black/[0.08] bg-[#fafafa] px-3 py-2 text-sm" /></label>
                </div>
              </article>
            ))}
          </div>
        </div>
      ) : null}
    </section>
  )
}

function StatPickerSelect({ value, onChange, availability = statAvailability.characterStats }) {
  const allowed = new Set(availability)
  const options = statDatabase.filter((stat) => allowed.has(stat.id))
  return (
    <select value={value} onChange={(event) => onChange(event.target.value)} className="h-10 w-full rounded-xl border border-black/[0.08] bg-[#fafafa] px-3 text-sm font-semibold">
      <option value="">Select stat</option>
      {options.map((stat) => (
        <option key={stat.id} value={stat.id}>{stat.name} - {stat.displayName}</option>
      ))}
    </select>
  )
}

function StatChip({ statId, fallback }) {
  const stat = getStatById(statId)
  return (
    <div className="min-w-0">
      <p className="font-semibold text-[#111111]">{stat?.name || fallback || 'Unknown stat'}</p>
      {stat ? <p className="mt-0.5 text-xs text-[#6b7280]">{stat.displayName} · {stat.ruName}</p> : null}
    </div>
  )
}

function StatPriorityEditor({ title, items, onChange, addLabel, availability }) {
  const update = (index, patch) => onChange(items.map((item, itemIndex) => (itemIndex === index ? { ...item, ...patch } : item)))
  const move = (index, direction) => onChange(moveItem(items, index, direction).map((item, itemIndex) => ({ ...item, priority: itemIndex + 1 })))
  return (
    <section className="space-y-3">
      <div className="flex items-center justify-between gap-3">
        <h3 className="text-sm font-semibold uppercase tracking-wide text-[#6b7280]">{title}</h3>
        <button type="button" onClick={() => onChange([...items, makeBuildStat('build-stat', items.length + 1, availability?.[0] || 'atk')])} className="inline-flex items-center gap-2 rounded-full border border-black/[0.08] bg-white px-3 py-1.5 text-xs font-semibold"><Plus className="h-3.5 w-3.5" /> {addLabel}</button>
      </div>
      <div className="space-y-2">
        {items.map((item, index) => (
          <div key={item.id} className="grid gap-2 rounded-2xl bg-white p-3 ring-1 ring-black/[0.06] lg:grid-cols-[minmax(190px,1fr)_minmax(180px,1fr)_auto]">
            <div className="grid gap-2 sm:grid-cols-[minmax(0,1fr)_minmax(160px,1fr)]">
              <StatPickerSelect value={item.statId} onChange={(statId) => update(index, { statId, label: '' })} availability={availability} />
              <input value={item.note} onChange={(event) => update(index, { note: event.target.value })} placeholder="Optional note" className="h-10 rounded-xl border border-black/[0.08] bg-[#fafafa] px-3 text-sm" />
            </div>
            <StatChip statId={item.statId} fallback={item.label} />
            <div className="flex gap-1">
              <button type="button" onClick={() => move(index, -1)} disabled={index === 0} className="flex h-10 w-10 items-center justify-center rounded-xl border border-black/[0.06] bg-white disabled:opacity-40"><ArrowUp className="h-4 w-4" /></button>
              <button type="button" onClick={() => move(index, 1)} disabled={index === items.length - 1} className="flex h-10 w-10 items-center justify-center rounded-xl border border-black/[0.06] bg-white disabled:opacity-40"><ArrowDown className="h-4 w-4" /></button>
              <button type="button" onClick={() => onChange(items.filter((_, itemIndex) => itemIndex !== index))} className="flex h-10 w-10 items-center justify-center rounded-xl border border-black/[0.06] bg-white"><X className="h-4 w-4" /></button>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}

function WeaponPickerIcon({ weapon }) {
  const image = getWeaponAsset(weapon.name) || weapon.icon || weapon.image || ''
  if (image) {
    return <img src={image} alt={weapon.name} className="h-12 w-12 rounded-2xl bg-[#fafafa] object-contain p-1.5 ring-1 ring-black/[0.05]" loading="lazy" />
  }
  return (
    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[radial-gradient(circle_at_20%_20%,rgba(255,47,109,0.15),transparent_38%),radial-gradient(circle_at_80%_25%,rgba(6,182,212,0.14),transparent_34%),linear-gradient(135deg,#ffffff,#f5f5f4)] text-sm font-bold text-[#111111] ring-1 ring-black/[0.05]">
      {weaponInitials(weapon.name)}
    </div>
  )
}

function StringListEditor({ title, items, onChange, addLabel }) {
  return (
    <section className="space-y-3">
      <div className="flex items-center justify-between gap-3">
        <h3 className="text-sm font-semibold uppercase tracking-wide text-[#6b7280]">{title}</h3>
        <button type="button" onClick={() => onChange([...items, ''])} className="inline-flex items-center gap-2 rounded-full border border-black/[0.08] bg-white px-3 py-1.5 text-xs font-semibold"><Plus className="h-3.5 w-3.5" /> {addLabel}</button>
      </div>
      <div className="space-y-2">
        {items.map((item, index) => (
          <div key={index} className="flex gap-2">
            <input value={item} onChange={(event) => onChange(items.map((value, itemIndex) => (itemIndex === index ? event.target.value : value)))} className="h-10 min-w-0 flex-1 rounded-xl border border-black/[0.08] bg-[#fafafa] px-3 text-sm" />
            <button type="button" onClick={() => onChange(moveItem(items, index, -1))} disabled={index === 0} className="flex h-10 w-10 items-center justify-center rounded-xl border border-black/[0.06] bg-white disabled:opacity-40"><ArrowUp className="h-4 w-4" /></button>
            <button type="button" onClick={() => onChange(moveItem(items, index, 1))} disabled={index === items.length - 1} className="flex h-10 w-10 items-center justify-center rounded-xl border border-black/[0.06] bg-white disabled:opacity-40"><ArrowDown className="h-4 w-4" /></button>
            <button type="button" onClick={() => onChange(items.filter((_, itemIndex) => itemIndex !== index))} className="flex h-10 w-10 items-center justify-center rounded-xl border border-black/[0.06] bg-white"><X className="h-4 w-4" /></button>
          </div>
        ))}
      </div>
    </section>
  )
}

function CollapsibleEditorSection({ title, summary, defaultOpen = false, children }) {
  const [open, setOpen] = useState(defaultOpen)
  return (
    <section className="rounded-[24px] border border-black/[0.06] bg-white/80 shadow-[0_14px_42px_rgba(0,0,0,0.035)]">
      <button type="button" onClick={() => setOpen((value) => !value)} className="flex w-full items-center justify-between gap-3 px-4 py-3 text-left">
        <div>
          <h3 className="text-sm font-semibold uppercase tracking-wide text-[#6b7280]">{title}</h3>
          {summary ? <p className="mt-1 text-xs text-[#9ca3af]">{summary}</p> : null}
        </div>
        <ChevronDown className={['h-4 w-4 text-[#6b7280] transition', open ? 'rotate-180' : ''].join(' ')} strokeWidth={2} />
      </button>
      {open ? <div className="border-t border-black/[0.05] p-4">{children}</div> : null}
    </section>
  )
}

export default function BuildEditor({ character, open, onClose, onSave }) {
  const { mergedCartridges, mergedWeapons } = useAdminMode()
  const [build, setBuild] = useState(() => normalizeBuild(null))

  useEffect(() => {
    if (!open || !character) return
    setBuild(normalizeBuild(character.build))
  }, [character, open])

  if (!open || !character) return null

  const update = (patch) => setBuild((current) => ({ ...current, ...patch }))
  const save = () => {
    onSave?.(character.id, { build: cleanBuild(build) })
    onClose?.()
  }

  return (
    <div className="fixed inset-0 z-[110] flex items-center justify-center p-4" role="dialog" aria-modal="true">
      <button type="button" className="absolute inset-0 bg-black/35 backdrop-blur-sm" aria-label="Close build editor" onClick={onClose} />
      <div className="relative z-[111] flex max-h-[min(90vh,860px)] w-full max-w-5xl flex-col overflow-hidden rounded-[28px] border border-white/70 bg-white/95 shadow-[0_30px_100px_rgba(0,0,0,0.2)] backdrop-blur-xl">
        <div className="flex items-start justify-between gap-4 border-b border-black/[0.06] px-6 py-5 sm:px-8">
          <div><h2 className="text-lg font-semibold tracking-tight text-[#111111]">Edit Build</h2><p className="mt-1 text-sm text-[#6b7280]">{character.name} build data</p></div>
          <button type="button" onClick={onClose} className="flex h-10 w-10 items-center justify-center rounded-2xl border border-black/[0.06] bg-[#fafafa] text-[#6b7280]"><X className="h-4 w-4" /></button>
        </div>
        <div className="flex-1 space-y-4 overflow-y-auto px-6 py-5 sm:px-8">
          <CollapsibleEditorSection title="Weapons / Arcs" summary={`${build.recommendedWeapons.length} selected`} defaultOpen>
            <WeaponReferenceEditor items={build.recommendedWeapons} weaponOptions={mergedWeapons} onChange={(recommendedWeapons) => update({ recommendedWeapons })} />
          </CollapsibleEditorSection>
          <CollapsibleEditorSection title="Cartridges / Module Sets" summary={`${build.recommendedCartridges.length} selected`}>
            <CartridgeReferenceEditor items={build.recommendedCartridges} cartridgeOptions={mergedCartridges} onChange={(recommendedCartridges) => update({ recommendedCartridges })} />
          </CollapsibleEditorSection>
          <CollapsibleEditorSection title="Main Stats Priority" summary={`${build.mainStats.length} stats`}>
            <StatPriorityEditor title="Main Stats Priority" items={build.mainStats} onChange={(mainStats) => update({ mainStats })} addLabel="Add stat" availability={statAvailability.mainStats} />
          </CollapsibleEditorSection>
          <CollapsibleEditorSection title="Sub Stats Priority" summary={`${build.subStats.length} stats`}>
            <StatPriorityEditor title="Sub Stats Priority" items={build.subStats} onChange={(subStats) => update({ subStats })} addLabel="Add stat" availability={statAvailability.subStats} />
          </CollapsibleEditorSection>
          <CollapsibleEditorSection title="Recommended Endgame Stats" summary={`${build.endgameStats.length} targets`}>
          <section className="space-y-3">
            <div className="flex items-center justify-between gap-3"><h3 className="text-sm font-semibold uppercase tracking-wide text-[#6b7280]">Recommended Endgame Stats</h3><button type="button" onClick={() => update({ endgameStats: [...build.endgameStats, makeEndgameStat()] })} className="inline-flex items-center gap-2 rounded-full border border-black/[0.08] bg-white px-3 py-1.5 text-xs font-semibold"><Plus className="h-3.5 w-3.5" /> Add Endgame Stat</button></div>
            {build.endgameStats.map((stat, index) => (
              <div key={stat.id} className="grid gap-2 rounded-2xl bg-white p-3 ring-1 ring-black/[0.06] lg:grid-cols-[auto_minmax(180px,1fr)_minmax(150px,0.7fr)_minmax(180px,1fr)_auto]">
                <label className="inline-flex h-10 items-center gap-2 rounded-full border border-black/[0.06] bg-[#fafafa] px-3 text-xs font-semibold text-[#6b7280]"><input type="checkbox" checked={stat.enabled !== false} onChange={(event) => update({ endgameStats: build.endgameStats.map((item, itemIndex) => itemIndex === index ? { ...item, enabled: event.target.checked } : item) })} />Enabled</label>
                <StatPickerSelect value={stat.statId} onChange={(statId) => update({ endgameStats: build.endgameStats.map((item, itemIndex) => itemIndex === index ? { ...item, statId, label: '' } : item) })} availability={statAvailability.characterStats} />
                <input value={stat.targetValue || stat.value || ''} onChange={(event) => update({ endgameStats: build.endgameStats.map((item, itemIndex) => itemIndex === index ? { ...item, targetValue: event.target.value, value: event.target.value } : item) })} placeholder="Target value" className="h-10 rounded-xl border border-black/[0.08] bg-[#fafafa] px-3 text-sm" />
                <input value={stat.note || ''} onChange={(event) => update({ endgameStats: build.endgameStats.map((item, itemIndex) => itemIndex === index ? { ...item, note: event.target.value } : item) })} placeholder="Optional note" className="h-10 rounded-xl border border-black/[0.08] bg-[#fafafa] px-3 text-sm" />
                <div className="flex gap-1"><button type="button" onClick={() => update({ endgameStats: moveItem(build.endgameStats, index, -1) })} disabled={index === 0} className="flex h-10 w-10 items-center justify-center rounded-xl border border-black/[0.06] bg-white disabled:opacity-40"><ArrowUp className="h-4 w-4" /></button><button type="button" onClick={() => update({ endgameStats: moveItem(build.endgameStats, index, 1) })} disabled={index === build.endgameStats.length - 1} className="flex h-10 w-10 items-center justify-center rounded-xl border border-black/[0.06] bg-white disabled:opacity-40"><ArrowDown className="h-4 w-4" /></button><button type="button" onClick={() => update({ endgameStats: build.endgameStats.filter((_, itemIndex) => itemIndex !== index) })} className="flex h-10 w-10 items-center justify-center rounded-xl border border-black/[0.06] bg-white"><Trash2 className="h-4 w-4" /></button></div>
              </div>
            ))}
          </section>
          </CollapsibleEditorSection>
          <CollapsibleEditorSection title="Skill Priority" summary={`${build.skillPriority.length} items`}>
            <StringListEditor title="Skill Priority" items={build.skillPriority} onChange={(skillPriority) => update({ skillPriority })} addLabel="Add priority item" />
          </CollapsibleEditorSection>
          <CollapsibleEditorSection title="Build Notes" summary={`${build.notes.length} notes`}>
          <section className="space-y-3">
            <div className="flex items-center justify-between gap-3"><h3 className="text-sm font-semibold uppercase tracking-wide text-[#6b7280]">Build Notes</h3><button type="button" onClick={() => update({ notes: [...build.notes, makeNote()] })} className="inline-flex items-center gap-2 rounded-full border border-black/[0.08] bg-white px-3 py-1.5 text-xs font-semibold"><Plus className="h-3.5 w-3.5" /> Add note</button></div>
            {build.notes.map((note, index) => (
              <article key={note.id} className="rounded-[22px] border border-black/[0.06] bg-white p-4 shadow-[0_14px_42px_rgba(0,0,0,0.045)]">
                <div className="flex items-center justify-between gap-3"><label className="inline-flex h-10 items-center gap-2 rounded-full border border-black/[0.06] bg-[#fafafa] px-3 text-xs font-semibold text-[#6b7280]"><input type="checkbox" checked={note.enabled !== false} onChange={(event) => update({ notes: build.notes.map((item, itemIndex) => itemIndex === index ? { ...item, enabled: event.target.checked } : item) })} />Enabled</label><div className="flex gap-1"><button type="button" onClick={() => update({ notes: moveItem(build.notes, index, -1) })} disabled={index === 0} className="flex h-10 w-10 items-center justify-center rounded-xl border border-black/[0.06] bg-white disabled:opacity-40"><ArrowUp className="h-4 w-4" /></button><button type="button" onClick={() => update({ notes: moveItem(build.notes, index, 1) })} disabled={index === build.notes.length - 1} className="flex h-10 w-10 items-center justify-center rounded-xl border border-black/[0.06] bg-white disabled:opacity-40"><ArrowDown className="h-4 w-4" /></button><button type="button" onClick={() => update({ notes: build.notes.filter((_, itemIndex) => itemIndex !== index) })} className="flex h-10 w-10 items-center justify-center rounded-xl border border-black/[0.06] bg-white"><Trash2 className="h-4 w-4" /></button></div></div>
                <label className="mt-3 block"><FieldLabel>Title</FieldLabel><input value={note.title} onChange={(event) => update({ notes: build.notes.map((item, itemIndex) => itemIndex === index ? { ...item, title: event.target.value } : item) })} className="mt-1.5 h-10 w-full rounded-xl border border-black/[0.08] bg-[#fafafa] px-3 text-sm" /></label>
                <label className="mt-3 block"><FieldLabel>Content</FieldLabel><textarea value={note.content} onChange={(event) => update({ notes: build.notes.map((item, itemIndex) => itemIndex === index ? { ...item, content: event.target.value } : item) })} rows={3} className="mt-1.5 w-full rounded-xl border border-black/[0.08] bg-[#fafafa] px-3 py-2 text-sm" /></label>
              </article>
            ))}
          </section>
          </CollapsibleEditorSection>
        </div>
        <div className="flex justify-end gap-2 border-t border-black/[0.06] px-6 py-5 sm:px-8"><button type="button" onClick={onClose} className="rounded-full border border-black/[0.08] bg-[#fafafa] px-5 py-2 text-sm font-semibold text-[#6b7280]">Cancel</button><button type="button" onClick={save} className="rounded-full bg-[#111111] px-5 py-2 text-sm font-semibold text-white">Save</button></div>
      </div>
    </div>
  )
}
