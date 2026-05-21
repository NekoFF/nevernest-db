import { Component, useState } from 'react'
import { SECTION_FALLBACKS } from '../data/characterSchema.js'
import { hasBuildData, normalizeBuild, resolveBuildCartridgeReferences, resolveBuildWeaponReferencesFromList } from '../data/buildBlocks.js'
import { getStatById } from '../data/stats.js'
import { getCartridgeById } from '../data/cartridges.js'
import { useAdminMode } from '../admin/AdminModeContext.jsx'
import { badgeClass, weaponInitials } from './weapons/weaponStyle.js'
import CartridgeIcon from './cartridges/CartridgeIcon.jsx'
import ModuleShape from './ModuleShape.jsx'
import { categoryBadgeClass, rarityBadgeClass } from './cartridges/cartridgeStyle.js'
import { getWeaponAsset } from '../utils/assetHelpers.js'
import { getCartridgeModuleShapeRefs } from '../utils/moduleShapeRefs.js'
import { getElementMeta } from '../data/gameMeta.jsx'

const PLACEHOLDER = 'Data coming soon'

function EmptyBlock() {
  return (
    <p className="rounded-2xl border border-dashed border-black/[0.08] bg-white/80 px-4 py-5 text-sm text-[#9ca3af]">
      {PLACEHOLDER}
    </p>
  )
}

function RankRow({ item }) {
  return (
    <div className="flex gap-4 rounded-2xl border border-black/[0.06] bg-white px-4 py-3 shadow-sm">
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#fafafa] text-sm font-bold text-[#ff2f6d] ring-1 ring-black/[0.05]">
        #{item.rank}
      </div>
      {item.icon ? (
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#fafafa] text-lg ring-1 ring-black/[0.05]">
          {item.icon}
        </div>
      ) : null}
      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center gap-2">
          <p className="font-semibold text-[#111111]">{item.name}</p>
          {item.refinement || item.level ? (
            <span className="rounded-full bg-[#fafafa] px-2 py-0.5 text-[11px] font-semibold text-[#6b7280] ring-1 ring-black/[0.05]">
              {item.refinement || item.level}
            </span>
          ) : null}
          {item.teamScore ? (
            <span className="rounded-full bg-cyan-50 px-2 py-0.5 text-[11px] font-semibold text-cyan-800 ring-1 ring-cyan-100">
              {item.teamScore}
            </span>
          ) : null}
          {item.badge ? (
            <span className="rounded-full bg-black/[0.04] px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-[#6b7280]">
              {item.badge}
            </span>
          ) : null}
        </div>
        <p className="mt-1 text-sm leading-relaxed text-[#6b7280]">{item.description || item.note || PLACEHOLDER}</p>
      </div>
    </div>
  )
}

function WeaponRecommendationRow({ item, onOpenWeapon, accentColor = '#14b8a6' }) {
  const weapon = item.weapon
  if (!weapon) {
    return (
      <div className="rounded-2xl border border-dashed border-black/[0.08] bg-white px-4 py-3 text-sm text-[#6b7280]">
        Unknown weapon: <span className="font-semibold text-[#111111]">{item.weaponId}</span>
      </div>
    )
  }

  const preview = item.note || weapon.shortDescription || weapon.refinements?.[0]?.effect || weapon.quote || PLACEHOLDER
  const image = getWeaponAsset(weapon.name) || weapon.icon || weapon.image || ''

  return (
    <button type="button" onClick={() => onOpenWeapon?.(weapon.slug || weapon.id)} className="grid w-full gap-3 rounded-2xl border border-black/[0.06] bg-white/92 px-4 py-3 text-left shadow-sm transition hover:-translate-y-0.5 hover:shadow-[0_18px_54px_rgba(0,0,0,0.07)] sm:grid-cols-[52px_minmax(0,1fr)]" style={{ '--recommendation-accent': accentColor }}>
      {image ? (
        <div className="h-12 w-12 overflow-hidden rounded-2xl bg-[#fafafa] ring-1 ring-black/[0.05]">
          <img src={image} alt={weapon.name} className="h-full w-full object-contain p-1.5" loading="lazy" />
        </div>
      ) : (
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[radial-gradient(circle_at_20%_20%,rgba(255,47,109,0.15),transparent_38%),radial-gradient(circle_at_80%_25%,rgba(6,182,212,0.14),transparent_34%),linear-gradient(135deg,#ffffff,#f5f5f4)] text-sm font-bold text-[#111111] ring-1 ring-black/[0.05]">
          {weaponInitials(weapon.name)}
        </div>
      )}
      <div className="min-w-0">
        <div className="flex flex-wrap items-center gap-2">
          <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-[#fafafa] text-xs font-bold ring-1 ring-black/[0.05]" style={{ color: accentColor }}>
            #{item.priority}
          </span>
          <p className="font-semibold text-[#111111]">{weapon.name}</p>
          <span className={badgeClass('rarity', weapon.rarity)}>{weapon.rarity}</span>
          <span className={badgeClass('type', weapon.type)}>{weapon.type}</span>
          {item.label ? (
            <span className="rounded-full bg-black/[0.04] px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-[#6b7280]">
              {item.label}
            </span>
          ) : null}
          {item.refinement ? (
            <span className="rounded-full bg-[#fafafa] px-2 py-0.5 text-[11px] font-semibold text-[#6b7280] ring-1 ring-black/[0.05]">
              {item.refinement}
            </span>
          ) : null}
        </div>
        <div className="mt-2 flex flex-wrap gap-2">
          <span className="rounded-full bg-[#fafafa] px-2.5 py-1 text-xs font-semibold text-[#6b7280] ring-1 ring-black/[0.05]">
            {weapon.mainStat?.type}: {weapon.mainStat?.value}
          </span>
          <span className="rounded-full bg-[#fafafa] px-2.5 py-1 text-xs font-semibold text-[#6b7280] ring-1 ring-black/[0.05]">
            {weapon.subStat?.type}: {weapon.subStat?.value}
          </span>
        </div>
        <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-[#6b7280]">{preview}</p>
      </div>
    </button>
  )
}

function CartridgeRecommendationRow({ item, onOpenCartridge, accentColor = '#14b8a6' }) {
  const cartridge = item.cartridge
  if (!cartridge) {
    return (
      <div className="rounded-2xl border border-dashed border-black/[0.08] bg-white px-4 py-3 text-sm text-[#6b7280]">
        Missing cartridge data: <span className="font-semibold text-[#111111]">{item.cartridgeId}</span>
      </div>
    )
  }

  const rarity = item.rarity || 'S'
  const preview = item.note || cartridge.bonuses?.find((bonus) => bonus.pieces === 4)?.text || PLACEHOLDER

  return (
    <button type="button" onClick={() => onOpenCartridge?.(cartridge.slug || cartridge.id)} className="grid w-full gap-3 rounded-2xl border border-black/[0.06] bg-white/92 px-4 py-3 text-left shadow-sm transition hover:-translate-y-0.5 hover:shadow-[0_18px_54px_rgba(0,0,0,0.07)] sm:grid-cols-[52px_minmax(0,1fr)]">
      <CartridgeIcon cartridge={cartridge} rarity={rarity} className="h-12 w-12" />
      <div className="min-w-0">
        <div className="flex flex-wrap items-center gap-2">
          <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-[#fafafa] text-xs font-bold ring-1 ring-black/[0.05]" style={{ color: accentColor }}>
            #{item.priority}
          </span>
          <p className="font-semibold text-[#111111]">{cartridge.name}</p>
          <span className={`rounded-full border px-2 py-0.5 text-[10px] font-bold ${rarityBadgeClass(rarity)}`}>{rarity}</span>
          <span className={`rounded-full border px-2 py-0.5 text-[10px] font-bold capitalize ${categoryBadgeClass(cartridge.bonusCategory)}`}>{cartridge.bonusCategory}</span>
          {item.label ? (
            <span className="rounded-full bg-black/[0.04] px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-[#6b7280]">
              {item.label}
            </span>
          ) : null}
        </div>
        <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-[#6b7280]">{preview}</p>
      </div>
    </button>
  )
}

function PriorityCard({ title, items }) {
  const normalized = (items || []).map((item) => {
    if (typeof item === 'string') return { label: item }
    const stat = getStatById(item?.statId)
    return {
      label: stat?.name || item?.label || item?.name || PLACEHOLDER,
      caption: stat ? stat.displayName : item?.note || '',
      note: item?.note || '',
    }
  })

  return (
    <section className="rounded-3xl border border-black/[0.06] bg-white p-5 shadow-[0_16px_48px_rgba(0,0,0,0.05)]">
      <h3 className="text-sm font-semibold text-[#111111]">{title}</h3>
      {normalized.length ? (
        <div className="mt-4 flex flex-wrap items-center gap-2 text-sm font-semibold text-[#111111]">
          {normalized.map((item, index) => (
            <span key={`${title}-${item.label}-${index}`} className="inline-flex items-center gap-2">
              <span className="rounded-full bg-[#fafafa] px-3 py-1.5 ring-1 ring-black/[0.05]" title={item.note || item.caption || undefined}>{item.label}</span>
              {index < normalized.length - 1 ? <span className="text-[#9ca3af]">&gt;</span> : null}
            </span>
          ))}
        </div>
      ) : (
        <div className="mt-4">
          <EmptyBlock />
        </div>
      )}
    </section>
  )
}

function normalizeShapePieces(cartridge, fallbackPieces = []) {
  return getCartridgeModuleShapeRefs(cartridge, fallbackPieces).map((piece) => ({
    ...piece,
    moduleType: piece.moduleType || PLACEHOLDER,
  }))
}

function ConsoleSetupSummary({ setup, onOpenConsole, onOpenModule, onOpenCartridge }) {
  const { mergedCartridges } = useAdminMode()
  if (!setup) return null
  const cartridgeKey = setup.mainCartridgeId || String(setup.mainCartridgeName || setup.mainCartridge || '').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '')
  const cartridge = mergedCartridges?.find((item) => item.id === cartridgeKey || item.slug === cartridgeKey) || getCartridgeById(cartridgeKey)
  const pieces = normalizeShapePieces(cartridge, setup.requiredPieces || [])

  return (
    <section className="space-y-3">
      <h3 className="text-sm font-semibold uppercase tracking-wide text-[#6b7280]">Recommended Cartridge Setup</h3>
      <div className="rounded-3xl border border-black/[0.06] bg-white p-5 shadow-[0_16px_48px_rgba(0,0,0,0.05)]">
        <div className="grid gap-3 lg:grid-cols-2">
          <button type="button" disabled={!cartridge || !onOpenCartridge} onClick={() => onOpenCartridge?.(cartridge.slug || cartridge.id)} className="rounded-2xl bg-[#fafafa] px-4 py-3 text-left ring-1 ring-black/[0.04] transition enabled:hover:-translate-y-0.5 enabled:hover:bg-white enabled:hover:shadow-sm disabled:cursor-default">
            <p className="text-[11px] font-semibold uppercase tracking-wide text-[#9ca3af]">Main Cartridge</p>
            <p className="mt-1 text-sm font-semibold text-[#111111]">{cartridge?.name || setup.mainCartridgeName || setup.mainCartridge || PLACEHOLDER}</p>
          </button>
          <div className="rounded-2xl bg-[#fafafa] px-4 py-3 ring-1 ring-black/[0.04]">
            <p className="text-[11px] font-semibold uppercase tracking-wide text-[#9ca3af]">Console Trait</p>
            <p className="mt-1 text-sm font-semibold text-[#111111]">{setup.description || setup.consoleTrait || PLACEHOLDER}</p>
          </div>
        </div>

        {pieces.length ? (
          <div className="mt-5">
            <p className="mb-2 text-[11px] font-semibold uppercase tracking-wide text-[#9ca3af]">Compatible Modules</p>
            <div className="flex flex-wrap gap-2">
              {pieces.map((piece, index) => (
                <button key={`${piece.moduleShapeId || 'pending'}-${index}`} type="button" disabled={!piece.moduleShapeId || !onOpenModule} onClick={() => onOpenModule?.(piece.moduleShapeId, 'S')} className="inline-flex items-center gap-2 rounded-full bg-[#fafafa] px-3 py-1.5 text-xs font-semibold text-[#6b7280] ring-1 ring-black/[0.05] transition enabled:hover:-translate-y-0.5 enabled:hover:bg-white enabled:hover:text-[#be123c] enabled:hover:shadow-sm disabled:cursor-default">
                  {piece.moduleShapeId ? <ModuleShape shapeId={piece.moduleShapeId} rarity="S" size={7} compact /> : null}
                  {piece.moduleType}
                </button>
              ))}
            </div>
          </div>
        ) : null}

        <button
          type="button"
          onClick={onOpenConsole}
          className="mt-5 inline-flex rounded-full border border-black/[0.06] bg-white px-4 py-2 text-sm font-semibold text-[#111111] shadow-sm transition hover:bg-[#fafafa]"
        >
          Open Cartridge Setup
        </button>
      </div>
    </section>
  )
}

class BuildSectionErrorBoundary extends Component {
  constructor(props) {
    super(props)
    this.state = { error: null }
  }

  static getDerivedStateFromError(error) {
    return { error }
  }

  componentDidUpdate(prevProps) {
    if (prevProps.build !== this.props.build && this.state.error) {
      this.setState({ error: null })
    }
  }

  componentDidCatch(error) {
    if (import.meta?.env?.DEV) {
      console.warn('[BuildData] Build section render failed', error)
    }
  }

  render() {
    if (this.state.error) {
      return (
        <div className="rounded-3xl border border-dashed border-black/[0.08] bg-white/80 px-6 py-8 text-sm text-[#6b7280]">
          Build data could not be loaded. Please edit or reset this build.
        </div>
      )
    }

    return this.props.children
  }
}

export default function BuildSection(props) {
  return (
    <BuildSectionErrorBoundary build={props.build}>
      <BuildSectionContent {...props} />
    </BuildSectionErrorBoundary>
  )
}

function RecommendationSection({ title, rows, kind, onOpenWeapon, onOpenCartridge, accentColor }) {
  const [expanded, setExpanded] = useState(false)
  const visibleRows = expanded ? rows : rows.slice(0, 2)
  const hasMore = rows.length > 2
  const noun = kind === 'cartridge' ? 'cartridges' : 'weapons'

  const glowStyle = kind === 'cartridge'
    ? { right: '-5rem', top: '-6rem', width: '13rem', height: '13rem', opacity: 0.1 }
    : { left: '-4rem', top: '-5rem', width: '12rem', height: '12rem', opacity: 0.12 }

  return (
    <section className="relative space-y-3 overflow-hidden rounded-3xl border border-white/70 bg-white/55 p-4 shadow-[0_16px_48px_rgba(0,0,0,0.045)]">
      <div className="pointer-events-none absolute rounded-full blur-3xl" style={{ backgroundColor: accentColor, ...glowStyle }} aria-hidden />
      <h3 className="relative text-sm font-semibold uppercase tracking-wide text-[#6b7280]">{title}</h3>
      <div className="relative space-y-2">
        {visibleRows.length
          ? visibleRows.map((row, idx) =>
              kind === 'cartridge'
                ? <CartridgeRecommendationRow key={`${title}-${idx}`} item={row} onOpenCartridge={onOpenCartridge} accentColor={accentColor} />
                : kind === 'weapon'
                  ? <WeaponRecommendationRow key={`${title}-${idx}`} item={row} onOpenWeapon={onOpenWeapon} accentColor={accentColor} />
                  : <RankRow key={`${title}-${idx}`} item={row} />,
            )
          : <EmptyBlock />}
      </div>
      {hasMore ? (
        <button
          type="button"
          onClick={() => setExpanded((current) => !current)}
          className="relative inline-flex rounded-full border border-black/[0.06] bg-white/85 px-4 py-2 text-sm font-semibold text-[#111111] shadow-sm transition hover:-translate-y-0.5 hover:bg-white"
        >
          {expanded ? `Show fewer ${noun}` : `Show more ${noun}`}
        </button>
      ) : null}
    </section>
  )
}

function BuildSectionContent({ build, consoleSetup, onOpenConsole, onOpenWeapon, onOpenCartridge, onOpenModule, element }) {
  const { mergedCartridges, mergedWeapons } = useAdminMode()
  const accentColor = getElementMeta(element)?.color || '#14b8a6'
  if (!build || !hasBuildData(build)) {
    return consoleSetup ? (
      <div className="space-y-8">
        <ConsoleSetupSummary setup={consoleSetup} onOpenConsole={onOpenConsole} onOpenCartridge={onOpenCartridge} onOpenModule={onOpenModule} />
      </div>
    ) : (
      <p className="rounded-3xl border border-dashed border-black/[0.08] bg-white/80 px-6 py-8 text-sm text-[#6b7280]">{SECTION_FALLBACKS.build}</p>
    )
  }

  const normalizedBuild = normalizeBuild(build)
  const weaponRefs = resolveBuildWeaponReferencesFromList(build, mergedWeapons).recommendedWeaponRefs
  const cartridgeRefs = resolveBuildCartridgeReferences(build, mergedCartridges).recommendedCartridgeRefs
  const bestArcs = weaponRefs.length ? weaponRefs : normalizedBuild.weapons.filter((item) => item.enabled !== false)
  const bestCartridges = cartridgeRefs.length ? cartridgeRefs : normalizedBuild.cartridges.filter((item) => item.enabled !== false)
  const mainStats = normalizedBuild.mainStats
  const subStats = normalizedBuild.subStats
  const endgame = normalizedBuild.endgameStats.filter((item) => item.enabled !== false)
  const priority = normalizedBuild.skillPriority
  const notes = normalizedBuild.notes.filter((item) => item.enabled !== false)
  const videoGuides = []

  const hasAny =
    bestArcs.length ||
    bestCartridges.length ||
    mainStats.length ||
    subStats.length ||
    endgame.length ||
    priority.length ||
    notes.length ||
    videoGuides.length ||
    consoleSetup

  if (!hasAny) {
    return <p className="rounded-3xl border border-dashed border-black/[0.08] bg-white/80 px-6 py-8 text-sm text-[#6b7280]">{SECTION_FALLBACKS.build}</p>
  }

  return (
    <div className="space-y-8">
      <RecommendationSection title="Best Arcs / Weapons" rows={bestArcs} kind={weaponRefs.length > 0 ? 'weapon' : 'rank'} onOpenWeapon={onOpenWeapon} accentColor={accentColor} />
      <RecommendationSection title="Best Cartridges / Module Sets" rows={bestCartridges} kind={cartridgeRefs.length > 0 ? 'cartridge' : 'rank'} onOpenCartridge={onOpenCartridge} accentColor={accentColor} />

      {mainStats.length || subStats.length ? (
        <section className="space-y-3">
          <h3 className="text-sm font-semibold uppercase tracking-wide text-[#6b7280]">Best Stats</h3>
          <div className="grid gap-4 lg:grid-cols-2">
            {mainStats.length ? <PriorityCard title="Main Stats priority" items={mainStats} /> : null}
            {subStats.length ? <PriorityCard title="Sub Stats priority" items={subStats} /> : null}
          </div>
        </section>
      ) : null}

      {endgame.length ? (
        <section className="space-y-3">
          <h3 className="text-sm font-semibold uppercase tracking-wide text-[#6b7280]">Recommended Endgame Stats</h3>
          <div className="flex flex-wrap gap-2">
            {endgame.map((stat, index) => (
              <div key={`${stat.label}-${index}`} className="rounded-2xl border border-black/[0.06] bg-white px-4 py-3 shadow-sm">
                <p className="text-[11px] font-semibold uppercase tracking-wide text-[#6b7280]">{getStatById(stat.statId)?.name || stat.label}</p>
                <p className="mt-1 text-lg font-bold tracking-tight text-[#111111]">{stat.targetValue || stat.value}</p>
                {stat.note ? <p className="mt-1 text-xs text-[#6b7280]">{stat.note}</p> : null}
              </div>
            ))}
          </div>
        </section>
      ) : null}

      {priority.length ? (
        <section className="space-y-3">
          <h3 className="text-sm font-semibold uppercase tracking-wide text-[#6b7280]">Skill Priority</h3>
          <div className="flex flex-wrap items-center gap-2 rounded-3xl border border-black/[0.06] bg-white p-4 text-sm font-semibold text-[#111111] shadow-[0_16px_48px_rgba(0,0,0,0.05)]">
            {priority.map((item, index) => (
              <span key={`${item}-${index}`} className="inline-flex items-center gap-2">
                <span className="rounded-full bg-[#fafafa] px-3 py-1.5 ring-1 ring-black/[0.05]">{item}</span>
                {index < priority.length - 1 ? <span className="text-[#9ca3af]">-&gt;</span> : null}
              </span>
            ))}
          </div>
        </section>
      ) : null}

      {notes.length ? (
        <section className="space-y-3">
          <h3 className="text-sm font-semibold uppercase tracking-wide text-[#6b7280]">Build Notes</h3>
          <div className="space-y-3">
              {notes.map((note) => (
              <article key={note.id || note.title} className="rounded-3xl border border-black/[0.06] bg-white p-5 shadow-[0_16px_48px_rgba(0,0,0,0.05)]">
                <h4 className="text-sm font-semibold text-[#111111]">{note.title}</h4>
                <p className="mt-2 text-sm leading-relaxed text-[#6b7280]">{note.content || PLACEHOLDER}</p>
              </article>
              ))}
          </div>
        </section>
      ) : null}

      <ConsoleSetupSummary setup={consoleSetup} onOpenConsole={onOpenConsole} onOpenCartridge={onOpenCartridge} onOpenModule={onOpenModule} />

      {videoGuides.length ? (
        <section className="space-y-3">
          <h3 className="text-sm font-semibold uppercase tracking-wide text-[#6b7280]">Video Guides</h3>
          <div className="rounded-3xl border border-black/[0.06] bg-white p-5 text-sm text-[#6b7280] shadow-[0_16px_48px_rgba(0,0,0,0.05)]">
            {videoGuides.map((guide) => (
              <p key={guide}>{guide}</p>
            ))}
          </div>
        </section>
      ) : null}
    </div>
  )
}
