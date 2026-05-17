const STATUS_META = {
  verified: { label: 'Verified', className: 'border-emerald-200 bg-emerald-50 text-emerald-700' },
  needs_verification: { label: 'Needs verification', className: 'border-amber-200 bg-amber-50 text-amber-700' },
  estimated: { label: 'Estimated', className: 'border-sky-200 bg-sky-50 text-sky-700' },
  placeholder: { label: 'Source pending', className: 'border-slate-200 bg-slate-50 text-slate-600' },
  mock: { label: 'Mock data', className: 'border-fuchsia-200 bg-fuchsia-50 text-fuchsia-700' },
  unknown: { label: 'Source unknown', className: 'border-black/[0.08] bg-white text-[#6b7280]' },
}

export function sourceStatusLabel(status) {
  return STATUS_META[status]?.label || STATUS_META.unknown.label
}

export default function SourceStatusBadge({ status, className = '' }) {
  const meta = STATUS_META[status] || STATUS_META.unknown
  return (
    <span className={`inline-flex items-center rounded-full border px-2.5 py-1 text-[11px] font-bold ${meta.className} ${className}`}>
      {meta.label}
    </span>
  )
}
