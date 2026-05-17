import { SEVERITY, issue } from './shared.mjs'
import { validateTaxonomyPayloads } from './validateTaxonomyPayloads.mjs'
import { validateMediaPayloads } from './validateMediaPayloads.mjs'
import { validateCharacterPayloads } from './validateCharacterPayloads.mjs'
import { validateWeaponPayloads } from './validateWeaponPayloads.mjs'
import { validateCartridgeModulePayloads } from './validateCartridgeModulePayloads.mjs'
import { validateVehiclePayloads } from './validateVehiclePayloads.mjs'
import { validateTierListPayloads } from './validateTierListPayloads.mjs'
import { validateContentPayloads } from './validateContentPayloads.mjs'

export { SEVERITY, issue }

export function runPayloadValidators(payloads) {
  const context = { resolvedMediaAliases: [] }
  const issues = [
    ...validateTaxonomyPayloads(payloads, context),
    ...validateCharacterPayloads(payloads, context),
    ...validateWeaponPayloads(payloads, context),
    ...validateCartridgeModulePayloads(payloads, context),
    ...validateVehiclePayloads(payloads, context),
    ...validateTierListPayloads(payloads, context),
    ...validateContentPayloads(payloads, context),
    ...validateMediaPayloads(payloads, context),
  ]
  if (!issues.some((row) => row.severity === SEVERITY.BLOCKER)) {
    issues.unshift(issue(SEVERITY.OK, 'dry-run', 'No blocker-level import issues detected.'))
  }
  return { issues, context }
}

