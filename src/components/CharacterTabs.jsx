import { getElementAccent } from '../data/characterAccent.js'

const TABS = [
  { id: 'overview', label: 'Overview' },
  { id: 'skills', label: 'Skills' },
  { id: 'build', label: 'Build' },
  { id: 'teams', label: 'Teams' },
  { id: 'console', label: 'Console' },
  { id: 'materials', label: 'Materials' },
]

export default function CharacterTabs({ element, activeTab, onTabChange, children }) {
  const accent = getElementAccent(element)

  return (
    <div className="space-y-6">
      <div className="surface-glass-strong rounded-[22px] p-1.5 sm:p-2">
        <div className="flex gap-1 overflow-x-auto scrollbar-hide pb-0.5 sm:flex-wrap sm:overflow-visible">
          {TABS.map((t) => {
            const active = activeTab === t.id
            return (
              <button
                key={t.id}
                type="button"
                onClick={() => onTabChange(t.id)}
                className={[
                  'whitespace-nowrap rounded-full px-3.5 py-2 text-xs font-semibold transition ring-1 ring-inset sm:text-sm',
                  active ? `${accent.chip} shadow-sm ring-black/[0.06]` : 'text-[#6b7280] ring-transparent hover:bg-white/70 hover:text-[#111111]',
                ].join(' ')}
              >
                {t.label}
              </button>
            )
          })}
        </div>
      </div>
      <div>{children}</div>
    </div>
  )
}
