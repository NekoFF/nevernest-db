import { useEffect, useMemo, useState } from 'react'
import { ArrowRight, MessagesSquare, Pencil, Users, X } from 'lucide-react'
import StatItem from './StatItem.jsx'
import { useAdminMode } from '../admin/AdminModeContext.jsx'
import { ModuleBlocksIcon, WeaponArcIcon } from './ui/NteCategoryIcons.jsx'

const LS_HOME_BANNERS = 'nte-home-banner-slides'

const defaultSlides = [
  {
    title: 'NTE Community Database',
    subtitle: 'Characters, weapons, modules, and build references in one clean hub.',
    imageUrl: '',
    linkUrl: '/characters',
    buttonLabel: 'Explore Database',
    type: 'Guide',
    enabled: true,
  },
  {
    title: 'Modules / Cartridges',
    subtitle: 'Compare set bonuses, module shapes, and rarity variants without opening a spreadsheet.',
    imageUrl: '',
    linkUrl: '/modules',
    buttonLabel: 'Open Modules',
    type: 'Guide',
    enabled: true,
  },
  {
    title: 'Weapon Arcs',
    subtitle: 'Browse arc rarity, types, stat lines, and refinement effects.',
    imageUrl: '',
    linkUrl: '/weapons',
    buttonLabel: 'View Weapons',
    type: 'Guide',
    enabled: true,
  },
  {
    title: 'Apartments',
    subtitle: 'Housing and city-life references will live here as the database grows.',
    imageUrl: '',
    linkUrl: '/apartments',
    buttonLabel: 'Coming Later',
    type: 'Promo',
    enabled: true,
  },
]

function readSlides() {
  try {
    const raw = localStorage.getItem(LS_HOME_BANNERS)
    if (!raw) return defaultSlides
    const parsed = JSON.parse(raw)
    return Array.isArray(parsed) && parsed.length ? parsed.slice(0, 4) : defaultSlides
  } catch {
    return defaultSlides
  }
}

function saveSlides(slides) {
  try {
    localStorage.setItem(LS_HOME_BANNERS, JSON.stringify(slides.slice(0, 4)))
  } catch {
    /* ignore */
  }
}

export default function Hero({ onNavigate }) {
  const { isAdminMode, mergedCharacters, mergedWeapons, mergedCartridges } = useAdminMode()
  const [slides, setSlides] = useState(() => readSlides())
  const [active, setActive] = useState(0)
  const [paused, setPaused] = useState(false)
  const [editorOpen, setEditorOpen] = useState(false)
  const enabledSlides = useMemo(() => slides.filter((slide) => slide.enabled !== false).slice(0, 4), [slides])
  const current = enabledSlides[active] || enabledSlides[0] || defaultSlides[0]

  useEffect(() => {
    if (paused || enabledSlides.length <= 1) return undefined
    const timer = window.setInterval(() => {
      setActive((index) => (index + 1) % enabledSlides.length)
    }, 7000)
    return () => window.clearInterval(timer)
  }, [enabledSlides.length, paused])

  useEffect(() => {
    if (active >= enabledSlides.length) setActive(0)
  }, [active, enabledSlides.length])

  const openSlide = () => {
    if (!current?.linkUrl) return
    const target = current.linkUrl.replace(/^\//, '')
    onNavigate?.(target || 'home')
  }

  const updateSlides = (next) => {
    setSlides(next)
    saveSlides(next)
  }

  return (
    <section className="mb-10 md:mb-12">
      <div className="overflow-hidden rounded-[24px] border border-black/[0.06] bg-white/90 shadow-[0_20px_60px_rgba(0,0,0,0.06)]">
        <div className="grid gap-8 p-6 md:grid-cols-[0.92fr_1.08fr] md:gap-10 md:p-10 lg:p-12">
          <div className="flex flex-col justify-center gap-6">
            <div className="space-y-3">
              <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[#ff2f6d]">Neverness to Everness</p>
              <h1 className="text-3xl font-bold tracking-tight text-[#111111] sm:text-4xl lg:text-[2.6rem] lg:leading-[1.1]">
                NTE Community Database
              </h1>
              <p className="max-w-xl text-base leading-relaxed text-[#6b7280] sm:text-[17px]">
                Explore characters, weapons, modules, guides, and future city-life systems from one clean database.
              </p>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
              <button
                type="button"
                onClick={() => onNavigate?.('characters')}
                className="group inline-flex items-center justify-center gap-2 rounded-full bg-[#111111] px-6 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-black"
              >
                Explore Database
                <ArrowRight className="h-4 w-4 transition group-hover:translate-x-0.5" strokeWidth={2} aria-hidden />
              </button>
              <button
                type="button"
                onClick={() => onNavigate?.('community')}
                className="inline-flex items-center justify-center gap-2 rounded-full border border-black/[0.08] bg-white px-6 py-3 text-sm font-semibold text-[#111111] shadow-sm transition hover:border-black/[0.12] hover:bg-white"
              >
                <MessagesSquare className="h-4 w-4 text-[#5865F2]" aria-hidden />
                Join Community
              </button>
            </div>

            <div className="grid grid-cols-2 gap-2.5 xl:grid-cols-4">
              <StatItem icon={Users} label="Characters" value={mergedCharacters.length.toLocaleString()} onClick={() => onNavigate?.('characters')} />
              <StatItem icon={WeaponArcIcon} label="Weapons" value={mergedWeapons.length.toLocaleString()} onClick={() => onNavigate?.('weapons')} />
              <StatItem icon={ModuleBlocksIcon} label="Modules" value={mergedCartridges.length.toLocaleString()} onClick={() => onNavigate?.('modules')} />
              <StatItem icon={MessagesSquare} label="Community" value="0" onClick={() => onNavigate?.('community')} />
            </div>
          </div>

          <div
            className="relative min-h-[320px] overflow-hidden rounded-[24px] border border-black/[0.05] bg-gradient-to-br from-slate-50 via-white to-rose-50/40 shadow-inner md:min-h-[360px]"
            onMouseEnter={() => setPaused(true)}
            onMouseLeave={() => setPaused(false)}
          >
            {current.imageUrl ? (
              <img src={current.imageUrl} alt="" className="absolute inset-0 h-full w-full object-cover" loading="eager" decoding="async" />
            ) : (
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(255,47,109,0.16),transparent_42%),radial-gradient(circle_at_82%_24%,rgba(14,165,233,0.14),transparent_38%),linear-gradient(135deg,#ffffff,#fff1f5)]" />
            )}
            <div className="absolute inset-0 bg-white/[0.025]" />
            <div className="absolute inset-x-0 bottom-0 h-2/3 bg-gradient-to-t from-white/[0.07] via-white/[0.035] to-transparent" />
            {isAdminMode ? (
              <button
                type="button"
                onClick={() => setEditorOpen(true)}
                className="absolute right-4 top-4 z-20 flex h-9 w-9 items-center justify-center rounded-full border border-black/[0.06] bg-white/90 text-[#6b7280] shadow-sm transition hover:text-[#111111]"
                aria-label="Edit carousel"
              >
                <Pencil className="h-4 w-4" strokeWidth={1.8} />
              </button>
            ) : null}
            <div className="absolute inset-x-0 bottom-0 z-10 p-4 sm:p-6">
              <span className="inline-flex rounded-full border border-white/70 bg-white/70 px-3 py-1 text-[11px] font-bold uppercase tracking-wide text-[#ff2f6d] shadow-sm">
                {current.type || 'Guide'}
              </span>
              <h2 className="mt-3 max-w-xl break-words text-2xl font-black leading-tight tracking-tight text-[#111111] sm:text-3xl">{current.title}</h2>
              <p className="mt-2 max-w-xl text-sm leading-6 text-[#4b5563] line-clamp-3">{current.subtitle}</p>
              {current.buttonLabel ? (
                <button type="button" onClick={openSlide} className="mt-4 max-w-full rounded-full bg-[#111111] px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-black">
                  {current.buttonLabel}
                </button>
              ) : null}
            </div>
            <div className="absolute bottom-4 left-1/2 z-20 flex -translate-x-1/2 gap-2 rounded-full border border-white/60 bg-white/40 px-2 py-1.5 shadow-sm">
              {enabledSlides.map((slide, index) => (
                <button
                  key={`${slide.title}-${index}`}
                  type="button"
                  onClick={() => setActive(index)}
                  className={`h-2 rounded-full transition ${index === active ? 'w-7 bg-white shadow-sm' : 'w-2 bg-white/65 hover:bg-white/85'}`}
                  aria-label={`Show slide ${index + 1}`}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
      {editorOpen ? <BannerEditor slides={slides} onSave={updateSlides} onClose={() => setEditorOpen(false)} /> : null}
    </section>
  )
}

function BannerEditor({ slides, onSave, onClose }) {
  const [draft, setDraft] = useState(() => {
    const padded = [...slides]
    while (padded.length < 4) padded.push({ title: '', subtitle: '', imageUrl: '', linkUrl: '', buttonLabel: '', type: 'News', enabled: false })
    return padded.slice(0, 4)
  })

  const update = (index, patch) => {
    setDraft((prev) => prev.map((slide, i) => (i === index ? { ...slide, ...patch } : slide)))
  }

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <button type="button" className="absolute inset-0 bg-black/30" aria-label="Close banner editor" onClick={onClose} />
      <div className="relative z-[101] max-h-[86vh] w-full max-w-3xl overflow-y-auto rounded-[24px] border border-black/[0.08] bg-white p-5 shadow-[0_28px_90px_rgba(0,0,0,0.18)]">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h2 className="text-lg font-bold tracking-tight text-[#111111]">Edit Home Banners</h2>
            <p className="mt-1 text-sm text-[#6b7280]">Local admin override, up to four slides.</p>
          </div>
          <button type="button" onClick={onClose} className="flex h-10 w-10 items-center justify-center rounded-2xl border border-black/[0.06] bg-[#fafafa]">
            <X className="h-4 w-4" />
          </button>
        </div>
        <div className="mt-5 space-y-4">
          {draft.map((slide, index) => (
            <section key={index} className="rounded-2xl border border-black/[0.06] bg-[#fafafa] p-4">
              <div className="mb-3 flex items-center justify-between">
                <p className="text-sm font-bold text-[#111111]">Slide {index + 1}</p>
                <label className="flex items-center gap-2 text-xs font-semibold text-[#6b7280]">
                  <input type="checkbox" checked={slide.enabled !== false} onChange={(event) => update(index, { enabled: event.target.checked })} />
                  Enabled
                </label>
              </div>
              <div className="grid gap-3 sm:grid-cols-2">
                <Field label="Title" value={slide.title} onChange={(value) => update(index, { title: value })} />
                <Field label="Type" value={slide.type} onChange={(value) => update(index, { type: value })} />
                <Field label="Image URL" value={slide.imageUrl} onChange={(value) => update(index, { imageUrl: value })} />
                <Field label="Link URL" value={slide.linkUrl} onChange={(value) => update(index, { linkUrl: value })} />
                <Field label="Button Label" value={slide.buttonLabel} onChange={(value) => update(index, { buttonLabel: value })} />
              </div>
              <Field textarea label="Subtitle" value={slide.subtitle} onChange={(value) => update(index, { subtitle: value })} />
            </section>
          ))}
        </div>
        <div className="mt-5 flex justify-end gap-2 border-t border-black/[0.06] pt-4">
          <button type="button" onClick={onClose} className="rounded-full border border-black/[0.08] bg-white px-5 py-2 text-sm font-semibold text-[#6b7280]">Cancel</button>
          <button type="button" onClick={() => { onSave(draft); onClose() }} className="rounded-full bg-[#111111] px-5 py-2 text-sm font-semibold text-white">Save</button>
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
        <input value={value || ''} onChange={(event) => onChange(event.target.value)} className="mt-1.5 h-10 w-full rounded-2xl border border-black/[0.08] bg-white px-3 text-sm outline-none focus:border-[#ff2f6d]/25" />
      )}
    </label>
  )
}
