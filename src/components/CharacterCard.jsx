import { Pencil } from 'lucide-react'
import { getArcTypeMeta, getElementMeta, getRarityMeta } from '../data/gameMeta.jsx'
import { getCharacterAsset, getElementIcon, getTypeIcon } from '../utils/assetHelpers.js'
import { useAdminMode } from '../admin/AdminModeContext.jsx'
import GameIconBadge from './ui/GameIconBadge.jsx'
import CharacterPortrait from './CharacterPortrait.jsx'

const rarityAccent = {
  S: {
    border: 'border-amber-200/70',
    glow: 'rgba(245,158,11,0.22)',
    text: '#92400e',
    bg: '#fff7ed',
  },
  A: {
    border: 'border-fuchsia-200/70',
    glow: 'rgba(168,85,247,0.20)',
    text: '#7e22ce',
    bg: '#faf5ff',
  },
  B: {
    border: 'border-sky-200/70',
    glow: 'rgba(14,165,233,0.18)',
    text: '#0369a1',
    bg: '#f0f9ff',
  },
}

function statusBadge(character) {
  const status = character.statusBadge?.type || character.status || (character.showNewBadge === true ? 'new' : 'none')
  if (!status || status === 'none') return null
  if (status === 'version') {
    const label = character.statusBadge?.label || character.versionLabel || ''
    return label ? { label: label.startsWith('v') ? label : `v${label}`, tone: 'version' } : null
  }
  if (status === 'coming soon') return { label: 'Coming Soon', tone: 'soon' }
  if (status === 'unknown') return { label: 'Unknown Release', tone: 'unknown' }
  if (status === 'new') return { label: 'New', tone: 'new' }
  return null
}

function statusBadgeClass(tone) {
  const base = 'absolute right-3 top-3 z-10 rounded-full px-2.5 py-1 text-[10px] font-black uppercase tracking-wide shadow-sm ring-1'
  if (tone === 'new') return `${base} bg-[#ff2f6d] text-white ring-[#ff2f6d]/20`
  if (tone === 'soon') return `${base} bg-cyan-50 text-cyan-800 ring-cyan-100`
  if (tone === 'unknown') return `${base} bg-slate-100 text-slate-700 ring-slate-200`
  return `${base} bg-white/92 text-[#111111] ring-black/[0.08] backdrop-blur`
}

function rarityChipStyle(rarity) {
  if (rarity === 'S') {
    return {
      background: 'linear-gradient(135deg, rgba(255,255,255,0.92), rgba(254,243,199,0.78))',
      color: '#8a5b12',
      borderColor: 'rgba(245,158,11,0.22)',
      boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.85), 0 8px 18px rgba(245,158,11,0.10)',
    }
  }
  if (rarity === 'A') {
    return {
      background: 'linear-gradient(135deg, rgba(255,255,255,0.92), rgba(239,246,255,0.78))',
      color: '#475569',
      borderColor: 'rgba(148,163,184,0.22)',
      boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.85), 0 8px 18px rgba(148,163,184,0.08)',
    }
  }
  return {
    background: 'rgba(255,255,255,0.82)',
    color: '#0369a1',
    borderColor: 'rgba(14,165,233,0.18)',
    boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.85)',
  }
}

export default function CharacterCard({ character, onOpenCharacter, onAdminEdit }) {
  const { isAdminMode } = useAdminMode()
  const element = getElementMeta(character.element)
  const arc = getArcTypeMeta(character.arcType)
  const rarity = getRarityMeta(character.rarity)
  const ElementIcon = element?.icon
  const ArcIcon = arc?.icon
  const elementAssetIcon = getElementIcon(element?.label || character.element)
  const arcAssetIcon = getTypeIcon(arc?.label || character.arcType)
  const portrait = character.portrait || { from: '#f4f4f5', to: '#ffffff' }
  const portraitUrl = typeof character.portraitImageUrl === 'string' ? character.portraitImageUrl.trim() : ''
  const localAsset = getCharacterAsset(character.name)
  const resolvedImage = localAsset || portraitUrl
  const accent = rarityAccent[character.rarity] || rarityAccent.B
  const roleChips = [...new Set([...(character.roles || []), ...(character.tags || [])])].slice(0, 3)
  const badge = statusBadge(character)
  const hasElement = Boolean(element?.label || character.element)

  return (
    <article
      role="button"
      tabIndex={0}
      onClick={() => onOpenCharacter?.(character.id)}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault()
          onOpenCharacter?.(character.id)
        }
      }}
      className={[
        'card-premium interactive-soft group relative flex cursor-pointer flex-col overflow-hidden rounded-[24px] transition duration-300 outline-none focus-visible:ring-2 focus-visible:ring-[#ff2f6d]/35',
      ].join(' ')}
    >
      {badge ? (
        <span className={statusBadgeClass(badge.tone)}>
          {badge.label}
        </span>
      ) : null}

      <div
        className="relative mx-3 mt-3 h-44 overflow-hidden rounded-[20px] border border-black/[0.04] sm:h-48"
      >
        <div
          className="absolute inset-0"
          style={{
            background: `radial-gradient(circle at 50% 48%, ${accent.glow}, transparent 64%), linear-gradient(145deg, #ffffff, ${accent.bg})`,
          }}
          aria-hidden
        />
        <CharacterPortrait src={resolvedImage} name={character.name} localAsset={Boolean(localAsset)} portrait={portrait} className="absolute inset-0" imageClassName={localAsset ? 'p-1' : ''} />
        {isAdminMode ? (
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation()
              onAdminEdit?.(character.id)
            }}
            className="control-glass absolute bottom-2 right-2 z-20 flex h-8 w-8 cursor-pointer items-center justify-center rounded-xl text-[#6b7280] transition duration-200 hover:-translate-y-0.5 hover:bg-white hover:text-[#111111] hover:shadow-md"
            aria-label="Edit character"
          >
            <Pencil className="h-3.5 w-3.5" strokeWidth={2} />
          </button>
        ) : null}
      </div>

      <div className="flex flex-1 flex-col space-y-2.5 p-4">
        <div className="min-w-0">
          <h3 className="truncate text-[16px] font-bold tracking-tight text-[#111111] transition group-hover:text-[#be123c]">{character.name}</h3>
          <p className="mt-1 line-clamp-2 text-xs leading-relaxed text-[#6b7280]">{character.shortDescription}</p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <span
            className="rounded-full border px-2.5 py-1 text-[11px] font-bold backdrop-blur"
            style={rarityChipStyle(character.rarity)}
          >
            {rarity?.label || character.rarity}
          </span>
          {hasElement ? (
            <span className="inline-flex items-center gap-1.5 rounded-full bg-black/[0.03] px-2 py-1 text-[11px] font-semibold text-[#6b7280] ring-1 ring-black/[0.04]">
              <GameIconBadge kind="element" value={element?.id} label={element?.label} assetIcon={elementAssetIcon} fallbackIcon={ElementIcon} size="sm" />
              {element?.label || character.element}
            </span>
          ) : isAdminMode ? (
            <span className="rounded-full bg-black/[0.03] px-2 py-1 text-[11px] font-semibold text-[#9ca3af] ring-1 ring-black/[0.04]">
              Unknown element
            </span>
          ) : null}
          <span className="inline-flex items-center gap-1.5 rounded-full bg-black/[0.03] px-2 py-1 text-[11px] font-semibold text-[#6b7280] ring-1 ring-black/[0.04]">
            <GameIconBadge kind="arc" value={arc?.id} label={arc?.label} assetIcon={arcAssetIcon} fallbackIcon={ArcIcon} size="sm" />
            {arc?.label || character.arcType}
          </span>
          {roleChips.map((role) => (
            <span key={role} className="rounded-full bg-black/[0.03] px-2 py-1 text-[11px] font-semibold text-[#6b7280] ring-1 ring-black/[0.04]">
              {role}
            </span>
          ))}
        </div>
      </div>
    </article>
  )
}
