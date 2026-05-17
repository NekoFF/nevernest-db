// Future auth model only. Real authentication must be backend-based and must
// never store passwords or trusted roles in localStorage.

export const AUTH_ROLES = {
  anonymous: 'anonymous',
  user: 'user',
  editor: 'editor',
  admin: 'admin',
}

export const AUTH_PERMISSIONS = {
  contentRead: 'content/read',
  contentWrite: 'content/write',
  contentPublish: 'content/publish',
  charactersWrite: 'characters/write',
  weaponsWrite: 'weapons/write',
  modulesWrite: 'modules/write',
  vehiclesWrite: 'vehicles/write',
  codesWrite: 'codes/write',
  newsWrite: 'news/write',
  usersManage: 'users/manage',
  adminAuditRead: 'admin/audit/read',
}

export function createAnonymousSession() {
  return {
    user: null,
    role: AUTH_ROLES.anonymous,
    permissions: [],
    isAuthenticated: false,
  }
}
