import { useMemo, useState } from 'react'
import { ArrowLeft, CalendarDays, CheckCircle2, ChevronDown, Layers3, Languages, Package, Pencil, Quote, Sparkles, XCircle } from 'lucide-react'
import CharacterHero from '../components/CharacterHero.jsx'
import CharacterTabs from '../components/CharacterTabs.jsx'
import BuildSection from '../components/BuildSection.jsx'
import TeamSection from '../components/TeamSection.jsx'
import ConsoleTab from '../components/ConsoleTab.jsx'
import OverviewBlockEditor from '../admin/OverviewBlockEditor.jsx'
import SkillsEditor from '../admin/SkillsEditor.jsx'
import CharacterMaterialsEditor from '../admin/CharacterMaterialsEditor.jsx'
import TeamsEditor from '../admin/TeamsEditor.jsx'
import ConsoleInfoEditor from '../admin/ConsoleInfoEditor.jsx'
import ConsoleLayoutEditor from '../admin/ConsoleLayoutEditor.jsx'
import BuildEditor from '../admin/BuildEditor.jsx'
import { useAdminMode } from '../admin/AdminModeContext.jsx'
import { SECTION_FALLBACKS, hasOverviewContent } from '../data/characterSchema.js'
import { normalizeOverviewBlocks } from '../data/overviewBlocks.js'
import { normalizeSkills } from '../data/skillBlocks.js'
import { normalizeCharacterMaterials } from '../data/materialBlocks.js'
import { getElementMeta } from '../data/gameMeta.jsx'
import { getCharacterIntelNotes } from '../data/characterIntelNotes.js'
import Seo from '../components/Seo.jsx'
import NotFoundState from '../components/ui/NotFoundState.jsx'
import ApiEmptyState from '../components/ui/EmptyState.jsx'
import SourceStatusBadge from '../components/ui/SourceStatusBadge.jsx'
import { isApiMode } from '../repositories/dataSource.js'
import { getCharacterByIdOrSlugUnified } from '../repositories/unified/charactersRepository.js'
import { useAsyncData } from '../hooks/useAsyncData.js'

const PLACEHOLDER = 'Data coming soon'

function SectionFallback({ message }) {
  return (
    <p className="rounded-3xl border border-dashed border-black/[0.08] bg-white/80 px-6 py-10 text-center text-sm text-[#6b7280]">{message}</p>
  )
}

const ABILITY_CATEGORIES = [
  { id: 'skills', label: 'Skills' },
  { id: 'passives', label: 'Passives' },
  { id: 'awakening', label: 'Awakening' },
]

const ABILITY_CATEGORY_TYPES = {
  skills: ['Basic Attack', 'Skill', 'Ultimate', 'Other'],
  passives: ['Passive'],
  lifeSkills: ['Life Skill'],
  awakening: ['Awakening'],
  breakthrough: ['Breakthrough'],
}

function Panel({ title, children, compact = false, className = '' }) {
  return (
    <section className={['card-premium rounded-3xl', compact ? 'p-4 sm:p-5' : 'p-6 sm:p-8', className].filter(Boolean).join(' ')}>
      {title ? <h3 className="text-base font-semibold text-[#111111]">{title}</h3> : null}
      <div className={title ? 'mt-4' : ''}>{children}</div>
    </section>
  )
}

function BulletList({ items }) {
  if (!items || items.length === 0) return <p className="text-sm text-[#9ca3af]">{PLACEHOLDER}</p>

  return (
    <ul className="space-y-2 text-sm leading-relaxed text-[#6b7280]">
      {items.map((x) => (
        <li key={x} className="flex gap-2">
          <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-[#ff2f6d]/70" aria-hidden />
          <span>{x}</span>
        </li>
      ))}
    </ul>
  )
}

function rowsObject(rows) {
  return (rows || []).reduce((acc, row) => {
    acc[row.label] = row.value
    return acc
  }, {})
}

function KeyChips({ rows }) {
  const data = rowsObject(rows)
  const chips = [
    data['Arc Type'],
    ...(data['Combat Roles'] ? data['Combat Roles'].split('/').map((item) => item.trim()) : []),
  ].filter(Boolean)

  return (
    <div className="flex flex-wrap gap-2">
      {chips.map((chip) => (
        <span key={chip} className="rounded-full bg-white/85 px-3 py-1.5 text-xs font-bold text-[#111111] ring-1 ring-black/[0.06]">
          {chip}
        </span>
      ))}
    </div>
  )
}

function HeroSummaryBlock({ block, profileBlock }) {
  return (
    <section className="surface-glass-strong relative overflow-hidden rounded-[28px] p-6 sm:p-7">
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(135deg,rgba(20,184,166,0.08),transparent_42%,rgba(255,47,109,0.07))]" aria-hidden />
      <div className="relative grid gap-5 lg:grid-cols-[1fr_auto] lg:items-end">
        <div>
          <div className="pill-glass inline-flex items-center gap-2 px-3 py-1 text-xs font-bold text-[#0f766e] ring-1 ring-[#14b8a6]/15">
            <Sparkles className="h-3.5 w-3.5" strokeWidth={2} aria-hidden />
            Character Overview
          </div>
          <h3 className="mt-4 text-xl font-bold tracking-tight text-[#111111] sm:text-2xl">{block.title}</h3>
          <p className="mt-3 max-w-4xl text-sm leading-7 text-[#4b5563] sm:text-[15px]">{block.content || PLACEHOLDER}</p>
        </div>
        {profileBlock?.rows?.length ? <KeyChips rows={profileBlock.rows} /> : null}
      </div>
    </section>
  )
}

function ProfileGridBlock({ block }) {
  const rows = (block.rows || []).filter((row) => row.label && row.value)
  return (
    <Panel title={block.title} compact className="lg:col-span-2">
      <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-5">
        {rows.map((row) => (
          <div key={row.label} className="rounded-2xl bg-[#fafafa] px-3.5 py-3 ring-1 ring-black/[0.04]">
            <p className="text-[10px] font-bold uppercase tracking-wide text-[#9ca3af]">{row.label}</p>
            <p className="mt-1 text-sm font-semibold leading-snug text-[#111111]">{row.value}</p>
          </div>
        ))}
      </div>
    </Panel>
  )
}

function KeyValueGridBlock({ block }) {
  return <InfoPanel title={block.title} rows={(block.rows || []).map((row) => [row.label, row.value])} compact />
}

function VoiceActorsBlock({ block, accentColor = '#14b8a6' }) {
  const rows = (block.rows || []).filter((row) => row.label && row.value)
  return (
    <Panel title={block.title} compact className="relative overflow-hidden">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px opacity-40" style={{ backgroundColor: accentColor }} aria-hidden />
      <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
        {rows.map((row) => (
          <div key={row.label} className="rounded-2xl bg-cyan-50/60 px-3 py-3 text-center ring-1 ring-cyan-100">
            <span className="inline-flex h-7 min-w-7 items-center justify-center rounded-full bg-white px-2 text-[11px] font-black text-cyan-700 ring-1 ring-cyan-100">
              {row.label}
            </span>
            <p className="mt-2 text-sm font-semibold text-[#111111]">{row.value}</p>
          </div>
        ))}
      </div>
    </Panel>
  )
}

function ProsConsBlock({ pros, cons }) {
  return (
    <section className="grid gap-4 lg:col-span-2 lg:grid-cols-2">
      <Panel title={pros.title || 'Pros'} compact className="h-full">
        <ul className="space-y-2 text-sm leading-relaxed text-[#4b5563]">
          {(pros.items || []).map((item) => (
            <li key={item} className="flex gap-2 rounded-2xl bg-[#fafafa] px-3 py-2 ring-1 ring-black/[0.04]">
              <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-[#14b8a6]" strokeWidth={2} aria-hidden />
              <span>{item}</span>
            </li>
          ))}
        </ul>
      </Panel>
      <Panel title={cons.title || 'Cons'} compact className="h-full">
        <ul className="space-y-2 text-sm leading-relaxed text-[#4b5563]">
          {(cons.items || []).map((item) => (
            <li key={item} className="flex gap-2 rounded-2xl bg-[#fff7ed] px-3 py-2 ring-1 ring-amber-100">
              <XCircle className="mt-0.5 h-4 w-4 shrink-0 text-amber-600" strokeWidth={2} aria-hidden />
              <span>{item}</span>
            </li>
          ))}
        </ul>
      </Panel>
    </section>
  )
}

function GameplaySummaryBlock({ block, accentColor = '#14b8a6' }) {
  return (
    <Panel compact className="relative overflow-hidden">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px opacity-40" style={{ backgroundColor: accentColor }} aria-hidden />
      <div className="relative grid gap-4 lg:grid-cols-[auto_1fr] lg:items-start">
        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-white/80 text-[#0f766e] ring-1 ring-black/[0.05]" style={{ color: accentColor }}>
          <Sparkles className="h-5 w-5" strokeWidth={2} aria-hidden />
        </div>
        <div>
          <h3 className="text-base font-semibold text-[#111111]">{block.title}</h3>
          <p className="mt-2 text-sm leading-7 text-[#4b5563]">{block.content || PLACEHOLDER}</p>
        </div>
      </div>
    </Panel>
  )
}

function BannerHistoryBlock({ block }) {
  return (
    <Panel title={block.title} compact>
      <div className="space-y-2">
        {(block.items || []).map((item) => (
          <div key={item} className="flex items-center gap-3 rounded-2xl bg-[#fafafa] px-3.5 py-3 ring-1 ring-black/[0.04]">
            <CalendarDays className="h-4 w-4 shrink-0 text-[#ff2f6d]" strokeWidth={2} aria-hidden />
            <p className="text-sm font-semibold text-[#111111]">{item}</p>
          </div>
        ))}
      </div>
    </Panel>
  )
}

function LanguageTableBlock({ block }) {
  const groups = (block.rows || []).reduce((acc, row) => {
    const [group, language] = row.label.includes(' - ') ? row.label.split(' - ') : ['Nanally', row.label]
    if (!acc[group]) acc[group] = []
    acc[group].push({ language, value: row.value })
    return acc
  }, {})

  return (
    <Panel title={block.title} compact className="lg:col-span-2">
      <div className="grid gap-4 lg:grid-cols-2">
        {Object.entries(groups).map(([group, rows]) => (
          <div key={group} className="overflow-hidden rounded-2xl border border-black/[0.06]">
            <div className="flex items-center gap-2 bg-[#fafafa] px-4 py-2.5">
              <Languages className="h-4 w-4 text-[#6b7280]" strokeWidth={2} aria-hidden />
              <h4 className="text-sm font-semibold text-[#111111]">{group}</h4>
            </div>
            <div className="divide-y divide-black/[0.05]">
              {rows.map((row) => (
                <div key={`${group}-${row.language}`} className="grid grid-cols-[128px_1fr] gap-3 px-4 py-2.5 text-sm">
                  <span className="font-semibold text-[#6b7280]">{row.language}</span>
                  <span className="text-[#111111]">{row.value}</span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </Panel>
  )
}

function LoreCardsBlock({ block }) {
  const isStories = block.id === 'stories'
  return (
    <Panel title={block.title} compact className="lg:col-span-2">
      <div className={isStories ? 'grid gap-3 md:grid-cols-2 xl:grid-cols-3' : 'grid gap-3 md:grid-cols-3'}>
        {(block.items || []).map((item) => {
          const [name, ...rest] = item.split(':')
          return (
            <article key={item} className="rounded-2xl bg-[#fafafa] p-4 ring-1 ring-black/[0.04]">
              <h4 className="text-sm font-semibold text-[#111111]">{rest.length ? name : block.title}</h4>
              <p className="mt-2 text-sm leading-6 text-[#6b7280]">{rest.length ? rest.join(':').trim() : item}</p>
            </article>
          )
        })}
      </div>
    </Panel>
  )
}

function QuoteListBlock({ block }) {
  return (
    <Panel title={block.title} compact className="lg:col-span-2">
      <div className="grid gap-3 md:grid-cols-3">
        {(block.items || []).map((item) => (
          <figure key={item} className="rounded-2xl bg-rose-50/35 p-4 ring-1 ring-rose-100/70">
            <Quote className="h-4 w-4 text-[#ff2f6d]" strokeWidth={2} aria-hidden />
            <blockquote className="mt-2 text-sm italic leading-6 text-[#4b5563]">{item}</blockquote>
          </figure>
        ))}
      </div>
    </Panel>
  )
}

function OverviewBlock({ block, blocks, accentColor }) {
  const profileBlock = blocks.find((item) => item.type === 'profileGrid' || item.id === 'profile-snapshot')
  if (block.type === 'heroSummary') return <HeroSummaryBlock block={block} profileBlock={profileBlock} />
  if (block.type === 'profileGrid') return <ProfileGridBlock block={block} />
  if (block.type === 'voiceActors') return <VoiceActorsBlock block={block} accentColor={accentColor} />
  if (block.type === 'gameplaySummary') return <GameplaySummaryBlock block={block} accentColor={accentColor} />
  if (block.type === 'compactBannerHistory') return <BannerHistoryBlock block={block} />
  if (block.type === 'languageTable') return <LanguageTableBlock block={block} />
  if (block.type === 'loreCards') return <LoreCardsBlock block={block} />
  if (block.type === 'quoteList') return <QuoteListBlock block={block} />
  if (block.type === 'keyValueGrid') return <KeyValueGridBlock block={block} />

  if (block.type === 'list') {
    return (
      <Panel title={block.title} compact>
        <BulletList items={block.items?.filter((item) => item.trim())} />
      </Panel>
    )
  }

  if (block.type === 'meta') {
    return <InfoPanel title={block.title} rows={(block.rows || []).map((row) => [row.label, row.value])} compact />
  }

  return (
    <Panel title={block.title} compact>
      <p className="text-sm leading-relaxed text-[#6b7280]">{block.content || PLACEHOLDER}</p>
    </Panel>
  )
}

function defaultOverviewSize(block) {
  if (block.size) return block.size
  if (block.type === 'heroSummary' || block.type === 'profileGrid' || block.type === 'languageTable' || block.type === 'loreCards' || block.type === 'quoteList') return 'full'
  if (block.id === 'gameplay-identity' || block.id === 'stories') return 'full'
  if (['voice-actors', 'availability', 'rating', 'stat-model-note', 'trivia', 'intel', 'stories'].includes(block.id)) return 'half'
  return 'half'
}

function overviewSizeClass(block) {
  const size = defaultOverviewSize(block)
  if (size === 'full') return 'md:col-span-2 lg:col-span-6'
  if (size === 'twoThird') return 'md:col-span-2 lg:col-span-4'
  if (size === 'third' || size === 'compact') return 'md:col-span-1 lg:col-span-2'
  return 'md:col-span-1 lg:col-span-3'
}

function SourcePendingIntelSection({ intel }) {
  if (!intel || !intel.sections?.length) return null

  return (
    <section className="rounded-3xl border border-amber-200/70 bg-amber-50/60 p-4 shadow-[0_18px_55px_rgba(0,0,0,0.04)] sm:p-5 md:col-span-2 lg:col-span-6">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-amber-700">Source-pending intel</p>
          <h3 className="mt-1 text-lg font-semibold text-[#111111]">Character Notes</h3>
          <p className="mt-2 max-w-3xl text-sm leading-relaxed text-[#6b7280]">
            Extracted from local research files and awaiting manual verification. These notes do not change stats, builds, or calculator formulas.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <SourceStatusBadge status={intel.sourceStatus || 'needs_verification'} />
          {intel.confidence ? (
            <span className="rounded-full bg-white px-2.5 py-1 text-[11px] font-semibold capitalize text-amber-800 ring-1 ring-amber-200">
              Confidence: {intel.confidence}
            </span>
          ) : null}
        </div>
      </div>

      {intel.summary ? <p className="mt-4 text-sm leading-relaxed text-[#4b5563]">{intel.summary}</p> : null}

      <div className="mt-5 grid gap-3 md:grid-cols-2">
        {intel.sections.map((section) => (
          <div key={section.id} className="rounded-2xl bg-white/85 p-4 ring-1 ring-amber-100">
            <h4 className="text-sm font-semibold text-[#111111]">{section.title}</h4>
            <ul className="mt-3 space-y-2 text-sm leading-relaxed text-[#6b7280]">
              {(section.items || []).map((item) => (
                <li key={item.text} className="flex gap-2">
                  <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-amber-500" aria-hidden />
                  <span>{item.text}</span>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      {intel.warnings?.length ? (
        <div className="mt-4 rounded-2xl bg-white/70 p-3 text-xs leading-relaxed text-amber-800 ring-1 ring-amber-100 sm:p-4">
          {intel.warnings.join(' ')}
        </div>
      ) : null}
    </section>
  )
}

function OverviewSection({ character, isAdminMode, onEdit }) {
  const accentColor = getElementMeta(character.element)?.color || '#14b8a6'
  const intelNotes = getCharacterIntelNotes(character.slug || character.id)
  const overviewOrder = [
    'at-a-glance',
    'profile-snapshot',
    'voice-actors',
    'availability',
    'gameplay-identity',
    'pros',
    'cons',
    'rating',
    'stat-model-note',
    'trivia',
    'intel',
    'stories',
    'personal-items',
    'quotes',
    'other-languages',
  ]
  const orderIndex = new Map(overviewOrder.map((id, index) => [id, index]))
  const blocks = normalizeOverviewBlocks(character.overview)
    .filter((block) => block.enabled !== false && block.id !== 'identity')
    .map((block, index) => ({ ...block, __index: index }))
    .sort((a, b) => {
      const aOrder = orderIndex.has(a.id) ? orderIndex.get(a.id) : overviewOrder.length - 1.5
      const bOrder = orderIndex.has(b.id) ? orderIndex.get(b.id) : overviewOrder.length - 1.5
      if (aOrder !== bOrder) return aOrder - bOrder
      return a.__index - b.__index
    })
  const hasBlocks = hasOverviewContent(character.overview)
  const renderedBlocks = []
  for (let index = 0; index < blocks.length; index += 1) {
    const block = blocks[index]
    if (block.id === 'cons' && blocks[index - 1]?.id === 'pros') continue
    if (block.id === 'pros' && blocks[index + 1]?.id === 'cons') {
      renderedBlocks.push({ type: 'prosConsPair', id: 'pros-cons', pros: block, cons: blocks[index + 1] })
      continue
    }
    renderedBlocks.push(block)
  }

  return (
    <div className="space-y-4">
      {isAdminMode ? (
        <div className="flex justify-end">
          <button
            type="button"
            onClick={onEdit}
            className="inline-flex items-center gap-2 rounded-full border border-black/[0.08] bg-white px-4 py-2 text-sm font-semibold text-[#111111] shadow-sm transition hover:bg-[#fafafa]"
          >
            <Pencil className="h-4 w-4" strokeWidth={2} aria-hidden />
            Edit Overview
          </button>
        </div>
      ) : null}

      {hasBlocks ? (
        <div className="grid auto-rows-min gap-4 md:grid-cols-2 lg:grid-cols-6">
          <SourcePendingIntelSection intel={intelNotes} />
          {renderedBlocks.map((block) => (
            block.type === 'prosConsPair'
              ? <div key={block.id} className="md:col-span-2 lg:col-span-6"><ProsConsBlock pros={block.pros} cons={block.cons} /></div>
              : <div key={block.id} className={overviewSizeClass(block)}><OverviewBlock block={block} blocks={blocks} accentColor={accentColor} /></div>
          ))}
        </div>
      ) : (
        <div className="grid auto-rows-min gap-4 md:grid-cols-2 lg:grid-cols-6">
          <SourcePendingIntelSection intel={intelNotes} />
          {!intelNotes ? <div className="md:col-span-2 lg:col-span-6"><SectionFallback message={SECTION_FALLBACKS.overview} /></div> : null}
        </div>
      )}
    </div>
  )
}

function InfoPanel({ title, rows, compact = false }) {
  const filtered = (rows || []).filter(([, value]) => value)
  return (
    <Panel title={title} compact={compact}>
      {filtered.length ? (
        <div className={compact ? 'grid gap-2 sm:grid-cols-2' : 'space-y-2'}>
          {filtered.map(([label, value]) => (
            <div key={label} className="flex items-start justify-between gap-4 rounded-2xl bg-[#fafafa] px-3.5 py-3 ring-1 ring-black/[0.04]">
              <span className="text-xs font-semibold uppercase tracking-wide text-[#9ca3af]">{label}</span>
              <span className="text-right text-sm font-semibold text-[#111111]">{value}</span>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-sm text-[#9ca3af]">{PLACEHOLDER}</p>
      )}
    </Panel>
  )
}

function StatusPanel({ title, data }) {
  return (
    <Panel title={title}>
      {data ? (
        <div className="space-y-3">
          <span
            className={[
              'inline-flex rounded-full px-3 py-1 text-xs font-semibold ring-1 ring-inset',
              data.available ? 'bg-cyan-50 text-cyan-800 ring-cyan-100' : 'bg-[#fafafa] text-[#6b7280] ring-black/[0.05]',
            ].join(' ')}
          >
            {data.available ? 'Available' : 'Not available'}
          </span>
          <p className="text-sm leading-relaxed text-[#6b7280]">{data.text || PLACEHOLDER}</p>
        </div>
      ) : (
        <p className="text-sm text-[#9ca3af]">{PLACEHOLDER}</p>
      )}
    </Panel>
  )
}

function hasItemList(value) {
  return Array.isArray(value) && value.length > 0
}

function AbilitySection({ character, isAdminMode, onEditSkills }) {
  const [category, setCategory] = useState('skills')
  const categoryTypes = ABILITY_CATEGORY_TYPES[category] || ABILITY_CATEGORY_TYPES.skills

  return (
    <div className="space-y-5">
      <div className="rounded-[22px] border border-black/[0.06] bg-white/95 p-1.5 shadow-[0_14px_40px_rgba(0,0,0,0.045)]">
        <div className="scrollbar-hide flex gap-1 overflow-x-auto pb-0.5 sm:flex-wrap">
          {ABILITY_CATEGORIES.map((item) => {
            const active = category === item.id
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => setCategory(item.id)}
                className={[
                  'whitespace-nowrap rounded-full px-3.5 py-2 text-xs font-semibold transition ring-1 ring-inset sm:text-sm',
                  active
                    ? 'bg-[#ff2f6d]/10 text-[#ff2f6d] ring-[#ff2f6d]/15'
                    : 'text-[#6b7280] ring-transparent hover:bg-[#fafafa] hover:text-[#111111]',
                ].join(' ')}
              >
                {item.label}
              </button>
            )
          })}
        </div>
      </div>

      {isAdminMode ? (
        <div className="flex justify-end">
          <button
            type="button"
            onClick={onEditSkills}
            className="inline-flex items-center gap-2 rounded-full border border-black/[0.08] bg-white px-4 py-2 text-sm font-semibold text-[#111111] shadow-sm transition hover:bg-[#fafafa]"
          >
            <Pencil className="h-4 w-4" strokeWidth={2} aria-hidden />
            Edit Abilities
          </button>
        </div>
      ) : null}

      {category === 'passives' ? (
        <PassiveGroups skills={character.skills} />
      ) : (
        <SkillAccordion key={category} skills={character.skills} types={categoryTypes} emptyMessage="No data in this section yet." />
      )}
    </div>
  )
}

function PassiveGroups({ skills }) {
  const normalized = normalizeSkills(skills).filter((skill) => skill.enabled !== false)
  const groups = [
    { title: 'Combat Passives', badge: 'Passive', items: normalized.filter((skill) => skill.type === 'Passive') },
    { title: 'Life Skill', badge: 'Life Skill', items: normalized.filter((skill) => skill.type === 'Life Skill') },
    { title: 'Breakthrough / Resonance', badge: 'Breakthrough', items: normalized.filter((skill) => skill.type === 'Breakthrough') },
  ].filter((group) => group.items.length)

  if (!groups.length) return <SectionFallback message="No passive data in this section yet." />

  return (
    <div className="space-y-6">
      {groups.map((group) => (
        <section key={group.title} className="space-y-3">
          <h3 className="text-sm font-semibold uppercase tracking-wide text-[#6b7280]">{group.title}</h3>
          <div className="grid gap-4 lg:grid-cols-2">
            {group.items.map((item) => <PassiveCard key={item.id} item={item} fallbackBadge={group.badge} />)}
          </div>
        </section>
      ))}
    </div>
  )
}

function PassiveCard({ item, fallbackBadge }) {
  const isIconUrl = /^https?:\/\//i.test(item.icon || '')
  const effects = item.attributeLevels?.flatMap((level) => level.rows?.map((row) => `${row.label}: ${row.value}`) || []) || []

  return (
    <article className="rounded-3xl border border-black/[0.06] bg-white p-5 shadow-[0_16px_48px_rgba(0,0,0,0.05)]">
      <div className="flex items-start gap-4">
        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-cyan-50 text-cyan-700 ring-1 ring-cyan-100">
          {isIconUrl ? <img src={item.icon} alt="" className="h-8 w-8 rounded-xl object-cover" /> : <Layers3 className="h-5 w-5" strokeWidth={2} aria-hidden />}
        </div>
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <h4 className="font-semibold text-[#111111]">{item.name}</h4>
            <span className="rounded-full bg-[#ff2f6d]/10 px-2.5 py-1 text-[11px] font-semibold text-[#be123c] ring-1 ring-[#ff2f6d]/15">{item.type || fallbackBadge}</span>
          </div>
          <p className="mt-2 text-sm leading-7 text-[#6b7280]">{item.descriptionBlocks?.[0]?.content || PLACEHOLDER}</p>
        </div>
      </div>
      {effects.length ? (
        <div className="mt-4 space-y-2">
          {effects.map((effect) => (
            <div key={effect} className="rounded-2xl bg-[#fafafa] px-4 py-3 text-sm leading-6 text-[#6b7280] ring-1 ring-black/[0.04]">{effect}</div>
          ))}
        </div>
      ) : null}
    </article>
  )
}

function SkillAccordion({ skills, types, emptyMessage = SECTION_FALLBACKS.skills }) {
  const allowedTypes = new Set(types || [])
  const normalized = normalizeSkills(skills).filter((skill) => skill.enabled !== false && (!allowedTypes.size || allowedTypes.has(skill.type)))
  const [openIds, setOpenIds] = useState(() => new Set())
  const [innerTabs, setInnerTabs] = useState({})
  const [selectedLevels, setSelectedLevels] = useState({})

  if (!normalized.length) {
    return <SectionFallback message={emptyMessage} />
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-end gap-2">
        <button
          type="button"
          onClick={() => setOpenIds(new Set(normalized.map((skill) => skill.id)))}
          className="rounded-full border border-black/[0.06] bg-white px-3 py-1.5 text-xs font-semibold text-[#6b7280] shadow-sm hover:text-[#111111]"
        >
          Expand All
        </button>
        <button
          type="button"
          onClick={() => setOpenIds(new Set())}
          className="rounded-full border border-black/[0.06] bg-white px-3 py-1.5 text-xs font-semibold text-[#6b7280] shadow-sm hover:text-[#111111]"
        >
          Collapse All
        </button>
      </div>

      {normalized.map((skill) => {
        const open = openIds.has(skill.id)
        const isIconUrl = /^https?:\/\//i.test(skill.icon)
        const innerTab = innerTabs[skill.id] || 'description'
        const activeLevelValue = selectedLevels[skill.id] || skill.attributeLevels?.[0]?.level
        const activeLevel = skill.attributeLevels?.find((level) => level.level === activeLevelValue) || skill.attributeLevels?.[0]

        return (
          <article key={skill.id} className="overflow-hidden rounded-3xl border border-black/[0.06] bg-white shadow-[0_16px_48px_rgba(0,0,0,0.05)]">
            <button
              type="button"
              onClick={() => {
                const next = new Set(openIds)
                if (open) next.delete(skill.id)
                else next.add(skill.id)
                setOpenIds(next)
              }}
              className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left"
              aria-expanded={open}
            >
              <div className="flex min-w-0 items-center gap-3">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-cyan-50 text-sm font-bold text-cyan-700 ring-1 ring-cyan-100">
                  {isIconUrl ? <img src={skill.icon} alt="" className="h-7 w-7 rounded-xl object-cover" /> : skill.icon || skill.type?.slice(0, 1)?.toUpperCase() || 'S'}
                </div>
                <div className="min-w-0">
                  <p className="font-semibold text-[#111111]">{skill.name}</p>
                  <p className="text-xs font-semibold uppercase tracking-wide text-[#9ca3af]">{skill.type}</p>
                </div>
              </div>
              <ChevronDown className={['h-4 w-4 shrink-0 text-[#9ca3af] transition', open ? 'rotate-180' : ''].join(' ')} />
            </button>

            {open ? (
              <div className="border-t border-black/[0.05] px-5 pb-5 pt-4">
                <MiniTabs active={innerTab} onChange={(tab) => setInnerTabs((current) => ({ ...current, [skill.id]: tab }))} />

                {innerTab === 'description' ? (
                  <div className="space-y-3">
                    {skill.descriptionBlocks?.length ? (
                      skill.descriptionBlocks.map((block) => (
                        <div key={block.id} className="rounded-2xl bg-[#fafafa] p-4 ring-1 ring-black/[0.04]">
                          <h4 className="text-sm font-semibold text-[#111111]">{block.title}</h4>
                          <p className="mt-2 text-sm leading-relaxed text-[#6b7280]">{block.content || PLACEHOLDER}</p>
                        </div>
                      ))
                    ) : (
                      <p className="text-sm text-[#9ca3af]">{PLACEHOLDER}</p>
                    )}
                    {skill.quote ? (
                      <p className="rounded-2xl bg-pink-50/60 px-4 py-3 text-sm italic leading-relaxed text-[#6b7280] ring-1 ring-pink-100">
                        {skill.quote}
                      </p>
                    ) : null}
                  </div>
                ) : null}

                {innerTab === 'attributes' ? (
                  <AttributeTable
                    attributeLevels={skill.attributeLevels}
                    preservedAttributeGroups={skill.attributesByLevel}
                    maxLevel={skill.maxLevel}
                    activeLevel={activeLevel}
                    onLevel={(level) => setSelectedLevels((current) => ({ ...current, [skill.id]: level }))}
                  />
                ) : null}

                {innerTab === 'materials' ? (
                  <MaterialCards rows={{ items: skill.upgradeMaterials, currencyCost: skill.currencyCost }} emptyMessage="Skill material data coming soon." />
                ) : null}
              </div>
            ) : null}
          </article>
        )
      })}
    </div>
  )
}

function MiniTabs({ active, onChange }) {
  return (
    <div className="mb-4 flex flex-wrap gap-2">
      {['description', 'attributes', 'materials'].map((tab) => (
        <button
          key={tab}
          type="button"
          onClick={() => onChange(tab)}
          className={[
            'rounded-full px-3 py-1.5 text-xs font-semibold capitalize ring-1 ring-inset transition',
            active === tab
              ? 'bg-[#ff2f6d]/10 text-[#ff2f6d] ring-[#ff2f6d]/15'
              : 'bg-[#fafafa] text-[#6b7280] ring-black/[0.05] hover:text-[#111111]',
          ].join(' ')}
        >
          {tab}
        </button>
      ))}
    </div>
  )
}

function AttributeTable({ attributeLevels, preservedAttributeGroups, maxLevel, activeLevel, onLevel }) {
  if (!attributeLevels?.length) {
    const preservedGroups = Object.keys(preservedAttributeGroups || {}).filter((key) => !/^\d+$/.test(key))
    if (preservedGroups.length) {
      return (
        <div className="rounded-2xl border border-dashed border-black/[0.08] bg-white px-4 py-5">
          <p className="text-sm font-semibold text-[#111111]">Attribute data preserved - detailed level tabs coming soon.</p>
          <p className="mt-2 text-sm leading-6 text-[#6b7280]">
            {preservedGroups.length} source group{preservedGroups.length === 1 ? '' : 's'} need manual level mapping before they can be shown as selectable levels.
          </p>
        </div>
      )
    }
    return (
      <div className="rounded-2xl border border-dashed border-black/[0.08] bg-white px-4 py-5">
        <p className="text-sm font-semibold text-[#111111]">Data coming soon</p>
        <p className="mt-2 text-sm leading-6 text-[#6b7280]">No verified skill attribute rows are available for this ability yet.</p>
      </div>
    )
  }

  const levelsByNumber = new Map(attributeLevels.map((row) => [row.level, row]))
  const levelTabs = Number(maxLevel) > 0
    ? Array.from({ length: Number(maxLevel) }, (_, index) => index + 1)
    : attributeLevels.map((row) => row.level)

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-2">
        {levelTabs.map((level) => {
          const available = levelsByNumber.has(level)
          return (
            <button
              key={level}
              type="button"
              onClick={() => available && onLevel(level)}
              disabled={!available}
              className={[
                'rounded-full px-3 py-1.5 text-xs font-semibold ring-1 ring-inset',
                activeLevel?.level === level
                  ? 'bg-[#111111] text-white ring-[#111111]'
                  : available
                    ? 'bg-[#fafafa] text-[#6b7280] ring-black/[0.05]'
                    : 'cursor-not-allowed bg-white text-[#c4c4c4] ring-black/[0.04]',
              ].join(' ')}
              title={available ? `Lv.${level}` : 'Data coming soon'}
            >
              Lv.{level}
            </button>
          )
        })}
      </div>
      <div className="overflow-hidden rounded-2xl border border-black/[0.06]">
        <div className="grid grid-cols-[1fr_auto] gap-4 border-b border-black/[0.06] bg-[#fafafa] px-4 py-2.5">
          <span className="text-[11px] font-semibold uppercase tracking-wide text-[#9ca3af]">Attribute</span>
          <span className="text-[11px] font-semibold uppercase tracking-wide text-[#9ca3af]">Values</span>
        </div>
        {activeLevel?.rows?.length ? activeLevel.rows.map((value, index) => (
          <div key={`${value.label}-${index}`} className="grid grid-cols-[1fr_auto] gap-4 border-b border-black/[0.05] px-4 py-3 last:border-b-0">
            <span className="text-sm text-[#6b7280]">{value.label}</span>
            <span className="text-sm font-semibold text-[#111111]">{value.value}</span>
          </div>
        )) : (
          <div className="px-4 py-5">
            <p className="text-sm font-semibold text-[#111111]">Data coming soon</p>
          </div>
        )}
      </div>
    </div>
  )
}

function SimpleAccordion({ items, kind }) {
  const list = items || []
  const [openIds, setOpenIds] = useState(() => new Set(list.slice(0, 1).map((item) => item.id || item.name)))

  if (!list.length) return <EmptyState />

  return (
    <div className="space-y-3">
      {list.map((item) => {
        const key = item.id || item.name
        const open = openIds.has(key)
        return (
          <article key={key} className="overflow-hidden rounded-3xl border border-black/[0.06] bg-white shadow-[0_16px_48px_rgba(0,0,0,0.05)]">
            <button
              type="button"
              onClick={() => {
                const next = new Set(openIds)
                if (open) next.delete(key)
                else next.add(key)
                setOpenIds(next)
              }}
              className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left"
            >
              <div>
                <p className="font-semibold text-[#111111]">{item.name}</p>
                <p className="text-xs font-semibold uppercase tracking-wide text-[#9ca3af]">{kind}</p>
              </div>
              <ChevronDown className={['h-4 w-4 shrink-0 text-[#9ca3af] transition', open ? 'rotate-180' : ''].join(' ')} />
            </button>
            {open ? (
              <div className="border-t border-black/[0.05] px-5 pb-5 pt-4">
                <p className="text-sm leading-relaxed text-[#6b7280]">{item.description || PLACEHOLDER}</p>
                {item.flavorText ? (
                  <p className="mt-3 rounded-2xl bg-pink-50/60 px-4 py-3 text-sm italic leading-relaxed text-[#6b7280] ring-1 ring-pink-100">
                    {item.flavorText}
                  </p>
                ) : null}
              </div>
            ) : null}
          </article>
        )
      })}
    </div>
  )
}

function LifeSkills({ items }) {
  const list = items || []
  if (!list.length) return <EmptyState />

  return (
    <div className="grid gap-4 lg:grid-cols-2">
      {list.map((skill) => (
        <article key={skill.id || skill.name} className="rounded-3xl border border-black/[0.06] bg-white p-5 shadow-[0_16px_48px_rgba(0,0,0,0.05)]">
          <h3 className="font-semibold text-[#111111]">{skill.name}</h3>
          <div className="mt-4 space-y-2">
            {(skill.effects || []).map((effect) => (
              <div key={effect.level} className="rounded-2xl bg-[#fafafa] px-4 py-3 ring-1 ring-black/[0.04]">
                <p className="text-xs font-semibold uppercase tracking-wide text-[#ff2f6d]">Level {effect.level}</p>
                <p className="mt-1 text-sm leading-relaxed text-[#6b7280]">{effect.text}</p>
              </div>
            ))}
          </div>
        </article>
      ))}
    </div>
  )
}

function LabeledGrid({ items }) {
  const list = items || []
  if (!list.length) return <EmptyState />

  return (
    <div className="grid gap-4 lg:grid-cols-2">
      {list.map((item) => (
        <article key={item.id || item.label} className="rounded-3xl border border-black/[0.06] bg-white p-5 shadow-[0_16px_48px_rgba(0,0,0,0.05)]">
          <div className="flex items-start gap-3">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-cyan-50 text-sm font-bold text-cyan-700 ring-1 ring-cyan-100">
              {item.label}
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-[#9ca3af]">{item.type}</p>
              <h3 className="mt-1 font-semibold text-[#111111]">{item.name}</h3>
            </div>
          </div>
          <p className="mt-4 text-sm leading-relaxed text-[#6b7280]">{item.description || PLACEHOLDER}</p>
        </article>
      ))}
    </div>
  )
}

function MaterialsSection({ character, isAdminMode, onEdit }) {
  const materials = normalizeCharacterMaterials(character.materials)
  const hasData =
    materials.items.length ||
    materials.ascensionMaterials.length ||
    materials.skillMaterials.length ||
    materials.lifeSkillMaterials.length ||
    materials.ascensionTotals.length ||
    materials.currencyCost > 0

  return (
    <div className="space-y-4">
      {isAdminMode ? (
        <div className="flex justify-end">
          <button
            type="button"
            onClick={onEdit}
            className="inline-flex items-center gap-2 rounded-full border border-black/[0.08] bg-white px-4 py-2 text-sm font-semibold text-[#111111] shadow-sm transition hover:bg-[#fafafa]"
          >
            <Pencil className="h-4 w-4" strokeWidth={2} aria-hidden />
            Edit Materials
          </button>
        </div>
      ) : null}

      {hasData ? <MaterialSummary materials={materials} isAdminMode={isAdminMode} element={character.element} /> : <MaterialsEmptyState />}
    </div>
  )
}

function MaterialsEmptyState() {
  return (
    <section className="rounded-3xl border border-dashed border-black/[0.08] bg-white/82 px-6 py-8 shadow-sm">
      <h3 className="text-base font-semibold text-[#111111]">Character Materials</h3>
      <p className="mt-2 text-sm leading-6 text-[#6b7280]">No verified material data is available for this character yet.</p>
      <p className="mt-1 text-sm text-[#9ca3af]">Data coming soon.</p>
    </section>
  )
}

function materialSourceLookup(materials) {
  return new Map(
    (materials?.materialSources || []).filter(Boolean).map((entry) => [
      entry?.materialId,
      Array.isArray(entry.sources) ? entry.sources.map((source) => String(source)) : [],
    ]),
  )
}

function withMaterialSources(items, sourceMap) {
  return (items || []).filter(Boolean).map((item) => ({
    ...item,
    sources: item.sources?.length ? item.sources : sourceMap.get(item.materialId || item.id) || [],
  }))
}

function lifeSkillMaterialRows(materials, sourceMap) {
  return (materials?.lifeSkillMaterials || []).filter(Boolean).flatMap((level) =>
    (Array.isArray(level?.items) ? level.items : []).filter(Boolean).map((item, index) => ({
      ...item,
      id: `${item.materialId || item.name}-life-${level.level}-${index}`,
      group: `Family Business Lv.${level.level}`,
      sources: item.sources?.length ? item.sources : sourceMap.get(item.materialId || item.id) || [],
    })),
  )
}

function publicMaterialSectionTitle(section, index) {
  if (index === 0) return 'Total Materials'
  return `Total Materials ${index + 1}`
}

function materialSignature(items) {
  return (items || [])
    .filter(Boolean)
    .map((item) => `${String(item.materialId || item.id || item.name).toLowerCase()}:${Number(item.amount) || 0}`)
    .sort()
    .join('|')
}

function visibleTotalSections(materials, primaryAscension) {
  const primarySignature = materialSignature(primaryAscension)
  const seen = new Set([primarySignature])
  return (materials?.ascensionTotals || []).filter(Boolean).filter((section) => {
    const signature = materialSignature(section?.items)
    if (!signature || seen.has(signature)) return false
    seen.add(signature)
    return true
  })
}

function MaterialSummary({ materials, isAdminMode, element }) {
  const sourceMap = materialSourceLookup(materials)
  const primaryAscension = materials?.ascensionMaterials?.length ? materials.ascensionMaterials : materials?.items || []
  const totalSections = visibleTotalSections(materials, primaryAscension)
  const accentColor = getElementMeta(element)?.color || '#14b8a6'

  return (
    <div className="surface-elevated relative space-y-6 overflow-hidden rounded-[28px] p-4">
      <div className="pointer-events-none absolute inset-x-4 top-0 h-px opacity-35" style={{ backgroundColor: accentColor }} aria-hidden />
      <MaterialCards
        rows={{
          title: materials.title || 'Character Ascension Materials',
          notes: isAdminMode ? materials.notes : '',
          items: withMaterialSources(primaryAscension, sourceMap),
          currencyCost: 0,
        }}
        showHeader
        showAcquisition
        accentColor={accentColor}
      />

      {totalSections.length ? (
        <div className="space-y-3">
          {isAdminMode ? (
            <div className="rounded-3xl border border-black/[0.06] bg-white px-5 py-4 text-sm text-[#6b7280] shadow-sm">
              Admin note: alternate totals are shown only when they do not duplicate the primary material list.
            </div>
          ) : null}
          {totalSections.map((section, index) => (
            <MaterialCards
              key={section.id}
              rows={{
                title: isAdminMode ? section.title : publicMaterialSectionTitle(section, index),
                notes: isAdminMode ? [section.notes, section.status ? `Source status: ${section.status}` : ''].filter(Boolean).join(' ') : '',
                items: withMaterialSources(section.items, sourceMap),
                currencyCost: 0,
              }}
              showHeader
              showAcquisition
              accentColor={accentColor}
            />
          ))}
        </div>
      ) : null}

      {materials?.skillMaterials?.length ? (
        <MaterialCards
          rows={{
            title: 'Skill Upgrade Materials',
            notes: isAdminMode ? 'Shared combat skill upgrade material totals from the Nanally source pack.' : '',
            items: withMaterialSources(materials.skillMaterials, sourceMap),
            currencyCost: 0,
          }}
          showHeader
          showAcquisition
          accentColor={accentColor}
        />
      ) : null}

      {materials?.lifeSkillMaterials?.length ? (
        <MaterialCards
          rows={{
            title: 'Life Skill Upgrade Materials',
            notes: isAdminMode ? 'Family Business Lv.1-Lv.5 material requirements.' : '',
            items: withMaterialSources(lifeSkillMaterialRows(materials, sourceMap), sourceMap),
            currencyCost: 0,
          }}
          showHeader
          showAcquisition
          accentColor={accentColor}
        />
      ) : null}
    </div>
  )
}

export default function CharacterDetailPage({ characterId, onBack, onOpenCharacter, onOpenWeapon, onOpenCartridge, onOpenModule, onAdminEditCharacter }) {
  const [tab, setTab] = useState('overview')
  const [overviewEditorOpen, setOverviewEditorOpen] = useState(false)
  const [skillsEditorOpen, setSkillsEditorOpen] = useState(false)
  const [materialsEditorOpen, setMaterialsEditorOpen] = useState(false)
  const [teamsEditorOpen, setTeamsEditorOpen] = useState(false)
  const [consoleInfoEditorOpen, setConsoleInfoEditorOpen] = useState(false)
  const [consoleLayoutEditorOpen, setConsoleLayoutEditorOpen] = useState(false)
  const [buildEditorOpen, setBuildEditorOpen] = useState(false)
  const { getCharacterByIdMerged, isAdminMode, saveCharacterOverride } = useAdminMode()
  const apiMode = isApiMode()
  const effectiveAdminMode = isAdminMode && !apiMode
  const staticCharacter = useMemo(() => getCharacterByIdMerged(characterId), [characterId, getCharacterByIdMerged])
  const { data: apiCharacter, error, loading, reload } = useAsyncData(
    () => getCharacterByIdOrSlugUnified([], characterId),
    [apiMode, characterId],
    { enabled: apiMode, initialData: null },
  )
  const character = apiMode ? apiCharacter : staticCharacter

  if (loading) {
    return (
      <div className="space-y-4">
        <Seo title="Loading character" description="Loading character data from the local API." />
        <BackButton onBack={onBack} />
        <ApiEmptyState eyebrow="Loading" title="Loading character" description="Fetching character data from the local API." />
      </div>
    )
  }

  if (error) {
    return (
      <div className="space-y-4">
        <Seo title="Character failed to load" description="The local API did not return this character." />
        <BackButton onBack={onBack} />
        <ApiEmptyState eyebrow="API error" title="Character failed to load" description={error.message || 'The local API did not return this character.'} action={<button type="button" onClick={reload} className="rounded-full bg-[#111111] px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-black">Retry</button>} />
      </div>
    )
  }

  if (!character) {
    return (
      <div className="space-y-4">
        <Seo title="Character not found" description="This character route does not match an entry in the current NTE database." />
        <BackButton onBack={onBack} />
        <NotFoundState title="Character not found" description="This character route does not match an entry in the current NTE database." />
      </div>
    )
  }

  return (
    <div className="character-detail-page space-y-6 pb-10">
      <Seo title={character.name} description={`${character.name} character profile, stats, skills, builds, teams, and materials for the NTE Community Database.`} />
      <BackButton onBack={onBack} />

      <div className="space-y-3">
        {effectiveAdminMode ? (
          <div className="flex justify-end">
            <button
              type="button"
              onClick={() => onAdminEditCharacter?.(character.id)}
              className="inline-flex items-center gap-2 rounded-full border border-black/[0.08] bg-white px-3 py-1.5 text-xs font-semibold text-[#6b7280] shadow-sm transition hover:bg-[#fafafa] hover:text-[#111111]"
              aria-label="Edit character profile"
            >
              <Pencil className="h-3.5 w-3.5" strokeWidth={2} aria-hidden />
              Edit
            </button>
          </div>
        ) : null}
        <CharacterHero key={character.id} character={character} />
      </div>

      <CharacterTabs element={character.element} activeTab={tab} onTabChange={setTab}>
        {tab === 'overview' ? (
          <OverviewSection character={character} isAdminMode={effectiveAdminMode} onEdit={() => setOverviewEditorOpen(true)} />
        ) : null}

        {tab === 'skills' ? (
          <AbilitySection character={character} isAdminMode={effectiveAdminMode} onEditSkills={() => setSkillsEditorOpen(true)} />
        ) : null}

        {tab === 'build' ? (
          <div className="space-y-4">
            {effectiveAdminMode ? (
              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={() => setBuildEditorOpen(true)}
                  className="inline-flex items-center gap-2 rounded-full border border-black/[0.08] bg-white px-4 py-2 text-sm font-semibold text-[#111111] shadow-sm transition hover:bg-[#fafafa]"
                >
                  <Pencil className="h-4 w-4" strokeWidth={2} aria-hidden />
                  Edit Build
                </button>
              </div>
            ) : null}
            <BuildSection build={character.build} consoleSetup={character.consoleSetup || character.console} element={character.element} onOpenConsole={() => setTab('console')} onOpenWeapon={onOpenWeapon} onOpenCartridge={onOpenCartridge} onOpenModule={onOpenModule} />
          </div>
        ) : null}

        {tab === 'teams' ? (
          <TeamSection
            character={character}
            onOpenCharacter={onOpenCharacter}
            isAdminMode={effectiveAdminMode}
            onEditTeams={() => setTeamsEditorOpen(true)}
          />
        ) : null}

        {tab === 'console' ? (
          <div className="space-y-4">
            {effectiveAdminMode ? (
              <div className="flex flex-wrap justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setConsoleInfoEditorOpen(true)}
                  className="inline-flex items-center gap-2 rounded-full border border-black/[0.08] bg-white px-4 py-2 text-sm font-semibold text-[#111111] shadow-sm transition hover:bg-[#fafafa]"
                >
                  <Pencil className="h-4 w-4" strokeWidth={2} aria-hidden />
                  Edit Console Info
                </button>
                <button
                  type="button"
                  onClick={() => setConsoleLayoutEditorOpen(true)}
                  className="inline-flex items-center gap-2 rounded-full border border-black/[0.08] bg-white px-4 py-2 text-sm font-semibold text-[#111111] shadow-sm transition hover:bg-[#fafafa]"
                >
                  <Pencil className="h-4 w-4" strokeWidth={2} aria-hidden />
                  Edit Console Layout
                </button>
              </div>
            ) : null}
            <ConsoleTab character={character} onOpenCartridge={onOpenCartridge} onOpenWeapon={onOpenWeapon} onOpenModule={onOpenModule} />
          </div>
        ) : null}

        {tab === 'materials' ? (
          <MaterialsSection character={character} isAdminMode={effectiveAdminMode} onEdit={() => setMaterialsEditorOpen(true)} />
        ) : null}
      </CharacterTabs>

      <OverviewBlockEditor
        character={character}
        open={overviewEditorOpen}
        onClose={() => setOverviewEditorOpen(false)}
        onSave={(id, data) => saveCharacterOverride(id, data)}
      />
      <SkillsEditor
        character={character}
        open={skillsEditorOpen}
        onClose={() => setSkillsEditorOpen(false)}
        onSave={(id, data) => saveCharacterOverride(id, data)}
      />
      <CharacterMaterialsEditor
        character={character}
        open={materialsEditorOpen}
        onClose={() => setMaterialsEditorOpen(false)}
        onSave={(id, data) => saveCharacterOverride(id, data)}
      />
      <TeamsEditor
        character={character}
        open={teamsEditorOpen}
        onClose={() => setTeamsEditorOpen(false)}
        onSave={(id, data) => saveCharacterOverride(id, data)}
      />
      <ConsoleInfoEditor
        character={character}
        open={consoleInfoEditorOpen}
        onClose={() => setConsoleInfoEditorOpen(false)}
        onSave={(id, data) => saveCharacterOverride(id, data)}
      />
      <ConsoleLayoutEditor
        character={character}
        open={consoleLayoutEditorOpen}
        onClose={() => setConsoleLayoutEditorOpen(false)}
        onSave={(id, data) => saveCharacterOverride(id, data)}
      />
      <BuildEditor
        character={character}
        open={buildEditorOpen}
        onClose={() => setBuildEditorOpen(false)}
        onSave={(id, data) => saveCharacterOverride(id, data)}
      />
    </div>
  )
}

function BackButton({ onBack }) {
  return (
    <div className="sticky top-[92px] z-20 flex">
      <button
        type="button"
        onClick={onBack}
        className="control-glass inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold text-[#111111] transition hover:bg-white"
      >
        <ArrowLeft className="h-4 w-4" strokeWidth={2} aria-hidden />
        Back to Characters
      </button>
    </div>
  )
}

function EmptyState() {
  return <p className="rounded-3xl border border-dashed border-black/[0.08] bg-white/80 px-6 py-8 text-sm text-[#6b7280]">{PLACEHOLDER}</p>
}

function normalizeMaterialRows(rows) {
  if (Array.isArray(rows)) return { title: '', notes: '', items: rows, currencyCost: 0 }
  if (!rows || typeof rows !== 'object') return { title: '', notes: '', items: [], currencyCost: 0 }
  return {
    title: rows.title || '',
    notes: rows.notes || '',
    items: Array.isArray(rows.items) ? rows.items : [],
    currencyCost: Number(rows.currencyCost || rows.currency) || 0,
  }
}

const INTERNAL_MATERIAL_SOURCE_PATTERN = /pdf|data pack|fandom|screenshot|source status|verified|verification|recheck|conflict|supplemental|essential tool/i

function publicMaterialSources(material) {
  return (material?.sources || [])
    .map((source) => String(source).trim())
    .filter((source) => source && !INTERNAL_MATERIAL_SOURCE_PATTERN.test(source))
}

function MaterialCards({ rows, emptyMessage = SECTION_FALLBACKS.materials, showHeader = false, showAcquisition = false, accentColor = '#14b8a6' }) {
  const { title, notes, items: rawItems, currencyCost } = normalizeMaterialRows(rows ?? null)
  const items = (rawItems || []).filter(Boolean)

  if (!items.length && !currencyCost && !notes) {
    return (
      <div className="rounded-3xl border border-dashed border-black/[0.08] bg-white/80 p-5">
        <p className="text-sm font-semibold text-[#111111]">{emptyMessage}</p>
        <p className="mt-2 text-sm leading-6 text-[#6b7280]">This section is ready for material name, quantity, and icon path data. Future icons can live under <span className="font-semibold text-[#111111]">/assets/nte/materials</span>.</p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {showHeader && (title || notes) ? (
        <div className="relative">
          <div className="pointer-events-none absolute inset-x-0 top-0 h-px" style={{ background: `linear-gradient(90deg, ${accentColor}, transparent 72%)`, opacity: 0.26 }} aria-hidden />
          <div className="relative rounded-3xl border border-white/75 bg-white/88 px-5 py-4 shadow-sm ring-1 ring-black/[0.04]">
            {title ? <h3 className="text-base font-semibold text-[#111111]">{title}</h3> : null}
            {notes ? <p className="mt-2 text-sm leading-relaxed text-[#6b7280]">{notes}</p> : null}
          </div>
        </div>
      ) : null}
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {!showHeader ? (
          <p className="md:col-span-2 xl:col-span-3 text-sm leading-6 text-[#6b7280]">Listed materials are required to max the selected skill or ability.</p>
        ) : null}
        {items.map((material) => (
          <article key={material.id || `${material.group || 'material'}-${material.name}`} className="rounded-3xl border border-black/[0.06] bg-white p-4 shadow-[0_14px_42px_rgba(0,0,0,0.045)]">
            <div className="flex items-start gap-3">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-[#fafafa] text-xl font-bold text-[#6b7280] ring-1 ring-black/[0.05]">
                {/^https?:\/\//i.test(material.image || '') ? (
                  <img src={material.image} alt="" className="h-8 w-8 rounded-xl object-cover" />
                ) : (
                  <Package className="h-5 w-5" strokeWidth={2} aria-hidden />
                )}
              </div>
              <div className="min-w-0">
                {material.group ? <p className="text-[10px] font-semibold uppercase tracking-wide text-[#9ca3af]">{material.group}</p> : null}
                <h3 className="text-sm font-semibold text-[#111111]">{material.name}</h3>
                {material.amount ? <p className="mt-1 text-xs font-semibold text-[#ff2f6d]">Count: {material.amount}</p> : null}
              </div>
            </div>
            {showAcquisition && publicMaterialSources(material).length ? (
              <div className="mt-4 flex flex-wrap gap-2">
                {publicMaterialSources(material).map((source) => (
                  <span key={source} className="rounded-full bg-[#fafafa] px-3 py-1 text-xs font-medium text-[#6b7280] ring-1 ring-black/[0.05]">
                    {source}
                  </span>
                ))}
              </div>
            ) : null}
          </article>
        ))}
      </div>
      {currencyCost ? (
        <div className="inline-flex rounded-2xl border border-black/[0.06] bg-white px-5 py-3 shadow-sm">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-wide text-[#9ca3af]">Required Currency</p>
            <p className="mt-1 text-xl font-bold text-[#111111] tabular-nums">{Number(currencyCost).toLocaleString()}</p>
          </div>
        </div>
      ) : null}
    </div>
  )
}
