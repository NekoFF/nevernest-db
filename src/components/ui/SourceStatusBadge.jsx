const STATUS_META = {
  verified: { label: 'Verified', className: 'bg-emerald-50/80 text-emerald-700' },
  needs_verification: { label: 'Review', className: 'bg-amber-50/85 text-amber-700' },
  estimated: { label: 'Estimated', className: 'bg-sky-50/85 text-sky-700' },
  placeholder: { label: 'Planned', className: 'bg-slate-50/85 text-slate-600' },
  mock: { label: 'Mock data', className: 'bg-fuchsia-50/85 text-fuchsia-700' },
  unknown: { label: 'Unknown', className: 'bg-white/80 text-[#6b7280]' },
}

export function sourceStatusLabel(status) {
  return STATUS_META[status]?.label || STATUS_META.unknown.label
}

export default function SourceStatusBadge({ status, className = '' }) {
  return null
}
