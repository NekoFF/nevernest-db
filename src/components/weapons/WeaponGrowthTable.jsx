import SourceStatusBadge from '../ui/SourceStatusBadge.jsx'

export default function WeaponGrowthTable({ weapon }) {
  const rows = weapon.growthScaling || []
  const mainLabel = weapon.mainStat?.type || 'Main Stat'
  const subLabel = weapon.subStat?.type || 'Sub Stat'

  return (
    <section className="rounded-[30px] border border-white/75 bg-white/82 p-5 shadow-[0_20px_70px_rgba(0,0,0,0.055)] ring-1 ring-black/[0.035] backdrop-blur">
      <div>
        <div className="flex flex-wrap items-center gap-2">
          <h2 className="text-lg font-bold tracking-tight text-[#111111]">Growth Scaling</h2>
          <SourceStatusBadge status={weapon.sourceStatus} />
        </div>
        <p className="mt-1 text-sm text-[#6b7280]">Level progression for the main and sub stat values.</p>
      </div>
      {rows.length === 0 ? (
        <p className="mt-4 rounded-[20px] border border-dashed border-black/[0.08] bg-[#fafafa] px-5 py-8 text-center text-sm text-[#6b7280]">
          Data coming soon.
        </p>
      ) : (
        <div className="mt-4 overflow-hidden rounded-[22px] border border-black/[0.055] bg-white shadow-[inset_0_1px_0_rgba(255,255,255,0.9)]">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-black/[0.055] text-sm">
              <thead className="bg-[#fafafa] text-left text-xs font-semibold uppercase tracking-[0.14em] text-[#9ca3af]">
                <tr>
                  <th className="px-4 py-3.5">Level</th>
                  <th className="px-4 py-3.5">{mainLabel}</th>
                  <th className="px-4 py-3.5">{subLabel}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-black/[0.05] bg-white">
                {rows.map((row) => (
                  <tr key={row.level} className="transition hover:bg-[#fff7fa]">
                    <td className="px-4 py-3 font-semibold text-[#111111]">Lv. {row.level}</td>
                    <td className="px-4 py-3 text-[#4b5563]">{row.atk || 'Unknown'}</td>
                    <td className="px-4 py-3 text-[#4b5563]">{row.subStatValue || 'Unknown'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </section>
  )
}
