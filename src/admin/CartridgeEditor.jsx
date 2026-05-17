import { useEffect, useMemo, useState } from 'react'
import { Check, Plus, Trash2, X } from 'lucide-react'
import ModuleShape from '../components/ModuleShape.jsx'
import { MODULE_SHAPES } from '../data/moduleCatalog.js'

const rarityOptions = ['B', 'A', 'S']
const categoryOptions = ['damage', 'defense', 'healing', 'break', 'utility', 'support']
const elementOptions = ['', 'Cosmos', 'Anima', 'Incantation', 'Chaos', 'Psyche', 'Lakshana', 'Cognitive']

function FieldLabel({ children }) {
  return <p className="text-[11px] font-semibold uppercase tracking-wide text-[#6b7280]">{children}</p>
}

function cleanCartridge(data) {
  const shapeIds = (data.compatibleModuleShapeIds || []).slice(0, 4).map((id) => String(id || '').trim()).filter(Boolean)
  return {
    name: String(data.name || '').trim(),
    theme: String(data.theme || '').trim(),
    element: String(data.element || '').trim(),
    bonusCategory: String(data.bonusCategory || 'support').trim(),
    description: String(data.description || '').trim(),
    image: String(data.image || '').trim(),
    icon: String(data.icon || '').trim(),
    availableRarities: rarityOptions.filter((rarity) => data.availableRarities?.includes(rarity)),
    bonuses: [
      { pieces: 2, text: String(data.twoPiece || '').trim() },
      { pieces: 4, text: String(data.fourPiece || '').trim() },
    ],
    compatibleModuleShapeIds: shapeIds,
    compatibleModules: shapeIds.map((moduleShapeId, index) => ({ slot: index + 1, moduleShapeId })),
    requiredSetPieceShapeIds: shapeIds,
    requiredSetPieces: shapeIds.map((moduleShapeId, index) => ({ slot: index + 1, moduleShapeId })),
    compatibleModulesVerified: true,
    compatibleModulesSource: 'admin-local-override',
    dataStatus: 'admin-verified-compatible-shapes',
  }
}

export default function CartridgeEditor({ cartridge, open, onClose, onSave, onDelete }) {
  const [draft, setDraft] = useState(null)

  useEffect(() => {
    if (!open || !cartridge) return
    setDraft({
      name: cartridge.name || '',
      theme: cartridge.theme || '',
      element: cartridge.element || '',
      bonusCategory: cartridge.bonusCategory || 'support',
      description: cartridge.description || '',
      image: cartridge.image || '',
      icon: cartridge.icon || '',
      availableRarities: cartridge.availableRarities || ['B', 'A', 'S'],
      twoPiece: cartridge.bonuses?.find((bonus) => Number(bonus.pieces) === 2)?.text || '',
      fourPiece: cartridge.bonuses?.find((bonus) => Number(bonus.pieces) === 4)?.text || '',
      compatibleModuleShapeIds: cartridge.compatibleModuleShapeIds || cartridge.compatibleModules?.map((module) => module.moduleShapeId) || [],
    })
  }, [cartridge, open])

  const shapeOptions = useMemo(() => {
    const current = (draft?.compatibleModuleShapeIds || []).filter(Boolean)
    const known = MODULE_SHAPES.map((shape) => shape.id)
    return Array.from(new Set([...current, ...known]))
  }, [draft])

  if (!open || !cartridge || !draft) return null

  const update = (patch) => setDraft((current) => ({ ...current, ...patch }))
  const updateShape = (index, moduleShapeId) => {
    const next = [...(draft.compatibleModuleShapeIds || [])]
    next[index] = moduleShapeId
    update({ compatibleModuleShapeIds: next })
  }
  const clearShape = (index) => {
    const next = [...(draft.compatibleModuleShapeIds || [])]
    next[index] = ''
    update({ compatibleModuleShapeIds: next })
  }
  const toggleRarity = (rarity) => {
    const set = new Set(draft.availableRarities || [])
    if (set.has(rarity)) set.delete(rarity)
    else set.add(rarity)
    update({ availableRarities: rarityOptions.filter((item) => set.has(item)) })
  }
  const isNew = !cartridge.id
  const remove = () => {
    if (!cartridge?.id || !onDelete) return
    if (!window.confirm(`Delete ${cartridge.name || 'this cartridge'} from the local admin database?`)) return
    onDelete(cartridge.id)
    onClose?.()
  }

  return (
    <div className="fixed inset-0 z-[110] flex items-center justify-center p-4" role="dialog" aria-modal="true">
      <button type="button" className="absolute inset-0 bg-black/35 backdrop-blur-sm" aria-label="Close cartridge editor" onClick={onClose} />
      <div className="relative z-[111] flex max-h-[min(90vh,860px)] w-full max-w-4xl flex-col overflow-hidden rounded-[28px] border border-white/70 bg-white/95 shadow-[0_30px_100px_rgba(0,0,0,0.2)] backdrop-blur-xl">
        <div className="flex items-start justify-between gap-4 border-b border-black/[0.06] px-6 py-5 sm:px-8">
          <div>
            <h2 className="text-lg font-semibold tracking-tight text-[#111111]">{isNew ? 'Add Cartridge Set' : 'Edit Cartridge Set'}</h2>
            <p className="mt-1 text-sm text-[#6b7280]">{isNew ? 'Create a reusable cartridge record for the database and Build Planner.' : cartridge.name}</p>
          </div>
          <button type="button" onClick={onClose} className="flex h-10 w-10 items-center justify-center rounded-2xl border border-black/[0.06] bg-[#fafafa] text-[#6b7280]"><X className="h-4 w-4" /></button>
        </div>

        <div className="flex-1 space-y-5 overflow-y-auto px-6 py-5 sm:px-8">
          <section className="grid gap-3 sm:grid-cols-2">
            <label><FieldLabel>Name</FieldLabel><input value={draft.name} onChange={(event) => update({ name: event.target.value })} className="mt-1.5 h-11 w-full rounded-2xl border border-black/[0.08] bg-[#fafafa] px-4 text-sm" /></label>
            <label><FieldLabel>Element / Theme</FieldLabel><select value={draft.element} onChange={(event) => update({ element: event.target.value, theme: event.target.value || draft.theme })} className="mt-1.5 h-11 w-full rounded-2xl border border-black/[0.08] bg-[#fafafa] px-3 text-sm">{elementOptions.map((option) => <option key={option} value={option}>{option || 'None'}</option>)}</select></label>
            <label><FieldLabel>Bonus Type</FieldLabel><select value={draft.bonusCategory} onChange={(event) => update({ bonusCategory: event.target.value })} className="mt-1.5 h-11 w-full rounded-2xl border border-black/[0.08] bg-[#fafafa] px-3 text-sm capitalize">{categoryOptions.map((option) => <option key={option} value={option}>{option}</option>)}</select></label>
            <label><FieldLabel>Theme Label</FieldLabel><input value={draft.theme} onChange={(event) => update({ theme: event.target.value })} className="mt-1.5 h-11 w-full rounded-2xl border border-black/[0.08] bg-[#fafafa] px-4 text-sm" /></label>
          </section>

          <label className="block"><FieldLabel>Description / Tagline</FieldLabel><textarea value={draft.description} onChange={(event) => update({ description: event.target.value })} rows={2} className="mt-1.5 w-full rounded-2xl border border-black/[0.08] bg-[#fafafa] px-4 py-3 text-sm" /></label>

          <section className="grid gap-3 sm:grid-cols-2">
            <label><FieldLabel>Icon Path</FieldLabel><input value={draft.icon} onChange={(event) => update({ icon: event.target.value })} placeholder="/assets/cartridges/icon.png" className="mt-1.5 h-11 w-full rounded-2xl border border-black/[0.08] bg-[#fafafa] px-4 text-sm" /></label>
            <label><FieldLabel>Image Path</FieldLabel><input value={draft.image} onChange={(event) => update({ image: event.target.value })} placeholder="/assets/cartridges/image.png" className="mt-1.5 h-11 w-full rounded-2xl border border-black/[0.08] bg-[#fafafa] px-4 text-sm" /></label>
          </section>

          <section className="space-y-3">
            <FieldLabel>Available Rarities</FieldLabel>
            <div className="flex flex-wrap gap-2">
              {rarityOptions.map((rarity) => (
                <button key={rarity} type="button" onClick={() => toggleRarity(rarity)} className={`inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-semibold ${draft.availableRarities?.includes(rarity) ? 'border-[#ff2f6d]/25 bg-[#ff2f6d]/10 text-[#be123c]' : 'border-black/[0.06] bg-white text-[#6b7280]'}`}>
                  {draft.availableRarities?.includes(rarity) ? <Check className="h-4 w-4" /> : null}
                  {rarity}
                </button>
              ))}
            </div>
          </section>

          <section className="grid gap-3 sm:grid-cols-2">
            <label><FieldLabel>2-Piece Bonus</FieldLabel><textarea value={draft.twoPiece} onChange={(event) => update({ twoPiece: event.target.value })} rows={3} className="mt-1.5 w-full rounded-2xl border border-black/[0.08] bg-[#fafafa] px-4 py-3 text-sm" /></label>
            <label><FieldLabel>4-Piece Bonus</FieldLabel><textarea value={draft.fourPiece} onChange={(event) => update({ fourPiece: event.target.value })} rows={3} className="mt-1.5 w-full rounded-2xl border border-black/[0.08] bg-[#fafafa] px-4 py-3 text-sm" /></label>
          </section>

          <section className="space-y-3">
            <div>
              <h3 className="text-sm font-semibold uppercase tracking-wide text-[#6b7280]">Compatible Module Shapes</h3>
              <p className="mt-1 text-xs text-[#9ca3af]">These belong to the cartridge set and apply to B/A/S equally.</p>
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              {[0, 1, 2, 3].map((index) => (
                <div key={index} className="rounded-2xl border border-black/[0.06] bg-[#fafafa] p-3">
                  <div className="mb-2 flex items-center justify-between gap-2">
                    <FieldLabel>Slot {index + 1}</FieldLabel>
                    <button type="button" onClick={() => clearShape(index)} className="flex h-8 w-8 items-center justify-center rounded-xl border border-black/[0.06] bg-white text-[#b45309]"><Trash2 className="h-3.5 w-3.5" /></button>
                  </div>
                  <div className="grid gap-3 sm:grid-cols-[80px_1fr] sm:items-center">
                    <div className="flex h-16 items-center justify-center rounded-2xl bg-white ring-1 ring-black/[0.05]">
                      {draft.compatibleModuleShapeIds?.[index] ? <ModuleShape shapeId={draft.compatibleModuleShapeIds[index]} rarity="S" size={12} /> : <span className="text-xs text-[#9ca3af]">Empty</span>}
                    </div>
                    <select value={draft.compatibleModuleShapeIds?.[index] || ''} onChange={(event) => updateShape(index, event.target.value)} className="h-10 rounded-xl border border-black/[0.08] bg-white px-3 text-sm">
                      <option value="">Shape pending</option>
                      {shapeOptions.map((shapeId) => <option key={shapeId} value={shapeId}>{shapeId}</option>)}
                    </select>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>

        <div className="flex justify-end gap-2 border-t border-black/[0.06] px-6 py-5 sm:px-8">
          {!isNew && onDelete ? (
            <button type="button" onClick={remove} className="mr-auto rounded-full border border-rose-100 bg-rose-50 px-5 py-2 text-sm font-semibold text-rose-700 hover:bg-rose-100">Delete</button>
          ) : null}
          <button type="button" onClick={onClose} className="rounded-full border border-black/[0.08] bg-[#fafafa] px-5 py-2 text-sm font-semibold text-[#6b7280]">Cancel</button>
          <button type="button" onClick={() => { onSave?.(cartridge.id, cleanCartridge(draft)); onClose?.() }} disabled={!draft.name.trim()} className="rounded-full bg-[#111111] px-5 py-2 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:bg-[#d1d5db]">Save</button>
        </div>
      </div>
    </div>
  )
}
