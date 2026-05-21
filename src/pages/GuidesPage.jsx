import { BookOpen, CarFront, Gift, Layers3, Sparkles, Swords, Users, Zap } from 'lucide-react'
import Seo from '../components/Seo.jsx'
import EmptyState from '../components/ui/EmptyState.jsx'

const guideCategories = [
  { title: 'Beginner Guide', icon: Sparkles, accent: 'from-rose-100/80 via-white to-transparent' },
  { title: 'Esper Cycles', icon: Zap, accent: 'from-cyan-100/70 via-white to-transparent' },
  { title: 'Modules & Cartridges', icon: Layers3, accent: 'from-violet-100/70 via-white to-transparent' },
  { title: 'Character Builds', icon: Users, accent: 'from-pink-100/70 via-white to-transparent' },
  { title: 'Team Building', icon: Swords, accent: 'from-amber-100/70 via-white to-transparent' },
  { title: 'Vehicles', icon: CarFront, accent: 'from-neutral-200/70 via-white to-transparent' },
  { title: 'Events', icon: BookOpen, accent: 'from-blue-100/70 via-white to-transparent' },
  { title: 'Codes', icon: Gift, accent: 'from-rose-100/70 via-white to-transparent' },
]

export default function GuidesPage({ topbarQuery = '' }) {
  const tokens = String(topbarQuery || '').trim().toLowerCase().split(/\s+/).filter(Boolean)
  const filteredCategories = guideCategories.filter((category) => {
    if (!tokens.length) return true
    const haystack = [category.title, 'guide planned manual content'].join(' ').toLowerCase()
    return tokens.every((token) => haystack.includes(token))
  })

  return (
    <div className="space-y-7 pb-8">
      <Seo title="Guides" description="Planned NTE guide categories for beginner help, builds, modules, vehicles, events, and codes." />
      <header className="card-premium rounded-[28px] p-6 sm:p-8">
        <div className="badge-soft inline-flex items-center gap-2 bg-[#fff7fa]/85 px-3 py-1.5 text-xs font-semibold text-[#ff2f6d]">
          <BookOpen className="h-3.5 w-3.5" strokeWidth={1.8} aria-hidden />
          Planned guide library
        </div>
        <h1 className="mt-4 text-3xl font-bold tracking-tight text-[#111111] sm:text-4xl">Guides</h1>
        <p className="mt-2 max-w-3xl text-base leading-relaxed text-[#6b7280] sm:text-lg">
          Planned guide categories for combat basics, Esper cycles, modules, cartridges, team building, vehicles, currencies.
        </p>
      </header>

      <section className="surface-glass-strong rounded-[22px] p-3.5">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <span className="badge-soft px-3 py-2 text-sm font-bold text-[#6b7280]">
            <span className="text-[#111111] tabular-nums">{filteredCategories.length}</span> planned guide{filteredCategories.length === 1 ? '' : 's'}
          </span>
          <span className="badge-soft bg-amber-50/85 px-3 py-2 text-xs font-bold uppercase tracking-wide text-amber-700">
            Planned
          </span>
        </div>
      </section>

      {filteredCategories.length ? (
      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {filteredCategories.map((category) => {
          const Icon = category.icon
          return (
            <article key={category.title} className="card-premium relative min-h-[156px] overflow-hidden rounded-[24px] p-5">
              <div className={`absolute -right-10 -top-10 h-36 w-36 rounded-full bg-gradient-to-br ${category.accent}`} aria-hidden />
              <div className="relative z-10">
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#ff2f6d]/10 text-[#ff2f6d]">
                  <Icon className="h-5 w-5" strokeWidth={1.75} aria-hidden />
                </div>
                <h2 className="mt-5 text-lg font-black tracking-tight text-[#111111]">{category.title}</h2>
                <p className="mt-2 text-sm leading-6 text-[#6b7280]">Reserved for curated manual guide content.</p>
              </div>
            </article>
          )
        })}
      </section>
      ) : (
        <EmptyState title="No guides found" description="No planned guide category matches the current search." />
      )}
    </div>
  )
}
