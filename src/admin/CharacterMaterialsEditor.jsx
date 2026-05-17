import { useEffect, useState } from 'react'
import { Plus, Trash2, X } from 'lucide-react'
import { normalizeCharacterMaterials } from '../data/materialBlocks.js'

function FieldLabel({ children }) {
  return <p className="text-[11px] font-semibold uppercase tracking-wide text-[#6b7280]">{children}</p>
}

function makeId(prefix) {
  return `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`
}

function makeMaterial() {
  return { id: makeId('character-material'), name: 'New material', amount: 0, image: '', sources: ['Data coming soon'] }
}

function cleanMaterials(materials) {
  return {
    title: materials.title.trim() || 'Character Ascension Materials',
    notes: materials.notes.trim(),
    items: (materials.items || [])
      .map((item) => ({
        id: item.id,
        name: item.name.trim() || 'Untitled material',
        amount: Number(item.amount) || 0,
        image: item.image.trim(),
        sources: (item.sources || []).map((source) => source.trim()).filter(Boolean),
      }))
      .filter((item) => item.name || item.amount || item.image || item.sources.length),
    currencyCost: Number(materials.currencyCost) || 0,
  }
}

export default function CharacterMaterialsEditor({ character, open, onClose, onSave }) {
  const [materials, setMaterials] = useState(() => normalizeCharacterMaterials(null))

  useEffect(() => {
    if (!open || !character) return
    setMaterials(normalizeCharacterMaterials(character.materials))
  }, [character, open])

  if (!open || !character) return null

  const updateItem = (index, patch) => {
    setMaterials((current) => ({
      ...current,
      items: current.items.map((item, itemIndex) => (itemIndex === index ? { ...item, ...patch } : item)),
    }))
  }

  const updateSource = (itemIndex, sourceIndex, value) => {
    setMaterials((current) => ({
      ...current,
      items: current.items.map((item, currentItemIndex) => {
        if (currentItemIndex !== itemIndex) return item
        const sources = [...(item.sources || [])]
        sources[sourceIndex] = value
        return { ...item, sources }
      }),
    }))
  }

  const save = () => {
    onSave?.(character.id, { materials: cleanMaterials(materials) })
    onClose?.()
  }

  return (
    <div className="fixed inset-0 z-[110] flex items-center justify-center p-4" role="dialog" aria-modal="true" aria-labelledby="materials-editor-title">
      <button type="button" className="absolute inset-0 bg-black/35 backdrop-blur-sm" aria-label="Close materials editor" onClick={onClose} />

      <div className="relative z-[111] flex max-h-[min(88vh,820px)] w-full max-w-3xl flex-col overflow-hidden rounded-[28px] border border-white/70 bg-white/95 shadow-[0_30px_100px_rgba(0,0,0,0.2)] backdrop-blur-xl">
        <div className="flex items-start justify-between gap-4 border-b border-black/[0.06] px-6 py-5 sm:px-8">
          <div>
            <h2 id="materials-editor-title" className="text-lg font-semibold tracking-tight text-[#111111]">
              Edit Materials
            </h2>
            <p className="mt-1 text-sm text-[#6b7280]">{character.name} character materials</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl border border-black/[0.06] bg-[#fafafa] text-[#6b7280] transition hover:text-[#111111]"
            aria-label="Close"
          >
            <X className="h-4 w-4" strokeWidth={2} />
          </button>
        </div>

        <div className="flex-1 space-y-4 overflow-y-auto px-6 py-5 sm:px-8">
          <label className="block">
            <FieldLabel>Title</FieldLabel>
            <input
              type="text"
              value={materials.title}
              onChange={(event) => setMaterials((current) => ({ ...current, title: event.target.value }))}
              className="mt-1.5 h-11 w-full rounded-2xl border border-black/[0.08] bg-[#fafafa] px-4 text-sm text-[#111111] outline-none transition focus:border-[#ff2f6d]/25 focus:bg-white"
            />
          </label>

          <label className="block">
            <FieldLabel>Notes</FieldLabel>
            <textarea
              value={materials.notes}
              onChange={(event) => setMaterials((current) => ({ ...current, notes: event.target.value }))}
              rows={3}
              className="mt-1.5 w-full resize-y rounded-2xl border border-black/[0.08] bg-[#fafafa] px-4 py-3 text-sm leading-relaxed text-[#111111] outline-none transition focus:border-[#ff2f6d]/25 focus:bg-white"
            />
          </label>

          <label className="block max-w-48">
            <FieldLabel>Currency Cost</FieldLabel>
            <input
              type="number"
              min="0"
              value={materials.currencyCost}
              onChange={(event) => setMaterials((current) => ({ ...current, currencyCost: event.target.value }))}
              className="mt-1.5 h-11 w-full rounded-2xl border border-black/[0.08] bg-[#fafafa] px-4 text-sm text-[#111111] outline-none focus:border-[#ff2f6d]/25 focus:bg-white"
            />
          </label>

          <div className="space-y-3">
            {(materials.items || []).map((item, itemIndex) => (
              <article key={item.id} className="rounded-[22px] border border-black/[0.06] bg-white p-4 shadow-[0_14px_42px_rgba(0,0,0,0.045)]">
                <div className="grid gap-2 sm:grid-cols-[1fr_110px_1fr_auto]">
                  <input
                    type="text"
                    value={item.name}
                    onChange={(event) => updateItem(itemIndex, { name: event.target.value })}
                    placeholder="Material name"
                    className="h-10 min-w-0 rounded-xl border border-black/[0.08] bg-[#fafafa] px-3 text-sm text-[#111111] outline-none focus:border-[#ff2f6d]/25"
                  />
                  <input
                    type="number"
                    min="0"
                    value={item.amount}
                    onChange={(event) => updateItem(itemIndex, { amount: event.target.value })}
                    placeholder="Amount"
                    className="h-10 min-w-0 rounded-xl border border-black/[0.08] bg-[#fafafa] px-3 text-sm text-[#111111] outline-none focus:border-[#ff2f6d]/25"
                  />
                  <input
                    type="text"
                    value={item.image}
                    onChange={(event) => updateItem(itemIndex, { image: event.target.value })}
                    placeholder="Image path or URL"
                    className="h-10 min-w-0 rounded-xl border border-black/[0.08] bg-[#fafafa] px-3 text-sm text-[#111111] outline-none focus:border-[#ff2f6d]/25"
                  />
                  <button
                    type="button"
                    onClick={() => setMaterials((current) => ({ ...current, items: current.items.filter((_, currentIndex) => currentIndex !== itemIndex) }))}
                    className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-black/[0.06] bg-white text-[#b45309] transition hover:bg-amber-50"
                    aria-label="Delete material"
                  >
                    <Trash2 className="h-4 w-4" strokeWidth={2} />
                  </button>
                </div>

                <div className="mt-3 space-y-2">
                  {(item.sources || []).map((source, sourceIndex) => (
                    <div key={`${item.id}-source-${sourceIndex}`} className="flex gap-2">
                      <input
                        type="text"
                        value={source}
                        onChange={(event) => updateSource(itemIndex, sourceIndex, event.target.value)}
                        placeholder="Source"
                        className="h-10 min-w-0 flex-1 rounded-xl border border-black/[0.08] bg-[#fafafa] px-3 text-sm text-[#111111] outline-none focus:border-[#ff2f6d]/25"
                      />
                      <button
                        type="button"
                        onClick={() => updateItem(itemIndex, { sources: (item.sources || []).filter((_, currentIndex) => currentIndex !== sourceIndex) })}
                        className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-black/[0.06] bg-white text-[#6b7280] transition hover:text-[#111111]"
                        aria-label="Remove source"
                      >
                        <X className="h-4 w-4" strokeWidth={2} />
                      </button>
                    </div>
                  ))}
                  <button
                    type="button"
                    onClick={() => updateItem(itemIndex, { sources: [...(item.sources || []), ''] })}
                    className="inline-flex items-center gap-2 rounded-full border border-black/[0.08] bg-[#fafafa] px-3 py-1.5 text-xs font-semibold text-[#6b7280] transition hover:bg-white hover:text-[#111111]"
                  >
                    <Plus className="h-3.5 w-3.5" strokeWidth={2} aria-hidden />
                    Add source
                  </button>
                </div>
              </article>
            ))}

            <button
              type="button"
              onClick={() => setMaterials((current) => ({ ...current, items: [...current.items, makeMaterial()] }))}
              className="inline-flex items-center gap-2 rounded-full border border-black/[0.08] bg-white px-4 py-2 text-sm font-semibold text-[#111111] shadow-sm transition hover:bg-[#fafafa]"
            >
              <Plus className="h-4 w-4" strokeWidth={2} aria-hidden />
              Add Material
            </button>
          </div>
        </div>

        <div className="flex flex-wrap justify-end gap-2 border-t border-black/[0.06] px-6 py-5 sm:px-8">
          <button
            type="button"
            onClick={onClose}
            className="rounded-full border border-black/[0.08] bg-[#fafafa] px-5 py-2 text-sm font-semibold text-[#6b7280] transition hover:bg-white"
          >
            Cancel
          </button>
          <button type="button" onClick={save} className="rounded-full bg-[#111111] px-5 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-black">
            Save
          </button>
        </div>
      </div>
    </div>
  )
}
