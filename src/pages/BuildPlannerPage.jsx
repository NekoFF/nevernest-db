import { Component, useRef, useState, useMemo } from 'react'
import {
  ArrowUpRight,
  Calculator,
  ChevronDown,
  CircleDot,
  Disc3,
  Edit3,
  FileJson,
  FolderOpen,
  ImageDown,
  Layers3,
  Plus,
  RotateCcw,
  Save,
  Search,
  Shield,
  Sparkles,
  Trash2,
  Upload,
  WandSparkles,
  X,
  Zap,
} from 'lucide-react'
import { useAdminMode } from '../admin/AdminModeContext.jsx'
import { ARC_TYPES, ELEMENTS, RARITIES, ROLES } from '../data/characters.js'
import { getEsperCyclePreview } from '../data/esperCycles.js'
import {
  formatCartridgeStatValue,
  getAvailableMainStatsForCartridge,
  getAvailableSubStatsForCartridge,
  getCartridgeStatValue,
} from '../data/cartridges.js'
import {
  formatModuleStatValue,
  getModuleMainStats,
  getModulePossibleSubStats,
  getModuleShapeOptions,
} from '../data/modulePieces.js'
import ConsoleModuleBoard from '../components/ConsoleModuleBoard.jsx'
import { normalizeConsole } from '../data/consoleBlocks.js'
import { getArcTypeMeta, getElementMeta, getRarityMeta } from '../data/gameMeta.jsx'
import { getCharacterAsset, getElementIcon, getModuleAsset, getTypeIcon, getWeaponAsset } from '../utils/assetHelpers.js'
import {
  PLANNER_STAT_DEFS,
  calculateBuildStats,
  createEmptyBuildSlot,
  createEmptyBuildState,
  formatPlannerStat,
} from '../utils/buildCalculator.js'
import {
  getCartridgeBonus,
  getSafeCartridgeBonuses,
  getCartridgeModuleShapeIds,
  getCartridgeModuleShapeRefs,
  normalizeBlockedCells,
  normalizePlacements,
} from '../utils/moduleShapeRefs.js'
import Seo from '../components/Seo.jsx'
import { readJsonStorage, writeJsonStorage } from '../utils/safeStorage.js'

const LS_BUILD_DRAFTS = 'nte.admin.plannerDrafts'
const LEGACY_BUILD_DRAFTS = 'nte-build-planner-drafts'
const tabs = ['Character', 'Arc / Weapon', 'Cartridge', 'Modules', 'Awakening', 'Abilities', 'Esper Cycle']
const cycleElements = ['cosmos', 'anima', 'incantation', 'chaos', 'psyche', 'lakshana']
const previewStatGroups = [
  { title: 'Core', keys: ['hp', 'atk', 'def', 'chargeEfficiency'] },
  { title: 'Combat', keys: ['critRate', 'critDmg', 'damageBonus'] },
]
const compactStatGroups = [
  { title: 'Special', keys: ['essence', 'destructionIntensity'] },
  { title: 'Element Damage', keys: ['cosmosDmg', 'animaDmg', 'incantationDmg', 'chaosDmg', 'psycheDmg', 'lakshanaDmg', 'cognitiveDmg'], collapsible: true },
]
const placeholderCopy = {
  'Arc / Weapon': 'Arc setup will allow selecting a weapon, assuming max level first, then applying arc stats and passive bonuses into the preview panel.',
  Cartridge: 'Cartridge setup will allow selecting rarity, main stat, sub stats, and set bonuses before they flow into build totals.',
  Modules: 'Modules will support placing module shapes on the console grid, choosing rarity, and adding main and sub stats.',
  Awakening: 'Awakening will track unlocked nodes and apply character-specific stat or ability effects when the data is verified.',
  Abilities: 'Abilities will let you compare leveled skills, passive effects, and active damage assumptions without inventing missing formulas.',
}

function readDrafts() {
  const parsed = readJsonStorage(LS_BUILD_DRAFTS, [], [LEGACY_BUILD_DRAFTS])
  return Array.isArray(parsed) ? parsed : []
}

function writeDrafts(drafts) {
  writeJsonStorage(LS_BUILD_DRAFTS, Array.isArray(drafts) ? drafts : [])
}

function slugifyFile(value) {
  return String(value || '').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '') || 'draft'
}

function buildExportPayload(buildState, activeTab, selectedCharacter, calculation) {
  return {
    version: 1,
    source: 'NTE Community Database',
    type: 'build-planner-draft',
    createdAt: new Date().toISOString(),
    teamSlots: buildState.slots || [],
    selectedSlot: buildState.activeSlotIndex || 0,
    activeTab,
    plannerState: buildState,
    previewStats: calculation?.stats || null,
    characterName: selectedCharacter?.name || null,
  }
}

function downloadBlob(blob, filename) {
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = filename
  document.body.appendChild(link)
  link.click()
  link.remove()
  URL.revokeObjectURL(url)
}

function validateImportedBuild(payload) {
  if (!payload || payload.type !== 'build-planner-draft' || !payload.plannerState) return null
  return sanitizeBuildState(payload.plannerState)
}

function normalizeBuildSlot(slot) {
  const base = createEmptyBuildSlot()
  if (!slot || typeof slot !== 'object') return base
  return {
    ...base,
    ...slot,
    console: { ...base.console, ...(slot.console && typeof slot.console === 'object' ? slot.console : {}) },
    modules: normalizePlacements(slot.modules),
    awakening: slot.awakening && typeof slot.awakening === 'object' ? slot.awakening : {},
    abilities: slot.abilities && typeof slot.abilities === 'object' ? slot.abilities : {},
    activeCycles: Array.isArray(slot.activeCycles) ? slot.activeCycles : [],
  }
}

function sanitizeBuildState(state) {
  const base = createEmptyBuildState()
  if (!state || typeof state !== 'object') return base
  const rawSlots = Array.isArray(state.slots) ? state.slots : Array.isArray(state.team) ? state.team : []
  const slots = Array.from({ length: 4 }, (_, index) => normalizeBuildSlot(rawSlots[index]))
  const rawIndex = Number(state.activeSlotIndex ?? state.activeSlot ?? 0)
  const activeSlotIndex = Number.isFinite(rawIndex) ? Math.min(Math.max(rawIndex, 0), slots.length - 1) : 0
  return {
    ...base,
    ...state,
    slots,
    activeSlotIndex,
    teamEffects: Array.isArray(state.teamEffects) ? state.teamEffects : [],
    esperCycles: Array.isArray(state.esperCycles) ? state.esperCycles : [],
  }
}

class BuildPlannerTabErrorBoundary extends Component {
  constructor(props) {
    super(props)
    this.state = { error: null }
  }

  static getDerivedStateFromError(error) {
    return { error }
  }

  componentDidCatch(error, info) {
    console.error('[NTE] Build Planner tab failed to render', {
      error,
      componentStack: info?.componentStack,
      context: this.props.debugContext,
    })
  }

  componentDidUpdate(prevProps) {
    if (this.state.error && prevProps.resetKey !== this.props.resetKey) {
      this.setState({ error: null })
    }
  }

  render() {
    if (!this.state.error) return this.props.children
    const context = this.props.debugContext || {}
    return (
      <section className="rounded-[30px] border border-rose-200 bg-rose-50 p-5 text-sm text-rose-900 shadow-sm">
        <h2 className="text-base font-black text-rose-950">Build Planner module panel failed to render</h2>
        <p className="mt-2 font-semibold">{this.state.error.message || String(this.state.error)}</p>
        <dl className="mt-4 grid gap-2 sm:grid-cols-2">
          <DebugDatum label="Selected tab" value={context.activeTab} />
          <DebugDatum label="Character" value={context.characterLabel} />
          <DebugDatum label="Cartridge" value={context.cartridgeLabel} />
          <DebugDatum label="Modules" value={context.modulesSummary} />
        </dl>
      </section>
    )
  }
}

function DebugDatum({ label, value }) {
  return (
    <div className="rounded-2xl bg-white/70 px-3 py-2 ring-1 ring-rose-100">
      <dt className="text-[10px] font-black uppercase tracking-wide text-rose-400">{label}</dt>
      <dd className="mt-1 break-words font-bold text-rose-950">{value || 'None'}</dd>
    </div>
  )
}

function loadImage(src) {
  return new Promise((resolve, reject) => {
    if (!src) {
      resolve(null)
      return
    }
    const image = new Image()
    image.crossOrigin = 'anonymous'
    image.onload = () => resolve(image)
    image.onerror = reject
    image.src = src
  })
}

function drawRoundRect(ctx, x, y, width, height, radius = 18) {
  ctx.beginPath()
  ctx.moveTo(x + radius, y)
  ctx.arcTo(x + width, y, x + width, y + height, radius)
  ctx.arcTo(x + width, y + height, x, y + height, radius)
  ctx.arcTo(x, y + height, x, y, radius)
  ctx.arcTo(x, y, x + width, y, radius)
  ctx.closePath()
}

function drawCard(ctx, x, y, width, height, fill = '#ffffff') {
  ctx.save()
  ctx.fillStyle = fill
  drawRoundRect(ctx, x, y, width, height, 24)
  ctx.fill()
  ctx.strokeStyle = 'rgba(17,17,17,0.08)'
  ctx.stroke()
  ctx.restore()
}

function drawText(ctx, text, x, y, options = {}) {
  ctx.fillStyle = options.color || '#111111'
  ctx.font = `${options.weight || 700} ${options.size || 24}px Inter, Arial, sans-serif`
  ctx.textBaseline = 'top'
  ctx.fillText(String(text || ''), x, y, options.maxWidth)
}

function drawWrappedText(ctx, text, x, y, maxWidth, lineHeight, options = {}) {
  const words = String(text || '').split(/\s+/).filter(Boolean)
  let line = ''
  let cursorY = y
  ctx.fillStyle = options.color || '#4b5563'
  ctx.font = `${options.weight || 600} ${options.size || 20}px Inter, Arial, sans-serif`
  ctx.textBaseline = 'top'
  words.forEach((word) => {
    const test = line ? `${line} ${word}` : word
    if (ctx.measureText(test).width > maxWidth && line) {
      ctx.fillText(line, x, cursorY)
      line = word
      cursorY += lineHeight
    } else {
      line = test
    }
  })
  if (line) ctx.fillText(line, x, cursorY)
  return cursorY + lineHeight
}

function drawPill(ctx, label, x, y, options = {}) {
  ctx.save()
  ctx.font = `${options.weight || 800} ${options.size || 18}px Inter, Arial, sans-serif`
  const width = Math.max(options.minWidth || 0, ctx.measureText(label).width + 30)
  drawRoundRect(ctx, x, y, width, options.height || 34, 17)
  ctx.fillStyle = options.fill || '#fff7fa'
  ctx.fill()
  ctx.strokeStyle = options.stroke || 'rgba(255,47,109,0.14)'
  ctx.stroke()
  ctx.fillStyle = options.color || '#ff2f6d'
  ctx.textBaseline = 'middle'
  ctx.fillText(label, x + 15, y + (options.height || 34) / 2)
  ctx.restore()
  return width
}

function getRequiredShapeIds(cartridge) {
  return getCartridgeModuleShapeIds(cartridge)
}

function getSetProgressForExport(slot, cartridge) {
  const requiredShapeIds = getRequiredShapeIds(cartridge)
  const placedShapeIds = normalizePlacements(slot?.modules).map((module) => module.shapeId || module.moduleShapeId).filter(Boolean)
  const placedCounts = new Map()
  const requiredCounts = new Map()
  placedShapeIds.forEach((shapeId) => placedCounts.set(shapeId, (placedCounts.get(shapeId) || 0) + 1))
  requiredShapeIds.forEach((shapeId) => requiredCounts.set(shapeId, (requiredCounts.get(shapeId) || 0) + 1))
  const matched = [...requiredCounts.entries()].reduce((total, [shapeId, count]) => total + Math.min(count, placedCounts.get(shapeId) || 0), 0)
  return {
    matched,
    total: requiredShapeIds.length || 4,
    twoPieceActive: requiredShapeIds.length >= 2 && matched >= 2,
    fourPieceActive: requiredShapeIds.length >= 4 && matched >= 4,
  }
}

async function exportBuildImage({ character, slot, calculation, cartridges, weapons }) {
  const canvas = document.createElement('canvas')
  canvas.width = 1400
  canvas.height = 900
  const ctx = canvas.getContext('2d')
  ctx.fillStyle = '#f8f7f5'
  ctx.fillRect(0, 0, canvas.width, canvas.height)
  const bg = ctx.createRadialGradient(210, 0, 0, 210, 0, 520)
  bg.addColorStop(0, 'rgba(255,47,109,0.18)')
  bg.addColorStop(0.48, 'rgba(255,247,250,0.52)')
  bg.addColorStop(1, 'rgba(248,247,245,0)')
  ctx.fillStyle = bg
  ctx.fillRect(0, 0, canvas.width, canvas.height)

  const cartridge = cartridges.find((item) => item.id === slot?.console?.cartridgeId || item.slug === slot?.console?.cartridgeId)
  const weapon = weapons.find((item) => item.id === slot?.weaponId || item.slug === slot?.weaponId)
  const portrait = await loadImage(getCharacterAsset(character?.name) || character?.portraitImageUrl).catch(() => null)
  const setProgress = getSetProgressForExport(slot, cartridge)

  drawText(ctx, 'NTE Community Database', 58, 42, { size: 19, color: '#ff2f6d', weight: 900 })
  drawText(ctx, `${character?.name || 'Build Draft'} Build`, 58, 74, { size: 44, weight: 900 })
  drawPill(ctx, 'Build Planner Share Card', 58, 132, { size: 16, minWidth: 220 })

  drawCard(ctx, 58, 190, 355, 560, 'rgba(255,255,255,0.92)')
  if (portrait) {
    drawRoundRect(ctx, 92, 220, 287, 350, 30)
    ctx.save()
    ctx.clip()
    ctx.fillStyle = '#fff7fa'
    ctx.fillRect(92, 220, 287, 350)
    ctx.drawImage(portrait, 92, 220, 287, 350)
    ctx.restore()
  }
  drawText(ctx, character?.name || 'No character', 88, 600, { size: 34, weight: 900 })
  drawPill(ctx, `${character?.rarity || 'Unknown'} Rank`, 88, 648, { size: 16, fill: '#fff7fa' })
  drawText(ctx, `${getElementMeta(character?.element)?.label || character?.element || 'Unknown'} / ${getArcTypeMeta(character?.arcType)?.label || character?.arcType || 'Unknown'}`, 88, 698, { size: 20, color: '#6b7280', weight: 800 })

  drawCard(ctx, 450, 190, 410, 220, 'rgba(255,255,255,0.94)')
  drawText(ctx, 'Equipment', 480, 220, { size: 19, color: '#9ca3af', weight: 900 })
  drawWrappedText(ctx, weapon?.name ? `Arc: ${weapon.name}` : 'Arc: Not selected', 480, 262, 340, 28, { size: 22, color: '#111111', weight: 900 })
  drawWrappedText(ctx, cartridge?.name ? `Cartridge: ${cartridge.name}` : 'Cartridge: Not selected', 480, 326, 340, 25, { size: 19, color: '#4b5563', weight: 800 })

  drawCard(ctx, 450, 442, 410, 308, 'rgba(255,255,255,0.94)')
  drawText(ctx, 'Module Board', 480, 472, { size: 19, color: '#9ca3af', weight: 900 })
  const gridX = 492
  const gridY = 526
  const cell = 35
  const gap = 6
  const shapeMap = new Map(getModuleShapeOptions().map((shape) => [shape.id, shape]))
  const occupied = new Map()
  ;(slot.modules || []).forEach((module) => {
    const shape = shapeMap.get(module.shapeId || module.moduleShapeId)
    ;(shape?.matrix || [[1]]).forEach((row, rowIndex) => {
      row.forEach((filled, colIndex) => {
        if (filled) occupied.set(`${(module.row || module.position?.row || 0) + rowIndex},${(module.col || module.position?.col || 0) + colIndex}`, module.rarity || 'S')
      })
    })
  })
  for (let row = 0; row < 7; row += 1) {
    for (let col = 0; col < 7; col += 1) {
      const rarity = occupied.get(`${row},${col}`)
      ctx.fillStyle = rarity === 'A' ? '#d946ef' : rarity === 'B' ? '#22d3ee' : rarity === 'S' ? '#f59e0b' : '#fbfbfa'
      drawRoundRect(ctx, gridX + col * (cell + gap), gridY + row * (cell + gap), cell, cell, 8)
      ctx.fill()
      ctx.strokeStyle = 'rgba(17,17,17,0.08)'
      ctx.stroke()
    }
  }
  drawText(ctx, `${(slot.modules || []).length} modules placed`, 480, 706, { size: 19, color: '#4b5563', weight: 900 })

  drawCard(ctx, 895, 190, 447, 560, 'rgba(255,255,255,0.94)')
  drawText(ctx, 'Preview Stats', 925, 220, { size: 19, color: '#9ca3af', weight: 900 })
  const statKeys = ['hp', 'atk', 'def', 'critRate', 'critDmg', 'chargeEfficiency', 'essence', 'destructionIntensity', 'damageBonus']
  statKeys.forEach((key, index) => {
    const stat = PLANNER_STAT_DEFS.find((item) => item.key === key)
    const x = 925 + (index % 3) * 137
    const y = 270 + Math.floor(index / 3) * 92
    drawText(ctx, stat?.label === 'Charge Efficiency' ? 'Charge Eff.' : stat?.label || key, x, y, { size: 15, color: '#9ca3af', weight: 900 })
    drawText(ctx, formatPlannerStat(calculation.stats[key], stat?.type), x, y + 26, { size: 24, weight: 900 })
  })
  drawText(ctx, 'Set Bonus Status', 925, 594, { size: 19, color: '#9ca3af', weight: 900 })
  drawPill(ctx, `Required pieces ${setProgress.matched} / ${setProgress.total}`, 925, 634, { size: 16, minWidth: 220, fill: '#ffffff' })
  drawPill(ctx, `2-piece ${setProgress.twoPieceActive ? 'Active' : 'Inactive'}`, 925, 680, { size: 16, minWidth: 160, fill: setProgress.twoPieceActive ? '#fff7fa' : '#fafafa', color: setProgress.twoPieceActive ? '#ff2f6d' : '#6b7280' })
  drawPill(ctx, `4-piece ${setProgress.fourPieceActive ? 'Active' : 'Inactive'}`, 1105, 680, { size: 16, minWidth: 160, fill: setProgress.fourPieceActive ? '#fff7fa' : '#fafafa', color: setProgress.fourPieceActive ? '#ff2f6d' : '#6b7280' })
  drawText(ctx, 'Partial builds are welcome. Missing slots are shown cleanly for sharing.', 58, 812, { size: 18, color: '#9ca3af', weight: 800 })

  const blob = await new Promise((resolve, reject) => canvas.toBlob((item) => (item ? resolve(item) : reject(new Error('blob'))), 'image/png'))
  downloadBlob(blob, `${slugifyFile(character?.name)}-build-summary.png`)
}

export default function BuildPlannerPage() {
  const { mergedCharacters, mergedCartridges, mergedWeapons } = useAdminMode()
  const [buildState, setBuildState] = useState(() => sanitizeBuildState(createEmptyBuildState()))
  const [activeTab, setActiveTab] = useState('Character')
  const [pickerSlot, setPickerSlot] = useState(null)
  const [drafts, setDrafts] = useState(() => readDrafts())
  const [draftsOpen, setDraftsOpen] = useState(false)
  const [toast, setToast] = useState(null)
  const fileInputRef = useRef(null)

  const activeSlot = Array.isArray(buildState.slots) ? buildState.slots[buildState.activeSlotIndex] || createEmptyBuildSlot() : createEmptyBuildSlot()
  const calculation = useMemo(
    () => calculateBuildStats(buildState, { characters: mergedCharacters, weapons: mergedWeapons, cartridges: mergedCartridges }),
    [buildState, mergedCartridges, mergedCharacters, mergedWeapons],
  )
  const selectedCharacter = calculation.character
  const selectedCartridgeForDebug = useMemo(() => {
    const cartridgeId = activeSlot?.console?.cartridgeId
    return (Array.isArray(mergedCartridges) ? mergedCartridges : []).find((item) => item.id === cartridgeId || item.slug === cartridgeId) || null
  }, [activeSlot?.console?.cartridgeId, mergedCartridges])
  const tabDebugContext = useMemo(() => ({
    activeTab,
    characterLabel: selectedCharacter ? `${selectedCharacter.name} (${selectedCharacter.id})` : activeSlot?.characterId || 'None',
    cartridgeLabel: selectedCartridgeForDebug ? `${selectedCartridgeForDebug.name} (${selectedCartridgeForDebug.id})` : activeSlot?.console?.cartridgeId || 'None',
    modulesSummary: `${normalizePlacements(activeSlot?.modules).length} placed module(s)`,
  }), [activeSlot?.characterId, activeSlot?.console?.cartridgeId, activeSlot?.modules, activeTab, selectedCharacter, selectedCartridgeForDebug])

  const updateSlot = (index, patch) => {
    setBuildState((prev) => {
      const current = sanitizeBuildState(prev)
      return {
        ...current,
        activeSlotIndex: index,
        slots: current.slots.map((slot, slotIndex) => (slotIndex === index ? normalizeBuildSlot({ ...slot, ...patch }) : slot)),
      }
    })
  }

  const selectCharacter = (slotIndex, character) => {
    updateSlot(slotIndex, { characterId: character.id })
    setPickerSlot(null)
  }

  const removeCharacter = (slotIndex) => {
    updateSlot(slotIndex, { characterId: null })
  }

  const resetBuild = () => {
    setBuildState(createEmptyBuildState())
    setActiveTab('Character')
  }

  const showToast = (message, tone = 'success') => {
    setToast({ message, tone, id: Date.now() })
    window.setTimeout(() => setToast((current) => (current?.message === message ? null : current)), 2600)
  }

  const saveDraft = () => {
    const next = [
      {
        id: `draft-${Date.now()}`,
        name: selectedCharacter ? `${selectedCharacter.name} Build Draft` : 'Untitled Build Draft',
        savedAt: new Date().toISOString(),
        state: buildState,
        activeTab,
      },
      ...drafts,
    ].slice(0, 12)
    setDrafts(next)
    writeDrafts(next)
    showToast('Draft saved locally in this browser')
  }

  const loadDraft = (draft) => {
    setBuildState(sanitizeBuildState(draft.state))
    setActiveTab(draft.activeTab === 'Console' ? 'Cartridge' : draft.activeTab || 'Character')
    setDraftsOpen(false)
    showToast('Draft loaded')
  }

  const renameDraft = (draftId, name) => {
    const next = drafts.map((draft) => (draft.id === draftId ? { ...draft, name: name.trim() || draft.name } : draft))
    setDrafts(next)
    writeDrafts(next)
  }

  const deleteDraft = (draftId) => {
    const next = drafts.filter((draft) => draft.id !== draftId)
    setDrafts(next)
    writeDrafts(next)
    showToast('Draft deleted')
  }

  const exportBuild = () => {
    const payload = buildExportPayload(buildState, activeTab, selectedCharacter, calculation)
    const date = new Date().toISOString().slice(0, 10)
    const filename = selectedCharacter ? `nte-build-${slugifyFile(selectedCharacter.name)}-${date}.json` : 'nte-build-draft.json'
    downloadBlob(new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' }), filename)
    showToast('Build file exported')
  }

  const importBuild = async (event) => {
    const file = event.target.files?.[0]
    event.target.value = ''
    if (!file) return
    try {
      const payload = JSON.parse(await file.text())
      const state = validateImportedBuild(payload)
      if (!state) throw new Error('invalid')
      setBuildState(state)
      setActiveTab(payload.activeTab === 'Console' ? 'Cartridge' : payload.activeTab || 'Character')
      showToast('Build file imported')
    } catch {
      showToast('Invalid build file. Please import a valid NTE build draft.', 'error')
    }
  }

  const exportImage = async () => {
    if (!selectedCharacter) {
      showToast('Select a character before exporting an image.', 'error')
      return
    }
    try {
      await exportBuildImage({ character: selectedCharacter, slot: activeSlot, calculation, cartridges: mergedCartridges, weapons: mergedWeapons })
      showToast('Build image exported')
    } catch {
      showToast('Image export failed. Please try again.', 'error')
    }
  }

  return (
    <div className="space-y-7 pb-8">
      <Seo title="Build Planner" description="Plan NTE character builds with team slots, arcs, cartridges, modules, preview stats, drafts, and exports." />
      <header className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
        <div className="max-w-3xl">
          <div className="inline-flex items-center gap-2 rounded-full border border-[#ff2f6d]/15 bg-[#ff2f6d]/8 px-3 py-1.5 text-xs font-semibold text-[#ff2f6d]">
            <Calculator className="h-3.5 w-3.5" strokeWidth={1.8} aria-hidden />
            Build theorycrafting
          </div>
          <h1 className="mt-3 text-3xl font-bold tracking-tight text-[#111111] sm:text-4xl">Build Planner</h1>
          <p className="mt-2 max-w-2xl text-base leading-relaxed text-[#6b7280] sm:text-lg">
            Plan characters, console cartridges, modules, stats, and team cycles before committing resources in-game.
          </p>
        </div>
        <div className="grid grid-cols-1 gap-2 sm:grid-cols-3 lg:min-w-[520px]">
          <SummaryPill label="Characters available" value={mergedCharacters.length} />
          <SummaryPill label="Saved drafts" value={drafts.length} />
          <SummaryPill label="Planner mode" value="Local" />
        </div>
      </header>

      <section className="overflow-hidden rounded-[30px] border border-black/[0.06] bg-white/92 p-4 shadow-[0_24px_80px_rgba(0,0,0,0.065)] sm:p-5">
        <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-lg font-black tracking-tight text-[#111111]">Team Draft</h2>
            <p className="mt-1 text-sm text-[#6b7280]">Select a character now; team and cycle calculations are prepared for future passes.</p>
          </div>
          <div className="rounded-[24px] border border-black/[0.06] bg-[#fafafa] p-2 shadow-inner">
            <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 xl:grid-cols-6">
              <button type="button" onClick={saveDraft} className="inline-flex h-10 items-center justify-center gap-2 rounded-2xl border border-[#ff2f6d]/14 bg-white px-3 text-xs font-black text-[#111111] shadow-sm transition hover:bg-[#fff7fa] hover:text-[#ff2f6d]">
                <Save className="h-3.5 w-3.5 text-[#ff2f6d]" strokeWidth={2} />
                Save Draft
              </button>
              <button type="button" onClick={() => setDraftsOpen(true)} className="inline-flex h-10 items-center justify-center gap-2 rounded-2xl border border-black/[0.06] bg-white px-3 text-xs font-black text-[#6b7280] shadow-sm transition hover:text-[#111111]">
                <FolderOpen className="h-3.5 w-3.5" strokeWidth={2} />
                Drafts
              </button>
              <button type="button" onClick={exportBuild} className="inline-flex h-10 items-center justify-center gap-2 rounded-2xl border border-black/[0.06] bg-white px-3 text-xs font-black text-[#6b7280] shadow-sm transition hover:text-[#111111]">
                <FileJson className="h-3.5 w-3.5" strokeWidth={2} />
                Export Draft
              </button>
              <button type="button" onClick={() => fileInputRef.current?.click()} className="inline-flex h-10 items-center justify-center gap-2 rounded-2xl border border-black/[0.06] bg-white px-3 text-xs font-black text-[#6b7280] shadow-sm transition hover:text-[#111111]">
                <Upload className="h-3.5 w-3.5" strokeWidth={2} />
                Import Draft
              </button>
              <button type="button" disabled={!selectedCharacter} onClick={exportImage} title={selectedCharacter ? 'Export build image' : 'Select a character first'} className={`inline-flex h-10 items-center justify-center gap-2 rounded-2xl border px-3 text-xs font-black shadow-sm transition ${selectedCharacter ? 'border-[#ff2f6d]/12 bg-white text-[#ff2f6d] hover:bg-[#fff7fa]' : 'cursor-not-allowed border-black/[0.04] bg-[#f3f3f2] text-[#9ca3af]'}`}>
                <ImageDown className="h-3.5 w-3.5" strokeWidth={2} />
                Export Image
              </button>
              <button type="button" onClick={resetBuild} className="inline-flex h-10 items-center justify-center gap-2 rounded-2xl border border-black/[0.06] bg-white px-3 text-xs font-black text-[#6b7280] shadow-sm transition hover:text-[#111111]">
                <RotateCcw className="h-3.5 w-3.5" strokeWidth={2} />
                Reset
              </button>
              <input ref={fileInputRef} type="file" accept=".json,application/json" onChange={importBuild} className="hidden" />
            </div>
          </div>
        </div>
        <p className="mb-4 text-xs font-semibold text-[#9ca3af]">Save Draft stores this build in this browser&apos;s localStorage. Export Draft downloads a reusable JSON file. Import Draft restores that file later.</p>
        <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
          {buildState.slots.map((slot, index) => {
            const character = mergedCharacters.find((item) => item.id === slot.characterId)
            return (
              <BuildSlotCard
                key={index}
                slot={slot}
                index={index}
                active={buildState.activeSlotIndex === index}
                character={character}
                onActivate={() => setBuildState((prev) => ({ ...prev, activeSlotIndex: index }))}
                onPick={() => {
                  setBuildState((prev) => ({ ...prev, activeSlotIndex: index }))
                  setPickerSlot(index)
                }}
                onRemove={() => removeCharacter(index)}
              />
            )
          })}
        </div>
      </section>

      <div className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_300px]">
        <section className="min-w-0 space-y-5">
          <div className="scrollbar-hide sticky top-[88px] z-20 flex gap-2 overflow-x-auto rounded-[22px] border border-black/[0.06] bg-white/88 p-2 shadow-[0_16px_48px_rgba(0,0,0,0.045)] backdrop-blur-xl">
            {tabs.map((tab) => (
              <button
                key={tab}
                type="button"
                onClick={() => setActiveTab(tab)}
                className={`shrink-0 rounded-full px-4 py-2.5 text-sm font-bold transition ${
                  activeTab === tab ? 'bg-[#ff2f6d]/10 text-[#ff2f6d] shadow-sm' : 'text-[#6b7280] hover:bg-[#fafafa] hover:text-[#111111]'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          <BuildPlannerTabErrorBoundary
            resetKey={`${activeTab}-${activeSlot?.characterId || ''}-${activeSlot?.console?.cartridgeId || ''}-${buildState.activeSlotIndex}`}
            debugContext={tabDebugContext}
          >
            {activeTab === 'Character' ? (
              <CharacterPlannerTab
                character={selectedCharacter}
                slot={activeSlot}
                stats={calculation.stats}
                onPick={() => {
                  setBuildState((prev) => ({ ...prev, activeSlotIndex: 0 }))
                  setPickerSlot(0)
                }}
                onLevelChange={(level) => updateSlot(buildState.activeSlotIndex, { level })}
              />
            ) : activeTab === 'Arc / Weapon' ? (
              <ArcWeaponTab
                slot={activeSlot}
                weapons={mergedWeapons}
                character={selectedCharacter}
                onSelect={(weapon) => updateSlot(buildState.activeSlotIndex, { weaponId: weapon.id, arcId: weapon.id, weaponLevel: activeSlot.weaponLevel || 80, arcLevel: activeSlot.weaponLevel || 80 })}
                onWeaponLevelChange={(weaponLevel) => updateSlot(buildState.activeSlotIndex, { weaponLevel, arcLevel: weaponLevel })}
                onRemove={() => updateSlot(buildState.activeSlotIndex, { weaponId: null, arcId: null })}
              />
            ) : activeTab === 'Cartridge' ? (
              <ConsoleTab
                slot={activeSlot}
                cartridges={mergedCartridges}
                character={selectedCharacter}
                onConsoleChange={(consolePatch) => updateSlot(buildState.activeSlotIndex, { console: { ...activeSlot.console, ...consolePatch } })}
                onClear={() => updateSlot(buildState.activeSlotIndex, { console: { cartridgeId: null, rarity: 'S', mainStat: null, subStats: [] } })}
              />
            ) : activeTab === 'Modules' ? (
              <ModulesPlannerTab
                slot={activeSlot}
                cartridges={mergedCartridges}
                character={selectedCharacter}
                traitState={calculation.sources.characterConsoleTrait}
                onModulesChange={(modules) => updateSlot(buildState.activeSlotIndex, { modules })}
              />
            ) : activeTab === 'Esper Cycle' ? (
              <EsperCyclePanel character={selectedCharacter} slots={buildState.slots} characters={mergedCharacters} />
            ) : (
              <PlannerPlaceholder tab={activeTab} />
            )}
          </BuildPlannerTabErrorBoundary>
        </section>

        <StatPanel calculation={calculation} />
      </div>

      {pickerSlot != null ? (
        <CharacterPicker
          characters={mergedCharacters}
          onSelect={(character) => selectCharacter(pickerSlot, character)}
          onClose={() => setPickerSlot(null)}
        />
      ) : null}
      {draftsOpen ? (
        <SavedDraftsModal
          drafts={drafts}
          onClose={() => setDraftsOpen(false)}
          onLoad={loadDraft}
          onRename={renameDraft}
          onDelete={deleteDraft}
        />
      ) : null}
      {toast ? <Toast message={toast.message} tone={toast.tone} /> : null}
    </div>
  )
}

function SummaryPill({ label, value }) {
  return (
    <div className="rounded-2xl bg-white px-4 py-3 text-[#111111] shadow-sm ring-1 ring-black/[0.06]">
      <p className="text-[11px] font-bold uppercase tracking-wide text-[#9ca3af]">{label}</p>
      <p className="mt-0.5 text-xl font-black tracking-tight tabular-nums">{value}</p>
    </div>
  )
}

function SavedDraftsModal({ drafts, onClose, onLoad, onRename, onDelete }) {
  return (
    <div className="fixed inset-0 z-[120] flex items-center justify-center p-4">
      <button type="button" className="absolute inset-0 bg-black/25 backdrop-blur-[2px]" aria-label="Close saved drafts" onClick={onClose} />
      <section className="relative z-[121] flex max-h-[86vh] w-full max-w-3xl flex-col overflow-hidden rounded-[30px] border border-black/[0.08] bg-white shadow-[0_30px_100px_rgba(0,0,0,0.18)]">
        <div className="flex items-start justify-between gap-4 border-b border-black/[0.06] p-5">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.18em] text-[#ff2f6d]">Local browser storage</p>
            <h2 className="mt-1 text-2xl font-black tracking-tight text-[#111111]">Saved Drafts</h2>
            <p className="mt-1 text-sm text-[#6b7280]">Drafts stay in this browser until you delete them or clear site data.</p>
          </div>
          <button type="button" onClick={onClose} className="flex h-10 w-10 items-center justify-center rounded-2xl border border-black/[0.06] bg-[#fafafa]">
            <X className="h-4 w-4" />
          </button>
        </div>
        <div className="scrollbar-hide min-h-0 flex-1 space-y-3 overflow-y-auto p-5">
          {drafts.length ? drafts.map((draft) => (
            <div key={draft.id} className="rounded-2xl border border-black/[0.06] bg-[#fafafa] p-3 shadow-sm">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div className="min-w-0 flex-1">
                  <input
                    value={draft.name}
                    onChange={(event) => onRename(draft.id, event.target.value)}
                    className="w-full rounded-xl border border-black/[0.06] bg-white px-3 py-2 text-sm font-black text-[#111111] outline-none focus:border-[#ff2f6d]/25"
                  />
                  <p className="mt-1 text-xs font-semibold text-[#9ca3af]">{new Date(draft.savedAt).toLocaleString()} / Slot {(draft.state?.activeSlotIndex || 0) + 1}</p>
                </div>
                <div className="flex gap-2">
                  <button type="button" onClick={() => onLoad(draft)} className="rounded-full bg-[#111111] px-4 py-2 text-sm font-bold text-white">Load</button>
                  <button type="button" onClick={() => onDelete(draft.id)} className="rounded-full border border-black/[0.07] bg-white px-4 py-2 text-sm font-bold text-[#6b7280]">Delete</button>
                </div>
              </div>
            </div>
          )) : (
            <p className="rounded-2xl border border-dashed border-black/[0.08] bg-[#fafafa] px-5 py-8 text-center text-sm font-semibold text-[#9ca3af]">No local drafts saved yet.</p>
          )}
        </div>
      </section>
    </div>
  )
}

function Toast({ message, tone = 'success' }) {
  return (
    <div className={`fixed bottom-5 right-5 z-[150] max-w-sm rounded-2xl border px-4 py-3 text-sm font-bold shadow-[0_18px_60px_rgba(0,0,0,0.16)] ${tone === 'error' ? 'border-rose-100 bg-rose-50 text-rose-700' : 'border-black/[0.06] bg-white text-[#111111]'}`}>
      {message}
    </div>
  )
}

function BuildSlotCard({ index, active, character, slot, onActivate, onPick, onRemove }) {
  const portrait = character ? getCharacterAsset(character.name) || character.portraitImageUrl : null
  const rarity = getRarityMeta(character?.rarity)
  const element = getElementMeta(character?.element)
  const arc = getArcTypeMeta(character?.arcType)
  return (
    <article
      className={`group/slot relative overflow-hidden rounded-[24px] border p-3 transition duration-300 ${
        active ? 'border-[#ff2f6d]/20 bg-[#fff7fa] shadow-[0_22px_74px_rgba(255,47,109,0.12)]' : 'border-black/[0.06] bg-white/82 shadow-sm hover:-translate-y-0.5 hover:bg-white hover:shadow-[0_18px_58px_rgba(0,0,0,0.07)]'
      }`}
    >
      <div className="pointer-events-none absolute -right-10 -top-12 h-28 w-28 rounded-full bg-[#ff2f6d]/8 blur-2xl opacity-0 transition group-hover/slot:opacity-100" aria-hidden />
      {character ? (
        <button type="button" onClick={onActivate} className="group flex w-full items-center gap-3 text-left">
          <CharacterPortrait src={portrait} name={character.name} className="h-20 w-20 rounded-[20px]" />
          <div className="min-w-0 flex-1">
            <div className="mb-2 flex flex-wrap items-center gap-1.5">
              <span className={`rounded-full px-2 py-0.5 text-[11px] font-black ring-1 ${rarity?.chip || 'bg-slate-50 text-slate-700 ring-slate-100'}`}>{character.rarity || 'Unknown'}</span>
              {element ? <MetaChip label={element.label} iconSrc={getElementIcon(element.id)} /> : null}
            </div>
            <h3 className="truncate text-lg font-black tracking-tight text-[#111111]">{character.name}</h3>
            <p className="mt-1 truncate text-xs font-semibold text-[#6b7280]">{arc?.label || character.arcType || 'Unknown arc'}</p>
            <div className="mt-2 flex flex-wrap gap-1">
              {(character.roles || []).slice(0, 2).map((role) => (
                <span key={role} className="rounded-full bg-white px-2 py-0.5 text-[11px] font-bold text-[#6b7280] ring-1 ring-black/[0.05]">{role}</span>
              ))}
            </div>
          </div>
        </button>
      ) : (
        <button type="button" onClick={onPick} className="relative flex min-h-[104px] w-full flex-col items-center justify-center gap-2 overflow-hidden rounded-[20px] border border-dashed border-black/[0.08] bg-[linear-gradient(135deg,#ffffff,#fff7fa)] text-center transition hover:border-[#ff2f6d]/25 hover:shadow-inner">
          <span className="absolute inset-x-8 bottom-0 h-10 rounded-[50%] bg-[#ff2f6d]/8 blur-xl" aria-hidden />
          <span className="relative flex h-11 w-11 items-center justify-center rounded-2xl bg-white text-[#ff2f6d] shadow-sm ring-1 ring-[#ff2f6d]/12 transition group-hover/slot:scale-105">
            <Plus className="h-5 w-5" strokeWidth={2} />
          </span>
          <span className="relative text-sm font-black text-[#111111]">{index === 0 ? 'Add character' : 'Add teammate'}</span>
          <span className="relative rounded-full bg-white/80 px-2.5 py-0.5 text-xs font-semibold text-[#9ca3af] ring-1 ring-black/[0.05]">Slot {index + 1}</span>
        </button>
      )}
      {character ? (
        <div className="absolute right-3 top-3 flex gap-1.5">
          <button type="button" onClick={onPick} className="flex h-8 w-8 items-center justify-center rounded-full border border-black/[0.06] bg-white/85 text-[#6b7280] shadow-sm transition hover:text-[#111111]" aria-label="Change character">
            <Edit3 className="h-3.5 w-3.5" strokeWidth={1.8} />
          </button>
          <button type="button" onClick={onRemove} className="flex h-8 w-8 items-center justify-center rounded-full border border-rose-200 bg-rose-50/90 text-rose-600 shadow-sm transition hover:bg-rose-100" aria-label="Remove character">
            <Trash2 className="h-3.5 w-3.5" strokeWidth={1.8} />
          </button>
        </div>
      ) : null}
    </article>
  )
}

function CharacterPlannerTab({ character, slot, stats, onPick, onLevelChange }) {
  if (!character) {
    return (
      <section className="overflow-hidden rounded-[30px] border border-black/[0.06] bg-white/88 p-4 shadow-[0_18px_56px_rgba(0,0,0,0.045)] sm:p-5">
        <div className="relative rounded-[24px] border border-dashed border-[#ff2f6d]/16 bg-[radial-gradient(circle_at_50%_0%,rgba(255,47,109,0.10),transparent_46%),linear-gradient(135deg,#ffffff,#fffafa)] px-5 py-9 text-center">
          <div className="pointer-events-none absolute inset-x-16 bottom-0 h-14 rounded-[50%] bg-[#ff2f6d]/8 blur-2xl" aria-hidden />
          <div className="relative mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-white text-[#ff2f6d] shadow-sm ring-1 ring-[#ff2f6d]/12">
            <Plus className="h-6 w-6" strokeWidth={2} />
          </div>
          <h2 className="relative mt-4 text-2xl font-black tracking-tight text-[#111111]">Choose a character to begin</h2>
          <p className="relative mx-auto mt-2 max-w-lg text-sm leading-6 text-[#6b7280]">Start with Slot 1, then layer arc, console, module, and team effects in later planner passes.</p>
          <button type="button" onClick={onPick} className="relative mt-5 rounded-full bg-[#111111] px-5 py-2.5 text-sm font-bold text-white shadow-sm transition hover:bg-black">
            Add character
          </button>
        </div>
      </section>
    )
  }

  const portrait = getCharacterAsset(character.name) || character.portraitImageUrl
  const element = getElementMeta(character.element)
  const rarity = getRarityMeta(character.rarity)
  const arc = getArcTypeMeta(character.arcType)
  const ArcIcon = arc?.icon
  const profileText = character.shortDescription || character.profileText || character.profile?.text || 'No profile summary added yet.'

  return (
    <section className="overflow-hidden rounded-[30px] border border-black/[0.06] bg-white/92 shadow-[0_22px_72px_rgba(0,0,0,0.06)]">
      <div className="grid gap-0 lg:grid-cols-[320px_minmax(0,1fr)]">
        <div className="relative min-h-[360px] overflow-hidden bg-[radial-gradient(circle_at_50%_18%,rgba(255,47,109,0.16),transparent_42%),linear-gradient(180deg,#fff7fa,#ffffff)] p-6">
          <div className="absolute inset-x-8 bottom-8 h-16 rounded-[50%] bg-black/[0.08] blur-2xl" aria-hidden />
          <CharacterPortrait src={portrait} name={character.name} className="relative z-10 mx-auto h-72 w-full max-w-[260px] rounded-[28px]" large />
        </div>
        <div className="p-6 sm:p-8">
          <div className="flex flex-wrap items-center gap-2">
            <span className={`rounded-full px-3 py-1 text-xs font-black ring-1 ${rarity?.chip || 'bg-slate-50 text-slate-700 ring-slate-100'}`}>{rarity?.label || character.rarity || 'Unknown rank'}</span>
            {element ? <MetaChip label={element.label} iconSrc={getElementIcon(element.id)} strong /> : null}
            <span className="inline-flex items-center gap-1.5 rounded-full bg-[#fafafa] px-3 py-1 text-xs font-black text-[#6b7280] ring-1 ring-black/[0.06]">
              {ArcIcon ? <ArcIcon className="h-3.5 w-3.5" /> : null}
              {arc?.label || character.arcType || 'Unknown arc'}
            </span>
          </div>
          <h2 className="mt-4 text-3xl font-black tracking-tight text-[#111111]">{character.name}</h2>
          <p className="mt-3 max-w-3xl text-sm leading-7 text-[#5f6673]">{profileText}</p>

          <div className="mt-6 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
            <InfoTile label="Faction" value={character.faction || 'Unknown'} />
            <InfoTile label="Birthday" value={character.birthday || 'Unknown'} />
            <InfoTile label="Arc Type" value={arc?.label || character.arcType || 'Unknown'} />
            <label className="rounded-2xl border border-black/[0.06] bg-[#fafafa] px-4 py-3 shadow-sm">
              <span className="text-[11px] font-bold uppercase tracking-wide text-[#9ca3af]">Level</span>
              <select value={slot.level || 80} onChange={(event) => onLevelChange(Number(event.target.value))} className="mt-1 w-full bg-transparent text-lg font-black text-[#111111] outline-none">
                {[1, 20, 40, 60, 70, 80].map((level) => <option key={level} value={level}>Lv. {level}</option>)}
              </select>
              <span className="mt-1 block text-[10px] font-semibold text-[#9ca3af]">Lv. 80 max for this pass</span>
            </label>
          </div>

          <div className="mt-6">
            <p className="text-[11px] font-bold uppercase tracking-wide text-[#9ca3af]">Roles</p>
            <div className="mt-2 flex flex-wrap gap-2">
              {(character.roles?.length ? character.roles : ['Unknown']).map((role) => (
                <span key={role} className="rounded-full border border-black/[0.06] bg-white px-3 py-1.5 text-xs font-bold text-[#6b7280] shadow-sm">{role}</span>
              ))}
            </div>
          </div>

          <div className="mt-6 rounded-[22px] border border-black/[0.06] bg-white p-4 shadow-sm">
            <div className="flex items-center justify-between gap-3">
              <p className="text-[11px] font-bold uppercase tracking-wide text-[#9ca3af]">Base Stat Preview</p>
              <span className="rounded-full bg-[#fff7fa] px-2.5 py-1 text-[11px] font-black text-[#ff2f6d] ring-1 ring-[#ff2f6d]/12">Lv. {slot.level || 80}</span>
            </div>
            <div className="mt-3 grid gap-2 sm:grid-cols-3">
              {PLANNER_STAT_DEFS.slice(0, 6).map((stat) => (
                <div key={stat.key} className="rounded-2xl bg-[#fafafa] px-3 py-2.5">
                  <p className="text-[10px] font-bold uppercase tracking-wide text-[#9ca3af]">{stat.label}</p>
                  <p className="mt-0.5 text-sm font-black text-[#111111] tabular-nums">{formatPlannerStat(stats?.[stat.key], stat.type)}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

function getRecommendedWeaponIds(character) {
  const build = character?.build || {}
  const refs = Array.isArray(build.recommendedWeapons) ? build.recommendedWeapons : []
  return [
    ...refs.map((item) => item.weaponId || item.weaponSlug || item.slug).filter(Boolean),
    ...(build.recommendedWeaponIds || []),
  ]
}

function getRecommendedCartridgeIds(character) {
  const build = character?.build || {}
  const refs = Array.isArray(build.recommendedCartridges) ? build.recommendedCartridges : []
  return [
    ...refs.map((item) => item.cartridgeId || item.slug || item.id).filter(Boolean),
    ...(build.cartridgeIds || []),
  ]
}

function orderRecommendedFirst(items, recommendedIds, getId = (item) => item.id) {
  const order = new Map(recommendedIds.map((id, index) => [String(id), index]))
  return [...items].sort((a, b) => {
    const aKey = String(getId(a))
    const bKey = String(getId(b))
    const aRank = Math.min(order.get(aKey) ?? 999, order.get(a.slug) ?? 999)
    const bRank = Math.min(order.get(bKey) ?? 999, order.get(b.slug) ?? 999)
    return aRank - bRank || a.name.localeCompare(b.name)
  })
}

function ArcWeaponTab({ slot, weapons, character, onSelect, onRemove, onWeaponLevelChange }) {
  const [query, setQuery] = useState('')
  const [rarity, setRarity] = useState('All')
  const [type, setType] = useState('All')
  const selectedWeapon = weapons.find((weapon) => weapon.id === slot.weaponId || weapon.slug === slot.weaponId) || null
  const recommendedWeaponIds = useMemo(() => getRecommendedWeaponIds(character), [character])
  const weaponTypes = ['All', ...Array.from(new Set(weapons.map((weapon) => weapon.type).filter(Boolean)))]
  const filteredWeapons = useMemo(() => {
    const tokens = query.trim().toLowerCase().split(/\s+/).filter(Boolean)
    const result = weapons.filter((weapon) => {
      if (rarity !== 'All' && weapon.rarity !== rarity) return false
      if (type !== 'All' && weapon.type !== type) return false
      if (!tokens.length) return true
      const haystack = [weapon.name, weapon.rarity, weapon.type, weapon.mainStat?.type, weapon.subStat?.type, weapon.shortDescription].filter(Boolean).join(' ').toLowerCase()
      return tokens.every((token) => haystack.includes(token))
    })
    return orderRecommendedFirst(result, recommendedWeaponIds)
  }, [query, rarity, type, weapons, recommendedWeaponIds])
  const weaponLevels = useMemo(() => {
    const rows = selectedWeapon?.growthScaling || []
    const levels = rows.map((row) => Number(row.level)).filter(Boolean)
    return levels.length ? levels.filter((level) => level === 1 || level % 10 === 0 || level === Math.max(...levels)) : [80]
  }, [selectedWeapon])

  return (
    <section className="space-y-4 rounded-[30px] border border-black/[0.06] bg-white/92 p-5 shadow-[0_22px_72px_rgba(0,0,0,0.06)] sm:p-6">
      <div className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
        <div>
          <div className="inline-flex rounded-full border border-[#ff2f6d]/15 bg-[#ff2f6d]/8 px-3 py-1.5 text-xs font-black uppercase tracking-wide text-[#ff2f6d]">
            Level scaling enabled
          </div>
          <h2 className="mt-3 text-2xl font-black tracking-tight text-[#111111]">Arc / Weapon</h2>
          <p className="mt-2 max-w-2xl text-sm leading-7 text-[#6b7280]">
            Recommended weapons from this character&apos;s build appear first. Weapon level affects Preview Stats.
          </p>
        </div>
        {selectedWeapon ? (
          <button type="button" onClick={onRemove} className="inline-flex items-center justify-center gap-2 rounded-full border border-rose-200 bg-rose-50 px-4 py-2.5 text-sm font-bold text-rose-600 transition hover:bg-rose-100">
            <Trash2 className="h-4 w-4" strokeWidth={1.8} />
            Remove weapon
          </button>
        ) : null}
      </div>

      {selectedWeapon ? (
        <SelectedWeaponCard weapon={selectedWeapon} level={slot.weaponLevel || slot.arcLevel || 80} levels={weaponLevels} onLevelChange={onWeaponLevelChange} />
      ) : (
        <div className="rounded-[24px] border border-dashed border-black/[0.08] bg-[linear-gradient(135deg,#ffffff,#fff7fa)] p-5 text-center">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-white text-[#ff2f6d] shadow-sm ring-1 ring-[#ff2f6d]/12">
            <Disc3 className="h-5 w-5" strokeWidth={1.8} />
          </div>
          <h3 className="mt-3 text-lg font-black text-[#111111]">No Arc selected</h3>
          <p className="mt-1 text-sm text-[#6b7280]">Choose a weapon below to add its stats to this build.</p>
        </div>
      )}

      <div className="rounded-[24px] border border-black/[0.06] bg-[#fafafa] p-3">
        <div className="flex flex-col gap-3 xl:flex-row xl:items-center">
          <div className="relative min-w-0 flex-1">
            <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[#9ca3af]" strokeWidth={2} />
            <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search weapons..." className="h-11 w-full rounded-full border border-black/[0.07] bg-white pl-11 pr-4 text-sm outline-none transition focus:border-[#ff2f6d]/25" />
          </div>
          <div className="flex flex-wrap gap-2">
            <PickerSelect value={rarity} onChange={setRarity} options={['All', 'S', 'A', 'B']} />
            <PickerSelect value={type} onChange={setType} options={weaponTypes} />
          </div>
        </div>
        <div className="scrollbar-hide mt-3 grid max-h-[430px] gap-3 overflow-y-auto pr-1 sm:grid-cols-2 2xl:grid-cols-3">
          {filteredWeapons.map((weapon) => (
            <button
              key={weapon.id}
              type="button"
              onClick={() => onSelect(weapon)}
              className={`group rounded-[20px] border p-3 text-left shadow-sm transition hover:-translate-y-0.5 hover:bg-white hover:shadow-[0_18px_56px_rgba(0,0,0,0.08)] ${
                selectedWeapon?.id === weapon.id ? 'border-[#ff2f6d]/20 bg-[#fff7fa]' : 'border-black/[0.06] bg-white/80'
              }`}
            >
              <div className="flex items-center gap-3">
                <WeaponImage weapon={weapon} className="h-16 w-16 rounded-[18px]" />
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap gap-1.5">
                    <span className={`rounded-full px-2 py-0.5 text-[11px] font-black ring-1 ${getRarityMeta(weapon.rarity)?.chip || 'bg-slate-50 text-slate-700 ring-slate-100'}`}>{weapon.rarity}</span>
                    <TypeBadge type={weapon.type} />
                  </div>
                  <h3 className="mt-2 truncate text-sm font-black text-[#111111]">{weapon.name}</h3>
                  <p className="mt-1 text-xs font-semibold text-[#6b7280]">{weapon.mainStat?.type || 'ATK'} {formatWeaponStatValue(weapon.mainStat?.value)} / {weapon.subStat?.type || 'Sub'} {formatWeaponStatValue(weapon.subStat?.value)}</p>
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>
    </section>
  )
}

function SelectedWeaponCard({ weapon, level, levels, onLevelChange }) {
  const hasScaling = Array.isArray(weapon.growthScaling) && weapon.growthScaling.length > 0
  const row = [...(weapon.growthScaling || [])].reverse().find((item) => Number(item.level) <= Number(level)) || weapon.growthScaling?.[0]
  const mainValue = row?.atk ?? weapon.mainStat?.value
  const subType = row?.subStatType || weapon.subStat?.type
  const subValue = row?.subStatValue ?? weapon.subStat?.value
  return (
    <article className="overflow-hidden rounded-[26px] border border-[#ff2f6d]/14 bg-[#fff7fa] shadow-[0_18px_60px_rgba(255,47,109,0.08)]">
      <div className="grid gap-0 md:grid-cols-[180px_minmax(0,1fr)]">
        <div className="flex min-h-[180px] items-center justify-center bg-[radial-gradient(circle_at_50%_20%,rgba(255,47,109,0.12),transparent_44%),linear-gradient(135deg,#ffffff,#fff7fa)] p-5">
          <WeaponImage weapon={weapon} className="h-36 w-36 rounded-[26px]" />
        </div>
        <div className="p-5">
          <div className="flex flex-wrap gap-2">
            <span className={`rounded-full px-3 py-1 text-xs font-black ring-1 ${getRarityMeta(weapon.rarity)?.chip || 'bg-slate-50 text-slate-700 ring-slate-100'}`}>{weapon.rarity}-Rank</span>
            <TypeBadge type={weapon.type} strong />
            <span className="rounded-full bg-white px-3 py-1 text-xs font-black text-[#6b7280] ring-1 ring-black/[0.06]">Lv. {level}</span>
          </div>
          <h3 className="mt-3 text-2xl font-black tracking-tight text-[#111111]">{weapon.name}</h3>
          <p className="mt-2 text-sm leading-6 text-[#6b7280]">{weapon.shortDescription || 'Arc weapon stats are applied at max level for this planner pass.'}</p>
          <div className="mt-4 grid gap-2 sm:grid-cols-2">
            <StatMini label={weapon.mainStat?.type || 'Main Stat'} value={formatWeaponStatValue(mainValue)} />
            <StatMini label={subType || 'Sub Stat'} value={formatWeaponStatValue(subValue)} />
          </div>
          <div className="mt-4">
            <p className="text-[11px] font-bold uppercase tracking-wide text-[#9ca3af]">Weapon Level</p>
            <div className="mt-2 flex flex-wrap gap-2">
              {levels.map((item) => (
                <button key={item} type="button" onClick={() => onLevelChange?.(item)} className={`rounded-full px-3 py-1.5 text-xs font-black ring-1 transition ${Number(level) === Number(item) ? 'bg-[#111111] text-white ring-[#111111]' : 'bg-white text-[#6b7280] ring-black/[0.06] hover:bg-[#fafafa]'}`}>
                  Lv. {item}
                </button>
              ))}
            </div>
            {!hasScaling ? <p className="mt-2 text-xs font-semibold text-[#9ca3af]">No level table is stored for this weapon yet; Preview Stats use the listed max-level values.</p> : null}
          </div>
        </div>
      </div>
    </article>
  )
}

function ConsoleTab({ slot, cartridges, character, onConsoleChange, onClear }) {
  const [query, setQuery] = useState('')
  const [theme, setTheme] = useState('All')
  const consoleSetup = slot.console || { cartridgeId: null, rarity: 'S', mainStat: null, subStats: [] }
  const selectedCartridge = cartridges.find((item) => item.id === consoleSetup.cartridgeId || item.slug === consoleSetup.cartridgeId) || null
  const recommendedCartridgeIds = useMemo(() => getRecommendedCartridgeIds(character), [character])
  const rarity = consoleSetup.rarity || 'S'
  const themes = ['All', ...Array.from(new Set(cartridges.map((item) => item.theme || item.element).filter(Boolean)))]
  const mainOptions = getAvailableMainStatsForCartridge().filter((option) => getCartridgeStatValue(rarity, 'main', option.statId))
  const subOptions = getAvailableSubStatsForCartridge().filter((option) => getCartridgeStatValue(rarity, 'sub', option.statId))
  const selectedSubStats = Array.from({ length: 4 }, (_, index) => consoleSetup.subStats?.[index] || '')
  const filteredCartridges = useMemo(() => {
    const tokens = query.trim().toLowerCase().split(/\s+/).filter(Boolean)
    const result = cartridges.filter((cartridge) => {
      if (theme !== 'All' && cartridge.theme !== theme && cartridge.element !== theme) return false
      if (!tokens.length) return true
      const haystack = [cartridge.name, cartridge.theme, cartridge.element, cartridge.bonusCategory, ...getSafeCartridgeBonuses(cartridge).map((bonus) => bonus.text)].join(' ').toLowerCase()
      return tokens.every((token) => haystack.includes(token))
    })
    return orderRecommendedFirst(result, recommendedCartridgeIds)
  }, [cartridges, query, theme, recommendedCartridgeIds])

  const setRarity = (nextRarity) => {
    onConsoleChange({
      rarity: nextRarity,
      mainStat: getCartridgeStatValue(nextRarity, 'main', consoleSetup.mainStat) ? consoleSetup.mainStat : null,
      subStats: selectedSubStats.map((statId) => (getCartridgeStatValue(nextRarity, 'sub', statId) ? statId : '')).filter(Boolean),
    })
  }

  const updateSubStat = (index, statId) => {
    const next = selectedSubStats.map((item, itemIndex) => (itemIndex === index ? statId : item))
    onConsoleChange({ subStats: next })
  }

  return (
    <section className="space-y-4 rounded-[30px] border border-black/[0.06] bg-white/92 p-5 shadow-[0_22px_72px_rgba(0,0,0,0.06)] sm:p-6">
      <div className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
        <div>
          <div className="inline-flex rounded-full border border-[#ff2f6d]/15 bg-[#ff2f6d]/8 px-3 py-1.5 text-xs font-black uppercase tracking-wide text-[#ff2f6d]">
            Lv. 20 max assumed
          </div>
          <h2 className="mt-3 text-2xl font-black tracking-tight text-[#111111]">Console Cartridge</h2>
          <p className="mt-2 max-w-2xl text-sm leading-7 text-[#6b7280]">
            Select one cartridge, rarity, main stat, and up to four sub stats. Set bonuses are displayed for reference and are not auto-calculated yet.
          </p>
        </div>
        {selectedCartridge ? (
          <button type="button" onClick={onClear} className="inline-flex items-center justify-center gap-2 rounded-full border border-rose-200 bg-rose-50 px-4 py-2.5 text-sm font-bold text-rose-600 transition hover:bg-rose-100">
            <Trash2 className="h-4 w-4" strokeWidth={1.8} />
            Clear cartridge
          </button>
        ) : null}
      </div>

      {selectedCartridge ? (
        <SelectedCartridgePanel
          cartridge={selectedCartridge}
          rarity={rarity}
          mainStat={consoleSetup.mainStat}
          subStats={selectedSubStats}
          mainOptions={mainOptions}
          subOptions={subOptions}
          onRarityChange={setRarity}
          onMainStatChange={(mainStat) => onConsoleChange({ mainStat: mainStat || null })}
          onSubStatChange={updateSubStat}
        />
      ) : (
        <div className="rounded-[24px] border border-dashed border-black/[0.08] bg-[linear-gradient(135deg,#ffffff,#fff7fa)] p-5 text-center">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-white text-[#ff2f6d] shadow-sm ring-1 ring-[#ff2f6d]/12">
            <Layers3 className="h-5 w-5" strokeWidth={1.8} />
          </div>
          <h3 className="mt-3 text-lg font-black text-[#111111]">Choose a console cartridge</h3>
          <p className="mt-1 text-sm text-[#6b7280]">Pick a cartridge below to unlock rarity, main stat, and sub stat configuration.</p>
        </div>
      )}

      <div className="rounded-[24px] border border-black/[0.06] bg-[#fafafa] p-3">
        <div className="flex flex-col gap-3 xl:flex-row xl:items-center">
          <div className="relative min-w-0 flex-1">
            <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[#9ca3af]" strokeWidth={2} />
            <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search cartridges..." className="h-11 w-full rounded-full border border-black/[0.07] bg-white pl-11 pr-4 text-sm outline-none transition focus:border-[#ff2f6d]/25" />
          </div>
          <PickerSelect value={theme} onChange={setTheme} options={themes} />
        </div>
        <div className="scrollbar-hide mt-3 grid max-h-[430px] gap-3 overflow-y-auto pr-1 md:grid-cols-2 2xl:grid-cols-3">
          {filteredCartridges.map((cartridge) => (
            <CartridgePickCard
              key={cartridge.id}
              cartridge={cartridge}
              selected={selectedCartridge?.id === cartridge.id}
              rarity={rarity}
              onSelect={() => {
                const nextRarity = cartridge.availableRarities?.includes(rarity) ? rarity : cartridge.availableRarities?.[0] || 'S'
                onConsoleChange({ cartridgeId: cartridge.id, rarity: nextRarity, mainStat: null, subStats: [] })
              }}
            />
          ))}
        </div>
      </div>
    </section>
  )
}

function SelectedCartridgePanel({ cartridge, rarity, mainStat, subStats, mainOptions, subOptions, onRarityChange, onMainStatChange, onSubStatChange }) {
  return (
    <article className="overflow-hidden rounded-[26px] border border-[#ff2f6d]/14 bg-[#fff7fa] shadow-[0_18px_60px_rgba(255,47,109,0.08)]">
      <div className="grid gap-0 lg:grid-cols-[220px_minmax(0,1fr)]">
        <div className="flex min-h-[220px] items-center justify-center bg-[radial-gradient(circle_at_50%_20%,rgba(255,47,109,0.12),transparent_44%),linear-gradient(135deg,#ffffff,#fff7fa)] p-5">
          <CartridgeImage cartridge={cartridge} rarity={rarity} className="h-40 w-40 rounded-[28px]" />
        </div>
        <div className="space-y-4 p-5">
          <div className="flex flex-wrap items-center gap-2">
            {(cartridge.availableRarities || ['B', 'A', 'S']).map((item) => (
              <button
                key={item}
                type="button"
                onClick={() => onRarityChange(item)}
                className={`rounded-full px-3 py-1 text-xs font-black ring-1 transition ${rarity === item ? rarityClass(item, true) : rarityClass(item, false)}`}
              >
                {item}
              </button>
            ))}
            <span className="rounded-full bg-white px-3 py-1 text-xs font-black text-[#6b7280] ring-1 ring-black/[0.06]">Lv. 20</span>
            <span className="rounded-full bg-white px-3 py-1 text-xs font-black text-[#6b7280] ring-1 ring-black/[0.06]">{cartridge.theme || cartridge.element || 'General'}</span>
          </div>
          <div>
            <h3 className="text-2xl font-black tracking-tight text-[#111111]">{cartridge.name}</h3>
            <p className="mt-1 text-sm leading-6 text-[#6b7280]">{cartridge.description || 'Console Cartridge. Activate by pairing it to a Console.'}</p>
          </div>
          <div className="grid gap-3 xl:grid-cols-2">
            <label className="rounded-2xl border border-black/[0.06] bg-white p-3 shadow-sm">
              <span className="text-[11px] font-bold uppercase tracking-wide text-[#9ca3af]">Main Stat</span>
              <select value={mainStat || ''} onChange={(event) => onMainStatChange(event.target.value)} className="mt-2 h-10 w-full rounded-full border border-black/[0.06] bg-[#fafafa] px-3 text-sm font-bold text-[#111111] outline-none">
                <option value="">Choose main stat</option>
                {mainOptions.map((option) => {
                  const statValue = getCartridgeStatValue(rarity, 'main', option.statId)
                  return <option key={option.statId} value={option.statId}>{option.label} {statValue ? formatCartridgeStatValue(option.statId, statValue.value) : ''}</option>
                })}
              </select>
              {!mainStat ? <p className="mt-2 text-xs font-semibold text-amber-700">Main stat not selected yet.</p> : null}
            </label>
            <div className="rounded-2xl border border-black/[0.06] bg-white p-3 shadow-sm">
              <p className="text-[11px] font-bold uppercase tracking-wide text-[#9ca3af]">Set Bonuses</p>
              <div className="mt-2 space-y-2">
                {getSafeCartridgeBonuses(cartridge).map((bonus) => (
                  <div key={bonus.pieces} className="rounded-xl bg-[#fafafa] px-3 py-2">
                    <p className="text-xs font-black text-[#111111]">{bonus.pieces}-Piece</p>
                    <p className="mt-1 text-xs leading-5 text-[#6b7280]">{bonus.text}</p>
                  </div>
                ))}
              </div>
              <p className="mt-2 text-xs font-semibold text-[#9ca3af]">Conditional set bonus — displayed only, not included in stat calculation yet.</p>
            </div>
          </div>
          <div className="rounded-2xl border border-black/[0.06] bg-white p-3 shadow-sm">
            <p className="text-[11px] font-bold uppercase tracking-wide text-[#9ca3af]">Sub Stats</p>
            <div className="mt-2 grid gap-2 sm:grid-cols-2">
              {subStats.map((statId, index) => {
                const selected = subStats.filter(Boolean)
                return (
                  <select key={index} value={statId} onChange={(event) => onSubStatChange(index, event.target.value)} className="h-10 rounded-full border border-black/[0.06] bg-[#fafafa] px-3 text-sm font-bold text-[#111111] outline-none">
                    <option value="">Sub stat {index + 1}</option>
                    {subOptions.map((option) => {
                      const duplicate = selected.includes(option.statId) && statId !== option.statId
                      const statValue = getCartridgeStatValue(rarity, 'sub', option.statId)
                      return <option key={option.statId} value={option.statId} disabled={duplicate}>{option.label} {statValue ? formatCartridgeStatValue(option.statId, statValue.value) : ''}</option>
                    })}
                  </select>
                )
              })}
            </div>
          </div>
        </div>
      </div>
    </article>
  )
}

function CartridgePickCard({ cartridge, selected, rarity, onSelect }) {
  const bonus2 = getCartridgeBonus(cartridge, 2)
  const bonus4 = getCartridgeBonus(cartridge, 4)
  return (
    <button type="button" onClick={onSelect} className={`group rounded-[20px] border p-3 text-left shadow-sm transition hover:-translate-y-0.5 hover:bg-white hover:shadow-[0_18px_56px_rgba(0,0,0,0.08)] ${selected ? 'border-[#ff2f6d]/20 bg-[#fff7fa]' : 'border-black/[0.06] bg-white/80'}`}>
      <div className="flex items-start gap-3">
        <CartridgeImage cartridge={cartridge} rarity={rarity} className="h-16 w-16 rounded-[18px]" />
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap gap-1.5">
            {(cartridge.availableRarities || ['B', 'A', 'S']).map((item) => <span key={item} className={`rounded-full px-2 py-0.5 text-[10px] font-black ring-1 ${rarityClass(item, false)}`}>{item}</span>)}
            <span className="rounded-full bg-white px-2 py-0.5 text-[10px] font-black text-[#6b7280] ring-1 ring-black/[0.05]">{cartridge.theme || cartridge.element || 'General'}</span>
          </div>
          <h3 className="mt-2 line-clamp-1 text-sm font-black text-[#111111]">{cartridge.name}</h3>
          <p className="mt-1 line-clamp-2 text-xs leading-5 text-[#6b7280]">{bonus2?.text || '2-piece bonus data pending'}</p>
          <p className="mt-1 line-clamp-2 text-xs leading-5 text-[#9ca3af]">{bonus4?.text || '4-piece bonus data pending'}</p>
        </div>
      </div>
    </button>
  )
}

const GRID_COLS = 7
const GRID_ROWS = 6

function ModulesPlannerTab({ slot, cartridges, character, traitState, onModulesChange }) {
  const consoleSetup = slot?.console || {}
  const selectedCartridge = (Array.isArray(cartridges) ? cartridges : []).find((item) => item.id === consoleSetup.cartridgeId || item.slug === consoleSetup.cartridgeId) || null
  const placements = normalizePlacements(slot?.modules)
  const consoleData = normalizeConsole(character)
  const rawGrid = consoleData?.grid || {}
  const consoleGrid = {
    rows: Number(rawGrid.rows) || 7,
    cols: Number(rawGrid.cols) || 7,
    blockedCells: normalizeBlockedCells(rawGrid.blockedCells),
  }
  const requiredSetPieces = getCartridgeModuleShapeRefs(selectedCartridge)
  const requiredSetPieceShapeIds = getCartridgeModuleShapeIds(selectedCartridge)
  const compatibilityPending = selectedCartridge ? !requiredSetPieceShapeIds.length : true

  return (
    <section className="space-y-4 rounded-[30px] border border-black/[0.06] bg-white/92 p-5 shadow-[0_22px_72px_rgba(0,0,0,0.06)] sm:p-6">
      <div className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
        <div>
          <div className="inline-flex rounded-full border border-[#ff2f6d]/15 bg-[#ff2f6d]/8 px-3 py-1.5 text-xs font-black uppercase tracking-wide text-[#ff2f6d]">
            Max level modules
          </div>
          <h2 className="mt-3 text-2xl font-black tracking-tight text-[#111111]">Modules</h2>
          <p className="mt-2 max-w-2xl text-sm leading-7 text-[#6b7280]">
            Select a module shape, click the board to place it, then configure rarity and sub stats. Module fixed main stats and sub stats update Preview Stats.
          </p>
        </div>
        <button type="button" onClick={() => onModulesChange([])} className="inline-flex items-center justify-center gap-2 rounded-full border border-black/[0.07] bg-white px-4 py-2.5 text-sm font-bold text-[#6b7280] shadow-sm transition hover:text-[#111111]">
          <RotateCcw className="h-4 w-4" strokeWidth={1.8} />
          Clear board
        </button>
      </div>

      {!character ? <Notice text="Select a character first for full stat preview." /> : null}
      {!selectedCartridge ? <Notice text="Select a console cartridge first to see its required set pieces." /> : null}
      {selectedCartridge && compatibilityPending ? <Notice text="Set bonus piece shape data is pending. The Module Library still shows all module shapes." /> : null}

      <ConsoleModuleBoard
        placements={placements}
        onChange={onModulesChange}
        rows={consoleGrid.rows}
        cols={consoleGrid.cols}
        blockedCells={consoleGrid.blockedCells}
        compatibleShapeIds={requiredSetPieceShapeIds}
        compatibilityPending={compatibilityPending}
        selectedCartridge={selectedCartridge}
        requiredSetPieces={requiredSetPieces}
      />
    </section>
  )
}

function CharacterConsoleTraitCard({ trait, traitState }) {
  const count = traitState?.count || 0
  const value = traitState?.value || 0
  const suffix = trait.statId ? `+${Number.isInteger(value) ? value : value.toFixed(1)}%` : ''
  return (
    <section className="rounded-[24px] border border-black/[0.06] bg-[#fafafa] p-4 shadow-sm">
      <p className="text-[11px] font-black uppercase tracking-wide text-[#ff2f6d]">Character Console Trait</p>
      <div className="mt-2 flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
        <div>
          <h3 className="text-lg font-black tracking-tight text-[#111111]">{trait.title || 'Console Trait'}</h3>
          <p className="mt-1 max-w-2xl text-sm leading-6 text-[#4b5563]">{trait.effect || trait.description || trait.text}</p>
        </div>
        <div className="flex flex-wrap gap-2">
          {trait.trigger ? (
            <div className="rounded-2xl bg-white px-3 py-2 text-xs font-bold text-[#6b7280] ring-1 ring-black/[0.05]">
              Trigger: <span className="text-[#111111]">{trait.trigger}</span>
            </div>
          ) : null}
          <div className="rounded-2xl bg-white px-3 py-2 text-xs font-black text-[#6b7280] ring-1 ring-black/[0.05]">
            Multiplier: <span className="text-[#111111]">x{count}</span>{suffix ? <span className="ml-2 text-[#ff2f6d]">{suffix}</span> : null}
          </div>
        </div>
      </div>
    </section>
  )
}

function ModuleLibrary({ shapes, selectedShapeId, rarity, onRarityChange, onSelectShape }) {
  return (
    <aside className="rounded-[24px] border border-black/[0.06] bg-[#fafafa] p-3 shadow-sm">
      <div className="mb-3 flex items-center justify-between gap-3">
        <div>
          <h3 className="text-sm font-black uppercase tracking-wide text-[#111111]">Module Library</h3>
          <p className="mt-1 text-xs font-semibold text-[#6b7280]">Click shape, then board.</p>
        </div>
        <PickerSelect value={rarity} onChange={onRarityChange} options={['B', 'A', 'S']} />
      </div>
      <div className="scrollbar-hide max-h-[460px] space-y-2 overflow-y-auto pr-1">
        {shapes.map((shape) => (
          <button
            key={shape.id}
            type="button"
            onClick={() => onSelectShape(shape.id)}
            className={`flex w-full items-center gap-3 rounded-2xl border p-3 text-left transition hover:bg-white ${
              selectedShapeId === shape.id ? 'border-[#ff2f6d]/20 bg-[#fff7fa]' : 'border-black/[0.06] bg-white/75'
            }`}
          >
            <ShapeMini shape={shape} rarity={rarity} />
            <div className="min-w-0">
              <p className="text-sm font-black text-[#111111]">Type {shape.moduleType} Module</p>
              <p className="mt-1 text-xs font-semibold text-[#6b7280]">{shape.cellCount} cells / {shape.name}</p>
            </div>
          </button>
        ))}
      </div>
    </aside>
  )
}

function ModuleConfigPanel({ placement, onUpdate, onRemove }) {
  if (!placement) {
    return (
      <aside className="rounded-[24px] border border-dashed border-black/[0.08] bg-white/80 p-5 text-center shadow-sm">
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-[#ff2f6d]/10 text-[#ff2f6d]">
          <Layers3 className="h-5 w-5" strokeWidth={1.8} />
        </div>
        <h3 className="mt-3 text-lg font-black text-[#111111]">Select a module</h3>
        <p className="mt-1 text-sm leading-6 text-[#6b7280]">Placed modules can be edited here.</p>
      </aside>
    )
  }
  const shape = getModuleShapeOptions().find((item) => item.id === placement.shapeId)
  const mainStats = getModuleMainStats({ rarity: placement.rarity, moduleType: placement.moduleType })
  const subOptions = getModulePossibleSubStats({ rarity: placement.rarity, cellCount: placement.cellCount })
  const subStats = Array.from({ length: 4 }, (_, index) => placement.subStats?.[index] || '')
  const updateSubStat = (index, statId) => {
    onUpdate({ subStats: subStats.map((item, itemIndex) => (itemIndex === index ? statId : item)) })
  }
  return (
    <aside className="rounded-[24px] border border-black/[0.06] bg-white p-4 shadow-sm">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h3 className="text-lg font-black text-[#111111]">Module Config</h3>
          <p className="mt-1 text-xs font-semibold text-[#6b7280]">Max level assumed.</p>
        </div>
        <button type="button" onClick={onRemove} className="flex h-9 w-9 items-center justify-center rounded-full border border-rose-200 bg-rose-50 text-rose-600 transition hover:bg-rose-100" aria-label="Remove module">
          <Trash2 className="h-4 w-4" strokeWidth={1.8} />
        </button>
      </div>
      <div className="mt-4 flex items-center gap-3 rounded-2xl bg-[#fafafa] p-3">
        {shape ? <ShapeMini shape={shape} rarity={placement.rarity} /> : null}
        <div>
          <p className="text-sm font-black text-[#111111]">Type {placement.moduleType} Module</p>
          <p className="text-xs font-semibold text-[#6b7280]">{placement.cellCount} cells</p>
        </div>
      </div>
      <div className="mt-4">
        <p className="text-[11px] font-bold uppercase tracking-wide text-[#9ca3af]">Rarity</p>
        <div className="mt-2 flex gap-2">
          {['B', 'A', 'S'].map((rarity) => (
            <button key={rarity} type="button" onClick={() => onUpdate({ rarity })} className={`rounded-full px-3 py-1 text-xs font-black ring-1 transition ${placement.rarity === rarity ? rarityClass(rarity, true) : rarityClass(rarity, false)}`}>
              {rarity}
            </button>
          ))}
        </div>
      </div>
      <div className="mt-4 rounded-2xl border border-black/[0.05] bg-[#fafafa] p-3">
        <p className="text-[11px] font-bold uppercase tracking-wide text-[#9ca3af]">Locked Main Stats</p>
        <div className="mt-2 grid grid-cols-2 gap-2">
          {mainStats.map((stat) => (
            <div key={stat.statId} className="rounded-xl bg-white px-3 py-2 shadow-sm ring-1 ring-black/[0.04]">
              <p className="text-[10px] font-black uppercase tracking-wide text-[#9ca3af]">{stat.stat?.name || stat.statId}</p>
              <p className="mt-0.5 text-sm font-black text-[#111111]">{stat.formattedValue}</p>
            </div>
          ))}
        </div>
      </div>
      <div className="mt-4">
        <p className="text-[11px] font-bold uppercase tracking-wide text-[#9ca3af]">Sub Stats</p>
        <div className="mt-2 space-y-2">
          {subStats.map((statId, index) => {
            const selected = subStats.filter(Boolean)
            return (
              <select key={index} value={statId} onChange={(event) => updateSubStat(index, event.target.value)} className="h-10 w-full rounded-full border border-black/[0.06] bg-[#fafafa] px-3 text-sm font-bold text-[#111111] outline-none">
                <option value="">Sub stat {index + 1}</option>
                {subOptions.map((option) => {
                  const duplicate = selected.includes(option.statId) && statId !== option.statId
                  return <option key={option.statId} value={option.statId} disabled={duplicate}>{option.stat?.name || option.statId} {formatModuleStatValue(option.statId, option.value)}</option>
                })}
              </select>
            )
          })}
        </div>
      </div>
    </aside>
  )
}

function StatPanel({ calculation }) {
  const character = calculation.character
  const [elementOpen, setElementOpen] = useState(false)
  const traitState = calculation.sources?.characterConsoleTrait
  return (
    <aside className="xl:sticky xl:top-[104px] xl:self-start">
      <section className="flex max-h-[calc(100vh-128px)] flex-col overflow-hidden rounded-[24px] border border-black/[0.06] bg-white/94 shadow-[0_20px_60px_rgba(0,0,0,0.055)]">
        <div className="shrink-0 border-b border-black/[0.05] bg-[linear-gradient(135deg,#ffffff,#fff7fa)] p-3.5">
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="text-xs font-black uppercase tracking-[0.18em] text-[#ff2f6d]">Preview Stats</p>
              <h2 className="mt-1 text-xl font-black tracking-tight text-[#111111]">{character?.name || 'No character selected'}</h2>
            </div>
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#ff2f6d]/10 text-[#ff2f6d]">
              <WandSparkles className="h-5 w-5" strokeWidth={1.8} />
            </div>
          </div>
          <p className="mt-2 text-xs leading-5 text-[#6b7280]">
            Structured for base character stats, max-level arc stats, console, modules, set bonuses, and team cycle buffs.
          </p>
          {traitState?.trait ? (
            <div className="mt-3 rounded-2xl border border-[#ff2f6d]/12 bg-white/80 px-3 py-2 shadow-sm">
              <p className="text-[10px] font-black uppercase tracking-wide text-[#ff2f6d]">Console trait counted</p>
              <p className="mt-0.5 text-xs font-bold text-[#4b5563]">
                {traitState.trait.title}: x{traitState.count || 0}
                {traitState.value ? <span className="text-[#ff2f6d]"> / +{traitState.value}% Crit Rate</span> : null}
              </p>
            </div>
          ) : null}
        </div>
        <div className="scrollbar-hide min-h-0 flex-1 space-y-2.5 overflow-y-auto p-3">
          {previewStatGroups.map((group) => (
            <div key={group.title}>
              <h3 className="mb-2 px-1 text-[11px] font-black uppercase tracking-[0.18em] text-[#9ca3af]">{group.title}</h3>
              <div className="grid grid-cols-2 gap-1.5">
                {group.keys.map((key, index) => {
                  const stat = PLANNER_STAT_DEFS.find((item) => item.key === key)
                  if (!stat) return null
                  const fullWidth = group.keys.length % 2 === 1 && index === group.keys.length - 1
                  return (
                    <div key={stat.key} className={`rounded-xl border border-black/[0.045] bg-[#fafafa] px-2.5 py-2 shadow-sm ${fullWidth ? 'col-span-2' : ''}`}>
                      <p className="text-[10px] font-black uppercase tracking-wide text-[#9ca3af]">{stat.label}</p>
                      <p className="mt-0.5 text-sm font-black text-[#111111] tabular-nums">{formatPlannerStat(calculation.stats[stat.key], stat.type)}</p>
                    </div>
                  )
                })}
              </div>
            </div>
          ))}

          {compactStatGroups.map((group) => {
            const open = group.collapsible ? elementOpen : true
            return (
              <section key={group.title} className="rounded-[18px] border border-black/[0.05] bg-white p-2 shadow-sm">
                <button
                  type="button"
                  onClick={() => group.collapsible && setElementOpen((prev) => !prev)}
                  className={`flex w-full items-center justify-between gap-3 px-1 py-1 text-left ${group.collapsible ? 'cursor-pointer' : 'cursor-default'}`}
                >
                  <h3 className="text-[11px] font-black uppercase tracking-[0.18em] text-[#9ca3af]">{group.title}</h3>
                  {group.collapsible ? (
                    <span className="inline-flex items-center gap-1 rounded-full bg-[#fafafa] px-2 py-1 text-[10px] font-black uppercase tracking-wide text-[#9ca3af] ring-1 ring-black/[0.04]">
                      {open ? 'Hide' : 'Show'}
                      <ChevronDown className={`h-3 w-3 transition ${open ? 'rotate-180' : ''}`} strokeWidth={2} />
                    </span>
                  ) : null}
                </button>
                {open ? (
                  <div className={`mt-2 ${group.keys.length <= 2 ? 'grid grid-cols-2 gap-1.5' : 'grid grid-cols-1 gap-1.5'}`}>
                    {group.keys.map((key) => {
                      const stat = PLANNER_STAT_DEFS.find((item) => item.key === key)
                      if (!stat) return null
                      return (
                        <div key={stat.key} className="flex items-center justify-between gap-3 rounded-xl bg-[#fafafa] px-3 py-2">
                          <span className="min-w-0 text-xs font-bold text-[#6b7280]">{stat.label}</span>
                          <span className="shrink-0 text-xs font-black text-[#111111] tabular-nums">{formatPlannerStat(calculation.stats[stat.key], stat.type)}</span>
                        </div>
                      )
                    })}
                  </div>
                ) : (
                  <p className="mt-1 px-1 pb-1 text-xs font-semibold text-[#9ca3af]">Collapsed until elemental bonuses are added.</p>
                )}
              </section>
            )
          })}
        </div>
      </section>
    </aside>
  )
}

function PlannerPlaceholder({ tab }) {
  const iconMap = {
    'Arc / Weapon': Disc3,
    Cartridge: Calculator,
    Modules: Layers3,
    Awakening: Sparkles,
    Abilities: Zap,
  }
  const Icon = iconMap[tab] || CircleDot
  return (
    <section className="rounded-[30px] border border-black/[0.06] bg-white/88 p-8 shadow-[0_18px_56px_rgba(0,0,0,0.045)]">
      <div className="flex flex-col gap-5 sm:flex-row sm:items-center">
        <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-3xl bg-[#ff2f6d]/10 text-[#ff2f6d]">
          <Icon className="h-7 w-7" strokeWidth={1.7} />
        </div>
        <div>
          <h2 className="text-2xl font-black tracking-tight text-[#111111]">{tab}</h2>
          <p className="mt-2 max-w-2xl text-sm leading-7 text-[#6b7280]">
            {placeholderCopy[tab] || 'Coming in next planner pass. This section is reserved for verified planner calculations.'}
          </p>
          <div className="mt-4 inline-flex rounded-full border border-[#ff2f6d]/15 bg-[#ff2f6d]/8 px-3 py-1.5 text-xs font-black uppercase tracking-wide text-[#ff2f6d]">
            Future planner section
          </div>
        </div>
      </div>
    </section>
  )
}

function EsperCyclePanel({ character, slots = [], characters = [] }) {
  const activeElement = character?.element
  const activeMeta = getElementMeta(activeElement)
  const cyclePreview = useMemo(() => getEsperCyclePreview({ slots, characters }), [characters, slots])
  const highlightedElements = new Set(cyclePreview.selectedElementsFromTeam.map((item) => item.element))
  const activeCycleIds = new Set(cyclePreview.activeCycles.map((cycle) => cycle.id))
  const selectedStatus = activeMeta
    ? `${character.name} currently activates ${activeMeta.label}.`
    : 'Select a character to preview their Esper Cycle element.'
  return (
    <section className="overflow-hidden rounded-[30px] border border-black/[0.06] bg-white/92 p-5 shadow-[0_22px_72px_rgba(0,0,0,0.06)] sm:p-6">
      <div className="grid gap-6 xl:grid-cols-[minmax(390px,0.95fr)_minmax(320px,0.75fr)] xl:items-center">
        <div className="relative overflow-hidden rounded-[28px] border border-black/[0.05] bg-[radial-gradient(circle_at_50%_44%,rgba(255,47,109,0.10),transparent_34%),linear-gradient(145deg,#ffffff,#fbfaf9)] px-4 py-7 shadow-inner">
          <div className="pointer-events-none absolute inset-x-10 bottom-8 h-20 rounded-[50%] bg-[#ff2f6d]/8 blur-3xl" aria-hidden />
          <div className="relative mx-auto h-[min(78vw,430px)] w-[min(78vw,430px)] max-w-full rounded-full border border-white bg-[radial-gradient(circle_at_50%_48%,#ffffff_0%,#fffafa_32%,#f6f4f2_100%)] shadow-[inset_0_2px_18px_rgba(255,255,255,0.95),inset_0_-18px_42px_rgba(17,17,17,0.045),0_22px_70px_rgba(0,0,0,0.07)]">
            <div className="absolute inset-[9%] rounded-full border border-[#ff2f6d]/10 bg-white/30 shadow-[inset_0_0_38px_rgba(255,47,109,0.055)]" aria-hidden />
            <div className="absolute inset-[19%] rounded-full border border-dashed border-black/[0.08]" aria-hidden />
            <div className="absolute inset-[31%] rounded-full border border-white/80 bg-white/58 shadow-[inset_0_1px_14px_rgba(255,255,255,0.92),0_14px_44px_rgba(0,0,0,0.055)] backdrop-blur-md" aria-hidden />
            <div className="absolute left-1/2 top-1/2 flex h-[132px] w-[132px] -translate-x-1/2 -translate-y-1/2 flex-col items-center justify-center rounded-full border border-[#ff2f6d]/12 bg-white/86 text-center shadow-[0_18px_56px_rgba(255,47,109,0.12)] backdrop-blur-md">
              <span className="mb-2 h-1.5 w-10 rounded-full bg-[#ff2f6d]/35" aria-hidden />
              <span className="text-[11px] font-black uppercase tracking-[0.18em] text-[#ff2f6d]">Esper</span>
              <span className="mt-0.5 text-lg font-black tracking-tight text-[#111111]">Cycle</span>
              <span className="mt-2 rounded-full bg-[#fff7fa] px-2.5 py-1 text-[10px] font-black text-[#ff2f6d] ring-1 ring-[#ff2f6d]/10">{activeMeta?.label || 'Neutral'}</span>
            </div>
            <svg className="pointer-events-none absolute inset-0 h-full w-full" viewBox="0 0 100 100" aria-hidden>
              <circle cx="50" cy="50" r="38" fill="none" stroke="rgba(255,47,109,0.11)" strokeWidth="0.7" strokeDasharray="1.8 2.6" />
              <circle cx="50" cy="50" r="31" fill="none" stroke="rgba(17,17,17,0.05)" strokeWidth="0.45" />
              {ESPER_CYCLE_LINKS.map((link) => (
                <EsperCycleConnection key={link.id} link={link} active={activeCycleIds.has(link.id)} />
              ))}
              {[...highlightedElements].map((elementId) => {
                const index = cycleElements.indexOf(elementId)
                if (index < 0) return null
                const style = elementCycleStyle(elementId)
                const rotation = (index / cycleElements.length) * 360 - 104
                return (
                  <circle
                    key={`active-arc-${elementId}`}
                    cx="50"
                    cy="50"
                    r="38"
                    fill="none"
                    stroke={style.color}
                    strokeWidth="1.15"
                    strokeLinecap="round"
                    strokeDasharray="13 226"
                    opacity="0.55"
                    transform={`rotate(${rotation} 50 50)`}
                  />
                )
              })}
            </svg>
            {cycleElements.map((elementId, index) => {
              const meta = getElementMeta(elementId)
              const style = elementCycleStyle(elementId)
              const angle = (index / cycleElements.length) * Math.PI * 2 - Math.PI / 2
              const x = 50 + Math.cos(angle) * 38
              const y = 50 + Math.sin(angle) * 38
              const active = activeElement === elementId
              const teamHighlighted = highlightedElements.has(elementId)
              return (
                <button
                  key={elementId}
                  type="button"
                  title={`${meta?.label || elementId} Esper element`}
                  aria-label={`${meta?.label || elementId} Esper element${active ? ', selected character element' : teamHighlighted ? ', team element' : ''}`}
                  aria-pressed={active}
                  className={`group absolute flex h-[82px] w-[82px] -translate-x-1/2 -translate-y-1/2 flex-col items-center justify-center rounded-full border text-center outline-none transition duration-300 ease-out hover:-translate-y-[54%] hover:scale-[1.08] focus-visible:ring-2 focus-visible:ring-[#ff2f6d]/25 ${
                    active
                      ? 'z-30 scale-110 border-white bg-white/94 opacity-100'
                      : teamHighlighted
                        ? 'z-20 border-white/90 bg-white/84 opacity-95'
                        : activeElement
                          ? 'z-10 border-white/70 bg-white/66 opacity-68 hover:opacity-95'
                          : 'z-10 border-white/80 bg-white/74 opacity-90 hover:opacity-100'
                  }`}
                  style={{
                    left: `${x}%`,
                    top: `${y}%`,
                    boxShadow: active
                      ? `0 22px 64px ${style.activeGlow}, inset 0 1px 0 rgba(255,255,255,0.98), 0 0 0 6px ${style.aura}`
                      : teamHighlighted
                        ? `0 16px 44px ${style.glow}, inset 0 1px 0 rgba(255,255,255,0.94), 0 0 0 4px ${style.soft}`
                        : `0 12px 32px rgba(0,0,0,0.06), inset 0 1px 0 rgba(255,255,255,0.9), 0 0 0 3px ${style.soft}`,
                  }}
                >
                  {active ? <span className="absolute -inset-2 rounded-full opacity-70" style={{ background: `radial-gradient(circle, ${style.aura}, transparent 68%)` }} aria-hidden /> : null}
                  <span className="absolute inset-2 rounded-full opacity-80 transition duration-300 group-hover:opacity-100" style={{ background: `radial-gradient(circle at 50% 30%, ${style.soft}, transparent 68%)` }} aria-hidden />
                  <span className="relative flex h-10 w-10 items-center justify-center rounded-full border border-white/90 bg-white/82 shadow-sm transition duration-300 group-hover:bg-white group-hover:shadow-[0_8px_20px_rgba(0,0,0,0.10)]">
                    <img src={getElementIcon(elementId)} alt="" className="h-7 w-7 object-contain drop-shadow-sm transition duration-300 group-hover:scale-105" />
                  </span>
                  <span className="relative mt-1.5 text-[10px] font-black uppercase tracking-wide transition duration-300 group-hover:text-[#111111]" style={{ color: active || teamHighlighted ? style.color : '#6b7280' }}>{meta?.label || elementId}</span>
                </button>
              )
            })}
          </div>
        </div>
        <div className="min-w-0 rounded-[28px] border border-black/[0.06] bg-[#fafafa] p-4 shadow-sm sm:p-5">
          <div className="inline-flex items-center gap-2 rounded-full border border-[#ff2f6d]/15 bg-[#ff2f6d]/8 px-3 py-1.5 text-xs font-black text-[#ff2f6d]">
            <Sparkles className="h-3.5 w-3.5" strokeWidth={1.8} />
            Cycle calculation coming soon
          </div>
          <h2 className="mt-4 text-2xl font-black tracking-tight text-[#111111]">Esper Cycle Preview</h2>
          <p className="mt-3 max-w-2xl text-sm leading-7 text-[#6b7280]">
            The selected character&apos;s element is highlighted now. Later this panel will evaluate selected team members and show which cycle effects are active.
          </p>
          <div
            className="mt-5 rounded-[22px] border bg-white/84 p-4 shadow-sm transition duration-300"
            style={{
              borderColor: activeMeta ? `${elementCycleStyle(activeMeta.id).color}26` : 'rgba(17,17,17,0.06)',
              background: activeMeta ? `linear-gradient(135deg, ${elementCycleStyle(activeMeta.id).soft}, rgba(255,255,255,0.90))` : 'rgba(255,255,255,0.84)',
            }}
          >
            <p className="text-[11px] font-black uppercase tracking-wide text-[#9ca3af]">Selected Element</p>
            {activeMeta ? (
              <div className="mt-3 flex items-center gap-3">
                <span className="flex h-14 w-14 items-center justify-center rounded-full border border-white bg-white shadow-[0_12px_34px_rgba(0,0,0,0.07)]" style={{ boxShadow: `0 12px 34px ${elementCycleStyle(activeMeta.id).glow}, inset 0 1px 0 rgba(255,255,255,0.95)` }}>
                  <img src={getElementIcon(activeMeta.id)} alt="" className="h-9 w-9 object-contain" />
                </span>
                <div>
                  <p className="text-lg font-black text-[#111111]">{activeMeta.label}</p>
                  <p className="mt-1 text-xs font-bold text-[#6b7280]">{selectedStatus}</p>
                </div>
              </div>
            ) : (
              <div className="mt-3 flex items-center gap-3">
                <span className="flex h-12 w-12 items-center justify-center rounded-full border border-black/[0.05] bg-white text-sm font-black text-[#9ca3af] shadow-sm">?</span>
                <div>
                  <p className="text-lg font-black text-[#111111]">Unknown</p>
                  <p className="mt-1 text-xs font-bold text-[#6b7280]">{selectedStatus}</p>
                </div>
              </div>
            )}
          </div>
          <div className="mt-3 rounded-[22px] border border-black/[0.05] bg-white p-4 shadow-sm">
            <div className="flex items-center justify-between gap-3">
              <p className="text-[11px] font-black uppercase tracking-wide text-[#9ca3af]">Team Cycle Effects</p>
              <span className="rounded-full bg-[#fff7fa] px-2.5 py-1 text-[10px] font-black text-[#ff2f6d] ring-1 ring-[#ff2f6d]/10">{cyclePreview.activeCycles.length} Active</span>
            </div>
            <div className="mt-3">
              <p className="text-[11px] font-black uppercase tracking-wide text-[#9ca3af]">Team Elements</p>
              <div className="mt-2 flex flex-wrap gap-1.5">
                {cyclePreview.selectedElementsFromTeam.length ? cyclePreview.selectedElementsFromTeam.map((item) => {
                  const meta = getElementMeta(item.element)
                  const style = elementCycleStyle(item.element)
                  return (
                    <span key={`${item.slotIndex}-${item.element}`} className="inline-flex items-center gap-1.5 rounded-full bg-white px-2.5 py-1 text-[11px] font-black text-[#6b7280] ring-1 ring-black/[0.05]">
                      <span className="h-2 w-2 rounded-full" style={{ backgroundColor: style.color }} />
                      Slot {item.slotIndex + 1}: {meta?.label || item.element}
                    </span>
                  )
                }) : (
                  <span className="rounded-full bg-white px-2.5 py-1 text-[11px] font-black text-[#9ca3af] ring-1 ring-black/[0.05]">No team elements selected</span>
                )}
              </div>
            </div>
            {cyclePreview.activeCycles.length ? (
              <div className="mt-4 space-y-2.5">
                {cyclePreview.activeCycles.map((cycle) => (
                  <article key={cycle.id} className={['rounded-2xl border bg-[#fafafa] p-3 shadow-sm', cycle.kind === 'advanced' ? 'border-[#ff2f6d]/14 ring-2 ring-[#ff2f6d]/6' : 'border-black/[0.05]'].join(' ')}>
                    <div className="flex flex-wrap items-start justify-between gap-2">
                      <div>
                        <div className="flex flex-wrap items-center gap-2">
                          <h3 className="text-sm font-black text-[#111111]">{cycle.name}</h3>
                          <span className={['rounded-full px-2 py-0.5 text-[10px] font-black uppercase ring-1', cycle.kind === 'advanced' ? 'bg-[#fff7fa] text-[#ff2f6d] ring-[#ff2f6d]/12' : 'bg-white text-[#6b7280] ring-black/[0.05]'].join(' ')}>{cycle.kind}</span>
                          <span className="rounded-full bg-emerald-50 px-2 py-0.5 text-[10px] font-black uppercase text-emerald-700 ring-1 ring-emerald-100">Active</span>
                        </div>
                        <p className="mt-1 text-xs font-semibold text-[#9ca3af]">{cycle.trigger}</p>
                      </div>
                      <ElementIconRow elements={cycle.requiredElements} />
                    </div>
                    <p className="mt-2 text-xs leading-5 text-[#4b5563]">{cycle.description}</p>
                  </article>
                ))}
              </div>
            ) : (
              <p className="mt-3 rounded-2xl border border-dashed border-black/[0.08] bg-[#fafafa] px-4 py-4 text-sm font-semibold text-[#6b7280]">
                {cyclePreview.selectedElementsFromTeam.length ? 'No cycle effects active yet.' : 'Select more team members to calculate active Esper Cycle effects.'}
              </p>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}

const ESPER_NODE_POSITIONS = {
  cosmos: { x: 50, y: 12 },
  anima: { x: 83, y: 31 },
  incantation: { x: 83, y: 69 },
  chaos: { x: 50, y: 88 },
  psyche: { x: 17, y: 69 },
  lakshana: { x: 17, y: 31 },
}

const ESPER_CYCLE_LINKS = [
  { id: 'remora', kind: 'pair', elements: ['lakshana', 'cosmos'] },
  { id: 'bloom', kind: 'pair', elements: ['cosmos', 'anima'] },
  { id: 'witchcraft', kind: 'pair', elements: ['anima', 'incantation'] },
  { id: 'nova', kind: 'pair', elements: ['chaos', 'psyche'] },
  { id: 'burn', kind: 'pair', elements: ['incantation', 'chaos'] },
  { id: 'trace', kind: 'pair', elements: ['psyche', 'lakshana'] },
  { id: 'charging', kind: 'advanced', elements: ['lakshana', 'cosmos', 'anima'] },
  { id: 'dissonance', kind: 'advanced', elements: ['chaos', 'psyche', 'incantation'] },
]

function elementPoint(elementId) {
  return ESPER_NODE_POSITIONS[elementId] || { x: 50, y: 50 }
}

function EsperCycleConnection({ link, active }) {
  const points = link.elements.map(elementPoint)
  const first = points[0]
  const path = link.kind === 'advanced'
    ? `${points.map((point, index) => `${index === 0 ? 'M' : 'L'} ${point.x} ${point.y}`).join(' ')} Z`
    : `M ${first.x} ${first.y} L ${points[1].x} ${points[1].y}`
  const color = link.elements.map((element) => elementCycleStyle(element).color)[0] || '#ff2f6d'
  return (
    <path
      d={path}
      fill={link.kind === 'advanced' && active ? color : 'none'}
      fillOpacity={link.kind === 'advanced' && active ? 0.055 : 0}
      stroke={active ? color : 'rgba(17,17,17,0.055)'}
      strokeWidth={active ? (link.kind === 'advanced' ? 1.5 : 1.25) : 0.55}
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeDasharray={link.kind === 'advanced' && !active ? '1.5 2.4' : undefined}
      opacity={active ? 0.72 : 0.8}
    />
  )
}

function ElementIconRow({ elements = [] }) {
  return (
    <div className="flex -space-x-1">
      {elements.map((elementId) => {
        const meta = getElementMeta(elementId)
        return (
          <span key={elementId} title={meta?.label || elementId} className="flex h-7 w-7 items-center justify-center rounded-full border border-white bg-white shadow-sm ring-1 ring-black/[0.05]">
            <img src={getElementIcon(elementId)} alt="" className="h-5 w-5 object-contain" />
          </span>
        )
      })}
    </div>
  )
}

function elementCycleStyle(elementId) {
  const meta = getElementMeta(elementId)
  const color = meta?.color || '#ff2f6d'
  const styles = {
    incantation: { color, soft: 'rgba(255,59,111,0.13)', aura: 'rgba(255,59,111,0.12)', glow: 'rgba(255,59,111,0.22)' },
    cosmos: { color, soft: 'rgba(148,163,184,0.16)', aura: 'rgba(148,163,184,0.13)', glow: 'rgba(148,163,184,0.22)' },
    chaos: { color, soft: 'rgba(168,85,247,0.13)', aura: 'rgba(168,85,247,0.12)', glow: 'rgba(168,85,247,0.22)' },
    psyche: { color, soft: 'rgba(56,189,248,0.13)', aura: 'rgba(56,189,248,0.12)', glow: 'rgba(56,189,248,0.22)' },
    anima: { color, soft: 'rgba(20,184,166,0.13)', aura: 'rgba(20,184,166,0.12)', glow: 'rgba(20,184,166,0.22)' },
    lakshana: { color, soft: 'rgba(246,199,68,0.16)', aura: 'rgba(246,199,68,0.13)', glow: 'rgba(246,199,68,0.24)' },
  }
  const style = styles[elementId] || { color, soft: 'rgba(255,47,109,0.12)', aura: 'rgba(255,47,109,0.10)', glow: 'rgba(255,47,109,0.20)' }
  return { ...style, activeGlow: style.glow.replace('0.22', '0.32').replace('0.24', '0.34') }
}

function CharacterPicker({ characters, onSelect, onClose }) {
  const [query, setQuery] = useState('')
  const [rarity, setRarity] = useState('All')
  const [element, setElement] = useState('All')
  const [arcType, setArcType] = useState('All')
  const [role, setRole] = useState('All')

  const filtered = useMemo(() => {
    const tokens = query.trim().toLowerCase().split(/\s+/).filter(Boolean)
    return characters.filter((character) => {
      if (rarity !== 'All' && character.rarity !== rarity) return false
      if (element !== 'All' && character.element !== element) return false
      if (arcType !== 'All' && character.arcType !== arcType) return false
      if (role !== 'All' && !(character.roles || []).includes(role)) return false
      if (!tokens.length) return true
      const haystack = [character.name, character.rarity, character.element, character.arcType, character.faction, ...(character.roles || [])].join(' ').toLowerCase()
      return tokens.every((token) => haystack.includes(token))
    })
  }, [arcType, characters, element, query, rarity, role])

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <button type="button" className="absolute inset-0 bg-black/25 backdrop-blur-[2px]" aria-label="Close character picker" onClick={onClose} />
      <section className="relative z-[101] flex max-h-[88vh] w-full max-w-5xl flex-col overflow-hidden rounded-[30px] border border-black/[0.08] bg-white shadow-[0_30px_100px_rgba(0,0,0,0.18)]">
        <div className="border-b border-black/[0.06] p-5 sm:p-6">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#ff2f6d]">Character picker</p>
              <h2 className="mt-1 text-2xl font-black tracking-tight text-[#111111]">Select Character</h2>
            </div>
            <button type="button" onClick={onClose} className="flex h-10 w-10 items-center justify-center rounded-2xl border border-black/[0.06] bg-[#fafafa]">
              <X className="h-4 w-4" />
            </button>
          </div>
          <div className="mt-5 flex flex-col gap-3 xl:flex-row xl:items-center">
            <div className="relative min-w-0 flex-1">
              <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[#9ca3af]" strokeWidth={2} />
              <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search characters..." className="h-12 w-full rounded-full border border-black/[0.07] bg-[#fafafa] pl-11 pr-4 text-sm outline-none transition focus:border-[#ff2f6d]/25 focus:bg-white" />
            </div>
            <div className="flex flex-wrap gap-2">
              <PickerSelect value={rarity} onChange={setRarity} options={['All', ...RARITIES]} />
              <PickerSelect value={element} onChange={setElement} options={['All', ...ELEMENTS]} />
              <PickerSelect value={arcType} onChange={setArcType} options={['All', ...ARC_TYPES]} />
              <PickerSelect value={role} onChange={setRole} options={['All', ...ROLES]} />
            </div>
          </div>
        </div>
        <div className="scrollbar-hide grid gap-3 overflow-y-auto p-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {filtered.map((character) => (
            <button key={character.id} type="button" onClick={() => onSelect(character)} className="group overflow-hidden rounded-[22px] border border-black/[0.06] bg-[#fafafa] p-3 text-left shadow-sm transition hover:-translate-y-0.5 hover:bg-white hover:shadow-[0_18px_56px_rgba(0,0,0,0.08)]">
              <div className="flex items-center gap-3">
                <CharacterPortrait src={getCharacterAsset(character.name) || character.portraitImageUrl} name={character.name} className="h-16 w-16 rounded-[18px]" />
                <div className="min-w-0 flex-1">
                  <h3 className="truncate text-base font-black text-[#111111]">{character.name}</h3>
                  <p className="mt-1 truncate text-xs font-semibold text-[#6b7280]">{getElementMeta(character.element)?.label || character.element || 'Unknown'} / {getArcTypeMeta(character.arcType)?.label || character.arcType || 'Unknown'}</p>
                </div>
                <ArrowUpRight className="h-4 w-4 text-[#ff2f6d] opacity-0 transition group-hover:opacity-100" strokeWidth={2} />
              </div>
              <div className="mt-3 flex flex-wrap gap-1.5">
                <span className={`rounded-full px-2 py-0.5 text-[11px] font-black ring-1 ${getRarityMeta(character.rarity)?.chip || 'bg-slate-50 text-slate-700 ring-slate-100'}`}>{character.rarity || 'Unknown'}</span>
                {(character.roles || []).slice(0, 2).map((item) => (
                  <span key={item} className="rounded-full bg-white px-2 py-0.5 text-[11px] font-bold text-[#6b7280] ring-1 ring-black/[0.05]">{item}</span>
                ))}
              </div>
            </button>
          ))}
        </div>
      </section>
    </div>
  )
}

function PickerSelect({ value, onChange, options }) {
  return (
    <select value={value} onChange={(event) => onChange(event.target.value)} className="h-10 rounded-full border border-black/[0.07] bg-white px-3 text-sm font-bold text-[#6b7280] outline-none transition focus:border-[#ff2f6d]/25">
      {options.map((option) => (
        <option key={option} value={option}>{option === 'All' ? 'All' : labelForOption(option)}</option>
      ))}
    </select>
  )
}

function WeaponImage({ weapon, className = '' }) {
  const image = getWeaponAsset(weapon?.name) || weapon?.image || weapon?.icon
  return (
    <div className={`overflow-hidden border border-black/[0.06] bg-white shadow-sm ${className}`}>
      {image ? (
        <img src={image} alt={weapon?.name || ''} className="h-full w-full object-contain p-2" loading="lazy" />
      ) : (
        <div className="flex h-full w-full items-center justify-center bg-[#fff7fa] text-sm font-black text-[#ff2f6d]">
          {String(weapon?.name || '?').slice(0, 2)}
        </div>
      )}
    </div>
  )
}

function CartridgeImage({ cartridge, rarity = 'S', className = '' }) {
  const image = getModuleAsset(cartridge?.name, rarity) || cartridge?.image || cartridge?.icon
  return (
    <div className={`overflow-hidden border border-black/[0.06] bg-white shadow-sm ${className}`}>
      {image ? (
        <img src={image} alt={cartridge?.name || ''} className="h-full w-full object-contain p-2" loading="lazy" />
      ) : (
        <div className="flex h-full w-full items-center justify-center bg-[#fff7fa] text-sm font-black text-[#ff2f6d]">
          {String(cartridge?.name || '?').slice(0, 2)}
        </div>
      )}
    </div>
  )
}

function ShapeMini({ shape, rarity = 'S' }) {
  const matrix = shape.matrix || [[1]]
  return (
    <div
      className="grid shrink-0 rounded-xl bg-white p-2 ring-1 ring-black/[0.05]"
      style={{ gridTemplateColumns: `repeat(${matrix[0]?.length || 1}, 12px)`, gap: 3 }}
    >
      {matrix.flatMap((row, y) => row.map((cell, x) => (
        <span key={`${x}-${y}`} className={`h-3 w-3 rounded-[3px] ${cell ? moduleCellClass(rarity) : 'bg-transparent'}`} />
      )))}
    </div>
  )
}

function TypeBadge({ type, strong = false }) {
  const icon = getTypeIcon(type)
  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full px-2 py-0.5 text-[11px] font-black ring-1 ${strong ? 'bg-white text-[#111111] ring-black/[0.06]' : 'bg-white/80 text-[#6b7280] ring-black/[0.05]'}`}>
      {icon ? <img src={icon} alt="" className="h-3.5 w-3.5 object-contain" /> : null}
      {type || 'Unknown'}
    </span>
  )
}

function rarityClass(rarity, active = false) {
  if (rarity === 'S') return active ? 'bg-amber-100 text-amber-900 ring-amber-200' : 'bg-amber-50 text-amber-800 ring-amber-100'
  if (rarity === 'A') return active ? 'bg-fuchsia-100 text-fuchsia-900 ring-fuchsia-200' : 'bg-fuchsia-50 text-fuchsia-800 ring-fuchsia-100'
  return active ? 'bg-sky-100 text-sky-900 ring-sky-200' : 'bg-sky-50 text-sky-800 ring-sky-100'
}

function moduleCellClass(rarity = 'S') {
  if (rarity === 'S') return 'bg-amber-300 text-amber-900'
  if (rarity === 'A') return 'bg-fuchsia-300 text-fuchsia-900'
  return 'bg-cyan-300 text-cyan-900'
}

function Notice({ text }) {
  return (
    <p className="rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm font-semibold text-amber-800">
      {text}
    </p>
  )
}

function StatusPill({ label, value, active = false }) {
  return (
    <span className={`rounded-full px-3 py-1.5 text-xs font-black ring-1 ${active ? 'bg-emerald-50 text-emerald-700 ring-emerald-100' : 'bg-white text-[#6b7280] ring-black/[0.06]'}`}>
      {label}: <span className="text-[#111111]">{value}</span>
    </span>
  )
}

function getShapeCells(shape) {
  return (shape.matrix || [[1]]).flatMap((row, y) => row.map((cell, x) => (cell ? { x, y } : null)).filter(Boolean))
}

function getPlacementCells(shape, x, y) {
  return getShapeCells(shape).map((cell) => ({ x: x + cell.x, y: y + cell.y }))
}

function getPlacementShape(placement) {
  return getModuleShapeOptions().find((shape) => shape.id === placement.shapeId)
}

function getCellsForPlacement(placement) {
  const shape = getPlacementShape(placement)
  return shape ? getPlacementCells(shape, placement.x, placement.y) : []
}

function getPlacementAtCell(placements, x, y) {
  return placements.find((placement) => getCellsForPlacement(placement).some((cell) => cell.x === x && cell.y === y)) || null
}

function canPlaceShape(shape, x, y, placements) {
  const cells = getPlacementCells(shape, x, y)
  if (cells.some((cell) => cell.x < 0 || cell.y < 0 || cell.x >= GRID_COLS || cell.y >= GRID_ROWS)) return false
  return !cells.some((cell) => getPlacementAtCell(placements, cell.x, cell.y))
}

function StatMini({ label, value }) {
  return (
    <div className="rounded-2xl border border-black/[0.05] bg-white px-4 py-3 shadow-sm">
      <p className="text-[11px] font-bold uppercase tracking-wide text-[#9ca3af]">{label}</p>
      <p className="mt-1 text-lg font-black text-[#111111] tabular-nums">{value || '0'}</p>
    </div>
  )
}

function formatWeaponStatValue(value) {
  if (value == null || value === '') return '0'
  return String(value)
}

function labelForOption(option) {
  return getElementMeta(option)?.label || getArcTypeMeta(option)?.label || getRarityMeta(option)?.shortLabel || option
}

function CharacterPortrait({ src, name, className = '', large = false }) {
  return (
    <div className={`overflow-hidden border border-black/[0.06] bg-white shadow-sm ${className}`}>
      {src ? (
        <img src={src} alt={name || ''} className={`h-full w-full object-contain ${large ? 'scale-110' : ''}`} loading="lazy" />
      ) : (
        <div className="flex h-full w-full items-center justify-center bg-[#fff7fa] text-[#ff2f6d]">
          <Shield className="h-6 w-6" strokeWidth={1.8} />
        </div>
      )}
    </div>
  )
}

function MetaChip({ label, iconSrc, strong = false }) {
  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-black ring-1 ${strong ? 'bg-white text-[#111111] ring-black/[0.06]' : 'bg-white/80 text-[#6b7280] ring-black/[0.05]'}`}>
      {iconSrc ? <img src={iconSrc} alt="" className="h-3.5 w-3.5 object-contain" /> : null}
      {label}
    </span>
  )
}

function InfoTile({ label, value }) {
  return (
    <div className="rounded-2xl border border-black/[0.06] bg-[#fafafa] px-4 py-3 shadow-sm">
      <p className="text-[11px] font-bold uppercase tracking-wide text-[#9ca3af]">{label}</p>
      <p className="mt-1 truncate text-sm font-black text-[#111111]">{value}</p>
    </div>
  )
}
