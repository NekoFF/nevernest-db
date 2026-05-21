import { useMemo, useCallback } from 'react'
import { getElementMeta, getRarityMeta } from '../data/gameMeta.jsx'
import { getCharacterAsset, getElementIcon } from '../utils/assetHelpers.js'
import { SECTION_FALLBACKS } from '../data/characterSchema.js'
import { useAdminMode } from '../admin/AdminModeContext.jsx'
import { normalizeTeams } from '../data/teamBlocks.js'
import CharacterPortrait from './CharacterPortrait.jsx'
import GameIconBadge from './ui/GameIconBadge.jsx'

const PLACEHOLDER = 'Data coming soon'

function useCharacterMap() {
  const { mergedCharacters } = useAdminMode()
  return useMemo(() => {
    const map = new Map()
    mergedCharacters.forEach((character) => {
      ;[character.id, character.slug, character.name].filter(Boolean).forEach((key) => {
        map.set(String(key).toLowerCase(), character)
      })
    })
    return map
  }, [mergedCharacters])
}

function Avatar({ character, fallbackName, size = 'lg', onClick }) {
  const element = character ? getElementMeta(character.element) : null
  const rarity = character ? getRarityMeta(character.rarity) : null
  const portrait = character?.portrait || { from: '#f4f4f5', to: '#ffffff' }
  const portraitUrl = typeof character?.portraitImageUrl === 'string' ? character.portraitImageUrl.trim() : ''
  const localAsset = getCharacterAsset(character?.name)
  const resolvedImage = localAsset || portraitUrl
  const clickable = Boolean(character && onClick)
  const dimensions = size === 'sm' ? 'h-[82px] w-[82px] rounded-[24px]' : size === 'xl' ? 'h-28 w-24 rounded-[26px]' : 'h-24 w-24 rounded-[26px]'

  const content = (
    <span
      className={[
        'relative flex shrink-0 items-center justify-center overflow-hidden border border-black/[0.06] shadow-sm',
        dimensions,
        clickable ? 'transition hover:-translate-y-0.5 hover:shadow-md' : '',
      ].join(' ')}
    >
      {rarity ? <span className="absolute inset-[-20%] opacity-40 blur-xl" style={{ backgroundColor: rarity.color }} aria-hidden /> : null}
      {element ? <span className="absolute inset-0 opacity-35" style={{ background: `radial-gradient(circle at 50% 50%, ${element.color}22, transparent 70%)` }} aria-hidden /> : null}
      <CharacterPortrait src={resolvedImage} name={character?.name || fallbackName} localAsset={Boolean(localAsset)} portrait={portrait} className="absolute inset-0" imageClassName={localAsset ? 'p-0.5' : ''} />
    </span>
  )

  if (!clickable) return content

  return (
    <button type="button" onClick={() => onClick(character.id)} className="rounded-[20px] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#ff2f6d]/35">
      {content}
    </button>
  )
}

function SynergyCard({ synergy, onOpenCharacter, resolveCharacter }) {
  const resolved = resolveCharacter(synergy.characterId || synergy.name)
  const element = resolved ? getElementMeta(resolved.element) : null
  const ElementIcon = element?.icon
  const elementAssetIcon = getElementIcon(element?.label || resolved?.element)
  const displayName = synergy.name || resolved?.name || PLACEHOLDER
  const roleLabel = synergy.roleLabel || PLACEHOLDER
  if (!resolved) {
    return (
      <article className="card-premium rounded-3xl p-5">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div className="min-w-0">
            <h3 className="break-words font-semibold text-[#111111]">{displayName}</h3>
            <p className="mt-2 text-sm leading-6 text-[#6b7280]">—</p>
          </div>
        </div>
        {synergy.notes?.length ? (
          <ul className="mt-4 space-y-2 border-t border-black/[0.05] pt-4 text-sm leading-relaxed text-[#6b7280]">
            {synergy.notes.map((note) => (
              <li key={note} className="flex gap-2">
                <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-amber-500" aria-hidden />
                <span>{note}</span>
              </li>
            ))}
          </ul>
        ) : null}
      </article>
    )
  }

  const content = (
    <>
      <div className="flex min-h-[96px] items-start gap-4">
        <Avatar character={resolved} fallbackName={displayName} />
        <div className="min-w-0">
          <h3 className="font-semibold text-[#111111]">{resolved?.name || displayName}</h3>
          <div className="mt-2 flex flex-wrap gap-2">
            <span className="rounded-full bg-[#ff2f6d]/10 px-2.5 py-1 text-[11px] font-semibold text-[#be123c] ring-1 ring-[#ff2f6d]/15">{roleLabel}</span>
            {element ? (
              <span className="inline-flex items-center gap-1.5 rounded-full bg-[#fafafa] px-2.5 py-1 text-[11px] font-semibold text-[#6b7280] ring-1 ring-black/[0.05]">
                <GameIconBadge kind="element" value={element.id} label={element.label} assetIcon={elementAssetIcon} fallbackIcon={ElementIcon} size="sm" />
                {element.label}
              </span>
            ) : null}
          </div>
        </div>
      </div>
      {synergy.notes?.length ? (
        <ul className="mt-4 space-y-2 border-t border-black/[0.05] pt-4 text-sm leading-relaxed text-[#6b7280]">
          {synergy.notes.map((note) => (
            <li key={note} className="flex gap-2">
              <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-[#ff2f6d]/70" aria-hidden />
              <span>{note}</span>
            </li>
          ))}
        </ul>
      ) : (
        <p className="mt-4 text-sm text-[#9ca3af]">{PLACEHOLDER}</p>
      )}
    </>
  )

  if (resolved && onOpenCharacter) {
    return (
      <button
        type="button"
        onClick={() => onOpenCharacter(resolved.id)}
        className="card-premium interactive-soft w-full rounded-3xl p-5 text-left transition"
      >
        {content}
      </button>
    )
  }

  return (
    <article className="card-premium rounded-3xl p-5">
      {content}
    </article>
  )
}

function TeamMemberAvatar({ member, onOpenCharacter, resolveCharacter }) {
  const resolved = resolveCharacter(member.characterId || member.name)
  const element = resolved ? getElementMeta(resolved.element) : null
  const ElementIcon = element?.icon
  const elementAssetIcon = getElementIcon(element?.label || resolved?.element)
  const displayName = member.name || resolved?.name || PLACEHOLDER
  const content = (
    <>
      <div className="flex justify-center">
        <Avatar character={resolved} fallbackName={displayName} size="xl" />
      </div>
      <p className="mt-2 text-sm font-semibold text-[#111111]">{resolved?.name || displayName}</p>
      <div className="mt-2 flex flex-wrap items-center justify-center gap-1.5">
        {element ? <GameIconBadge kind="element" value={element.id} label={element.label} assetIcon={elementAssetIcon} fallbackIcon={ElementIcon} size="sm" /> : null}
        <span className="inline-flex rounded-full bg-white px-2.5 py-1 text-[11px] font-semibold text-[#6b7280] ring-1 ring-black/[0.05]">{member.role || PLACEHOLDER}</span>
      </div>
      {member.note ? <p className="mt-2 text-xs leading-relaxed text-[#9ca3af]">{member.note}</p> : null}
    </>
  )

  if (resolved && onOpenCharacter) {
    return (
      <button
        type="button"
        onClick={() => onOpenCharacter(resolved.id)}
        className="w-full rounded-2xl bg-white/72 p-3 text-center ring-1 ring-black/[0.05] transition hover:-translate-y-0.5 hover:bg-white hover:shadow-sm"
      >
        {content}
      </button>
    )
  }

  return (
    <div className="rounded-2xl bg-white/72 p-3 text-center ring-1 ring-black/[0.05]">
      {content}
    </div>
  )
}

function TeamCompCard({ team, onOpenCharacter, resolveCharacter }) {
  return (
    <article className="relative overflow-hidden rounded-3xl border border-white/80 bg-white/88 p-5 shadow-[0_18px_54px_rgba(20,184,166,0.08)] ring-1 ring-black/[0.03] backdrop-blur">
      <div className="pointer-events-none absolute -right-16 -top-20 h-48 w-48 rounded-full bg-[radial-gradient(circle,rgba(20,184,166,0.16),rgba(255,47,109,0.08)_45%,transparent_70%)] blur-2xl" aria-hidden />
      <div className="relative flex flex-wrap items-center gap-2">
        <h3 className="text-lg font-semibold text-[#111111]">{team.title}</h3>
        {team.badge ? <span className="rounded-full bg-cyan-50 px-2.5 py-1 text-[11px] font-semibold text-cyan-800 ring-1 ring-cyan-100">{team.badge}</span> : null}
        {team.tag ? <span className="rounded-full bg-white/80 px-2.5 py-1 text-[11px] font-semibold text-[#6b7280] ring-1 ring-black/[0.05]">{team.tag}</span> : null}
      </div>

      <div className="relative mt-4 rounded-[26px] border border-black/[0.05] bg-white/56 p-3 shadow-inner">
        <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        {(team.members || []).map((member) => (
          <TeamMemberAvatar
            key={`${team.id}-${member.characterId || member.name || member.slot}`}
            member={member}
            onOpenCharacter={onOpenCharacter}
            resolveCharacter={resolveCharacter}
          />
        ))}
        </div>
      </div>

      <p className="relative mt-4 border-t border-black/[0.05] pt-4 text-sm leading-relaxed text-[#6b7280]">{team.description || PLACEHOLDER}</p>

      <div className="relative mt-5 grid gap-4 lg:grid-cols-2">
        <ListBlock title="Rotation" items={team.rotation} />
        <ListBlock title="Alternatives" items={team.alternatives} />
      </div>
    </article>
  )
}

function ListBlock({ title, items }) {
  return (
    <div className="rounded-2xl bg-[#fafafa] p-4 ring-1 ring-black/[0.04]">
      <h4 className="text-xs font-semibold uppercase tracking-wide text-[#6b7280]">{title}</h4>
      {items?.length ? (
        <ul className="mt-3 space-y-2 text-sm leading-relaxed text-[#6b7280]">
          {items.map((item) => (
            <li key={item} className="flex gap-2">
              <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-[#ff2f6d]/70" aria-hidden />
              <span>{item}</span>
            </li>
          ))}
        </ul>
      ) : (
        <p className="mt-3 text-sm text-[#9ca3af]">{PLACEHOLDER}</p>
      )}
    </div>
  )
}

export default function TeamSection({ character, teams, onOpenCharacter, isAdminMode = false, onEditTeams }) {
  const characterMap = useCharacterMap()
  const resolveCharacter = useCallback((id) => (id ? characterMap.get(String(id).toLowerCase()) : null), [characterMap])
  const normalizedTeams = normalizeTeams(teams ?? character)
  const synergies = normalizedTeams.synergies.filter((synergy) => synergy.enabled !== false)
  const teamList = normalizedTeams.recommendedTeams.filter((team) => team.enabled !== false)
  const hasAnyTeamsData = synergies.length || teamList.length

  return (
    <div className="space-y-8">
      {isAdminMode ? (
        <div className="flex justify-end">
          <button
            type="button"
            onClick={onEditTeams}
            className="inline-flex items-center gap-2 rounded-full border border-black/[0.08] bg-white px-4 py-2 text-sm font-semibold text-[#111111] shadow-sm transition hover:bg-[#fafafa]"
          >
            Edit Teams
          </button>
        </div>
      ) : null}
      {!hasAnyTeamsData ? (
        <p className="rounded-3xl border border-dashed border-black/[0.08] bg-white/80 px-6 py-8 text-sm text-[#6b7280]">{SECTION_FALLBACKS.teams}</p>
      ) : null}
      {hasAnyTeamsData ? <section className="space-y-3">
        <h3 className="text-sm font-semibold uppercase tracking-wide text-[#6b7280]">Recommended Teams</h3>
        {teamList.length ? (
          <div className="space-y-4">
            {teamList.map((team) => (
              <TeamCompCard key={team.id || team.name} team={team} onOpenCharacter={onOpenCharacter} resolveCharacter={resolveCharacter} />
            ))}
          </div>
        ) : (
          <p className="rounded-3xl border border-dashed border-black/[0.08] bg-white/80 px-6 py-8 text-sm text-[#6b7280]">{SECTION_FALLBACKS.teams}</p>
        )}
      </section> : null}

      {hasAnyTeamsData ? <section className="space-y-3">
        <h3 className="text-sm font-semibold uppercase tracking-wide text-[#6b7280]">Synergies</h3>
        {synergies.length ? (
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {synergies.map((synergy) => (
              <SynergyCard
                key={synergy.characterId || synergy.name}
                synergy={synergy}
                onOpenCharacter={onOpenCharacter}
                resolveCharacter={resolveCharacter}
              />
            ))}
          </div>
        ) : (
          <p className="rounded-3xl border border-dashed border-black/[0.08] bg-white/80 px-6 py-8 text-sm text-[#6b7280]">{SECTION_FALLBACKS.teams}</p>
        )}
      </section> : null}
    </div>
  )
}
