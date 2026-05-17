import { useEffect, useState } from 'react'
import { ArrowDown, ArrowUp, Plus, Trash2, X } from 'lucide-react'
import {
  OVERVIEW_BLOCK_TYPES,
  OVERVIEW_BLOCK_SIZES,
  OVERVIEW_LAYOUT_STYLES,
  OVERVIEW_LIST_TYPES,
  OVERVIEW_META_TYPES,
  createDefaultOverviewBlocks,
  normalizeOverview,
  normalizeOverviewBlocks,
} from '../data/overviewBlocks.js'

function FieldLabel({ children }) {
  return <p className="text-[11px] font-semibold uppercase tracking-wide text-[#6b7280]">{children}</p>
}

function makeBlock(type) {
  const id = `${type}-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`
  if (OVERVIEW_LIST_TYPES.has(type)) {
    return { id, type, title: 'New list block', enabled: true, size: '', icon: '', accentColor: '', layout: '', items: [''] }
  }
  if (OVERVIEW_META_TYPES.has(type)) {
    return { id, type, title: 'New meta block', enabled: true, size: '', icon: '', accentColor: '', layout: '', rows: [{ label: '', value: '' }] }
  }
  return { id, type, title: 'New text block', enabled: true, size: '', icon: '', accentColor: '', layout: '', content: '' }
}

function cleanBlock(block) {
  const options = {
    size: block.size || '',
    icon: (block.icon || '').trim(),
    accentColor: (block.accentColor || '').trim(),
    layout: (block.layout || block.style || '').trim(),
    style: (block.style || block.layout || '').trim(),
    accent: (block.accent || block.accentColor || '').trim(),
  }
  if (OVERVIEW_LIST_TYPES.has(block.type)) {
    return {
      id: block.id,
      type: block.type,
      title: block.title.trim() || 'Untitled block',
      enabled: block.enabled !== false,
      ...options,
      items: (block.items || []).map((item) => item.trim()).filter(Boolean),
    }
  }

  if (OVERVIEW_META_TYPES.has(block.type)) {
    return {
      id: block.id,
      type: block.type,
      title: block.title.trim() || 'Untitled block',
      enabled: block.enabled !== false,
      ...options,
      rows: (block.rows || [])
        .map((row) => ({ label: row.label.trim(), value: row.value.trim() }))
        .filter((row) => row.label || row.value),
    }
  }

  return {
    id: block.id,
    type: block.type,
    title: block.title.trim() || 'Untitled block',
    enabled: block.enabled !== false,
    ...options,
    content: (block.content || '').trim(),
  }
}

export default function OverviewBlockEditor({ character, open, onClose, onSave }) {
  const [blocks, setBlocks] = useState([])

  useEffect(() => {
    if (!open || !character) return
    const current = normalizeOverviewBlocks(character.overview)
    setBlocks(current.length ? current : createDefaultOverviewBlocks())
  }, [character, open])

  if (!open || !character) return null

  const updateBlock = (index, patch) => {
    setBlocks((current) => current.map((block, blockIndex) => (blockIndex === index ? { ...block, ...patch } : block)))
  }

  const moveBlock = (index, direction) => {
    setBlocks((current) => {
      const nextIndex = index + direction
      if (nextIndex < 0 || nextIndex >= current.length) return current
      const next = [...current]
      const [block] = next.splice(index, 1)
      next.splice(nextIndex, 0, block)
      return next
    })
  }

  const save = () => {
    const overview = normalizeOverview({ blocks: blocks.map(cleanBlock) })
    onSave?.(character.id, { overview })
    onClose?.()
  }

  return (
    <div className="fixed inset-0 z-[110] flex items-center justify-center p-4" role="dialog" aria-modal="true" aria-labelledby="overview-editor-title">
      <button type="button" className="absolute inset-0 bg-black/35 backdrop-blur-sm" aria-label="Close overview editor" onClick={onClose} />

      <div className="relative z-[111] flex max-h-[min(88vh,820px)] w-full max-w-3xl flex-col overflow-hidden rounded-[28px] border border-white/70 bg-white/95 shadow-[0_30px_100px_rgba(0,0,0,0.2)] backdrop-blur-xl">
        <div className="flex items-start justify-between gap-4 border-b border-black/[0.06] px-6 py-5 sm:px-8">
          <div>
            <h2 id="overview-editor-title" className="text-lg font-semibold tracking-tight text-[#111111]">
              Edit Overview
            </h2>
            <p className="mt-1 text-sm text-[#6b7280]">{character.name} overview blocks</p>
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
          {blocks.map((block, index) => (
            <article key={block.id} className="rounded-[22px] border border-black/[0.06] bg-white p-4 shadow-[0_14px_42px_rgba(0,0,0,0.045)]">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div className="flex min-w-[220px] flex-1 flex-col gap-3 sm:flex-row">
                  <label className="min-w-0 flex-1">
                    <FieldLabel>Title</FieldLabel>
                    <input
                      type="text"
                      value={block.title}
                      onChange={(event) => updateBlock(index, { title: event.target.value })}
                      className="mt-1.5 h-11 w-full rounded-2xl border border-black/[0.08] bg-[#fafafa] px-4 text-sm text-[#111111] outline-none transition focus:border-[#ff2f6d]/25 focus:bg-white"
                    />
                  </label>
                  <label className="w-full sm:w-36">
                    <FieldLabel>Type</FieldLabel>
                    <select
                      value={block.type}
                      onChange={(event) => {
                        const type = event.target.value
                        if (OVERVIEW_LIST_TYPES.has(type)) updateBlock(index, { type, items: block.items?.length ? block.items : [''] })
                        else if (OVERVIEW_META_TYPES.has(type)) updateBlock(index, { type, rows: block.rows?.length ? block.rows : [{ label: '', value: '' }] })
                        else updateBlock(index, { type, content: block.content || '' })
                      }}
                      className="mt-1.5 h-11 w-full rounded-2xl border border-black/[0.08] bg-[#fafafa] px-3 text-sm text-[#111111] outline-none focus:border-[#ff2f6d]/25 focus:bg-white"
                    >
                      {OVERVIEW_BLOCK_TYPES.map((type) => (
                        <option key={type} value={type}>{type}</option>
                      ))}
                    </select>
                  </label>
                </div>

                <div className="flex items-center gap-2">
                  <label className="inline-flex h-10 items-center gap-2 rounded-full border border-black/[0.06] bg-[#fafafa] px-3 text-xs font-semibold text-[#6b7280]">
                    <input
                      type="checkbox"
                      checked={block.enabled !== false}
                      onChange={(event) => updateBlock(index, { enabled: event.target.checked })}
                      className="rounded border-black/[0.2]"
                    />
                    Enabled
                  </label>
                  <button
                    type="button"
                    onClick={() => moveBlock(index, -1)}
                    disabled={index === 0}
                    className="flex h-10 w-10 items-center justify-center rounded-2xl border border-black/[0.06] bg-[#fafafa] text-[#6b7280] transition hover:text-[#111111] disabled:opacity-40"
                    aria-label="Move block up"
                  >
                    <ArrowUp className="h-4 w-4" strokeWidth={2} />
                  </button>
                  <button
                    type="button"
                    onClick={() => moveBlock(index, 1)}
                    disabled={index === blocks.length - 1}
                    className="flex h-10 w-10 items-center justify-center rounded-2xl border border-black/[0.06] bg-[#fafafa] text-[#6b7280] transition hover:text-[#111111] disabled:opacity-40"
                    aria-label="Move block down"
                  >
                    <ArrowDown className="h-4 w-4" strokeWidth={2} />
                  </button>
                  <button
                    type="button"
                    onClick={() => setBlocks((current) => current.filter((_, blockIndex) => blockIndex !== index))}
                    className="flex h-10 w-10 items-center justify-center rounded-2xl border border-black/[0.06] bg-white text-[#b45309] transition hover:bg-amber-50"
                    aria-label="Delete block"
                  >
                    <Trash2 className="h-4 w-4" strokeWidth={2} />
                  </button>
                </div>
              </div>

              <div className="mt-4 grid gap-3 sm:grid-cols-4">
                <label>
                  <FieldLabel>Size</FieldLabel>
                  <select
                    value={block.size || ''}
                    onChange={(event) => updateBlock(index, { size: event.target.value })}
                    className="mt-1.5 h-11 w-full rounded-2xl border border-black/[0.08] bg-[#fafafa] px-3 text-sm text-[#111111] outline-none focus:border-[#ff2f6d]/25 focus:bg-white"
                  >
                    <option value="">Auto</option>
                    {OVERVIEW_BLOCK_SIZES.map((size) => (
                      <option key={size} value={size}>{size}</option>
                    ))}
                  </select>
                </label>
                <label>
                  <FieldLabel>Icon</FieldLabel>
                  <input
                    type="text"
                    value={block.icon || ''}
                    onChange={(event) => updateBlock(index, { icon: event.target.value })}
                    placeholder="sparkles"
                    className="mt-1.5 h-11 w-full rounded-2xl border border-black/[0.08] bg-[#fafafa] px-4 text-sm text-[#111111] outline-none focus:border-[#ff2f6d]/25 focus:bg-white"
                  />
                </label>
                <label>
                  <FieldLabel>Accent</FieldLabel>
                  <input
                    type="text"
                    value={block.accentColor || ''}
                    onChange={(event) => updateBlock(index, { accentColor: event.target.value })}
                    placeholder="#14b8a6"
                    className="mt-1.5 h-11 w-full rounded-2xl border border-black/[0.08] bg-[#fafafa] px-4 text-sm text-[#111111] outline-none focus:border-[#ff2f6d]/25 focus:bg-white"
                  />
                </label>
                <label>
                  <FieldLabel>Layout</FieldLabel>
                  <select
                    value={block.style || block.layout || ''}
                    onChange={(event) => updateBlock(index, { style: event.target.value, layout: event.target.value })}
                    className="mt-1.5 h-11 w-full rounded-2xl border border-black/[0.08] bg-[#fafafa] px-4 text-sm text-[#111111] outline-none focus:border-[#ff2f6d]/25 focus:bg-white"
                  >
                    <option value="">Auto</option>
                    {OVERVIEW_LAYOUT_STYLES.map((style) => (
                      <option key={style} value={style}>{style}</option>
                    ))}
                  </select>
                </label>
              </div>

              {OVERVIEW_LIST_TYPES.has(block.type) ? (
                <div className="mt-4 space-y-2">
                  <FieldLabel>Items</FieldLabel>
                  {(block.items || []).map((item, itemIndex) => (
                    <div key={`${block.id}-${itemIndex}`} className="flex gap-2">
                      <input
                        type="text"
                        value={item}
                        onChange={(event) => {
                          const items = [...(block.items || [])]
                          items[itemIndex] = event.target.value
                          updateBlock(index, { items })
                        }}
                        className="h-11 min-w-0 flex-1 rounded-2xl border border-black/[0.08] bg-[#fafafa] px-4 text-sm text-[#111111] outline-none focus:border-[#ff2f6d]/25 focus:bg-white"
                      />
                      <button
                        type="button"
                        onClick={() => updateBlock(index, { items: (block.items || []).filter((_, currentIndex) => currentIndex !== itemIndex) })}
                        className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border border-black/[0.06] bg-white text-[#6b7280] transition hover:text-[#111111]"
                        aria-label="Remove list item"
                      >
                        <X className="h-4 w-4" strokeWidth={2} />
                      </button>
                    </div>
                  ))}
                  <button
                    type="button"
                    onClick={() => updateBlock(index, { items: [...(block.items || []), ''] })}
                    className="inline-flex items-center gap-2 rounded-full border border-black/[0.08] bg-[#fafafa] px-4 py-2 text-sm font-semibold text-[#6b7280] transition hover:bg-white hover:text-[#111111]"
                  >
                    <Plus className="h-4 w-4" strokeWidth={2} aria-hidden />
                    Add item
                  </button>
                </div>
              ) : OVERVIEW_META_TYPES.has(block.type) ? (
                <div className="mt-4 space-y-2">
                  <FieldLabel>Rows</FieldLabel>
                  {(block.rows || []).map((row, rowIndex) => (
                    <div key={`${block.id}-${rowIndex}`} className="grid gap-2 sm:grid-cols-[1fr_1fr_auto]">
                      <input
                        type="text"
                        value={row.label}
                        onChange={(event) => {
                          const rows = [...(block.rows || [])]
                          rows[rowIndex] = { ...rows[rowIndex], label: event.target.value }
                          updateBlock(index, { rows })
                        }}
                        placeholder="Label"
                        className="h-11 min-w-0 rounded-2xl border border-black/[0.08] bg-[#fafafa] px-4 text-sm text-[#111111] outline-none focus:border-[#ff2f6d]/25 focus:bg-white"
                      />
                      <input
                        type="text"
                        value={row.value}
                        onChange={(event) => {
                          const rows = [...(block.rows || [])]
                          rows[rowIndex] = { ...rows[rowIndex], value: event.target.value }
                          updateBlock(index, { rows })
                        }}
                        placeholder="Value"
                        className="h-11 min-w-0 rounded-2xl border border-black/[0.08] bg-[#fafafa] px-4 text-sm text-[#111111] outline-none focus:border-[#ff2f6d]/25 focus:bg-white"
                      />
                      <button
                        type="button"
                        onClick={() => updateBlock(index, { rows: (block.rows || []).filter((_, currentIndex) => currentIndex !== rowIndex) })}
                        className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border border-black/[0.06] bg-white text-[#6b7280] transition hover:text-[#111111]"
                        aria-label="Remove meta row"
                      >
                        <X className="h-4 w-4" strokeWidth={2} />
                      </button>
                    </div>
                  ))}
                  <button
                    type="button"
                    onClick={() => updateBlock(index, { rows: [...(block.rows || []), { label: '', value: '' }] })}
                    className="inline-flex items-center gap-2 rounded-full border border-black/[0.08] bg-[#fafafa] px-4 py-2 text-sm font-semibold text-[#6b7280] transition hover:bg-white hover:text-[#111111]"
                  >
                    <Plus className="h-4 w-4" strokeWidth={2} aria-hidden />
                    Add row
                  </button>
                </div>
              ) : (
                <label className="mt-4 block">
                  <FieldLabel>Content</FieldLabel>
                  <textarea
                    value={block.content || ''}
                    onChange={(event) => updateBlock(index, { content: event.target.value })}
                    rows={4}
                    className="mt-1.5 w-full resize-y rounded-2xl border border-black/[0.08] bg-[#fafafa] px-4 py-3 text-sm leading-relaxed text-[#111111] outline-none transition focus:border-[#ff2f6d]/25 focus:bg-white"
                  />
                </label>
              )}
            </article>
          ))}

          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => setBlocks((current) => [...current, makeBlock('text')])}
              className="inline-flex items-center gap-2 rounded-full border border-black/[0.08] bg-white px-4 py-2 text-sm font-semibold text-[#111111] shadow-sm transition hover:bg-[#fafafa]"
            >
              <Plus className="h-4 w-4" strokeWidth={2} aria-hidden />
              Add Text Block
            </button>
            <button
              type="button"
              onClick={() => setBlocks((current) => [...current, makeBlock('profileGrid')])}
              className="inline-flex items-center gap-2 rounded-full border border-black/[0.08] bg-white px-4 py-2 text-sm font-semibold text-[#111111] shadow-sm transition hover:bg-[#fafafa]"
            >
              <Plus className="h-4 w-4" strokeWidth={2} aria-hidden />
              Add Profile Grid
            </button>
            <button
              type="button"
              onClick={() => setBlocks((current) => [...current, makeBlock('list')])}
              className="inline-flex items-center gap-2 rounded-full border border-black/[0.08] bg-white px-4 py-2 text-sm font-semibold text-[#111111] shadow-sm transition hover:bg-[#fafafa]"
            >
              <Plus className="h-4 w-4" strokeWidth={2} aria-hidden />
              Add List Block
            </button>
            <button
              type="button"
              onClick={() => setBlocks((current) => [...current, makeBlock('gameplaySummary')])}
              className="inline-flex items-center gap-2 rounded-full border border-black/[0.08] bg-white px-4 py-2 text-sm font-semibold text-[#111111] shadow-sm transition hover:bg-[#fafafa]"
            >
              <Plus className="h-4 w-4" strokeWidth={2} aria-hidden />
              Add Summary
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
