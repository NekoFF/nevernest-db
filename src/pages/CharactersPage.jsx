import { useEffect, useMemo, useRef, useState, useCallback } from 'react'
import { ArrowRight } from 'lucide-react'
import CharacterFilters from '../components/CharacterFilters.jsx'
import CharacterCard from '../components/CharacterCard.jsx'
import { useAdminMode } from '../admin/AdminModeContext.jsx'
import SummaryCounters from '../components/ui/SummaryCounters.jsx'
import GameIconBadge from '../components/ui/GameIconBadge.jsx'
import FilterControlBar from '../components/ui/FilterControlBar.jsx'
import PageAdminActions, { AdminAddButton } from '../components/ui/PageAdminActions.jsx'
import { arcTypesMeta, elementsMeta, getArcTypeMeta, getElementMeta, getRarityMeta } from '../data/gameMeta.jsx'
import { getCharacterAsset, getElementIcon, getTypeIcon } from '../utils/assetHelpers.js'
import { SORT_OPTIONS } from '../data/characters.js'
import Seo from '../components/Seo.jsx'
import EmptyState from '../components/ui/EmptyState.jsx'
import { isApiMode } from '../repositories/dataSource.js'
import { getCharacters } from '../repositories/unified/charactersRepository.js'
import { useAsyncData } from '../hooks/useAsyncData.js'
import { apiCountValue, apiFailureDescription } from '../utils/apiDisplay.js'
import { DISCOVERY_SOURCE_OPTIONS, matchesDiscoverySourceStatus } from '../utils/sourceStatusFilters.js'

const defaultFilters = {
  sortBy: 'rarity-desc',
  viewMode: 'grid',
  elements: [],
  rarities: [],
  arcs: [],
  roles: [],
  sourceStatuses: [],
}

function applyFilters(list, filters, extraNameQuery) {
  const tokens = [extraNameQuery]
    .map((s) => (s || '').trim().toLowerCase())
    .filter(Boolean)

  return list.filter((c) => {
    if (tokens.length) {
      const haystack = [c.name, c.id, c.slug, c.shortDescription, c.element, c.arcType, ...(c.roles || []), ...(c.tags || [])].filter(Boolean).join(' ').toLowerCase()
      if (!tokens.every((t) => haystack.includes(t))) return false
    }
    if (filters.elements.length && !filters.elements.includes(c.element)) return false
    if (filters.rarities.length && !filters.rarities.includes(c.rarity)) return false
    if (filters.arcs.length && !filters.arcs.includes(c.arcType)) return false
    if (filters.roles.length) {
      const roleHit = filters.roles.some((role) => {
        if (role === 'Sub DPS') return c.tags?.includes('Burst DPS')
        return c.roles?.includes(role) || c.tags?.includes(role)
      })
      if (!roleHit) return false
    }
    if (filters.sourceStatuses.length && !filters.sourceStatuses.some((status) => matchesDiscoverySourceStatus(c.sourceStatus || c.statSourceStatus, status))) return false
    return true
  })
}

function sortList(list, sortBy) {
  const next = [...list]
  const rarityOrder = { S: 2, A: 1, B: 0 }
  const rarityValue = (x) => rarityOrder[x.rarity] || 0
  const byDate = (a, b) => new Date(b.releaseDate) - new Date(a.releaseDate)
  const byNameAsc = (a, b) => a.name.localeCompare(b.name)
  const byNameDesc = (a, b) => b.name.localeCompare(a.name)
  const byRarityDesc = (a, b) => rarityValue(b) - rarityValue(a) || a.name.localeCompare(b.name)
  const byRarityAsc = (a, b) => rarityValue(a) - rarityValue(b) || a.name.localeCompare(b.name)

  switch (sortBy) {
    case 'name-asc':
      next.sort(byNameAsc)
      break
    case 'name-desc':
      next.sort(byNameDesc)
      break
    case 'rarity-desc':
      next.sort(byRarityDesc)
      break
    case 'rarity-asc':
      next.sort(byRarityAsc)
      break
    case 'release':
    default:
      next.sort(byDate)
      break
  }
  return next
}

export default function CharactersPage({ topbarQuery = '', onOpenCharacter, onAdminEditCharacter, onAdminAddCharacter }) {
  const { isAdminMode, mergedCharacters } = useAdminMode()
  const apiMode = isApiMode()
  const { data: apiCharacters, error, loading, reload } = useAsyncData(
    () => getCharacters(mergedCharacters),
    [apiMode, mergedCharacters],
    { enabled: apiMode, initialData: [] },
  )
  const characters = apiMode ? apiCharacters || [] : mergedCharacters
  const effectiveAdminMode = isAdminMode && !apiMode
  const [filters, setFilters] = useState(defaultFilters)
  const [showMiniFilters, setShowMiniFilters] = useState(false)
  const filterRef = useRef(null)

  const updateFilters = useCallback((patch) => {
    setFilters((prev) => ({ ...prev, ...patch }))
  }, [])

  const clearAll = useCallback(() => {
    setFilters({ ...defaultFilters })
  }, [])

  useEffect(() => {
    const node = filterRef.current
    if (!node || typeof IntersectionObserver === 'undefined') return undefined
    const observer = new IntersectionObserver(
      ([entry]) => setShowMiniFilters(!entry.isIntersecting),
      { rootMargin: '-96px 0px 0px 0px', threshold: 0.05 },
    )
    observer.observe(node)
    return () => observer.disconnect()
  }, [])

  const filtered = useMemo(() => {
    const base = applyFilters(characters, filters, topbarQuery)
    return sortList(base, filters.sortBy)
  }, [filters, topbarQuery, characters])

  const stats = useMemo(() => {
    const total = characters.length
    const sRank = characters.filter((c) => c.rarity === 'S').length
    const aRank = characters.filter((c) => c.rarity === 'A').length
    return { total, sRank, aRank }
  }, [characters])

  const compact = filters.viewMode === 'compact'

  return (
    <div className="space-y-7 pb-6">
      <Seo title="Characters" description="Browse NTE characters by element, rarity, arc type, role, and build direction." />
      <header className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
        <div className="max-w-2xl space-y-2">
          <h1 className="text-3xl font-bold tracking-tight text-[#111111] sm:text-4xl">Characters</h1>
          <p className="text-base leading-relaxed text-[#6b7280] sm:text-lg">
            Browse all characters and their details, builds, and more.
          </p>
        </div>

        <PageAdminActions className="lg:flex-col lg:items-end">
          <SummaryCounters
            className="w-full lg:w-auto"
            items={[
              { label: 'Characters', value: apiCountValue(apiMode, loading, error, stats.total.toLocaleString()) },
              { label: 'S', value: apiCountValue(apiMode, loading, error, stats.sRank.toLocaleString()), tone: 's' },
              { label: 'A', value: apiCountValue(apiMode, loading, error, stats.aRank.toLocaleString()), tone: 'a' },
            ]}
          />
          {effectiveAdminMode ? <AdminAddButton label="Add Character" onClick={onAdminAddCharacter} /> : null}
        </PageAdminActions>
      </header>

      <div className="space-y-2.5">
        <FilterControlBar
          resultCount={filtered.length}
          sortValue={filters.sortBy}
          sortOptions={SORT_OPTIONS}
          onSortChange={(sortBy) => updateFilters({ sortBy })}
          viewMode={filters.viewMode}
          onViewModeChange={(viewMode) => updateFilters({ viewMode })}
          onClearAll={clearAll}
        />

        <div ref={filterRef}>
          <CharacterFilters filters={filters} onUpdate={updateFilters} resultCount={filtered.length} sourceOptions={DISCOVERY_SOURCE_OPTIONS} />
        </div>
      </div>

      <CharacterMiniFilters show={showMiniFilters} filters={filters} onUpdate={updateFilters} />

      {loading ? (
        <EmptyState title="Loading characters" description="Fetching character data from the local API." />
      ) : error ? (
        <EmptyState title="Characters failed to load" description={apiFailureDescription(error, 'The local API did not return character data.')} action={<button type="button" onClick={reload} className="rounded-full bg-[#111111] px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-black">Retry</button>} />
      ) : filtered.length === 0 ? (
        <EmptyState title="No characters found" description="No characters match your filters. Try clearing a few filters or widening your search." />
      ) : (
        compact ? (
          <div className="space-y-2.5">
            {filtered.map((c) => (
              <CompactCharacterRow key={c.id} character={c} onOpenCharacter={onOpenCharacter} />
            ))}
          </div>
        ) : (
          <div className="dense-grid grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
            {filtered.map((c) => (
              <CharacterCard
                key={c.id}
                character={c}
                onOpenCharacter={onOpenCharacter}
                onAdminEdit={effectiveAdminMode ? onAdminEditCharacter : undefined}
              />
            ))}
          </div>
        )
      )}
    </div>
  )
}

function CompactCharacterRow({ character, onOpenCharacter }) {
  const element = getElementMeta(character.element)
  const arc = getArcTypeMeta(character.arcType)
  const rarity = getRarityMeta(character.rarity)
  const ElementIcon = element?.icon
  const ArcIcon = arc?.icon
  const portrait = getCharacterAsset(character.name) || character.portraitImageUrl
  const elementAssetIcon = getElementIcon(element?.label || character.element)
  const arcAssetIcon = getTypeIcon(arc?.label || character.arcType)
  const roles = [...new Set([...(character.roles || []), ...(character.tags || [])])].slice(0, 3)

  return (
    <button
      type="button"
      onClick={() => onOpenCharacter?.(character.id)}
      className="compact-row card-premium interactive-soft group grid w-full gap-3 rounded-[22px] p-3 text-left md:grid-cols-[58px_minmax(140px,1fr)_72px_116px_112px_minmax(150px,1.1fr)_auto] md:items-center"
    >
      <div className="h-14 w-14 overflow-hidden rounded-2xl border border-black/[0.05] bg-[#fafafa]">
        {portrait ? <img src={portrait} alt="" className="h-full w-full object-contain p-1" loading="lazy" /> : null}
      </div>
      <div className="min-w-0">
        <p className="truncate font-bold tracking-tight text-[#111111] transition group-hover:text-[#be123c]">{character.name}</p>
        <p className="line-clamp-1 text-xs text-[#6b7280]">{character.shortDescription || 'Data coming soon.'}</p>
      </div>
      <span
        className="w-fit rounded-full border px-2.5 py-1 text-[11px] font-bold"
        style={{ borderColor: `${rarity?.color || '#64748b'}55`, backgroundColor: `${rarity?.color || '#64748b'}18`, color: rarity?.id === 'S' ? '#92400e' : rarity?.id === 'A' ? '#7e22ce' : '#0369a1' }}
      >
        {rarity?.label || character.rarity}
      </span>
      <span className="inline-flex w-fit items-center gap-1.5 rounded-full border border-black/[0.06] bg-[#fafafa] px-2.5 py-1 text-xs font-semibold text-[#4b5563]">
        <GameIconBadge kind="element" value={element?.id} label={element?.label} assetIcon={elementAssetIcon} fallbackIcon={ElementIcon} size="sm" />
        {element?.label || character.element}
      </span>
      <span className="inline-flex w-fit items-center gap-1.5 rounded-full border border-black/[0.06] bg-[#fafafa] px-2.5 py-1 text-xs font-semibold text-[#4b5563]">
        <GameIconBadge kind="arc" value={arc?.id} label={arc?.label} assetIcon={arcAssetIcon} fallbackIcon={ArcIcon} size="sm" />
        {arc?.label || character.arcType}
      </span>
      <div className="flex flex-wrap gap-1.5">
        {roles.length ? roles.map((role) => (
          <span key={role} className="rounded-full bg-black/[0.03] px-2 py-1 text-[11px] font-semibold text-[#6b7280] ring-1 ring-black/[0.04]">{role}</span>
        )) : <span className="text-xs text-[#9ca3af]">Role pending</span>}
      </div>
      <span className="inline-flex items-center gap-1.5 text-sm font-semibold text-[#ff2f6d]">
        View
        <ArrowRight className="h-4 w-4 transition group-hover:translate-x-0.5" strokeWidth={1.8} />
      </span>
    </button>
  )
}

function CharacterMiniFilters({ show, filters, onUpdate }) {
  const toggleIn = (key, value) => {
    const arr = filters[key]
    onUpdate({ [key]: arr.includes(value) ? arr.filter((x) => x !== value) : [...arr, value] })
  }

  return (
    <div
      className={`fixed left-1/2 top-[92px] z-40 w-fit max-w-[calc(100vw-2rem)] -translate-x-1/2 transition duration-200 lg:left-[calc(50%+160px)] lg:max-w-[calc(100vw-24rem)] ${
        show ? 'translate-y-0 opacity-100' : 'pointer-events-none -translate-y-2 opacity-0'
      }`}
      aria-hidden={!show}
    >
      <div className="floating-glass overflow-x-auto rounded-full px-3 py-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        <div className="flex w-max items-center gap-1.5 lg:mx-auto">
        {['S', 'A'].map((rank) => (
          <button
            key={rank}
            type="button"
            onClick={() => toggleIn('rarities', rank)}
            className={`h-8 rounded-full border px-3 text-xs font-black transition ${
              filters.rarities.includes(rank)
                ? rank === 'S' ? 'border-amber-200 bg-amber-50 text-amber-700' : 'border-fuchsia-200 bg-fuchsia-50 text-fuchsia-700'
                : 'border-black/[0.06] bg-[#fafafa] text-[#6b7280] hover:bg-white'
            }`}
          >
            {rank}
          </button>
        ))}
        <Divider />
        {elementsMeta.map((meta) => {
          const active = filters.elements.includes(meta.id)
          return (
            <IconMiniButton
              key={meta.id}
              active={active}
              title={meta.label}
              onClick={() => toggleIn('elements', meta.id)}
            >
              <GameIconBadge kind="element" value={meta.id} label={meta.label} assetIcon={getElementIcon(meta.label)} fallbackIcon={meta.icon} size="sm" />
            </IconMiniButton>
          )
        })}
        <Divider />
        {arcTypesMeta.map((meta) => (
          <IconMiniButton
            key={meta.id}
            active={filters.arcs.includes(meta.id)}
            title={meta.label}
            onClick={() => toggleIn('arcs', meta.id)}
          >
            <GameIconBadge kind="arc" value={meta.id} label={meta.label} assetIcon={getTypeIcon(meta.label)} fallbackIcon={meta.icon} size="sm" />
          </IconMiniButton>
        ))}
        </div>
      </div>
    </div>
  )
}

function IconMiniButton({ active, title, onClick, children }) {
  return (
    <button
      type="button"
      onClick={onClick}
      title={title}
      className={`inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-full border transition ${
        active ? 'border-[#ff2f6d]/25 bg-[#fff1f5] text-[#be123c]' : 'border-black/[0.06] bg-[#fafafa] text-[#6b7280] hover:bg-white'
      }`}
    >
      {children}
    </button>
  )
}

function Divider() {
  return <span className="mx-1 h-5 w-px shrink-0 bg-black/[0.08]" aria-hidden />
}
