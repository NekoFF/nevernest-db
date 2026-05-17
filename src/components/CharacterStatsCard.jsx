export default function CharacterStatsCard({ label, value }) {
  return (
    <div className="rounded-2xl border border-black/[0.06] bg-[#fafafa] px-4 py-3.5 shadow-sm">
      <p className="text-[11px] font-semibold uppercase tracking-wide text-[#6b7280]">{label}</p>
      <p className="mt-1 text-lg font-semibold tracking-tight text-[#111111] tabular-nums">{value}</p>
    </div>
  )
}
