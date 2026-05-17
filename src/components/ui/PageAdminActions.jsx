import { Plus } from 'lucide-react'

export default function PageAdminActions({ children, className = '' }) {
  return (
    <div className={['flex flex-col items-start gap-3 sm:flex-row sm:items-center sm:justify-end', className].filter(Boolean).join(' ')}>
      {children}
    </div>
  )
}

export function AdminAddButton({ label, onClick, icon: Icon = Plus }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="inline-flex h-10 items-center justify-center gap-2 rounded-full bg-[#111111] px-4 text-sm font-semibold text-white shadow-[0_12px_30px_rgba(0,0,0,0.12)] transition hover:-translate-y-0.5 hover:bg-black focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#ff2f6d]/30"
    >
      <Icon className="h-4 w-4" strokeWidth={2} aria-hidden />
      {label}
    </button>
  )
}
