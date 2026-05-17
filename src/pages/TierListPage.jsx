import { useEffect, useMemo, useRef, useState } from 'react'
import {
  ArrowDown,
  ArrowUp,
  Check,
  Download,
  Layers,
  Pencil,
  Plus,
  RotateCcw,
  Save,
  Settings,
  Trash2,
  X,
} from 'lucide-react'
import { useAdminMode } from '../admin/AdminModeContext.jsx'
import { characters as baseCharacters, ELEMENTS, RARITIES, ROLES } from '../data/characters.js'
import { cloneTierList, defaultPersonalTierList, normalizeTierList, tierTemplates } from '../data/tierList.js'
import { getCharacterAsset } from '../utils/assetHelpers.js'
import Seo from '../components/Seo.jsx'
import EmptyState from '../components/ui/EmptyState.jsx'
import { readJsonStorage, writeJsonStorage } from '../utils/safeStorage.js'
import { isApiMode } from '../repositories/dataSource.js'
import { getOfficialTierList as getUnifiedOfficialTierList } from '../repositories/unified/tierListRepository.js'
import { useAsyncData } from '../hooks/useAsyncData.js'

const LS_PERSONAL = 'nte-personal-tier-list'
const LS_PRESETS = 'nte-personal-tier-list-presets'

function readPersonalList() {
  const parsed = readJsonStorage(LS_PERSONAL, null)
  return parsed ? normalizeTierList(parsed, defaultPersonalTierList) : cloneTierList(defaultPersonalTierList)
}

function writePersonalList(list) {
  writeJsonStorage(LS_PERSONAL, list)
}

function readPresets() {
  const parsed = readJsonStorage(LS_PRESETS, [])
  return Array.isArray(parsed) ? parsed : []
}

function writePresets(presets) {
  writeJsonStorage(LS_PRESETS, Array.isArray(presets) ? presets : [])
}

function uniquePlacements(list) {
  const seen = new Set()
  return {
    ...list,
    tiers: list.tiers.map((tier) => ({
      ...tier,
      characterIds: (tier.characterIds || []).filter((id) => {
        if (seen.has(id)) return false
        seen.add(id)
        return true
      }),
    })),
  }
}

export default function TierListPage({ topbarQuery = '' }) {
  const {
    isAdminMode,
    mergedCharacters,
    mergedOfficialTierList,
    saveOfficialTierListOverride,
    clearOfficialTierListOverride,
  } = useAdminMode()
  const apiMode = isApiMode()
  const { data: apiOfficialTierList, error, loading, reload } = useAsyncData(
    () => getUnifiedOfficialTierList(mergedOfficialTierList, mergedOfficialTierList),
    [apiMode, mergedOfficialTierList],
    { enabled: apiMode, initialData: null },
  )
  const officialSource = apiMode ? apiOfficialTierList || mergedOfficialTierList : mergedOfficialTierList
  const effectiveAdminMode = isAdminMode && !apiMode
  const roster = mergedCharacters || baseCharacters
  const boardRef = useRef(null)
  const [mode, setMode] = useState('official')
  const [officialDraft, setOfficialDraft] = useState(() => cloneTierList(officialSource))
  const [personalList, setPersonalList] = useState(() => readPersonalList())
  const [officialEditing, setOfficialEditing] = useState(false)
  const [settingsOpen, setSettingsOpen] = useState(false)
  const [drag, setDrag] = useState(null)
  const [selectedId, setSelectedId] = useState('')
  const [poolFilters, setPoolFilters] = useState({ element: 'All', rarity: 'All', role: 'All' })
  const [notice, setNotice] = useState('')

  useEffect(() => {
    if (!officialEditing) setOfficialDraft(cloneTierList(officialSource))
  }, [officialSource, officialEditing])

  useEffect(() => {
    writePersonalList(personalList)
  }, [personalList])

  const activeList = mode === 'official' ? officialDraft : personalList
  const editable = mode === 'personal' || (mode === 'official' && effectiveAdminMode && officialEditing)
  const setActiveList = (updater) => {
    if (mode === 'official') setOfficialDraft((current) => uniquePlacements(typeof updater === 'function' ? updater(current) : updater))
    else setPersonalList((current) => uniquePlacements(typeof updater === 'function' ? updater(current) : updater))
  }

  const characterById = useMemo(() => new Map(roster.map((character) => [character.id, character])), [roster])
  const placedIds = useMemo(() => new Set(activeList.tiers.flatMap((tier) => tier.characterIds || [])), [activeList.tiers])
  const poolCharacters = useMemo(() => {
    const tokens = String(topbarQuery || '').trim().toLowerCase().split(/\s+/).filter(Boolean)
    return roster.filter((character) => {
      if (placedIds.has(character.id)) return false
      if (poolFilters.element !== 'All' && character.element !== poolFilters.element) return false
      if (poolFilters.rarity !== 'All' && character.rarity !== poolFilters.rarity) return false
      if (poolFilters.role !== 'All' && !(character.roles || []).includes(poolFilters.role) && !(character.tags || []).includes(poolFilters.role)) return false
      if (!tokens.length) return true
      const haystack = [character.name, character.rarity, character.element, character.arcType, ...(character.roles || []), ...(character.tags || [])].join(' ').toLowerCase()
      return tokens.every((token) => haystack.includes(token))
    })
  }, [placedIds, poolFilters, roster, topbarQuery])

  const saveOfficial = () => {
    saveOfficialTierListOverride({ ...officialDraft, updatedAt: new Date().toISOString().slice(0, 10) })
    setOfficialEditing(false)
    flash('Official tier list saved locally.')
  }

  const savePersonal = () => {
    writePersonalList(personalList)
    flash('Personal tier list saved locally.')
  }

  const flash = (message) => {
    setNotice(message)
    window.setTimeout(() => setNotice(''), 2200)
  }

  const reset = () => {
    if (mode === 'official') {
      if (effectiveAdminMode) {
        clearOfficialTierListOverride()
        setOfficialDraft(cloneTierList(officialSource))
        setOfficialEditing(false)
        flash('Official override reset.')
      }
    } else {
      setPersonalList(cloneTierList(defaultPersonalTierList))
      flash('Personal tier list reset.')
    }
  }

  const moveCharacter = (characterId, targetTierId, targetIndex = null) => {
    if (!editable) return
    setActiveList((current) => {
      const next = cloneTierList(current)
      next.tiers = next.tiers.map((tier) => ({ ...tier, characterIds: (tier.characterIds || []).filter((id) => id !== characterId) }))
      if (targetTierId !== 'pool') {
        next.tiers = next.tiers.map((tier) => {
          if (tier.id !== targetTierId) return tier
          const ids = [...(tier.characterIds || [])]
          const index = targetIndex == null ? ids.length : Math.max(0, Math.min(targetIndex, ids.length))
          ids.splice(index, 0, characterId)
          return { ...tier, characterIds: ids }
        })
      }
      return next
    })
    setSelectedId('')
  }

  const updateListMeta = (patch) => setActiveList((current) => ({ ...current, ...patch }))
  const updateSettings = (patch) => setActiveList((current) => ({ ...current, settings: { ...(current.settings || {}), ...patch } }))
  const updateTiers = (tiers) => setActiveList((current) => uniquePlacements({ ...current, tiers }))

  const downloadImage = async () => {
    await exportTierListImage(activeList, roster)
    flash('Tier list image downloaded.')
  }

  return (
    <div className="space-y-7 pb-6">
      <Seo title="Tier List" description="Compare NTE character placements with official and personal tier list modes." />
      <header className="overflow-hidden rounded-[28px] border border-black/[0.06] bg-white/92 p-5 shadow-[0_22px_70px_rgba(0,0,0,0.055)] sm:p-6 lg:p-7">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-3xl space-y-3">
            <div className="inline-flex items-center gap-2 rounded-full border border-[#ff2f6d]/15 bg-[#ff2f6d]/8 px-3 py-1.5 text-xs font-semibold text-[#ff2f6d]">
              <Layers className="h-3.5 w-3.5" strokeWidth={1.8} aria-hidden />
              {mode === 'official' ? 'Official ranking' : 'Personal maker'}
            </div>
            <div>
              <h1 className="text-3xl font-bold tracking-tight text-[#111111] sm:text-4xl">Tier List</h1>
              <p className="mt-2 max-w-2xl text-base leading-relaxed text-[#6b7280] sm:text-lg">
                Compare characters by role, strength, flexibility, and current meta value.
              </p>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-2 sm:flex sm:flex-wrap lg:justify-end">
            <InfoCapsule label="Tiers" value={activeList.tiers.length} />
            <InfoCapsule label="Placed" value={placedIds.size} />
            <InfoCapsule label="Pool" value={roster.length - placedIds.size} />
          </div>
        </div>
      </header>

      <section className="rounded-[22px] border border-black/[0.06] bg-white/95 p-3 shadow-[0_16px_48px_rgba(0,0,0,0.045)] sm:p-3.5">
        <div className="flex flex-col gap-3 xl:flex-row xl:items-center xl:justify-between">
          <div className="inline-flex w-fit rounded-full border border-black/[0.06] bg-[#fafafa] p-1 shadow-[inset_0_1px_0_rgba(255,255,255,0.8)]">
            {[
              ['official', 'Official Tier List'],
              ['personal', 'My Tier List'],
            ].map(([value, label]) => (
              <button
                key={value}
                type="button"
                onClick={() => setMode(value)}
                className={`rounded-full px-4 py-2 text-sm font-semibold transition ${mode === value ? 'bg-white text-[#be123c] shadow-sm' : 'text-[#6b7280] hover:text-[#111111]'}`}
              >
                {label}
              </button>
            ))}
          </div>
          <div className="flex flex-wrap items-center gap-2 xl:justify-end">
            {mode === 'official' && effectiveAdminMode ? (
              <button type="button" onClick={() => setOfficialEditing((current) => !current)} className={`control-button ${officialEditing ? 'bg-[#fff1f5] text-[#be123c]' : ''}`}>
                <Pencil className="h-4 w-4" strokeWidth={1.8} />
                {officialEditing ? 'Editing Official' : 'Edit Official Tier List'}
              </button>
            ) : null}
            <button type="button" onClick={reset} className="control-button">
              <RotateCcw className="h-4 w-4" strokeWidth={1.8} />
              Reset
            </button>
            <button type="button" onClick={() => setSettingsOpen(true)} className="control-button">
              <Settings className="h-4 w-4" strokeWidth={1.8} />
              Settings
            </button>
            <button type="button" onClick={downloadImage} className="control-button">
              <Download className="h-4 w-4" strokeWidth={1.8} />
              Download Image
            </button>
            {mode === 'official' ? (
              effectiveAdminMode && officialEditing ? (
                <button type="button" onClick={saveOfficial} className="primary-button">
                  <Save className="h-4 w-4" strokeWidth={1.8} />
                  Save Official
                </button>
              ) : null
            ) : (
              <button type="button" onClick={savePersonal} className="primary-button">
                <Save className="h-4 w-4" strokeWidth={1.8} />
                Save Locally
              </button>
            )}
          </div>
        </div>
      </section>

      {mode === 'official' && loading ? (
        <EmptyState title="Loading tier list" description="Fetching the official tier list from the local API." />
      ) : mode === 'official' && error ? (
        <EmptyState title="Tier list failed to load" description={error.message || 'The local API did not return the official tier list.'} action={<button type="button" onClick={reload} className="rounded-full bg-[#111111] px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-black">Retry</button>} />
      ) : (
      <section ref={boardRef} className="overflow-x-auto rounded-[28px] border border-black/[0.06] bg-white/92 p-3 shadow-[0_22px_70px_rgba(0,0,0,0.055)] sm:p-4">
        <div className="min-w-[760px] space-y-3">
          <div className="flex flex-wrap items-end justify-between gap-3 px-1">
            <div>
              <h2 className="text-xl font-black tracking-tight text-[#111111]">{activeList.title}</h2>
              <p className="mt-1 max-w-2xl text-sm leading-6 text-[#6b7280]">{activeList.description}</p>
            </div>
            {mode === 'official' && activeList.updatedAt ? (
              <span className="rounded-full border border-black/[0.06] bg-white px-3 py-1.5 text-xs font-bold text-[#6b7280]">Updated {activeList.updatedAt}</span>
            ) : null}
          </div>
          <TierBoard
            list={activeList}
            characterById={characterById}
            editable={editable}
            drag={drag}
            setDrag={setDrag}
            selectedId={selectedId}
            setSelectedId={setSelectedId}
            onMove={moveCharacter}
          />
          {activeList.settings?.showWatermark ? (
            <div className="flex justify-end px-2 text-xs font-black uppercase tracking-[0.18em] text-[#d1d5db]">NTE Database</div>
          ) : null}
        </div>
      </section>
      )}

      {!(mode === 'official' && (loading || error)) ? <CharacterPool
        characters={poolCharacters}
        filters={poolFilters}
        onFilters={setPoolFilters}
        editable={editable}
        drag={drag}
        setDrag={setDrag}
        selectedId={selectedId}
        setSelectedId={setSelectedId}
        tiers={activeList.tiers}
        onMove={moveCharacter}
        showNames={activeList.settings?.showNames}
      /> : null}

      {mode === 'personal' ? (
        <p className="rounded-[22px] border border-cyan-100 bg-cyan-50/60 px-4 py-3 text-sm font-semibold text-cyan-900">
          Personal lists are saved locally in this browser. Public sharing will come later.
        </p>
      ) : null}

      {settingsOpen ? (
        <TierSettingsModal
          mode={mode}
          editable={editable || mode === 'personal'}
          isAdminMode={effectiveAdminMode}
          list={activeList}
          onClose={() => setSettingsOpen(false)}
          onMeta={updateListMeta}
          onSettings={updateSettings}
          onTiers={updateTiers}
          onLoadTemplate={(template) => setActiveList((current) => {
            const hasPlacements = current.tiers.some((tier) => tier.characterIds?.length)
            if (hasPlacements && !window.confirm('Load this template and move current placements back to the pool?')) return current
            return { ...current, tiers: template.tiers.map((tier) => ({ ...tier, characterIds: [] })) }
          })}
          onLoadList={(list) => setActiveList(list)}
          flash={flash}
        />
      ) : null}

      {notice ? (
        <div className="fixed bottom-6 left-1/2 z-50 -translate-x-1/2 rounded-full border border-black/[0.06] bg-white/95 px-4 py-2 text-sm font-bold text-[#111111] shadow-[0_18px_55px_rgba(0,0,0,0.14)] backdrop-blur">
          {notice}
        </div>
      ) : null}

      <style>{`
        .control-button {
          display: inline-flex;
          height: 2.75rem;
          align-items: center;
          gap: 0.5rem;
          border-radius: 9999px;
          border: 1px solid rgba(0,0,0,0.06);
          background: rgba(255,255,255,0.9);
          padding: 0 1rem;
          font-size: 0.875rem;
          font-weight: 700;
          color: #4b5563;
          box-shadow: 0 1px 2px rgba(0,0,0,0.04);
          transition: 160ms ease;
        }
        .control-button:hover { background: #fff; color: #111111; }
        .primary-button {
          display: inline-flex;
          height: 2.75rem;
          align-items: center;
          gap: 0.5rem;
          border-radius: 9999px;
          background: #111111;
          padding: 0 1rem;
          font-size: 0.875rem;
          font-weight: 700;
          color: white;
          box-shadow: 0 1px 2px rgba(0,0,0,0.08);
          transition: 160ms ease;
        }
        .primary-button:hover { background: #000; }
      `}</style>
    </div>
  )
}

function InfoCapsule({ label, value }) {
  return (
    <div className="rounded-2xl bg-white px-4 py-3 text-[#111111] shadow-sm ring-1 ring-black/[0.06]">
      <p className="text-[11px] font-bold uppercase tracking-wide opacity-60">{label}</p>
      <p className="mt-0.5 text-xl font-black tracking-tight tabular-nums">{value}</p>
    </div>
  )
}

function TierBoard({ list, characterById, editable, drag, setDrag, selectedId, setSelectedId, onMove }) {
  return (
    <div className="space-y-2.5">
      {list.tiers.map((tier) => (
        <div
          key={tier.id}
          className="grid min-h-[104px] grid-cols-[132px_minmax(0,1fr)] overflow-hidden rounded-[22px] border border-black/[0.055] bg-white shadow-[0_12px_38px_rgba(0,0,0,0.04)]"
          onDragOver={(event) => editable && event.preventDefault()}
          onDrop={(event) => {
            event.preventDefault()
            if (drag?.characterId) onMove(drag.characterId, tier.id)
            setDrag(null)
          }}
        >
          <div className="flex min-w-0 flex-col justify-center gap-1 overflow-hidden border-r border-black/[0.05] px-2 py-3 sm:px-3" style={{ background: softGradient(tier.color) }}>
            <p className="max-w-full overflow-hidden break-words text-center text-[clamp(0.86rem,1.8vw,1.55rem)] font-black leading-tight tracking-tight text-[#111111]">{tier.label}</p>
            <p className="line-clamp-2 text-center text-[11px] font-semibold leading-4 text-[#4b5563]">{tier.subtitle || 'Drop characters here'}</p>
          </div>
          <div className="relative flex min-h-[104px] flex-wrap content-start gap-2 p-3">
            {tier.characterIds?.length ? tier.characterIds.map((characterId, index) => {
              const character = characterById.get(characterId)
              if (!character) return null
              return (
                <CharacterToken
                  key={characterId}
                  character={character}
                  draggable={editable}
                  selected={selectedId === character.id}
                  showName={list.settings?.showNames}
                  compact={list.settings?.compactMode}
                  onSelect={() => setSelectedId(selectedId === character.id ? '' : character.id)}
                  onDragStart={() => setDrag({ characterId: character.id, sourceTierId: tier.id })}
                  onDragEnd={() => setDrag(null)}
                  onDropBefore={(event) => {
                    event.preventDefault()
                    if (drag?.characterId && drag.characterId !== character.id) onMove(drag.characterId, tier.id, index)
                    setDrag(null)
                  }}
                  onRemove={() => onMove(character.id, 'pool')}
                />
              )
            }) : (
              <div className="absolute inset-3 flex items-center justify-center rounded-[18px] border border-dashed border-black/[0.08] bg-[#fafafa]/70 text-sm font-semibold text-[#9ca3af]">
                Drop characters here
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  )
}

function CharacterToken({ character, draggable, selected, showName, compact, onSelect, onDragStart, onDragEnd, onDropBefore, onRemove }) {
  const image = getCharacterAsset(character.name) || character.portraitImageUrl
  const size = compact ? 'h-14 w-14' : 'h-16 w-16'
  return (
    <div
      draggable={draggable}
      onDragStart={(event) => {
        event.dataTransfer?.setData?.('text/plain', character.id)
        onDragStart?.(event)
      }}
      onDragEnd={onDragEnd}
      onDragOver={(event) => draggable && event.preventDefault()}
      onDrop={onDropBefore}
      className="group relative"
      title={character.name}
    >
      <button
        type="button"
        onClick={onSelect}
        className={`relative flex ${size} overflow-hidden rounded-[18px] border bg-white shadow-sm ring-1 transition hover:-translate-y-0.5 hover:shadow-[0_14px_34px_rgba(0,0,0,0.10)] ${
          selected ? 'border-[#ff2f6d]/35 ring-[#ff2f6d]/20' : 'border-white ring-black/[0.06]'
        }`}
      >
        {image ? <img src={image} alt="" className="h-full w-full object-contain p-1" loading="lazy" /> : <span className="m-auto text-sm font-black text-[#111111]">{initials(character.name)}</span>}
        <span className={`absolute left-1 top-1 rounded-full px-1.5 py-0.5 text-[10px] font-black ${character.rarity === 'S' ? 'bg-amber-50 text-amber-700' : 'bg-fuchsia-50 text-fuchsia-700'}`}>{character.rarity}</span>
      </button>
      {showName ? <p className="mt-1 max-w-16 truncate text-center text-[11px] font-bold text-[#6b7280]">{character.name}</p> : null}
      {draggable ? (
        <button type="button" onClick={onRemove} className="absolute -right-1 -top-1 hidden h-6 w-6 items-center justify-center rounded-full border border-black/[0.06] bg-white text-[#9ca3af] shadow-sm transition hover:text-[#be123c] group-hover:flex" aria-label={`Return ${character.name} to pool`}>
          <X className="h-3.5 w-3.5" />
        </button>
      ) : null}
    </div>
  )
}

function CharacterPool({ characters, filters, onFilters, editable, setDrag, selectedId, setSelectedId, tiers, onMove, showNames }) {
  return (
    <section className="rounded-[28px] border border-black/[0.06] bg-white/92 p-4 shadow-[0_22px_70px_rgba(0,0,0,0.055)]">
      <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h2 className="text-lg font-black tracking-tight text-[#111111]">Character Pool</h2>
          <p className="mt-1 text-sm text-[#6b7280]">Drag characters into tiers. Tap one on mobile, then choose a tier.</p>
        </div>
        <div className="flex flex-wrap gap-2 lg:justify-end">
          <PoolSelect label="Element" value={filters.element} options={['All', ...ELEMENTS]} onChange={(element) => onFilters({ ...filters, element })} />
          <PoolSelect label="Rarity" value={filters.rarity} options={['All', ...RARITIES]} onChange={(rarity) => onFilters({ ...filters, rarity })} />
          <PoolSelect label="Role" value={filters.role} options={['All', ...ROLES]} onChange={(role) => onFilters({ ...filters, role })} />
        </div>
      </div>
      {selectedId && editable ? (
        <div className="mt-4 flex flex-wrap items-center gap-2 rounded-[18px] border border-[#ff2f6d]/12 bg-[#fff7fa] px-3 py-2">
          <span className="text-xs font-bold text-[#be123c]">Send selected to</span>
          {tiers.map((tier) => (
            <button key={tier.id} type="button" onClick={() => onMove(selectedId, tier.id)} className="rounded-full border border-black/[0.06] bg-white px-3 py-1.5 text-xs font-bold text-[#111111] shadow-sm transition hover:bg-[#fff1f5] hover:text-[#be123c]">
              {tier.label}
            </button>
          ))}
        </div>
      ) : null}
      <div
        className="mt-4 max-h-[270px] overflow-y-auto rounded-[22px] border border-black/[0.05] bg-[#fafafa]/70 p-3 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        onDragOver={(event) => editable && event.preventDefault()}
        onDrop={(event) => {
          event.preventDefault()
          const id = event.dataTransfer?.getData('text/plain')
          if (id) onMove(id, 'pool')
        }}
      >
        {characters.length ? (
          <div className="flex flex-wrap gap-2">
            {characters.map((character) => (
              <CharacterToken
                key={character.id}
                character={character}
                draggable={editable}
                selected={selectedId === character.id}
                showName={showNames}
                onSelect={() => setSelectedId(selectedId === character.id ? '' : character.id)}
                onDragStart={(event) => {
                  event?.dataTransfer?.setData?.('text/plain', character.id)
                  setDrag({ characterId: character.id, sourceTierId: 'pool' })
                }}
                onDragEnd={() => setDrag(null)}
                onDropBefore={() => {}}
                onRemove={() => {}}
              />
            ))}
          </div>
        ) : (
          <p className="py-10 text-center text-sm font-semibold text-[#9ca3af]">No characters match the current pool filters.</p>
        )}
      </div>
    </section>
  )
}

function PoolSelect({ label, value, options, onChange }) {
  return (
    <label className="inline-flex h-10 items-center gap-2 rounded-full border border-black/[0.06] bg-white/90 pl-3 pr-2 text-sm font-semibold text-[#6b7280] shadow-sm">
      <span className="text-xs uppercase tracking-wide">{label}</span>
      <select value={value} onChange={(event) => onChange(event.target.value)} className="h-8 rounded-full border-0 bg-[#fafafa] px-2 text-sm font-semibold text-[#111111] outline-none">
        {options.map((option) => <option key={option} value={option}>{option}</option>)}
      </select>
    </label>
  )
}

function TierSettingsModal({ mode, editable, list, onClose, onMeta, onSettings, onTiers, onLoadTemplate, onLoadList, flash }) {
  const [tab, setTab] = useState('general')
  const [presets, setPresets] = useState(() => readPresets())
  const [presetName, setPresetName] = useState('')

  const savePreset = () => {
    if (!presetName.trim()) return
    const next = [{ id: `preset-${Date.now()}`, name: presetName.trim(), list: cloneTierList(list) }, ...presets].slice(0, 12)
    setPresets(next)
    writePresets(next)
    setPresetName('')
    flash('Preset saved locally.')
  }

  const deletePreset = (id) => {
    const next = presets.filter((preset) => preset.id !== id)
    setPresets(next)
    writePresets(next)
  }

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4" role="dialog" aria-modal="true">
      <button type="button" className="absolute inset-0 bg-black/30 backdrop-blur-sm" aria-label="Close settings" onClick={onClose} />
      <div className="relative z-[101] flex max-h-[88vh] w-full max-w-4xl flex-col overflow-hidden rounded-[28px] border border-black/[0.08] bg-white shadow-[0_28px_90px_rgba(0,0,0,0.18)]">
        <div className="flex items-start justify-between gap-4 border-b border-black/[0.06] px-5 py-4">
          <div>
            <h2 className="text-lg font-bold tracking-tight text-[#111111]">Tier List Settings</h2>
            <p className="mt-1 text-sm text-[#6b7280]">{mode === 'official' ? 'Official list settings' : 'Personal local list settings'}</p>
          </div>
          <button type="button" onClick={onClose} className="flex h-10 w-10 items-center justify-center rounded-2xl border border-black/[0.06] bg-[#fafafa] text-[#6b7280]">
            <X className="h-4 w-4" />
          </button>
        </div>
        <div className="flex flex-wrap gap-2 border-b border-black/[0.06] px-5 py-3">
          {[
            ['general', 'General'],
            ['tiers', 'Tiers'],
            ['templates', 'Templates'],
            ['presets', 'Presets / Local Saves'],
          ].map(([id, label]) => (
            <button key={id} type="button" onClick={() => setTab(id)} className={`rounded-full px-4 py-2 text-sm font-bold transition ${tab === id ? 'bg-[#fff1f5] text-[#be123c]' : 'bg-[#fafafa] text-[#6b7280] hover:text-[#111111]'}`}>
              {label}
            </button>
          ))}
        </div>
        <div className="flex-1 overflow-y-auto p-5 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {tab === 'general' ? (
            <div className="grid gap-4">
              <Field disabled={!editable} label="Tier list title" value={list.title} onChange={(value) => onMeta({ title: value })} />
              <Field disabled={!editable} textarea label="Description" value={list.description} onChange={(value) => onMeta({ description: value })} />
              <div className="rounded-2xl border border-black/[0.06] bg-[#fafafa] px-4 py-3 text-sm text-[#6b7280]">
                {mode === 'official' ? 'Official ranking is read-only unless Admin Mode editing is enabled.' : 'Personal lists are saved locally in this browser. Public sharing will come later.'}
              </div>
              <Toggle label="Show watermark on exported image" checked={list.settings?.showWatermark} onChange={(value) => onSettings({ showWatermark: value })} disabled={!editable} />
              <Toggle label="Show character names under portraits" checked={list.settings?.showNames} onChange={(value) => onSettings({ showNames: value })} disabled={!editable} />
              <Toggle label="Compact mode" checked={list.settings?.compactMode} onChange={(value) => onSettings({ compactMode: value })} disabled={!editable} />
            </div>
          ) : null}
          {tab === 'tiers' ? (
            <TierEditor tiers={list.tiers} disabled={!editable} onChange={onTiers} />
          ) : null}
          {tab === 'templates' ? (
            <div className="grid gap-3 sm:grid-cols-2">
              {Object.entries(tierTemplates).map(([id, template]) => (
                <button key={id} type="button" disabled={!editable} onClick={() => onLoadTemplate(template)} className="rounded-[22px] border border-black/[0.06] bg-[#fafafa] p-4 text-left transition hover:bg-white hover:shadow-sm disabled:cursor-not-allowed disabled:opacity-60">
                  <p className="font-black text-[#111111]">{template.name}</p>
                  <div className="mt-3 flex flex-wrap gap-1.5">
                    {template.tiers.map((tier) => <span key={tier.id} className="rounded-full px-2.5 py-1 text-xs font-black text-[#111111]" style={{ background: softGradient(tier.color) }}>{tier.label}</span>)}
                  </div>
                </button>
              ))}
            </div>
          ) : null}
          {tab === 'presets' ? (
            <div className="space-y-4">
              <div className="flex flex-col gap-2 rounded-[22px] border border-black/[0.06] bg-[#fafafa] p-4 sm:flex-row">
                <input value={presetName} onChange={(event) => setPresetName(event.target.value)} placeholder="Preset name" className="h-11 min-w-0 flex-1 rounded-full border border-black/[0.08] bg-white px-4 text-sm outline-none focus:border-[#ff2f6d]/25" />
                <button type="button" onClick={savePreset} className="primary-button">Save Current</button>
              </div>
              <div className="space-y-2">
                {presets.length ? presets.map((preset) => (
                  <div key={preset.id} className="flex flex-wrap items-center justify-between gap-3 rounded-[18px] border border-black/[0.06] bg-white px-4 py-3 shadow-sm">
                    <div>
                      <p className="font-bold text-[#111111]">{preset.name}</p>
                      <p className="text-xs font-semibold text-[#9ca3af]">{preset.list?.tiers?.length || 0} tiers</p>
                    </div>
                    <div className="flex gap-2">
                      <button type="button" disabled={!editable} onClick={() => onLoadList(normalizeTierList(preset.list, defaultPersonalTierList))} className="control-button disabled:cursor-not-allowed disabled:opacity-60">Load</button>
                      <button type="button" onClick={() => deletePreset(preset.id)} className="control-button text-rose-700"><Trash2 className="h-4 w-4" />Delete</button>
                    </div>
                  </div>
                )) : <p className="rounded-[22px] border border-dashed border-black/[0.08] bg-white/70 px-6 py-10 text-center text-sm text-[#9ca3af]">No local presets saved yet.</p>}
              </div>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  )
}

function TierEditor({ tiers, disabled, onChange }) {
  const update = (id, patch) => onChange(tiers.map((tier) => tier.id === id ? { ...tier, ...patch } : tier))
  const remove = (id) => onChange(tiers.filter((tier) => tier.id !== id))
  const move = (index, direction) => {
    const next = [...tiers]
    const target = index + direction
    if (target < 0 || target >= next.length) return
    const [tier] = next.splice(index, 1)
    next.splice(target, 0, tier)
    onChange(next)
  }
  const add = () => onChange([...tiers, { id: `tier-${Date.now()}`, label: 'New', subtitle: 'Custom tier', color: '#94a3b8', characterIds: [] }])
  return (
    <div className="space-y-3">
      <button type="button" disabled={disabled} onClick={add} className="primary-button disabled:cursor-not-allowed disabled:opacity-60"><Plus className="h-4 w-4" />Add tier</button>
      {tiers.map((tier, index) => (
        <div key={tier.id} className="grid gap-3 rounded-[22px] border border-black/[0.06] bg-[#fafafa] p-4 lg:grid-cols-[100px_1fr_1fr_110px_auto] lg:items-end">
          <div className="rounded-2xl px-4 py-3 text-center" style={{ background: softGradient(tier.color) }}>
            <p className="text-2xl font-black text-[#111111]">{tier.label}</p>
            <p className="truncate text-[11px] font-bold text-[#6b7280]">{tier.subtitle}</p>
          </div>
          <Field disabled={disabled} label="Label" value={tier.label} onChange={(value) => update(tier.id, { label: value })} />
          <Field disabled={disabled} label="Subtitle" value={tier.subtitle} onChange={(value) => update(tier.id, { subtitle: value })} />
          <Field disabled={disabled} label="Color" value={tier.color} onChange={(value) => update(tier.id, { color: value })} />
          <div className="flex gap-1">
            <button type="button" disabled={disabled} onClick={() => move(index, -1)} className="control-button h-10 px-3"><ArrowUp className="h-4 w-4" /></button>
            <button type="button" disabled={disabled} onClick={() => move(index, 1)} className="control-button h-10 px-3"><ArrowDown className="h-4 w-4" /></button>
            <button type="button" disabled={disabled} onClick={() => remove(tier.id)} className="control-button h-10 px-3 text-rose-700"><Trash2 className="h-4 w-4" /></button>
          </div>
        </div>
      ))}
    </div>
  )
}

function Field({ label, value, onChange, textarea = false, disabled = false }) {
  return (
    <label className="block">
      <span className="text-[11px] font-bold uppercase tracking-wide text-[#9ca3af]">{label}</span>
      {textarea ? (
        <textarea disabled={disabled} value={value || ''} onChange={(event) => onChange(event.target.value)} className="mt-1.5 min-h-24 w-full rounded-2xl border border-black/[0.08] bg-white px-3 py-2 text-sm outline-none focus:border-[#ff2f6d]/25 disabled:opacity-60" />
      ) : (
        <input disabled={disabled} value={value || ''} onChange={(event) => onChange(event.target.value)} className="mt-1.5 h-10 w-full rounded-2xl border border-black/[0.08] bg-white px-3 text-sm outline-none focus:border-[#ff2f6d]/25 disabled:opacity-60" />
      )}
    </label>
  )
}

function Toggle({ label, checked, onChange, disabled }) {
  return (
    <label className="flex items-center justify-between gap-4 rounded-2xl border border-black/[0.06] bg-white px-4 py-3 text-sm font-bold text-[#111111] shadow-sm">
      {label}
      <button type="button" disabled={disabled} onClick={() => onChange(!checked)} className={`relative h-7 w-12 rounded-full transition disabled:opacity-60 ${checked ? 'bg-[#ff2f6d]' : 'bg-[#e5e7eb]'}`}>
        <span className={`absolute top-1 h-5 w-5 rounded-full bg-white shadow-sm transition ${checked ? 'left-6' : 'left-1'}`} />
      </button>
    </label>
  )
}

function softGradient(color) {
  return `linear-gradient(135deg, ${hexToRgba(color, 0.18)}, ${hexToRgba(color, 0.07)} 58%, rgba(255,255,255,0.72))`
}

function hexToRgba(hex, alpha) {
  const clean = String(hex || '#94a3b8').replace('#', '')
  const value = clean.length === 3 ? clean.split('').map((c) => c + c).join('') : clean
  const int = Number.parseInt(value, 16)
  if (!Number.isFinite(int)) return `rgba(148,163,184,${alpha})`
  return `rgba(${(int >> 16) & 255},${(int >> 8) & 255},${int & 255},${alpha})`
}

function initials(name) {
  return String(name || '?').split(/\s+/).map((part) => part[0]).join('').slice(0, 2).toUpperCase()
}

async function exportTierListImage(list, roster) {
  const characterById = new Map(roster.map((character) => [character.id, character]))
  const cell = list.settings?.compactMode ? 58 : 68
  const labelWidth = 160
  const gap = 12
  const width = 1180
  const rows = list.tiers.map((tier) => {
    const count = tier.characterIds?.length || 0
    const perRow = Math.max(1, Math.floor((width - labelWidth - 70) / (cell + 8)))
    const lines = Math.max(1, Math.ceil(count / perRow))
    return { tier, height: Math.max(108, 42 + lines * (cell + (list.settings?.showNames ? 20 : 8))) }
  })
  const height = 110 + rows.reduce((sum, row) => sum + row.height + gap, 0) + 44
  const canvas = document.createElement('canvas')
  canvas.width = width * 2
  canvas.height = height * 2
  const ctx = canvas.getContext('2d')
  ctx.scale(2, 2)
  ctx.fillStyle = '#f8f8f7'
  ctx.fillRect(0, 0, width, height)
  ctx.fillStyle = '#111111'
  ctx.font = '800 34px Inter, Arial, sans-serif'
  ctx.fillText(list.title || 'Tier List', 32, 48)
  ctx.font = '600 15px Inter, Arial, sans-serif'
  ctx.fillStyle = '#6b7280'
  wrapText(ctx, list.description || '', 32, 76, 780, 21)

  let y = 112
  for (const { tier, height: rowHeight } of rows) {
    roundRect(ctx, 28, y, width - 56, rowHeight, 24, '#ffffff')
    roundRect(ctx, 28, y, labelWidth, rowHeight, 24, hexToRgba(tier.color, 0.18))
    ctx.fillStyle = '#111111'
    ctx.font = '900 34px Inter, Arial, sans-serif'
    ctx.fillText(tier.label, 50, y + 48)
    ctx.font = '700 13px Inter, Arial, sans-serif'
    ctx.fillStyle = '#6b7280'
    wrapText(ctx, tier.subtitle || '', 50, y + 72, 108, 16)

    let x = 28 + labelWidth + 18
    let cy = y + 20
    const maxX = width - 42 - cell
    for (const characterId of tier.characterIds || []) {
      const character = characterById.get(characterId)
      if (!character) continue
      if (x > maxX) {
        x = 28 + labelWidth + 18
        cy += cell + (list.settings?.showNames ? 30 : 12)
      }
      await drawCharacter(ctx, character, x, cy, cell, list.settings?.showNames)
      x += cell + 8
    }
    y += rowHeight + gap
  }

  if (list.settings?.showWatermark !== false) {
    ctx.font = '900 18px Inter, Arial, sans-serif'
    ctx.fillStyle = 'rgba(17,17,17,0.20)'
    ctx.fillText('NTE Database', width - 164, height - 28)
  }

  const link = document.createElement('a')
  link.download = `${String(list.title || 'nte-tier-list').toLowerCase().replace(/[^a-z0-9]+/g, '-')}.png`
  link.href = canvas.toDataURL('image/png')
  link.click()
}

function roundRect(ctx, x, y, w, h, r, fill) {
  ctx.beginPath()
  ctx.moveTo(x + r, y)
  ctx.arcTo(x + w, y, x + w, y + h, r)
  ctx.arcTo(x + w, y + h, x, y + h, r)
  ctx.arcTo(x, y + h, x, y, r)
  ctx.arcTo(x, y, x + w, y, r)
  ctx.closePath()
  ctx.fillStyle = fill
  ctx.fill()
}

function wrapText(ctx, text, x, y, maxWidth, lineHeight) {
  const words = String(text || '').split(/\s+/)
  let line = ''
  words.forEach((word) => {
    const test = line ? `${line} ${word}` : word
    if (ctx.measureText(test).width > maxWidth && line) {
      ctx.fillText(line, x, y)
      y += lineHeight
      line = word
    } else {
      line = test
    }
  })
  if (line) ctx.fillText(line, x, y)
}

async function drawCharacter(ctx, character, x, y, size, showName) {
  roundRect(ctx, x, y, size, size, 16, '#ffffff')
  const src = getCharacterAsset(character.name) || character.portraitImageUrl
  const image = src ? await loadImage(src) : null
  if (image) {
    ctx.save()
    ctx.beginPath()
    ctx.roundRect?.(x + 3, y + 3, size - 6, size - 6, 14)
    ctx.clip()
    ctx.drawImage(image, x + 3, y + 3, size - 6, size - 6)
    ctx.restore()
  } else {
    ctx.fillStyle = '#111111'
    ctx.font = '900 16px Inter, Arial, sans-serif'
    ctx.fillText(initials(character.name), x + 16, y + size / 2 + 6)
  }
  roundRect(ctx, x + 4, y + 4, 20, 16, 8, character.rarity === 'S' ? '#fef3c7' : '#fae8ff')
  ctx.fillStyle = character.rarity === 'S' ? '#92400e' : '#7e22ce'
  ctx.font = '900 10px Inter, Arial, sans-serif'
  ctx.fillText(character.rarity, x + 11, y + 16)
  if (showName) {
    ctx.fillStyle = '#4b5563'
    ctx.font = '700 11px Inter, Arial, sans-serif'
    ctx.fillText(character.name.slice(0, 11), x, y + size + 16)
  }
}

function loadImage(src) {
  return new Promise((resolve) => {
    const image = new Image()
    image.crossOrigin = 'anonymous'
    image.onload = () => resolve(image)
    image.onerror = () => resolve(null)
    image.src = src
  })
}
