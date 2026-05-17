import { ArrowRight } from 'lucide-react'
import { updates } from '../data/updates.js'

const badgeStyles = {
  green: 'bg-emerald-50 text-emerald-700 ring-emerald-100',
  red: 'bg-rose-50 text-rose-700 ring-rose-100',
  orange: 'bg-orange-50 text-orange-700 ring-orange-100',
  blue: 'bg-sky-50 text-sky-700 ring-sky-100',
}

export default function LatestUpdates() {
  return (
    <section className="mt-12 md:mt-14">
      <div className="mb-4 flex items-end justify-between gap-4">
        <h2 className="text-lg font-semibold tracking-tight text-[#111111] md:text-xl">Latest Updates</h2>
        <a
          href="#"
          onClick={(e) => e.preventDefault()}
          className="group inline-flex items-center gap-1 text-sm font-semibold text-[#ff2f6d]"
        >
          View all
          <ArrowRight className="h-4 w-4 transition group-hover:translate-x-0.5" strokeWidth={2} />
        </a>
      </div>

      <div className="-mx-1 flex gap-3 overflow-x-auto pb-2 md:grid md:grid-cols-2 md:overflow-visible lg:grid-cols-4">
        {updates.map((item) => (
          <article
            key={item.id}
            className="min-w-[240px] flex-1 rounded-[18px] border border-black/[0.06] bg-white/90 p-4 shadow-[0_16px_50px_rgba(0,0,0,0.05)] transition hover:-translate-y-0.5 hover:shadow-[0_20px_60px_rgba(0,0,0,0.07)] md:min-w-0"
          >
            <span
              className={[
                'inline-flex items-center rounded-full px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wide ring-1 ring-inset',
                badgeStyles[item.badge] || badgeStyles.blue,
              ].join(' ')}
            >
              {item.kind}
            </span>
            <p className="mt-3 text-sm font-semibold leading-snug text-[#111111]">{item.title}</p>
            <p className="mt-2 text-xs text-[#6b7280]">{item.time}</p>
          </article>
        ))}
      </div>
    </section>
  )
}
