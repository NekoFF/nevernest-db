import { useMemo, useState } from 'react'
import { ArrowUpRight, CalendarDays, Check, ChevronDown, Edit3, Megaphone, PlayCircle, Plus, Sparkles, Trash2, X } from 'lucide-react'
import { useAdminMode } from '../admin/AdminModeContext.jsx'
import { newsCategories, newsSearchText, newsSortOptions, normalizeNewsEntry, prepareNewsDraftFromUrl, youtubeThumbnailFromUrl } from '../data/news.js'
import Seo from '../components/Seo.jsx'
import EmptyState from '../components/ui/EmptyState.jsx'
import { isApiMode } from '../repositories/dataSource.js'
import { getNews } from '../repositories/unified/contentRepository.js'
import { useAsyncData } from '../hooks/useAsyncData.js'

const categoryStyle = {
  Official: 'bg-[#fff7fa] text-[#be526b] ring-[#ff2f6d]/15',
  Updates: 'bg-[#f4f7ff] text-[#4f65b8] ring-blue-500/10',
  Events: 'bg-[#fff8ec] text-[#a45e16] ring-amber-500/16',
  Banners: 'bg-[#f7f1ff] text-[#7b4bc1] ring-violet-500/14',
  Videos: 'bg-[#eefbff] text-[#16758d] ring-cyan-500/14',
  Community: 'bg-[#f5f5f4] text-[#62605b] ring-black/[0.06]',
}

export default function NewsPage({ topbarQuery = '' }) {
  const { isAdminMode, mergedNews, saveNewsOverride, createNewsOverride, deleteNewsOverride } = useAdminMode()
  const apiMode = isApiMode()
  const { data: apiNews, error, loading, reload } = useAsyncData(
    () => getNews(mergedNews),
    [apiMode, mergedNews],
    { enabled: apiMode, initialData: [] },
  )
  const news = apiMode ? apiNews || [] : mergedNews
  const effectiveAdminMode = isAdminMode && !apiMode
  const [category, setCategory] = useState('All')
  const [sortBy, setSortBy] = useState('featured')
  const [selected, setSelected] = useState(null)
  const [editing, setEditing] = useState(null)

  const filtered = useMemo(() => {
    const tokens = String(topbarQuery || '').trim().toLowerCase().split(/\s+/).filter(Boolean)
    const rows = (news || []).filter((entry) => {
      if (category !== 'All' && entry.category !== category) return false
      if (!tokens.length) return true
      const haystack = newsSearchText(entry)
      return tokens.every((token) => haystack.includes(token))
    })
    const sorted = [...rows].sort((a, b) => {
      if (a.pinned !== b.pinned) return a.pinned ? -1 : 1
      if (sortBy === 'featured' && a.featured !== b.featured) return a.featured ? -1 : 1
      const dateA = Date.parse(a.date || '') || 0
      const dateB = Date.parse(b.date || '') || 0
      if (sortBy === 'oldest') return dateA - dateB
      return dateB - dateA
    })
    return sorted
  }, [category, news, sortBy, topbarQuery])

  const stats = useMemo(() => {
    const rows = news || []
    return [
      { label: 'Total news', value: rows.length },
      { label: 'Official', value: rows.filter((entry) => entry.category === 'Official').length },
      { label: 'Videos', value: rows.filter((entry) => entry.category === 'Videos').length },
      { label: 'Events', value: rows.filter((entry) => entry.category === 'Events').length },
    ]
  }, [news])

  const startCreate = () => {
    setEditing({ id: `news-${Date.now()}`, title: '', description: '', category: 'Community', date: new Date().toISOString().slice(0, 10), sourceLabel: '', sourceUrl: '', imageUrl: '', featured: false, pinned: false })
  }

  const saveDraft = (draft) => {
    const normalized = normalizeNewsEntry(draft, Date.now())
    if ((news || []).some((entry) => entry.id === normalized.id)) saveNewsOverride(normalized.id, normalized)
    else createNewsOverride(normalized)
    setEditing(null)
  }

  const deleteEntry = (entry) => {
    if (!window.confirm(`Delete "${entry.title}" from local News data?`)) return
    deleteNewsOverride(entry.id)
    setSelected(null)
  }

  return (
    <div className="space-y-7 pb-8">
      <Seo title="News" description="Follow NTE official updates, events, banners, videos, and community notes." />
      <header className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
        <div className="max-w-3xl">
          <div className="inline-flex items-center gap-2 rounded-full border border-[#ff2f6d]/15 bg-[#ff2f6d]/8 px-3 py-1.5 text-xs font-semibold text-[#ff2f6d]">
            <Megaphone className="h-3.5 w-3.5" strokeWidth={1.8} aria-hidden />
            Updates hub
          </div>
          <h1 className="mt-3 text-3xl font-bold tracking-tight text-[#111111] sm:text-4xl">News</h1>
          <p className="mt-2 max-w-2xl text-base leading-relaxed text-[#6b7280] sm:text-lg">
            Official updates, events, banners, videos, and community notes in one place.
          </p>
        </div>
        <div className="grid grid-cols-2 gap-2 sm:flex sm:flex-wrap sm:justify-end">
          {stats.map((item) => (
            <div key={item.label} className="rounded-2xl bg-white px-4 py-3 shadow-sm ring-1 ring-black/[0.06]">
              <p className="text-[11px] font-bold uppercase tracking-wide text-[#9ca3af]">{item.label}</p>
              <p className="mt-0.5 text-xl font-black tracking-tight text-[#111111] tabular-nums">{item.value}</p>
            </div>
          ))}
        </div>
      </header>

      <section className="rounded-[22px] border border-black/[0.06] bg-white/95 p-3 shadow-[0_16px_48px_rgba(0,0,0,0.045)] sm:p-3.5">
        <div className="flex flex-col gap-3 xl:flex-row xl:items-center xl:justify-between">
          <div className="flex flex-wrap gap-1.5">
            {newsCategories.map((item) => (
              <button
                key={item}
                type="button"
                onClick={() => setCategory(item)}
                className={`rounded-full border px-3.5 py-2 text-sm font-bold transition ${
                  category === item
                    ? 'border-[#ff2f6d]/16 bg-[#fff7fa] text-[#be526b] shadow-sm'
                    : 'border-black/[0.06] bg-[#fafafa] text-[#6b7280] hover:bg-white hover:text-[#111111]'
                }`}
              >
                {item}
              </button>
            ))}
          </div>
          <div className="flex flex-wrap items-center gap-2 xl:justify-end">
            <SortMenu value={sortBy} onChange={setSortBy} />
            {effectiveAdminMode ? (
              <button type="button" onClick={startCreate} className="inline-flex items-center gap-2 rounded-full bg-[#111111] px-4 py-2.5 text-sm font-bold text-white shadow-sm transition hover:bg-black">
                <Plus className="h-4 w-4" strokeWidth={2} />
                Add news
              </button>
            ) : null}
          </div>
        </div>
      </section>

      {loading ? (
        <EmptyState title="Loading news" description="Fetching news data from the local API." />
      ) : error ? (
        <EmptyState title="News failed to load" description={error.message || 'The local API did not return news data.'} action={<button type="button" onClick={reload} className="rounded-full bg-[#111111] px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-black">Retry</button>} />
      ) : filtered.length ? (
        <section className="grid gap-4 lg:grid-cols-2 2xl:grid-cols-3">
          {filtered.map((entry) => (
            <NewsCard key={entry.id} entry={entry} onOpen={setSelected} onEdit={setEditing} onDelete={deleteEntry} isAdminMode={effectiveAdminMode} />
          ))}
        </section>
      ) : (
        <EmptyState title="No news found" description="No news matches the current filters." />
      )}

      {selected ? <NewsDetail entry={selected} onClose={() => setSelected(null)} onEdit={() => { setEditing(selected); setSelected(null) }} isAdminMode={effectiveAdminMode} /> : null}
      {effectiveAdminMode && editing ? <NewsEditor entry={editing} onClose={() => setEditing(null)} onSave={saveDraft} /> : null}
    </div>
  )
}

function SortMenu({ value, onChange }) {
  const [open, setOpen] = useState(false)
  const current = newsSortOptions.find((item) => item.id === value) || newsSortOptions[0]
  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        onBlur={() => window.setTimeout(() => setOpen(false), 120)}
        className="inline-flex min-w-[168px] items-center justify-between gap-3 rounded-full border border-black/[0.06] bg-white px-4 py-2.5 text-sm font-bold text-[#111111] shadow-sm transition hover:bg-[#fafafa]"
      >
        {current.label}
        <ChevronDown className={`h-4 w-4 text-[#9ca3af] transition ${open ? 'rotate-180' : ''}`} strokeWidth={2} />
      </button>
      {open ? (
        <div className="absolute right-0 z-30 mt-2 w-48 overflow-hidden rounded-2xl border border-black/[0.06] bg-white p-1.5 shadow-[0_18px_60px_rgba(0,0,0,0.12)]">
          {newsSortOptions.map((item) => (
            <button
              key={item.id}
              type="button"
              onMouseDown={(event) => event.preventDefault()}
              onClick={() => {
                onChange(item.id)
                setOpen(false)
              }}
              className={`flex w-full items-center justify-between rounded-xl px-3 py-2 text-left text-sm font-semibold transition ${
                value === item.id ? 'bg-[#fff7fa] text-[#be526b]' : 'text-[#6b7280] hover:bg-[#fafafa] hover:text-[#111111]'
              }`}
            >
              {item.label}
              {value === item.id ? <Check className="h-4 w-4" strokeWidth={2} /> : null}
            </button>
          ))}
        </div>
      ) : null}
    </div>
  )
}

function NewsCard({ entry, onOpen, onEdit, onDelete, isAdminMode }) {
  const thumb = entry.imageUrl || youtubeThumbnailFromUrl(entry.sourceUrl)
  const isVideo = entry.category === 'Videos' || Boolean(youtubeThumbnailFromUrl(entry.sourceUrl))
  return (
    <article
      role="button"
      tabIndex={0}
      onClick={() => onOpen(entry)}
      onKeyDown={(event) => {
        if (event.key === 'Enter' || event.key === ' ') onOpen(entry)
      }}
      className="group overflow-hidden rounded-[26px] border border-black/[0.06] bg-white/92 shadow-[0_20px_60px_rgba(0,0,0,0.055)] transition duration-300 hover:-translate-y-0.5 hover:shadow-[0_28px_80px_rgba(0,0,0,0.08)]"
    >
      <div className="relative h-44 overflow-hidden bg-[#fafafa]">
        {thumb ? (
          <img src={thumb} alt="" className="h-full w-full object-cover transition duration-500 group-hover:scale-[1.035]" loading="lazy" />
        ) : (
          <div className="h-full w-full bg-[radial-gradient(circle_at_25%_25%,rgba(255,47,109,0.16),transparent_42%),radial-gradient(circle_at_82%_20%,rgba(245,158,11,0.14),transparent_38%),linear-gradient(135deg,#fff,#fff7fa)]" />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-white/80 via-white/[0.08] to-transparent" />
        {isVideo ? (
          <div className="absolute left-4 top-4 inline-flex items-center gap-2 rounded-full border border-white/70 bg-white/80 px-3 py-1.5 text-xs font-black text-[#111111] shadow-sm backdrop-blur-md">
            <PlayCircle className="h-4 w-4 text-[#ff2f6d]" strokeWidth={2} />
            Video
          </div>
        ) : null}
        <div className="absolute bottom-4 left-4 right-4 flex flex-wrap items-center gap-2">
          <CategoryBadge category={entry.category} />
          {entry.featured ? <Flag label="Featured" /> : null}
          {entry.pinned ? <Flag label="Pinned" /> : null}
        </div>
      </div>
      <div className="p-5">
        <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wide text-[#9ca3af]">
          <CalendarDays className="h-3.5 w-3.5" strokeWidth={2} />
          <span>{formatDate(entry.date)}</span>
          {entry.sourceLabel ? <span className="truncate normal-case tracking-normal text-[#6b7280]">by {entry.sourceLabel}</span> : null}
        </div>
        <h2 className="mt-3 line-clamp-2 text-xl font-black tracking-tight text-[#111111]">{entry.title}</h2>
        <p className="mt-2 line-clamp-3 text-sm leading-6 text-[#6b7280]">{entry.description || 'No description added yet.'}</p>
        <div className="mt-4 flex items-center justify-between gap-3">
          <span className="inline-flex items-center gap-1 text-sm font-bold text-[#ff2f6d]">
            Open details
            <ArrowUpRight className="h-4 w-4 transition group-hover:translate-x-0.5 group-hover:-translate-y-0.5" strokeWidth={2} />
          </span>
          {isAdminMode ? (
            <div className="flex gap-1.5" onClick={(event) => event.stopPropagation()}>
              <button type="button" onClick={() => onEdit(entry)} className="flex h-9 w-9 items-center justify-center rounded-full border border-black/[0.06] bg-[#fafafa] text-[#6b7280] transition hover:text-[#111111]" aria-label="Edit news">
                <Edit3 className="h-4 w-4" strokeWidth={1.8} />
              </button>
              <button type="button" onClick={() => onDelete(entry)} className="flex h-9 w-9 items-center justify-center rounded-full border border-rose-200 bg-rose-50 text-rose-600 transition hover:bg-rose-100" aria-label="Delete news">
                <Trash2 className="h-4 w-4" strokeWidth={1.8} />
              </button>
            </div>
          ) : null}
        </div>
      </div>
    </article>
  )
}

function NewsDetail({ entry, onClose, onEdit, isAdminMode }) {
  const thumb = entry.imageUrl || youtubeThumbnailFromUrl(entry.sourceUrl)
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <button type="button" className="absolute inset-0 bg-black/25 backdrop-blur-[2px]" aria-label="Close news details" onClick={onClose} />
      <article className="relative z-[101] max-h-[88vh] w-full max-w-3xl overflow-y-auto rounded-[28px] border border-black/[0.08] bg-white shadow-[0_28px_90px_rgba(0,0,0,0.18)]">
        <div className="relative h-64 overflow-hidden bg-[#fafafa]">
          {thumb ? <img src={thumb} alt="" className="h-full w-full object-cover" /> : <div className="h-full w-full bg-[linear-gradient(135deg,#fff,#fff7fa)]" />}
          <div className="absolute inset-0 bg-gradient-to-t from-white via-white/20 to-transparent" />
          <button type="button" onClick={onClose} className="absolute right-4 top-4 flex h-10 w-10 items-center justify-center rounded-full border border-white/70 bg-white/80 text-[#6b7280] shadow-sm backdrop-blur-md">
            <X className="h-4 w-4" />
          </button>
          <div className="absolute bottom-5 left-5 right-5 flex flex-wrap items-center gap-2">
            <CategoryBadge category={entry.category} />
            {entry.featured ? <Flag label="Featured" /> : null}
            {entry.pinned ? <Flag label="Pinned" /> : null}
          </div>
        </div>
        <div className="p-6 sm:p-7">
          <div className="flex flex-wrap items-center gap-2 text-xs font-bold uppercase tracking-wide text-[#9ca3af]">
            <CalendarDays className="h-3.5 w-3.5" strokeWidth={2} />
            <span>{formatDate(entry.date)}</span>
            {entry.sourceLabel ? <span>Source: {entry.sourceLabel}</span> : null}
          </div>
          <h2 className="mt-3 text-3xl font-black tracking-tight text-[#111111]">{entry.title}</h2>
          <p className="mt-3 text-base leading-8 text-[#4b5563]">{entry.description || 'No description added yet.'}</p>
          <div className="mt-6 flex flex-wrap gap-2 border-t border-black/[0.06] pt-5">
            {entry.sourceUrl ? (
              <a href={entry.sourceUrl} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 rounded-full bg-[#111111] px-5 py-2.5 text-sm font-bold text-white shadow-sm transition hover:bg-black">
                Open source
                <ArrowUpRight className="h-4 w-4" strokeWidth={2} />
              </a>
            ) : null}
            {isAdminMode ? (
              <button type="button" onClick={onEdit} className="inline-flex items-center gap-2 rounded-full border border-black/[0.08] bg-white px-5 py-2.5 text-sm font-bold text-[#111111] shadow-sm transition hover:bg-[#fafafa]">
                <Edit3 className="h-4 w-4" strokeWidth={1.8} />
                Edit
              </button>
            ) : null}
          </div>
        </div>
      </article>
    </div>
  )
}

function NewsEditor({ entry, onClose, onSave }) {
  const [draft, setDraft] = useState(entry)
  const [urlInput, setUrlInput] = useState('')
  const update = (patch) => setDraft((prev) => ({ ...prev, ...patch }))
  const importUrl = () => {
    if (!urlInput.trim()) return
    const prepared = prepareNewsDraftFromUrl(urlInput)
    update({ ...prepared, title: draft.title || prepared.title })
    setUrlInput('')
  }

  return (
    <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
      <button type="button" className="absolute inset-0 bg-black/30" aria-label="Close news editor" onClick={onClose} />
      <div className="relative z-[111] max-h-[88vh] w-full max-w-3xl overflow-y-auto rounded-[26px] border border-black/[0.08] bg-white p-5 shadow-[0_28px_90px_rgba(0,0,0,0.18)] sm:p-6">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#ff2f6d]">Admin Mode</p>
            <h2 className="mt-1 text-xl font-black tracking-tight text-[#111111]">Edit News</h2>
            <p className="mt-1 text-sm text-[#6b7280]">Local admin data. URL import only prepares safe frontend drafts.</p>
          </div>
          <button type="button" onClick={onClose} className="flex h-10 w-10 items-center justify-center rounded-2xl border border-black/[0.06] bg-[#fafafa]">
            <X className="h-4 w-4" />
          </button>
        </div>

        <section className="mt-5 rounded-2xl border border-black/[0.06] bg-[#fafafa] p-3">
          <label className="block text-[11px] font-bold uppercase tracking-wide text-[#9ca3af]">Prepare draft from URL</label>
          <div className="mt-2 flex flex-col gap-2 sm:flex-row">
            <input value={urlInput} onChange={(event) => setUrlInput(event.target.value)} placeholder="Paste YouTube or source URL..." className="h-11 min-w-0 flex-1 rounded-full border border-black/[0.08] bg-white px-4 text-sm outline-none focus:border-[#ff2f6d]/25" />
            <button type="button" onClick={importUrl} className="rounded-full bg-[#111111] px-4 py-2 text-sm font-bold text-white">Prepare</button>
          </div>
        </section>

        <div className="mt-5 grid gap-4 sm:grid-cols-2">
          <Field label="Title" value={draft.title} onChange={(value) => update({ title: value })} />
          <label className="block">
            <span className="text-[11px] font-bold uppercase tracking-wide text-[#9ca3af]">Category</span>
            <select value={draft.category || 'Community'} onChange={(event) => update({ category: event.target.value })} className="mt-1.5 h-11 w-full rounded-2xl border border-black/[0.08] bg-white px-3 text-sm outline-none focus:border-[#ff2f6d]/25">
              {newsCategories.filter((item) => item !== 'All').map((item) => <option key={item} value={item}>{item}</option>)}
            </select>
          </label>
          <Field label="Date" value={draft.date} onChange={(value) => update({ date: value })} />
          <Field label="Source / Author" value={draft.sourceLabel} onChange={(value) => update({ sourceLabel: value })} />
          <Field label="Source URL" value={draft.sourceUrl} onChange={(value) => update({ sourceUrl: value, imageUrl: draft.imageUrl || youtubeThumbnailFromUrl(value) })} />
          <Field label="Image URL" value={draft.imageUrl} onChange={(value) => update({ imageUrl: value })} />
        </div>
        <Field textarea label="Description" value={draft.description} onChange={(value) => update({ description: value })} />
        <div className="mt-4 flex flex-wrap gap-4 rounded-2xl border border-black/[0.06] bg-[#fafafa] p-4">
          <label className="flex items-center gap-2 text-sm font-bold text-[#6b7280]">
            <input type="checkbox" checked={Boolean(draft.featured)} onChange={(event) => update({ featured: event.target.checked })} />
            Featured
          </label>
          <label className="flex items-center gap-2 text-sm font-bold text-[#6b7280]">
            <input type="checkbox" checked={Boolean(draft.pinned)} onChange={(event) => update({ pinned: event.target.checked })} />
            Pinned
          </label>
        </div>
        <div className="mt-5 flex justify-end gap-2 border-t border-black/[0.06] pt-4">
          <button type="button" onClick={onClose} className="rounded-full border border-black/[0.08] bg-white px-5 py-2 text-sm font-bold text-[#6b7280]">Cancel</button>
          <button type="button" onClick={() => onSave(draft)} className="rounded-full bg-[#111111] px-5 py-2 text-sm font-bold text-white">Save news</button>
        </div>
      </div>
    </div>
  )
}

function Field({ label, value, onChange, textarea = false }) {
  return (
    <label className={`block ${textarea ? 'mt-4' : ''}`}>
      <span className="text-[11px] font-bold uppercase tracking-wide text-[#9ca3af]">{label}</span>
      {textarea ? (
        <textarea value={value || ''} onChange={(event) => onChange(event.target.value)} className="mt-1.5 min-h-28 w-full rounded-2xl border border-black/[0.08] bg-white px-3 py-2 text-sm outline-none focus:border-[#ff2f6d]/25" />
      ) : (
        <input value={value || ''} onChange={(event) => onChange(event.target.value)} className="mt-1.5 h-11 w-full rounded-2xl border border-black/[0.08] bg-white px-3 text-sm outline-none focus:border-[#ff2f6d]/25" />
      )}
    </label>
  )
}

function CategoryBadge({ category }) {
  return (
    <span className={`rounded-full px-3 py-1 text-[11px] font-black uppercase tracking-wide shadow-sm ring-1 ${categoryStyle[category] || categoryStyle.Community}`}>
      {category}
    </span>
  )
}

function Flag({ label }) {
  return (
    <span className="inline-flex items-center gap-1 rounded-full border border-white/70 bg-white/80 px-2.5 py-1 text-[11px] font-black uppercase tracking-wide text-[#111111] shadow-sm backdrop-blur-md">
      <Sparkles className="h-3 w-3 text-[#ffb020]" strokeWidth={2} />
      {label}
    </span>
  )
}

function formatDate(value) {
  if (!value) return 'No date'
  const parsed = new Date(`${value}T00:00:00`)
  if (Number.isNaN(parsed.getTime())) return value
  return parsed.toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })
}
