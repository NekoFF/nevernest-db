export default function WeaponRefinementList({ refinements = [] }) {
  return (
    <section className="rounded-[30px] border border-white/75 bg-white/82 p-5 shadow-[0_20px_70px_rgba(0,0,0,0.055)] ring-1 ring-black/[0.035] backdrop-blur">
      <div>
        <h2 className="text-lg font-bold tracking-tight text-[#111111]">Refinement / Resonance</h2>
        <p className="mt-1 text-sm text-[#6b7280]">Rank effects pulled from the current arc database.</p>
      </div>
      {refinements.length === 0 ? (
        <p className="mt-4 rounded-[20px] border border-dashed border-black/[0.08] bg-[#fafafa] px-5 py-8 text-center text-sm text-[#6b7280]">
          Data coming soon.
        </p>
      ) : (
        <div className="mt-4 space-y-3">
          {refinements.map((rank) => (
            <article key={rank.rank} className="rounded-[22px] border border-black/[0.055] bg-[#fafafa]/92 p-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.85)]">
              <div className="flex items-start gap-3">
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl border border-[#ff2f6d]/12 bg-[#ff2f6d]/10 text-sm font-bold text-[#ff2f6d] shadow-[0_10px_24px_rgba(255,47,109,0.1)]">
                  R{rank.rank}
                </span>
                <p className="text-sm leading-7 text-[#4b5563]">{rank.effect || 'Data coming soon.'}</p>
              </div>
            </article>
          ))}
        </div>
      )}
    </section>
  )
}
