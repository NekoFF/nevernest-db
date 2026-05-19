import { useMemo, useState } from 'react'
import { Check, ChevronDown, Copy, Gift, Pencil, Plus, Trash2, X } from 'lucide-react'
import SummaryCounters from '../components/ui/SummaryCounters.jsx'
import { normalizeCodeEntry } from '../data/codes.js'
import { useAdminMode } from '../admin/AdminModeContext.jsx'
import Seo from '../components/Seo.jsx'
import EmptyState from '../components/ui/EmptyState.jsx'
import SourceStatusBadge from '../components/ui/SourceStatusBadge.jsx'
import { isApiMode } from '../repositories/dataSource.js'
import { getCodes } from '../repositories/unified/contentRepository.js'
import { useAsyncData } from '../hooks/useAsyncData.js'
import { apiCountValue, apiFailureDescription } from '../utils/apiDisplay.js'
import { DISCOVERY_SOURCE_OPTIONS, matchesDiscoverySourceStatus } from '../utils/sourceStatusFilters.js'

const statusFilters = ['All', 'Active', 'Expired']
const sortOptions = [
  { value: 'active-first', label: 'Active first' },
  { value: 'expired-first', label: 'Expired first' },
  { value: 'newest', label: 'Newest first' },
  { value: 'oldest', label: 'Oldest first' },
  { value: 'alpha', label: 'Code A-Z' },
  { value: 'alpha-desc', label: 'Code Z-A' },
]

const emptyDraft = {
  id: '',
  code: '',
  rewardSummary: '',
  status: 'active',
  startDate: '',
  endDate: '',
  enabled: true,
  sortOrder: 999,
}

export default function CodesPage({ topbarQuery = '' }) {
  const { isAdminMode, mergedCodes, saveCodeOverride, createCodeOverride, deleteCodeOverride } = useAdminMode()
  const apiMode = isApiMode()
  const { data: apiCodes, error, loading, reload } = useAsyncData(
    () => getCodes(mergedCodes),
    [apiMode, mergedCodes],
    { enabled: apiMode, initialData: [] },
  )
  const codes = apiMode ? apiCodes || [] : mergedCodes
  const effectiveAdminMode = isAdminMode && !apiMode
  const [status, setStatus] = useState('All')
  const [sourceStatus, setSourceStatus] = useState('All')
  const [sortBy, setSortBy] = useState('active-first')
  const [copiedId, setCopiedId] = useState('')
  const [toast, setToast] = useState('')
  const [editing, setEditing] = useState(null)

  const visibleCodes = useMemo(() => {
    const searchText = [topbarQuery].filter(Boolean).join(' ').trim().toLowerCase()
    const tokens = searchText.split(/\s+/).filter(Boolean)
    const filtered = (codes || []).filter((entry) => {
      if (!effectiveAdminMode && entry.enabled === false) return false
      if (status !== 'All' && entry.status !== status.toLowerCase()) return false
      if (sourceStatus !== 'All' && !matchesDiscoverySourceStatus(entry.sourceStatus, sourceStatus)) return false
      if (!tokens.length) return true
      const haystack = [entry.id, entry.code, entry.rewardSummary, entry.status, entry.startDate, entry.endDate, entry.sourceStatus].join(' ').toLowerCase()
      return tokens.every((token) => haystack.includes(token))
    })
    return sortCodes(filtered, sortBy)
  }, [codes, effectiveAdminMode, sortBy, sourceStatus, status, topbarQuery])

  const counts = useMemo(() => {
    const enabled = (codes || []).filter((entry) => effectiveAdminMode || entry.enabled !== false)
    return {
      total: enabled.length,
      active: enabled.filter((entry) => entry.status === 'active').length,
      expired: enabled.filter((entry) => entry.status === 'expired').length,
    }
  }, [codes, effectiveAdminMode])

  const activeCodes = visibleCodes.filter((entry) => entry.status === 'active')
  const expiredCodes = visibleCodes.filter((entry) => entry.status === 'expired')
  const unknownCodes = visibleCodes.filter((entry) => entry.status !== 'active' && entry.status !== 'expired')

  const copyCode = async (entry) => {
    try {
      await navigator.clipboard.writeText(entry.code)
      setCopiedId(entry.id)
      setToast(`${entry.code} copied`)
      window.setTimeout(() => setCopiedId(''), 1600)
      window.setTimeout(() => setToast(''), 2200)
    } catch {
      setToast('Copy failed')
      window.setTimeout(() => setToast(''), 2200)
    }
  }

  const saveEntry = (draft) => {
    const normalized = normalizeCodeEntry(draft)
    if (!normalized.code) return
    if (draft.id) saveCodeOverride(draft.id, normalized)
    else createCodeOverride({ ...normalized, id: normalized.id || normalized.code.toLowerCase() })
    setEditing(null)
  }

  return (
    <div className="relative space-y-7 pb-6">
      <Seo title="Codes" description="Track NTE redeem codes, rewards, availability, and source confidence. Expiry and reward details may still need verification." />
      <header className="overflow-hidden rounded-[28px] border border-black/[0.06] bg-white/92 p-5 shadow-[0_22px_70px_rgba(0,0,0,0.055)] sm:p-6 lg:p-7">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-3xl space-y-3">
            <div className="inline-flex items-center gap-2 rounded-full border border-[#ff2f6d]/15 bg-[#ff2f6d]/8 px-3 py-1.5 text-xs font-semibold text-[#ff2f6d]">
              <Gift className="h-3.5 w-3.5" strokeWidth={1.8} aria-hidden />
              Source review pending
            </div>
            <div>
              <h1 className="text-3xl font-bold tracking-tight text-[#111111] sm:text-4xl">Codes</h1>
              <p className="mt-2 max-w-2xl text-base leading-relaxed text-[#6b7280] sm:text-lg">
                Copy redeem codes and track expired rewards. Active labels reflect the current local list, not a live redemption check; expiry dates and exact reward details still need source verification.
              </p>
            </div>
          </div>
          <SummaryCounters
            items={[
              { label: 'Total codes', value: apiCountValue(apiMode, loading, error, counts.total) },
              { label: 'Active', value: apiCountValue(apiMode, loading, error, counts.active), tone: 'b' },
              { label: 'Expired', value: apiCountValue(apiMode, loading, error, counts.expired) },
            ]}
          />
        </div>
      </header>

      <section className="rounded-[22px] border border-black/[0.06] bg-white/95 p-3 shadow-[0_16px_48px_rgba(0,0,0,0.045)] sm:p-3.5">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-wrap items-center gap-2">
            <div className="inline-flex rounded-full border border-black/[0.06] bg-[#fafafa] p-1 shadow-[inset_0_1px_0_rgba(255,255,255,0.8)]">
              {statusFilters.map((option) => (
                <button
                  key={option}
                  type="button"
                  onClick={() => setStatus(option)}
                  className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
                    status === option ? 'bg-white text-[#be123c] shadow-sm' : 'text-[#6b7280] hover:text-[#111111]'
                  }`}
                >
                  {option}
                </button>
              ))}
            </div>
            <div className="inline-flex rounded-full border border-black/[0.06] bg-[#fafafa] p-1 shadow-[inset_0_1px_0_rgba(255,255,255,0.8)]">
              {DISCOVERY_SOURCE_OPTIONS.map((option) => (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => setSourceStatus(option.value)}
                  className={`rounded-full px-3 py-2 text-sm font-semibold transition ${
                    sourceStatus === option.value ? 'bg-white text-[#be123c] shadow-sm' : 'text-[#6b7280] hover:text-[#111111]'
                  }`}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-2 sm:justify-end">
            <span className="rounded-full border border-black/[0.06] bg-white px-3 py-2 text-sm font-bold text-[#6b7280] shadow-sm">
              <span className="text-[#111111] tabular-nums">{visibleCodes.length}</span> visible
            </span>
            <CustomSelect value={sortBy} options={sortOptions} onChange={setSortBy} />
            <button
              type="button"
              onClick={() => {
                setStatus('All')
                setSourceStatus('All')
                setSortBy('active-first')
              }}
              className="inline-flex h-11 items-center rounded-full border border-black/[0.06] bg-white/90 px-4 text-sm font-semibold text-[#111111] shadow-sm transition hover:bg-[#fafafa]"
            >
              Reset filters
            </button>
            {effectiveAdminMode ? (
              <button type="button" onClick={() => setEditing({ ...emptyDraft })} className="inline-flex h-11 items-center gap-2 rounded-full bg-[#111111] px-4 text-sm font-semibold text-white shadow-sm transition hover:bg-black">
                <Plus className="h-4 w-4" strokeWidth={1.8} />
                Add Code
              </button>
            ) : null}
          </div>
        </div>
      </section>

      {loading ? (
        <EmptyState title="Loading codes" description="Fetching redeem code data from the local API." />
      ) : error ? (
        <EmptyState title="Codes failed to load" description={apiFailureDescription(error, 'The local API did not return code data.')} action={<button type="button" onClick={reload} className="rounded-full bg-[#111111] px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-black">Retry</button>} />
      ) : null}

      {!loading && !error ? (
        <>
          <CodeSection title="Active Codes" codes={activeCodes} copiedId={copiedId} onCopy={copyCode} onEdit={setEditing} onDelete={deleteCodeOverride} isAdminMode={effectiveAdminMode} />
          <CodeSection title="Expired Codes" codes={expiredCodes} copiedId={copiedId} onCopy={copyCode} onEdit={setEditing} onDelete={deleteCodeOverride} isAdminMode={effectiveAdminMode} muted />
          <CodeSection title="Codes" codes={unknownCodes} copiedId={copiedId} onCopy={copyCode} onEdit={setEditing} onDelete={deleteCodeOverride} isAdminMode={effectiveAdminMode} muted />
        </>
      ) : null}

      {!loading && !error && !visibleCodes.length ? (
        <EmptyState title="No codes found" description="No codes match your filters." />
      ) : null}

      {toast ? (
        <div className="fixed bottom-6 left-1/2 z-50 -translate-x-1/2 rounded-full border border-black/[0.06] bg-white/95 px-4 py-2 text-sm font-bold text-[#111111] shadow-[0_18px_55px_rgba(0,0,0,0.14)] backdrop-blur">
          {toast}
        </div>
      ) : null}
      {effectiveAdminMode && editing ? <CodeEditor draft={editing} onClose={() => setEditing(null)} onSave={saveEntry} /> : null}
    </div>
  )
}

function CodeSection({ title, codes, copiedId, onCopy, onEdit, onDelete, isAdminMode, muted = false }) {
  if (!codes.length) return null
  return (
    <section className="space-y-3">
      <div className="flex items-center justify-between gap-3">
        <h2 className="text-lg font-bold tracking-tight text-[#111111]">{title}</h2>
        <span className="rounded-full border border-black/[0.06] bg-white px-3 py-1 text-xs font-bold text-[#6b7280]">{codes.length} code{codes.length === 1 ? '' : 's'}</span>
      </div>
      <div className="grid grid-cols-1 gap-4 xl:grid-cols-2 2xl:grid-cols-3">
        {codes.map((entry) => (
          <CodeCard key={entry.id} entry={entry} copied={copiedId === entry.id} onCopy={onCopy} onEdit={onEdit} onDelete={onDelete} isAdminMode={isAdminMode} muted={muted} />
        ))}
      </div>
    </section>
  )
}

function CodeCard({ entry, copied, onCopy, onEdit, onDelete, isAdminMode, muted }) {
  const active = entry.status === 'active'
  return (
    <article className={`group relative overflow-hidden rounded-[26px] border bg-white/94 p-4 shadow-[0_18px_52px_rgba(0,0,0,0.055)] transition duration-200 hover:-translate-y-0.5 hover:bg-white hover:shadow-[0_24px_70px_rgba(0,0,0,0.075)] ${
      active ? 'border-emerald-500/14 hover:border-emerald-400/24' : 'border-rose-900/[0.08] opacity-90 hover:border-rose-300/28'
    }`}>
      <div className={`pointer-events-none absolute inset-x-4 top-0 h-px transition group-hover:opacity-100 ${active ? 'bg-gradient-to-r from-transparent via-cyan-300/70 to-transparent' : 'bg-gradient-to-r from-transparent via-rose-200/70 to-transparent'} ${muted ? 'opacity-50' : 'opacity-80'}`} />
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="break-all text-xl font-black tracking-tight text-[#111111]">{entry.code}</p>
          <p className="mt-2 line-clamp-2 text-sm font-semibold leading-6 text-[#6b7280]">{entry.rewardSummary || 'Reward details pending'}</p>
        </div>
        <StatusPill status={entry.status} />
      </div>
      <div className="mt-4 rounded-2xl border border-black/[0.045] bg-[#fafafa]/85 px-3 py-3">
        <p className="text-xs font-semibold text-[#6b7280]">{dateLine(entry)}</p>
        {entry.sourceStatus ? <SourceStatusBadge status={entry.sourceStatus} className="mt-2" /> : null}
        <p className="mt-2 text-xs font-semibold leading-5 text-[#9ca3af]">Manual redemption/source check recommended before public launch.</p>
      </div>
      <div className="mt-4 flex flex-wrap items-center justify-between gap-2">
        <button type="button" onClick={() => onCopy(entry)} className={`inline-flex h-10 items-center gap-2 rounded-full border px-4 text-sm font-bold shadow-sm transition ${copied ? 'border-emerald-200 bg-emerald-50 text-emerald-700' : 'border-black/[0.06] bg-white/85 text-[#4b5563] hover:border-[#ff2f6d]/18 hover:bg-[#fff7fa] hover:text-[#be123c]'}`}>
          {copied ? <Check className="h-4 w-4" strokeWidth={2} /> : <Copy className="h-4 w-4" strokeWidth={1.8} />}
          {copied ? 'Copied' : 'Copy'}
        </button>
        {isAdminMode ? (
          <div className="flex gap-2">
            <button type="button" onClick={() => onEdit(entry)} className="flex h-10 w-10 items-center justify-center rounded-full border border-black/[0.06] bg-white text-[#6b7280] transition hover:text-[#111111]" aria-label={`Edit ${entry.code}`}>
              <Pencil className="h-4 w-4" strokeWidth={1.8} />
            </button>
            <button type="button" onClick={() => onDelete(entry.id)} className="flex h-10 w-10 items-center justify-center rounded-full border border-rose-200 bg-rose-50 text-rose-700 transition hover:bg-rose-100" aria-label={`Delete ${entry.code}`}>
              <Trash2 className="h-4 w-4" strokeWidth={1.8} />
            </button>
          </div>
        ) : null}
      </div>
      {isAdminMode && entry.enabled === false ? <p className="mt-3 text-xs font-bold text-amber-700">Disabled in public view</p> : null}
    </article>
  )
}

function StatusPill({ status }) {
  const active = status === 'active'
  return (
    <span className={`shrink-0 rounded-full border px-3 py-1 text-xs font-black uppercase tracking-wide ${
      active ? 'border-emerald-200 bg-emerald-50 text-emerald-700' : 'border-rose-200 bg-rose-50 text-rose-700'
    }`}>
      {active ? 'Active' : 'Expired'}
    </span>
  )
}

function CustomSelect({ value, options, onChange }) {
  const [open, setOpen] = useState(false)
  const selected = options.find((option) => option.value === value) || options[0]
  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setOpen((current) => !current)}
        onBlur={() => window.setTimeout(() => setOpen(false), 120)}
        className="inline-flex h-11 items-center gap-2 rounded-full border border-black/[0.06] bg-white/90 pl-4 pr-3 text-sm font-semibold text-[#111111] shadow-sm transition hover:bg-white"
      >
        <span className="text-xs uppercase tracking-wide text-[#9ca3af]">Sort</span>
        {selected.label}
        <ChevronDown className={`h-4 w-4 text-[#9ca3af] transition ${open ? 'rotate-180' : ''}`} strokeWidth={1.8} />
      </button>
      {open ? (
        <div className="absolute right-0 top-[calc(100%+8px)] z-30 w-48 overflow-hidden rounded-[18px] border border-black/[0.06] bg-white/96 p-1.5 shadow-[0_18px_55px_rgba(0,0,0,0.12)] backdrop-blur">
          {options.map((option) => (
            <button
              key={option.value}
              type="button"
              onMouseDown={(event) => event.preventDefault()}
              onClick={() => {
                onChange(option.value)
                setOpen(false)
              }}
              className={`w-full rounded-[14px] px-3 py-2 text-left text-sm font-semibold transition ${
                value === option.value ? 'bg-[#fff1f5] text-[#be123c]' : 'text-[#6b7280] hover:bg-[#fafafa] hover:text-[#111111]'
              }`}
            >
              {option.label}
            </button>
          ))}
        </div>
      ) : null}
    </div>
  )
}

function dateLine(entry) {
  if (entry.startDate && entry.endDate) return `Listed window: ${entry.startDate} - ${entry.endDate}`
  if (entry.endDate) return `${entry.status === 'expired' ? 'Expired' : 'Expires'}: ${entry.endDate}`
  if (entry.startDate) return `Started: ${entry.startDate}`
  return entry.status === 'active' ? 'Expiry not announced; verify before redeeming' : 'No longer redeemable'
}

function CodeEditor({ draft, onClose, onSave }) {
  const [form, setForm] = useState(() => ({ ...emptyDraft, ...draft }))
  const update = (patch) => setForm((current) => ({ ...current, ...patch }))

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4" role="dialog" aria-modal="true">
      <button type="button" className="absolute inset-0 bg-black/30 backdrop-blur-sm" aria-label="Close code editor" onClick={onClose} />
      <div className="relative z-[101] max-h-[88vh] w-full max-w-2xl overflow-y-auto rounded-[26px] border border-black/[0.08] bg-white p-5 shadow-[0_28px_90px_rgba(0,0,0,0.18)]">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h2 className="text-lg font-bold tracking-tight text-[#111111]">{form.id ? 'Edit Code' : 'Add Code'}</h2>
            <p className="mt-1 text-sm text-[#6b7280]">Local admin data for the Codes page.</p>
          </div>
          <button type="button" onClick={onClose} className="flex h-10 w-10 items-center justify-center rounded-2xl border border-black/[0.06] bg-[#fafafa] text-[#6b7280]">
            <X className="h-4 w-4" />
          </button>
        </div>
        <div className="mt-5 grid gap-3 sm:grid-cols-2">
          <Field label="Code" value={form.code} onChange={(value) => update({ code: value.toUpperCase() })} />
          <label className="block">
            <span className="text-[11px] font-bold uppercase tracking-wide text-[#9ca3af]">Status</span>
            <select value={form.status} onChange={(event) => update({ status: event.target.value })} className="mt-1.5 h-10 w-full rounded-2xl border border-black/[0.08] bg-white px-3 text-sm outline-none focus:border-[#ff2f6d]/25">
              <option value="active">Active</option>
              <option value="expired">Expired</option>
            </select>
          </label>
          <Field label="Start Date" value={form.startDate} onChange={(value) => update({ startDate: value })} />
          <Field label="End Date / Expiry" value={form.endDate} onChange={(value) => update({ endDate: value })} />
          <Field label="Sort Order" value={form.sortOrder} onChange={(value) => update({ sortOrder: value })} />
          <label className="mt-6 flex items-center gap-2 text-sm font-semibold text-[#6b7280]">
            <input type="checkbox" checked={form.enabled !== false} onChange={(event) => update({ enabled: event.target.checked })} />
            Enabled
          </label>
        </div>
        <Field textarea label="Reward Summary" value={form.rewardSummary} onChange={(value) => update({ rewardSummary: value })} />
        <div className="mt-5 flex justify-end gap-2 border-t border-black/[0.06] pt-4">
          <button type="button" onClick={onClose} className="rounded-full border border-black/[0.08] bg-white px-5 py-2 text-sm font-semibold text-[#6b7280]">Cancel</button>
          <button type="button" onClick={() => onSave(form)} className="rounded-full bg-[#111111] px-5 py-2 text-sm font-semibold text-white">Save</button>
        </div>
      </div>
    </div>
  )
}

function Field({ label, value, onChange, textarea = false }) {
  return (
    <label className={`block ${textarea ? 'mt-3' : ''}`}>
      <span className="text-[11px] font-bold uppercase tracking-wide text-[#9ca3af]">{label}</span>
      {textarea ? (
        <textarea value={value || ''} onChange={(event) => onChange(event.target.value)} className="mt-1.5 min-h-20 w-full rounded-2xl border border-black/[0.08] bg-white px-3 py-2 text-sm outline-none focus:border-[#ff2f6d]/25" />
      ) : (
        <input value={value ?? ''} onChange={(event) => onChange(event.target.value)} className="mt-1.5 h-10 w-full rounded-2xl border border-black/[0.08] bg-white px-3 text-sm outline-none focus:border-[#ff2f6d]/25" />
      )}
    </label>
  )
}

function sortCodes(items, sortBy) {
  const next = [...items]
  if (sortBy === 'newest') return next.sort((a, b) => Number(b.sortOrder) - Number(a.sortOrder) || a.code.localeCompare(b.code))
  if (sortBy === 'oldest') return next.sort((a, b) => Number(a.sortOrder) - Number(b.sortOrder) || a.code.localeCompare(b.code))
  if (sortBy === 'alpha') return next.sort((a, b) => a.code.localeCompare(b.code))
  if (sortBy === 'alpha-desc') return next.sort((a, b) => b.code.localeCompare(a.code))
  if (sortBy === 'expired-first') return next.sort((a, b) => Number(b.status === 'expired') - Number(a.status === 'expired') || Number(a.sortOrder) - Number(b.sortOrder) || a.code.localeCompare(b.code))
  return next.sort((a, b) => Number(b.status === 'active') - Number(a.status === 'active') || Number(a.sortOrder) - Number(b.sortOrder) || a.code.localeCompare(b.code))
}
