import { badgeClass } from './weaponStyle.js'

export default function WeaponMetricsCard({ weapon }) {
  const metrics = [
    { label: 'Rarity', value: weapon.rarity, badge: badgeClass('rarity', weapon.rarity) },
    { label: 'Type', value: weapon.type, badge: badgeClass('type', weapon.type) },
    { label: weapon.mainStat?.type || 'Main Stat', value: weapon.mainStat?.value || 'Data coming soon' },
    { label: weapon.subStat?.type || 'Sub Stat', value: weapon.subStat?.value || 'Data coming soon' },
  ]

  return (
    <section className="rounded-[30px] border border-white/75 bg-white/82 p-5 shadow-[0_20px_70px_rgba(0,0,0,0.055)] ring-1 ring-black/[0.035] backdrop-blur">
      <h2 className="text-lg font-bold tracking-tight text-[#111111]">Metrics</h2>
      <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {metrics.map((metric) => (
          <div key={metric.label} className="rounded-[22px] border border-black/[0.055] bg-[#fafafa]/88 p-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.9)]">
            <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[#9ca3af]">{metric.label}</p>
            <div className="mt-2">
              {metric.badge ? <span className={metric.badge}>{metric.value}</span> : <p className="text-xl font-bold text-[#111111]">{metric.value}</p>}
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
