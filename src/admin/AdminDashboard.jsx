import { useRef } from 'react'
import { Database, Download, HardDrive, RotateCcw, Upload, X } from 'lucide-react'
import { useAdminMode } from './AdminModeContext.jsx'

function downloadJson(data, filename) {
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = filename
  document.body.appendChild(link)
  link.click()
  link.remove()
  URL.revokeObjectURL(url)
}

function downloadJson5(data, filename) {
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json5' })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = filename
  document.body.appendChild(link)
  link.click()
  link.remove()
  URL.revokeObjectURL(url)
}

export default function AdminDashboard({ open, onClose }) {
  const inputRef = useRef(null)
  const importModeRef = useRef('merge')
  const {
    mergedCharacters,
    mergedWeapons,
    mergedCartridges,
    mergedVehicles,
    mergedNews,
    mergedCodes,
    adminStorageStatus,
    exportAllAdminData,
    exportCartridgeOnlyAdminData,
    importAllAdminData,
    resetAllAdminData,
  } = useAdminMode()

  if (!open) return null

  const importFile = async (event) => {
    const file = event.target.files?.[0]
    event.target.value = ''
    if (!file) return
    try {
      const payload = JSON.parse(await file.text())
      if (!payload || typeof payload !== 'object') throw new Error('Invalid admin data JSON.')
      const merge = importModeRef.current !== 'replace'
      const message = merge
        ? 'Import admin data into this browser? This will merge imported overrides with current local admin data.'
        : 'Replace local admin overrides with this file? Default seed data will remain, but current local admin overrides will be overwritten.'
      if (!window.confirm(message)) return
      importAllAdminData(payload, { merge })
      window.alert('Admin data imported.')
    } catch {
      window.alert('Invalid admin data JSON.')
    }
  }

  const reset = () => {
    if (!window.confirm('This resets local admin overrides stored in this browser. Default seed data will remain. Continue?')) return
    resetAllAdminData()
    window.alert('Local admin data reset.')
  }

  const exportCartridgesOnly = () => {
    const payload = exportCartridgeOnlyAdminData()
    const validation = payload.validation || {}
    const warnings = []
    if (validation.cartridgeCount !== 12) warnings.push(`Found ${validation.cartridgeCount || 0} cartridge override records; expected 12.`)
    if (!validation.allTwelveVerified) warnings.push(`${validation.verifiedCount || 0}/12 cartridge overrides are verified.`)
    if (!validation.allHaveFourShapes) warnings.push('One or more cartridge overrides does not have exactly 4 compatibleModuleShapeIds.')
    if (validation.duplicateWarnings?.length) warnings.push(`${validation.duplicateWarnings.length} cartridge override(s) contain duplicate shape IDs. Export will continue because duplicates may be valid.`)
    if (warnings.length) window.alert(`Cartridges-only export validation warning:\n\n${warnings.join('\n')}`)
    downloadJson(payload, `nte-admin-cartridges-${new Date().toISOString().slice(0, 10)}.json`)
  }

  const cards = [
    ['Characters', mergedCharacters.length],
    ['Weapons', mergedWeapons.length],
    ['Modules / Cartridges', mergedCartridges.length],
    ['Vehicles', mergedVehicles.length],
    ['News', mergedNews.length],
    ['Codes', mergedCodes.length],
    ['Build Planner data', 'Merged'],
  ]
  const lastSavedLabel = adminStorageStatus?.lastSavedAt
    ? new Date(adminStorageStatus.lastSavedAt).toLocaleString()
    : 'No local admin save yet'

  return (
    <div className="fixed inset-0 z-[130] flex items-center justify-center p-4" role="dialog" aria-modal="true">
      <button type="button" className="absolute inset-0 bg-black/35 backdrop-blur-sm" aria-label="Close admin overview" onClick={onClose} />
      <section className="relative z-[131] flex max-h-[min(92vh,860px)] w-full max-w-4xl flex-col overflow-hidden rounded-[28px] border border-white/70 bg-white/96 shadow-[0_30px_100px_rgba(0,0,0,0.24)] backdrop-blur-xl">
        <div className="flex items-start justify-between gap-3 border-b border-black/[0.06] px-5 py-4 sm:px-7">
          <div className="flex items-center gap-3">
            <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#ff2f6d]/10 text-[#ff2f6d]"><Database className="h-5 w-5" /></span>
            <div>
              <p className="text-xs font-black uppercase tracking-[0.16em] text-[#ff2f6d]">Admin Overview</p>
              <h2 className="mt-1 text-xl font-black tracking-tight text-[#111111]">Local data management</h2>
            </div>
          </div>
          <button type="button" onClick={onClose} className="flex h-10 w-10 items-center justify-center rounded-2xl border border-black/[0.06] bg-[#fafafa] text-[#6b7280] transition hover:bg-white hover:text-[#111111]">
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-5 py-5 sm:px-7">
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {cards.map(([label, value]) => (
              <div key={label} className="rounded-2xl border border-black/[0.05] bg-[#fafafa] px-4 py-3">
                <p className="text-[10px] font-black uppercase tracking-wide text-[#9ca3af]">{label}</p>
                <p className="mt-1 text-lg font-black text-[#111111] tabular-nums">{value}</p>
              </div>
            ))}
          </div>

          <div className="mt-4 rounded-[22px] border border-[#ff2f6d]/12 bg-[#fff7fa] p-4">
            <div className="flex items-start gap-3">
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-white text-[#ff2f6d] ring-1 ring-[#ff2f6d]/10">
                <HardDrive className="h-4 w-4" />
              </span>
              <div>
                <p className="text-sm font-black text-[#111111]">Storage mode: Local browser storage</p>
                <div className="mt-2 flex flex-wrap gap-2 text-xs font-bold">
                  <span className="rounded-full bg-white px-2.5 py-1 text-[#be123c] ring-1 ring-[#ff2f6d]/10">Backend: Not connected</span>
                  <span className="rounded-full bg-white px-2.5 py-1 text-[#be123c] ring-1 ring-[#ff2f6d]/10">Last saved: {lastSavedLabel}</span>
                  <span className="rounded-full bg-white px-2.5 py-1 text-[#be123c] ring-1 ring-[#ff2f6d]/10">Admin overrides: {adminStorageStatus?.totalOverrides ?? 0}</span>
                  <span className="rounded-full bg-white px-2.5 py-1 text-[#be123c] ring-1 ring-[#ff2f6d]/10">Backup recommended: Export Admin JSON5</span>
                </div>
                <p className="mt-2 text-sm leading-6 text-[#6b7280]">
                  Admin edits are saved in this browser via localStorage. They survive refreshes and normal dev server restarts in the same browser profile. Use Export Admin JSON5 to create one full-site handoff file for applying changes back into source data. No production write path is enabled here.
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2 border-t border-black/[0.06] px-5 py-4 sm:px-7">
          <button type="button" onClick={() => downloadJson5(exportAllAdminData(), `nte-admin-data-${new Date().toISOString().slice(0, 10)}.json5`)} className="inline-flex h-10 items-center gap-2 rounded-full bg-[#111111] px-4 text-sm font-bold text-white">
            <Download className="h-4 w-4" /> Export Admin JSON5
          </button>
          <button type="button" onClick={exportCartridgesOnly} className="inline-flex h-10 items-center gap-2 rounded-full border border-black/[0.08] bg-white px-4 text-sm font-bold text-[#111111]">
            <Download className="h-4 w-4" /> Export Cartridges Only
          </button>
          <button type="button" onClick={() => { importModeRef.current = 'merge'; inputRef.current?.click() }} className="inline-flex h-10 items-center gap-2 rounded-full border border-black/[0.08] bg-white px-4 text-sm font-bold text-[#6b7280]">
            <Upload className="h-4 w-4" /> Import Merge
          </button>
          <button type="button" onClick={() => { importModeRef.current = 'replace'; inputRef.current?.click() }} className="inline-flex h-10 items-center gap-2 rounded-full border border-black/[0.08] bg-white px-4 text-sm font-bold text-[#6b7280]">
            <Upload className="h-4 w-4" /> Import Replace
          </button>
          <button type="button" onClick={reset} className="inline-flex h-10 items-center gap-2 rounded-full border border-rose-100 bg-rose-50 px-4 text-sm font-bold text-rose-700">
            <RotateCcw className="h-4 w-4" /> Reset Admin Data
          </button>
          <input ref={inputRef} type="file" accept=".json,.json5,application/json,application/json5" onChange={importFile} className="hidden" />
        </div>
      </section>
    </div>
  )
}
