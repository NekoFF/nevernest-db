import { LayoutGrid, RotateCcw, Rows3 } from 'lucide-react'

export default function FilterControlBar({
  resultCount,
  sortValue,
  sortOptions,
  onSortChange,
  viewMode,
  onViewModeChange,
  onClearAll,
}) {
  return (
    <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
      <span className="pill-glass w-fit px-3 py-1.5 text-xs font-bold text-[#6b7280]">
        <span className="tabular-nums text-[#111111]">{resultCount}</span> results
      </span>

      <div className="flex flex-wrap items-center gap-2 sm:justify-end">
        <label className="control-glass inline-flex h-10 items-center gap-2 rounded-full pl-3 pr-2 text-sm font-semibold text-[#6b7280]">
          <span className="whitespace-nowrap text-xs uppercase tracking-wide">Sort</span>
          <select
            value={sortValue}
            onChange={(event) => onSortChange(event.target.value)}
            className="premium-select h-8 min-w-[150px] rounded-full border-0 px-3 text-sm font-semibold text-[#111111] outline-none"
          >
            {sortOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </label>

        <div className="control-glass inline-flex h-10 rounded-full p-1">
          {[
            ['grid', LayoutGrid, 'Grid'],
            ['compact', Rows3, 'Compact'],
          ].map(([mode, Icon, label]) => (
            <button
              key={mode}
              type="button"
              onClick={() => onViewModeChange(mode)}
              className={`inline-flex items-center gap-1.5 rounded-full px-3 text-sm font-semibold transition ${
                viewMode === mode ? 'bg-[#fff1f5] text-[#be123c] shadow-sm' : 'text-[#6b7280] hover:bg-[#fafafa] hover:text-[#111111]'
              }`}
            >
              <Icon className="h-4 w-4" strokeWidth={1.8} aria-hidden />
              {label}
            </button>
          ))}
        </div>

        <button
          type="button"
          onClick={onClearAll}
          className="control-glass inline-flex h-10 items-center gap-2 rounded-full px-4 text-sm font-semibold text-[#111111] transition hover:bg-white"
        >
          <RotateCcw className="h-4 w-4 text-[#6b7280]" strokeWidth={1.8} aria-hidden />
          Clear All
        </button>
      </div>
    </div>
  )
}
