import { useMemo, useState } from 'react'
import { Shield, Sparkles, Swords, Wand2 } from 'lucide-react'
import { getElementAccent } from '../data/characterAccent.js'
import { getArcTypeMeta, getElementMeta, getRarityMeta } from '../data/gameMeta.jsx'
import { getCharacterAsset, getElementIcon, getTypeIcon } from '../utils/assetHelpers.js'
import CharacterStatsCard from './CharacterStatsCard.jsx'
import GameIconBadge from './ui/GameIconBadge.jsx'
import CharacterPortrait from './CharacterPortrait.jsx'

const roleIcon = {
  Attack: Swords,
  Defense: Shield,
  Support: Wand2,
  Special: Sparkles,
  Damage: Swords,
  'Main DPS': Swords,
  'Follow-up Attack': Sparkles,
}

const rarityGlow = {
  S: { bg: '#fff7ed', glow: 'rgba(245,158,11,0.24)', text: '#92400e' },
  A: { bg: '#faf5ff', glow: 'rgba(168,85,247,0.22)', text: '#7e22ce' },
  B: { bg: '#f0f9ff', glow: 'rgba(14,165,233,0.18)', text: '#0369a1' },
}

function rarityChipStyle(rarity) {
  if (rarity === 'S') {
    return {
      background: 'linear-gradient(135deg, rgba(255,255,255,0.94), rgba(254,243,199,0.82))',
      color: '#8a5b12',
      borderColor: 'rgba(245,158,11,0.22)',
      boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.86), 0 8px 20px rgba(245,158,11,0.10)',
    }
  }
  if (rarity === 'A') {
    return {
      background: 'linear-gradient(135deg, rgba(255,255,255,0.94), rgba(239,246,255,0.82))',
      color: '#475569',
      borderColor: 'rgba(148,163,184,0.22)',
      boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.86), 0 8px 20px rgba(148,163,184,0.08)',
    }
  }
  return {
    background: 'rgba(255,255,255,0.84)',
    color: '#0369a1',
    borderColor: 'rgba(14,165,233,0.18)',
    boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.86)',
  }
}

function formatStat(label, value) {
  if (value == null || value === '') return '-'
  const numeric = Number(value)
  if (!Number.isFinite(numeric)) return value
  if (label.includes('Crit')) return `${Number.isInteger(numeric) ? numeric : numeric.toFixed(1)}%`
  return Math.round(numeric).toLocaleString()
}

function withFallbackStats(stats = {}, fallbackStats = {}) {
  return ['hp', 'atk', 'def', 'critRate', 'critDmg'].reduce((acc, key) => {
    acc[key] = stats[key] ?? fallbackStats[key]
    return acc
  }, {})
}

function interpolateKeyframeLevelStats(levelStats, level) {
  const keyframes = [...levelStats.keyframes].sort((a, b) => a.level - b.level)
  const minLevel = levelStats.minLevel ?? keyframes[0]?.level ?? 1
  const maxLevel = levelStats.maxLevel ?? keyframes[keyframes.length - 1]?.level ?? 80
  const clamped = Math.min(maxLevel, Math.max(minLevel, level))

  const exact = keyframes.find((k) => k.level === clamped)
  if (exact) {
    return {
      hp: exact.hp,
      atk: exact.atk,
      def: exact.def,
      critRate: exact.critRate,
      critDmg: exact.critDmg,
    }
  }

  for (let i = 0; i < keyframes.length - 1; i += 1) {
    const a = keyframes[i]
    const b = keyframes[i + 1]
    if (clamped > a.level && clamped < b.level) {
      const span = b.level - a.level
      const t = span === 0 ? 0 : (clamped - a.level) / span
      return {
        hp: Math.round(a.hp + (b.hp - a.hp) * t),
        atk: Math.round(a.atk + (b.atk - a.atk) * t),
        def: Math.round(a.def + (b.def - a.def) * t),
        critRate: a.critRate,
        critDmg: a.critDmg,
      }
    }
  }

  const end = clamped >= maxLevel ? keyframes[keyframes.length - 1] : keyframes[0]
  return {
    hp: end.hp,
    atk: end.atk,
    def: end.def,
    critRate: end.critRate,
    critDmg: end.critDmg,
  }
}

function interpolateStats(levelStats, level, fallbackStats = {}) {
  if (Array.isArray(levelStats?.keyframes) && levelStats.keyframes.length >= 2) {
    return withFallbackStats(interpolateKeyframeLevelStats(levelStats, level), fallbackStats)
  }

  if (!levelStats?.level1 || !levelStats?.level90) return fallbackStats

  const minLevel = levelStats.minLevel ?? 1
  const maxLevel = levelStats.maxLevel ?? 90
  const progress = maxLevel === minLevel ? 0 : (level - minLevel) / (maxLevel - minLevel)

  const interpolated = ['hp', 'atk', 'def', 'critRate', 'critDmg'].reduce((acc, key) => {
    const start = Number(levelStats.level1[key])
    const end = Number(levelStats.level90[key])
    acc[key] = Number.isFinite(start) && Number.isFinite(end) ? start + (end - start) * progress : fallbackStats[key]
    return acc
  }, {})
  return withFallbackStats(interpolated, fallbackStats)
}

export default function CharacterHero({ character }) {
  const minLevel = character.levelStats?.minLevel ?? 1
  const maxLevel = character.levelStats?.maxLevel ?? 90
  const [level, setLevel] = useState(maxLevel)
  const accent = getElementAccent(character.element)
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
  const roles = character.roles || []
  const rarityTone = rarityGlow[character.rarity] || rarityGlow.B
  const statFallbacks = useMemo(
    () => ({ ...(character.stats || {}), ...(character.combatBaseStats?.values || {}) }),
    [character.stats, character.combatBaseStats],
  )
  const stats = useMemo(
    () => interpolateStats(character.levelStats, level, statFallbacks),
    [character.levelStats, statFallbacks, level],
  )

  return (
    <div className="grid gap-4 lg:grid-cols-[minmax(0,0.92fr)_minmax(0,1.08fr)]">
      <div
        className={[
          'character-hero-card card-premium relative overflow-hidden rounded-[26px] p-4 sm:p-5',
        ].join(' ')}
      >
        <div className={['pointer-events-none absolute inset-0 bg-gradient-to-br opacity-90', accent.softBg].join(' ')} aria-hidden />
        <div className="relative grid gap-4 sm:grid-cols-[minmax(150px,190px)_minmax(0,1fr)] sm:items-start">
          <div>
            <div
              className="relative aspect-square overflow-hidden rounded-[24px] border border-black/[0.06] shadow-inner"
            >
              <div
                className="absolute inset-0"
                style={{
                  background: `radial-gradient(circle at 50% 45%, ${rarityTone.glow}, transparent 66%), radial-gradient(circle at 20% 20%, ${element?.color || '#ff2f6d'}22, transparent 52%), linear-gradient(145deg, #ffffff, ${rarityTone.bg})`,
                }}
                aria-hidden
              />
              <CharacterPortrait src={resolvedImage} name={character.name} localAsset={Boolean(localAsset)} portrait={portrait} className="absolute inset-0" imageClassName={localAsset ? 'scale-[1.16] p-0' : 'scale-[1.06]'} />
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <h1 className="text-2xl font-bold tracking-tight text-[#111111] sm:text-3xl">{character.name}</h1>
              </div>
            </div>

            <div className="flex flex-wrap gap-2 text-sm font-semibold text-[#111111]">
              <span className="rounded-full border px-3 py-1.5 font-bold backdrop-blur" style={rarityChipStyle(character.rarity)}>{rarity?.label || character.rarity}</span>
              <span className="pill-glass inline-flex items-center gap-1.5 px-3 py-1.5">
                <GameIconBadge kind="element" value={element?.id} label={element?.label} assetIcon={elementAssetIcon} fallbackIcon={ElementIcon} size="sm" />
                {element?.label || character.element}
              </span>
              <span className="pill-glass inline-flex items-center gap-1.5 px-3 py-1.5">
                <GameIconBadge kind="arc" value={arc?.id} label={arc?.label} assetIcon={arcAssetIcon} fallbackIcon={ArcIcon} size="sm" />
                {arc?.label || character.arcType}
              </span>
            </div>

            <div className="grid gap-2 text-sm sm:grid-cols-2">
              <div className="min-w-0 rounded-2xl bg-white/75 px-3 py-2 ring-1 ring-black/[0.05]">
                <p className="text-[10px] font-semibold uppercase tracking-wide text-[#9ca3af]">Faction</p>
                <p className="mt-0.5 break-words font-semibold leading-snug text-[#111111]">{character.faction || 'Unknown'}</p>
              </div>
              <div className="min-w-0 rounded-2xl bg-white/75 px-3 py-2 ring-1 ring-black/[0.05]">
                <p className="text-[10px] font-semibold uppercase tracking-wide text-[#9ca3af]">Birthday</p>
                <p className="mt-0.5 font-semibold text-[#111111]">{character.birthday || 'Unknown'}</p>
              </div>
              <div className="rounded-2xl bg-white/75 px-3 py-2 ring-1 ring-black/[0.05] sm:col-span-2">
                <p className="text-[10px] font-semibold uppercase tracking-wide text-[#9ca3af]">Combat Style / Roles</p>
                {roles.length ? (
                  <div className="mt-1.5 flex flex-wrap gap-1.5">
                    {roles.map((r) => {
                      const R = roleIcon[r] || Sparkles
                      return (
                        <span key={r} className="inline-flex items-center gap-1 rounded-full bg-white/80 px-2.5 py-1 text-[11px] font-semibold text-[#111111] ring-1 ring-black/[0.05]">
                          <R className="h-3.5 w-3.5 text-[#6b7280]" strokeWidth={1.75} />
                          {r}
                        </span>
                      )
                    })}
                  </div>
                ) : (
                  <p className="mt-0.5 font-semibold text-[#111111]">Unknown</p>
                )}
              </div>
              <div className="rounded-2xl bg-white/75 px-3 py-2 ring-1 ring-black/[0.05] sm:col-span-2">
                <p className="text-[10px] font-semibold uppercase tracking-wide text-[#9ca3af]">{character.esperAbility ? 'Esper Ability' : 'Release / Obtain Info'}</p>
                <p className="mt-0.5 font-semibold text-[#111111]">{character.esperAbility || character.releaseStatus || character.versionLabel || 'Unknown'}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="card-premium relative overflow-hidden rounded-[26px] p-4 sm:p-5">
        <div className="soft-accent-wash pointer-events-none absolute inset-x-0 top-0 h-20 opacity-80" style={{ '--accent-current': element?.color || '#ff2f6d' }} aria-hidden />
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <h2 className="text-lg font-semibold tracking-tight text-[#111111]">Character Profile</h2>
            <p className="mt-2 max-w-3xl text-sm leading-relaxed text-[#6b7280] sm:text-[15px]">
              {character.profile?.text ?? character.profileText ?? 'Data coming soon'}
            </p>
          </div>
          <div className="surface-glass-soft rounded-2xl px-4 py-2 text-right">
            <p className="text-[11px] font-semibold uppercase tracking-wide text-[#6b7280]">Level</p>
            <p className="text-2xl font-bold tracking-tight text-[#111111] tabular-nums">{level}</p>
          </div>
        </div>

        <div className="surface-glass-soft mt-5 rounded-2xl px-4 py-4">
          <div className="mb-3 flex items-center justify-between text-xs font-semibold text-[#6b7280]">
            <span>Lv.{minLevel}</span>
            <span>Lv.{maxLevel}</span>
          </div>
          <input
            type="range"
            min={minLevel}
            max={maxLevel}
            value={level}
            onChange={(event) => setLevel(Number(event.target.value))}
            className="character-level-slider h-2 w-full cursor-pointer"
            style={{ '--slider-color': element?.color || '#14b8a6' }}
            aria-label="Character level"
          />
        </div>

        <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-5">
          <CharacterStatsCard label="HP" value={formatStat('HP', stats.hp)} />
          <CharacterStatsCard label="ATK" value={formatStat('ATK', stats.atk)} />
          <CharacterStatsCard label="DEF" value={formatStat('DEF', stats.def)} />
          <CharacterStatsCard label="Crit Rate" value={formatStat('Crit Rate', stats.critRate)} />
          <CharacterStatsCard label="Crit DMG" value={formatStat('Crit DMG', stats.critDmg)} />
        </div>
      </div>
    </div>
  )
}
