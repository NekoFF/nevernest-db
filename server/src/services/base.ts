import { NotImplementedError } from '../utils/errors.js'

export function plannedServiceMethod(resourceName: string): never {
  throw new NotImplementedError(`${resourceName} service is planned for a later phase.`)
}
