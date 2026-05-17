import { BookOpen, CarFront, Gift, Layers3, Sparkles, Swords, Users, Zap } from 'lucide-react'

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

export default function GuidesPage() {
  return (
    <div className="space-y-7 pb-8">
      <header className="rounded-[28px] border border-black/[0.06] bg-white/92 p-6 shadow-[0_20px_60px_rgba(0,0,0,0.055)] sm:p-8">
        <div className="inline-flex items-center gap-2 rounded-full border border-[#ff2f6d]/15 bg-[#ff2f6d]/8 px-3 py-1.5 text-xs font-semibold text-[#ff2f6d]">
          <BookOpen className="h-3.5 w-3.5" strokeWidth={1.8} aria-hidden />
          Planned guide library
        </div>
        <h1 className="mt-4 text-3xl font-bold tracking-tight text-[#111111] sm:text-4xl">Guides</h1>
        <p className="mt-2 max-w-3xl text-base leading-relaxed text-[#6b7280] sm:text-lg">
          Coming later: combat basics, Esper cycles, modules, cartridges, team building, vehicles, currencies.
        </p>
      </header>

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {guideCategories.map((category) => {
          const Icon = category.icon
          return (
            <article key={category.title} className="relative min-h-[156px] overflow-hidden rounded-[24px] border border-black/[0.06] bg-white/90 p-5 shadow-[0_18px_56px_rgba(0,0,0,0.052)]">
              <div className={`absolute -right-10 -top-10 h-36 w-36 rounded-full bg-gradient-to-br ${category.accent}`} aria-hidden />
              <div className="relative z-10">
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#ff2f6d]/10 text-[#ff2f6d]">
                  <Icon className="h-5 w-5" strokeWidth={1.75} aria-hidden />
                </div>
                <h2 className="mt-5 text-lg font-black tracking-tight text-[#111111]">{category.title}</h2>
                <p className="mt-2 text-sm leading-6 text-[#6b7280]">Reserved for verified manual guide content.</p>
              </div>
            </article>
          )
        })}
      </section>
    </div>
  )
}
