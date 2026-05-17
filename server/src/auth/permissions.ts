import type { AuthPermission } from '../contracts/auth.js'

export const ADMIN_PERMISSIONS: AuthPermission[] = [
  'content/read',
  'content/write',
  'content/publish',
  'characters/write',
  'weapons/write',
  'modules/write',
  'vehicles/write',
  'codes/write',
  'news/write',
  'users/manage',
  'admin/audit/read',
]
