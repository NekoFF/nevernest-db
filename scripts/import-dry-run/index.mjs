import { loadSnapshot } from './loadSnapshot.mjs'
import { mapTaxonomy } from './mapTaxonomy.mjs'
import { mapMedia } from './mapMedia.mjs'
import { mapCharacters } from './mapCharacters.mjs'
import { mapWeapons } from './mapWeapons.mjs'
import { mapCartridgesModules } from './mapCartridgesModules.mjs'
import { mapVehicles } from './mapVehicles.mjs'
import { mapTierLists } from './mapTierLists.mjs'
import { mapContent } from './mapContent.mjs'
import { mapMaterialsDraft } from './mapMaterialsDraft.mjs'
import { validateImportPayloads } from './validateImportPayloads.mjs'
import { writeDryRunReport } from './writeDryRunReport.mjs'

export async function runImportDryRun() {
  const snapshot = await loadSnapshot()
  const payloads = {
    taxonomy: mapTaxonomy(snapshot),
    media: mapMedia(snapshot),
    characters: mapCharacters(snapshot),
    weapons: mapWeapons(snapshot),
    cartridgesModules: mapCartridgesModules(snapshot),
    vehicles: mapVehicles(snapshot),
    tierLists: mapTierLists(snapshot),
    content: mapContent(snapshot),
  }
  const validation = validateImportPayloads(payloads)
  const materialsDraft = mapMaterialsDraft(payloads)
  const reportPath = writeDryRunReport({ snapshot, payloads, validation, materialsDraft })
  return { snapshot, payloads, validation, materialsDraft, reportPath }
}
